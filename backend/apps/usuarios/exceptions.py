from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        request = context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'bloqueado') and request.user.bloqueado:
                return Response({
                    'bloqueado': True,
                    'mensaje': 'Tu cuenta ha sido temporalmente suspendida',
                    'instrucciones': 'Para obtener más información sobre el motivo de la suspensión y los pasos a seguir, por favor:',
                    'opciones': [
                        'Envía un correo electrónico a: soporte@infiber.com',
                        'Visita nuestra sede en: Medellín, Antioquia',
                        'Horario de atención: Lunes a Viernes de 8:00 AM a 6:00 PM'
                    ],
                    'nota': 'Nuestro equipo estará encantado de ayudarte a resolver esta situación.'
                }, status=403)
    
    return response
