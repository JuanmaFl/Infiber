from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import requests
import hashlib
from .models import Pago
from .serializers import PagoSerializer
from apps.facturas.models import Factura

class PagoViewSet(viewsets.ModelViewSet):
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

@api_view(['POST'])
def crear_transaccion_wompi(request):
    """Crear transacción en Wompi (sandbox)"""
    try:
        factura_id = request.data.get('factura_id')
        
        # Obtener factura
        factura = Factura.objects.get(id=factura_id)
        
        # Datos para Wompi
        payload = {
            'acceptance_token': settings.WOMPI_PUBLIC_KEY,
            'amount_in_cents': int(factura.monto * 100),  # Convertir a centavos
            'currency': 'COP',
            'customer_email': request.user.email,
            'reference': f'FAC-{factura.id}',
            'redirect_url': f'{settings.FRONTEND_URL}/dashboard/cliente/pagos?status=success'
        }
        
        # URL de Wompi Sandbox
        url = 'https://sandbox.wompi.co/v1/transactions'
        
        headers = {
            'Authorization': f'Bearer {settings.WOMPI_PUBLIC_KEY}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        return Response(response.json())
        
    except Factura.DoesNotExist:
        return Response({'error': 'Factura no encontrada'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def crear_transaccion_payu(request):
    """Crear transacción en PayU (sandbox)"""
    try:
        factura_id = request.data.get('factura_id')
        
        # Obtener factura
        factura = Factura.objects.get(id=factura_id)
        
        # Generar signature para PayU
        reference = f'FAC-{factura.id}'
        amount = str(int(factura.monto))
        currency = 'COP'
        
        signature_string = f"{settings.PAYU_API_KEY}~{settings.PAYU_MERCHANT_ID}~{reference}~{amount}~{currency}"
        signature = hashlib.md5(signature_string.encode()).hexdigest()
        
        # Datos para PayU
        payload = {
            'language': 'es',
            'command': 'SUBMIT_TRANSACTION',
            'merchant': {
                'apiKey': settings.PAYU_API_KEY,
                'apiLogin': settings.PAYU_API_LOGIN
            },
            'transaction': {
                'order': {
                    'accountId': settings.PAYU_ACCOUNT_ID,
                    'referenceCode': reference,
                    'description': f'Pago Factura {factura.numero}',
                    'language': 'es',
                    'signature': signature,
                    'buyer': {
                        'emailAddress': request.user.email,
                        'fullName': f'{request.user.first_name} {request.user.last_name}'
                    }
                },
                'type': 'AUTHORIZATION_AND_CAPTURE',
                'paymentMethod': 'PSE',
                'paymentCountry': 'CO',
                'amount': {
                    'value': amount,
                    'currency': currency
                }
            }
        }
        
        # URL de PayU Sandbox
        url = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
        
        response = requests.post(url, json=payload)
        
        return Response(response.json())
        
    except Factura.DoesNotExist:
        return Response({'error': 'Factura no encontrada'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def confirmar_pago(request):
    """Confirmar pago y actualizar factura"""
    try:
        factura_id = request.data.get('factura_id')
        metodo_pago = request.data.get('metodo_pago')
        referencia_transaccion = request.data.get('referencia_transaccion')
        
        # Obtener factura
        factura = Factura.objects.get(id=factura_id)
        
        # Crear registro de pago
        pago = Pago.objects.create(
            factura=factura,
            monto=factura.monto,
            metodo_pago=metodo_pago,
            referencia_transaccion=referencia_transaccion
        )
        
        # Actualizar estado de factura
        factura.estado = 'pagada'
        factura.save()
        
        serializer = PagoSerializer(pago)
        return Response(serializer.data)
        
    except Factura.DoesNotExist:
        return Response({'error': 'Factura no encontrada'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)