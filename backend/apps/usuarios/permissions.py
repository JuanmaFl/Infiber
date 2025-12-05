from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

class NoEstaBloqueado(BasePermission):
    """
    Permiso que verifica si el usuario está bloqueado
    """
    message = {
        'bloqueado': True,
        'mensaje': 'Tu cuenta ha sido temporalmente suspendida',
        'instrucciones': 'Para obtener más información sobre el motivo de la suspensión y los pasos a seguir, por favor:',
        'opciones': [
            'Envía un correo electrónico a: soporte@infiber.com',
            'Visita nuestra sede en: Medellín, Antioquia',
            'Horario de atención: Lunes a Viernes de 8:00 AM a 6:00 PM'
        ],
        'nota': 'Nuestro equipo estará encantado de ayudarte a resolver esta situación.'
    }
    
    def has_permission(self, request, view):
        logger.warning(f"🔍 Verificando permiso para usuario: {request.user}")
        logger.warning(f"🔍 Autenticado: {request.user.is_authenticated}")
        
        # Permitir acceso anónimo
        if not request.user.is_authenticated:
            logger.warning("✅ Usuario no autenticado, permitir")
            return True
        
        # Verificar si el usuario está bloqueado
        if hasattr(request.user, 'bloqueado'):
            logger.warning(f"🔍 Usuario tiene atributo bloqueado: {request.user.bloqueado}")
            if request.user.bloqueado:
                logger.warning("🚫 Usuario BLOQUEADO - Denegando acceso")
                return False
        else:
            logger.warning("⚠️ Usuario NO tiene atributo bloqueado")
        
        logger.warning("✅ Acceso permitido")
        return True
