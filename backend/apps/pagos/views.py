from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.conf import settings
from .models import Pago
from .serializers import PagoSerializer
from apps.facturas.models import Factura
from apps.facturas.utils import enviar_email_pago_confirmado
from .wompi_service import WompiService

# TEMPORAL - Modo desarrollo sin Wompi
MODO_DESARROLLO = True  # Cambiar a False cuando Wompi funcione

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_link_pago_wompi(request):
    """
    Crea un link de pago con Wompi para una factura
    """
    factura_id = request.data.get('factura_id')

    if not factura_id:
        return Response(
            {'error': 'factura_id es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        factura = Factura.objects.get(id=factura_id)

        # Verificar permisos
        if request.user.rol not in ['admin', 'superadmin']:
            if factura.contrato.cliente != request.user:
                return Response(
                    {'error': 'No tienes permiso para pagar esta factura'},
                    status=status.HTTP_403_FORBIDDEN
                )

        if factura.estado != 'pendiente':
            return Response(
                {'error': f'Esta factura ya está {factura.estado}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # MODO DESARROLLO - Simular respuesta de Wompi
        if MODO_DESARROLLO:
            referencia = f"INFIBER-FAC-{factura.id}-{factura.numero_factura}"

            # Crear pago pendiente
            pago = Pago.objects.create(
                factura=factura,
                monto=factura.monto,
                metodo_pago='wompi_card',
                estado='pendiente',
                wompi_reference=referencia,
                wompi_response={'modo': 'desarrollo'}
            )

            # Simular link de pago
            payment_link = f"https://checkout.wompi.co/l/TEST-{pago.id}"

            return Response({
                'success': True,
                'payment_link': payment_link,
                'payment_id': f'TEST-{pago.id}',
                'pago_id': pago.id,
                'reference': referencia,
                'modo_desarrollo': True,
                'mensaje': 'Modo desarrollo - Wompi bloqueado por CloudFront'
            }, status=status.HTTP_201_CREATED)

        # MODO PRODUCCIÓN - Usar Wompi real
        wompi = WompiService()
        resultado = wompi.crear_link_pago(factura, request.user.email)

        if resultado['success']:
            pago = Pago.objects.create(
                factura=factura,
                monto=factura.monto,
                metodo_pago='wompi_card',
                estado='pendiente',
                wompi_reference=resultado['reference'],
                wompi_response=resultado['data']
            )

            return Response({
                'success': True,
                'payment_link': resultado['payment_link'],
                'payment_id': resultado['id'],
                'pago_id': pago.id,
                'reference': resultado['reference']
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': resultado.get('error', 'Error creando link de pago')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Factura.DoesNotExist:
        return Response(
            {'error': 'Factura no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class PagoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar pagos
    """
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Devolver solo pagos del usuario autenticado"""
        user = self.request.user

        # Si es admin/superadmin, ver todos
        if user.rol in ['admin', 'superadmin']:
            return Pago.objects.all()

        # Si es cliente, solo ver sus pagos
        return Pago.objects.filter(factura__contrato__cliente=user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def consultar_estado_pago(request, transaction_id):
    """
    Consulta el estado de una transacción en Wompi
    """
    try:
        wompi = WompiService()
        resultado = wompi.consultar_transaccion(transaction_id)

        if resultado['success']:
            transaction_data = resultado['data']

            # Buscar el pago en nuestra base de datos
            try:
                pago = Pago.objects.get(wompi_transaction_id=transaction_id)

                # Actualizar estado si cambió
                wompi_status = transaction_data['status']

                if wompi_status == 'APPROVED':
                    pago.estado = 'aprobado'
                    pago.factura.estado = 'pagada'
                    pago.factura.save()

                    # Enviar email de confirmación
                    try:
                        enviar_email_pago_confirmado(pago)
                    except Exception as e:
                        print(f"⚠️ Error enviando email: {e}")

                elif wompi_status == 'DECLINED':
                    pago.estado = 'rechazado'
                elif wompi_status == 'ERROR':
                    pago.estado = 'error'

                pago.wompi_status = wompi_status
                pago.wompi_response = transaction_data
                pago.save()

            except Pago.DoesNotExist:
                pass

            return Response({
                'success': True,
                'status': transaction_data['status'],
                'data': transaction_data
            })
        else:
            return Response(
                {'error': resultado.get('error')},
                status=status.HTTP_404_NOT_FOUND
            )

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def webhook_wompi(request):
    """
    Webhook para recibir notificaciones de Wompi cuando cambia el estado de un pago
    IMPORTANTE: Este endpoint debe ser público (sin autenticación)
    """
    try:
        print(f"📩 Webhook recibido de Wompi: {request.data}")

        # Verificar firma del webhook
        wompi = WompiService()

        if not wompi.verificar_firma_webhook(request.data):
            print("❌ Firma inválida del webhook")
            return Response(
                {'error': 'Firma inválida'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Procesar evento
        event = request.data.get('event')
        data = request.data.get('data', {})
        transaction = data.get('transaction', {})

        print(f"📋 Evento: {event}")
        print(f"📋 Transaction ID: {transaction.get('id')}")

        if event == 'transaction.updated':
            transaction_id = transaction.get('id')
            transaction_status = transaction.get('status')

            # Buscar el pago
            try:
                pago = Pago.objects.get(wompi_transaction_id=transaction_id)

                # Actualizar estado
                if transaction_status == 'APPROVED':
                    pago.estado = 'aprobado'
                    pago.factura.estado = 'pagada'
                    pago.factura.save()

                    # REACTIVAR CONTRATO SI ESTABA SUSPENDIDO
                    contrato = pago.factura.contrato
                    if contrato.estado == 'suspendido':
                        contrato.reactivar()

                        # Desbloquear usuario
                        cliente = contrato.cliente
                        if cliente.bloqueado:
                            cliente.bloqueado = False
                            cliente.is_active = True
                            cliente.motivo_bloqueo = None
                            cliente.fecha_bloqueo = None
                            cliente.save()

                    # Enviar email
                    try:
                        enviar_email_pago_confirmado(pago)
                        print(f"✅ Email enviado para pago {pago.id}")
                    except Exception as e:
                        print(f"⚠️ Error enviando email: {e}")

                elif transaction_status == 'DECLINED':
                    pago.estado = 'rechazado'
                elif transaction_status == 'ERROR':
                    pago.estado = 'error'

                pago.wompi_status = transaction_status
                pago.wompi_response = transaction
                pago.save()

                print(f"✅ Webhook procesado: Pago {pago.id} - Estado {transaction_status}")

            except Pago.DoesNotExist:
                print(f"⚠️ Pago no encontrado para transaction_id: {transaction_id}")

        return Response({'success': True}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"❌ Error procesando webhook: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirmar_pago_manual(request):
    """
    Endpoint para que admins confirmen pagos manuales (presenciales).
    Al confirmar, reactiva el contrato automáticamente.
    """
    # Verificar permisos de admin
    if request.user.rol not in ['admin', 'superadmin']:
        return Response(
            {'error': 'No tienes permisos para confirmar pagos'},
            status=status.HTTP_403_FORBIDDEN
        )

    factura_id = request.data.get('factura_id')
    monto = request.data.get('monto')
    metodo_pago = request.data.get('metodo_pago', 'efectivo')
    referencia = request.data.get('referencia', '')

    if not factura_id or not monto:
        return Response(
            {'error': 'factura_id y monto son requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        factura = Factura.objects.get(id=factura_id)

        if factura.estado != 'pendiente':
            return Response(
                {'error': f'Esta factura ya está {factura.estado}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear registro de pago
        pago = Pago.objects.create(
            factura=factura,
            monto=monto,
            metodo_pago=metodo_pago,
            estado='aprobado',
            referencia_pago=referencia or f'MANUAL-{factura.numero_factura}'
        )

        # Marcar factura como pagada
        factura.estado = 'pagada'
        factura.save()

        # REACTIVAR CONTRATO SI ESTABA SUSPENDIDO
        contrato = factura.contrato
        if contrato.estado == 'suspendido':
            contrato.reactivar()

            # Desbloquear usuario
            cliente = contrato.cliente
            if cliente.bloqueado:
                cliente.bloqueado = False
                cliente.is_active = True
                cliente.motivo_bloqueo = None
                cliente.fecha_bloqueo = None
                cliente.save()

        # Enviar email de confirmación
        try:
            enviar_email_pago_confirmado(factura, pago)
        except Exception as e:
            print(f'Error enviando email: {e}')

        return Response({
            'success': True,
            'mensaje': 'Pago confirmado exitosamente',
            'pago_id': pago.id,
            'contrato_reactivado': contrato.estado == 'activo'
        }, status=status.HTTP_201_CREATED)

    except Factura.DoesNotExist:
        return Response(
            {'error': 'Factura no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
