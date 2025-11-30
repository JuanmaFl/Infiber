from django.core.mail import send_mail
from django.conf import settings
import random
import string

def generar_codigo_verificacion(longitud=6):
    """Genera un código numérico aleatorio"""
    return ''.join(random.choices(string.digits, k=longitud))

def enviar_codigo_recuperacion(email, codigo):
    """Envía email con código de recuperación de contraseña"""
    asunto = 'Recuperación de Contraseña - Infiber ISP'
    mensaje = f'''
Hola,

Has solicitado recuperar tu contraseña en Infiber ISP.

Tu código de verificación es: {codigo}

Este código es válido por 15 minutos.

Si no solicitaste este cambio, por favor ignora este mensaje.

---
Equipo Infiber ISP
Servicio de Internet - Medellín, Colombia
    '''
    
    try:
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error enviando email: {e}")
        return False

def enviar_confirmacion_cambio_password(email, nombre):
    """Envía email confirmando que la contraseña fue cambiada"""
    asunto = 'Contraseña Actualizada - Infiber ISP'
    mensaje = f'''
Hola {nombre},

Tu contraseña ha sido actualizada exitosamente en Infiber ISP.

Si no realizaste este cambio, por favor contacta a soporte inmediatamente.

---
Equipo Infiber ISP
Servicio de Internet - Medellín, Colombia
    '''
    
    try:
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error enviando email: {e}")
        return False