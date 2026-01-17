from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

class BloqueoUsuarioMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Rutas permitidas para usuarios bloqueados
        rutas_permitidas = [
            '/api/token/',
            '/api/token/refresh/',
            '/admin/',
            '/infiber/api/token/',
            '/infiber/api/token/refresh/',
        ]
        
        if request.user.is_authenticated and hasattr(request.user, 'bloqueado'):
            if request.user.bloqueado:
                # Verificar si la ruta está en las permitidas
                if not any(request.path.startswith(ruta) for ruta in rutas_permitidas):
                    return JsonResponse({
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
        return None
