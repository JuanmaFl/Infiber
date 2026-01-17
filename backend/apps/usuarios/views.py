from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Usuario, CodigoVerificacion
from .serializers import UsuarioSerializer, UsuarioCreateSerializer
from .utils import generar_codigo_verificacion, enviar_codigo_recuperacion, enviar_confirmacion_cambio_password
from apps.usuarios.permissions import NoEstaBloqueado

User = get_user_model()

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    permission_classes = [IsAuthenticated, NoEstaBloqueado]

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioSerializer

    def get_permissions(self):
        """
        Permite crear usuarios sin autenticación (registro público)
        Requiere autenticación para otras acciones
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated(), NoEstaBloqueado()]
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def bloquear(self, request, pk=None):
        """Bloquea un usuario"""
        if request.user.rol not in ['admin', 'superadmin']:
            return Response(
                {'error': 'No tienes permiso para bloquear usuarios'},
                status=status.HTTP_403_FORBIDDEN
            )

        usuario = self.get_object()
        motivo = request.data.get('motivo', 'Sin motivo especificado')

        usuario.bloqueado = True
        usuario.motivo_bloqueo = motivo
        usuario.fecha_bloqueo = timezone.now()
        usuario.save()

        return Response({
            'message': 'Usuario bloqueado exitosamente',
            'usuario': UsuarioSerializer(usuario).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def desbloquear(self, request, pk=None):
        """Desbloquea un usuario"""
        if request.user.rol not in ['admin', 'superadmin']:
            return Response(
                {'error': 'No tienes permiso para desbloquear usuarios'},
                status=status.HTTP_403_FORBIDDEN
            )

        usuario = self.get_object()
        usuario.bloqueado = False
        usuario.motivo_bloqueo = None
        usuario.fecha_bloqueo = None
        usuario.save()

        return Response({
            'message': 'Usuario desbloqueado exitosamente',
            'usuario': UsuarioSerializer(usuario).data
        })

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def historial(self, request, pk=None):
        """Obtiene el historial completo de un cliente"""
        if request.user.rol not in ['admin', 'superadmin']:
            return Response(
                {'error': 'No tienes permiso para ver el historial'},
                status=status.HTTP_403_FORBIDDEN
            )

        from apps.contratos.models import Contrato
        from apps.facturas.models import Factura
        from apps.pagos.models import Pago
        from apps.tickets.models import Ticket
        from apps.contratos.serializers import ContratoSerializer
        from apps.facturas.serializers import FacturaSerializer
        from apps.pagos.serializers import PagoSerializer
        from apps.tickets.serializers import TicketSerializer

        usuario = self.get_object()

        contratos = Contrato.objects.filter(cliente=usuario).order_by('-fecha_inicio')
        facturas = Factura.objects.filter(contrato__cliente=usuario).order_by('-fecha_emision')
        pagos = Pago.objects.filter(factura__contrato__cliente=usuario).order_by('-fecha_pago')
        tickets = Ticket.objects.filter(cliente=usuario).order_by('-creado')

        return Response({
            'usuario': UsuarioSerializer(usuario).data,
            'contratos': ContratoSerializer(contratos, many=True).data,
            'facturas': FacturaSerializer(facturas, many=True).data,
            'pagos': PagoSerializer(pagos, many=True).data,
            'tickets': TicketSerializer(tickets, many=True).data,
            'estadisticas': {
                'total_contratos': contratos.count(),
                'contratos_activos': contratos.filter(estado='activo').count(),
                'total_facturas': facturas.count(),
                'facturas_pendientes': facturas.filter(estado='pendiente').count(),
                'total_pagado': sum(float(p.monto) for p in pagos),
                'total_tickets': tickets.count(),
                'tickets_abiertos': tickets.filter(estado__in=['abierto', 'en_proceso']).count()
            }
        })


# ============================================
# ENDPOINTS DE RECUPERACIÓN DE CONTRASEÑA
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def solicitar_codigo_recuperacion(request):
    """
    Envía un código de verificación al email del usuario
    Body: { "email": "usuario@example.com" }
    """
    email = request.data.get('email')

    if not email:
        return Response(
            {'error': 'El email es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Buscar usuario por email (toma el primero si hay duplicados)
    usuario = User.objects.filter(email=email).first()

    if not usuario:
        # Por seguridad, no revelamos si el email existe o no
        return Response(
            {'message': 'Si el email existe, recibirás un código de verificación'},
            status=status.HTTP_200_OK
        )

    # Invalidar códigos anteriores
    CodigoVerificacion.objects.filter(usuario=usuario, usado=False).update(usado=True)

    # Generar nuevo código
    codigo = generar_codigo_verificacion()
    CodigoVerificacion.objects.create(usuario=usuario, codigo=codigo)

    # Enviar email
    if enviar_codigo_recuperacion(email, codigo):
        return Response(
            {'message': 'Código de verificación enviado al email'},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {'error': 'Error al enviar el email. Intenta nuevamente.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_codigo_y_resetear(request):
    """
    Verifica el código y permite cambiar la contraseña
    Body: {
        "email": "usuario@example.com",
        "codigo": "123456",
        "nueva_password": "nuevacontraseña123"
    }
    """
    email = request.data.get('email')
    codigo = request.data.get('codigo')
    nueva_password = request.data.get('nueva_password')

    if not all([email, codigo, nueva_password]):
        return Response(
            {'error': 'Email, código y nueva contraseña son requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Buscar usuario (toma el primero si hay duplicados)
    usuario = User.objects.filter(email=email).first()

    if not usuario:
        return Response(
            {'error': 'Email inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Buscar código válido
    try:
        codigo_obj = CodigoVerificacion.objects.get(
            usuario=usuario,
            codigo=codigo,
            usado=False
        )

        if not codigo_obj.es_valido():
            return Response(
                {'error': 'El código ha expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cambiar contraseña
        usuario.set_password(nueva_password)
        usuario.save()

        # Marcar código como usado
        codigo_obj.usado = True
        codigo_obj.save()

        # Enviar confirmación
        enviar_confirmacion_cambio_password(usuario.email, usuario.first_name or usuario.username)

        return Response(
            {'message': 'Contraseña actualizada exitosamente'},
            status=status.HTTP_200_OK
        )

    except CodigoVerificacion.DoesNotExist:
        return Response(
            {'error': 'Código inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password_autenticado(request):
    """
    Permite a un usuario autenticado cambiar su contraseña
    Body: {
        "password_actual": "actual123",
        "nueva_password": "nueva123"
    }
    """
    password_actual = request.data.get('password_actual')
    nueva_password = request.data.get('nueva_password')

    if not all([password_actual, nueva_password]):
        return Response(
            {'error': 'Contraseña actual y nueva contraseña son requeridas'},
            status=status.HTTP_400_BAD_REQUEST
        )

    usuario = request.user

    # Verificar contraseña actual
    if not usuario.check_password(password_actual):
        return Response(
            {'error': 'La contraseña actual es incorrecta'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Cambiar contraseña
    usuario.set_password(nueva_password)
    usuario.save()

    # Enviar confirmación
    enviar_confirmacion_cambio_password(usuario.email, usuario.first_name or usuario.username)

    return Response(
        {'message': 'Contraseña actualizada exitosamente'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def estadisticas_dashboard(request):
    """
    Obtiene estadísticas generales para el dashboard del admin
    """
    if request.user.rol not in ['admin', 'superadmin']:
        return Response(
            {'error': 'No tienes permiso para ver estadísticas'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from apps.contratos.models import Contrato
    from apps.facturas.models import Factura
    from apps.pagos.models import Pago
    from apps.tickets.models import Ticket
    from django.db.models import Sum, Count, Q
    from datetime import datetime, timedelta
    from decimal import Decimal
    
    # Clientes
    total_clientes = Usuario.objects.filter(rol='cliente').count()
    clientes_activos = Usuario.objects.filter(rol='cliente', bloqueado=False).count()
    clientes_bloqueados = Usuario.objects.filter(rol='cliente', bloqueado=True).count()
    
    # Contratos
    contratos_activos = Contrato.objects.filter(estado='activo').count()
    contratos_suspendidos = Contrato.objects.filter(estado='suspendido').count()
    contratos_cancelados = Contrato.objects.filter(estado='cancelado').count()
    
    # Facturas
    facturas_pendientes = Factura.objects.filter(estado='pendiente').count()
    facturas_pagadas = Factura.objects.filter(estado='pagada').count()
    facturas_vencidas = Factura.objects.filter(estado='vencida').count()
    
    total_por_cobrar = Factura.objects.filter(estado='pendiente').aggregate(
        total=Sum('monto')
    )['total'] or Decimal('0')
    
    # Pagos
    total_recaudado = Pago.objects.aggregate(total=Sum('monto'))['total'] or Decimal('0')
    
    # Pagos del mes actual
    primer_dia_mes = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    pagos_mes_actual = Pago.objects.filter(
        fecha_pago__gte=primer_dia_mes
    ).aggregate(total=Sum('monto'))['total'] or Decimal('0')
    
    # Tickets
    tickets_abiertos = Ticket.objects.filter(estado='abierto').count()
    tickets_en_proceso = Ticket.objects.filter(estado='en_proceso').count()
    tickets_resueltos = Ticket.objects.filter(estado='resuelto').count()
    tickets_cerrados = Ticket.objects.filter(estado='cerrado').count()
    
    # Ingresos por mes (últimos 6 meses)
    ingresos_mensuales = []
    for i in range(5, -1, -1):
        fecha = datetime.now() - timedelta(days=30*i)
        inicio_mes = fecha.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if i == 0:
            fin_mes = datetime.now()
        else:
            siguiente_mes = inicio_mes + timedelta(days=32)
            fin_mes = siguiente_mes.replace(day=1) - timedelta(seconds=1)
        
        total = Pago.objects.filter(
            fecha_pago__gte=inicio_mes,
            fecha_pago__lte=fin_mes
        ).aggregate(total=Sum('monto'))['total'] or Decimal('0')
        
        ingresos_mensuales.append({
            'mes': inicio_mes.strftime('%b %Y'),
            'ingresos': float(total)
        })
    
    # Tickets por tipo
    tickets_por_tipo = Ticket.objects.values('tipo').annotate(
        cantidad=Count('id')
    ).order_by('-cantidad')
    
    return Response({
        'clientes': {
            'total': total_clientes,
            'activos': clientes_activos,
            'bloqueados': clientes_bloqueados
        },
        'contratos': {
            'activos': contratos_activos,
            'suspendidos': contratos_suspendidos,
            'cancelados': contratos_cancelados
        },
        'facturas': {
            'pendientes': facturas_pendientes,
            'pagadas': facturas_pagadas,
            'vencidas': facturas_vencidas,
            'total_por_cobrar': float(total_por_cobrar)
        },
        'pagos': {
            'total_recaudado': float(total_recaudado),
            'mes_actual': float(pagos_mes_actual)
        },
        'tickets': {
            'abiertos': tickets_abiertos,
            'en_proceso': tickets_en_proceso,
            'resueltos': tickets_resueltos,
            'cerrados': tickets_cerrados
        },
        'ingresos_mensuales': ingresos_mensuales,
        'tickets_por_tipo': list(tickets_por_tipo)
    })
