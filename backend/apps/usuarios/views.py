from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Usuario, CodigoVerificacion
from .serializers import UsuarioSerializer, UsuarioCreateSerializer
from .utils import generar_codigo_verificacion, enviar_codigo_recuperacion, enviar_confirmacion_cambio_password

User = get_user_model()

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()

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
        return [IsAuthenticated()]

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
