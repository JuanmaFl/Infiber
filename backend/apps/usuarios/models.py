from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

class Usuario(AbstractUser):
    ROLES = [
        ('cliente', 'Cliente'),
        ('tecnico', 'Técnico'),
        ('admin', 'Administrador'),
        ('superadmin', 'Super Administrador'),
    ]
    
    rol = models.CharField(max_length=20, choices=ROLES, default='cliente')
    telefono = models.CharField(max_length=20, blank=True)
    direccion = models.TextField(blank=True)
    cedula = models.CharField(max_length=20, unique=True, blank=True, null=True)
    
    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.rol})"


class CodigoVerificacion(models.Model):
    """Modelo para almacenar códigos de verificación temporales"""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='codigos_verificacion')
    codigo = models.CharField(max_length=6)
    creado_en = models.DateTimeField(auto_now_add=True)
    expira_en = models.DateTimeField()
    usado = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'codigos_verificacion'
        verbose_name = 'Código de Verificación'
        verbose_name_plural = 'Códigos de Verificación'
        ordering = ['-creado_en']
    
    def save(self, *args, **kwargs):
        if not self.expira_en:
            self.expira_en = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)
    
    def es_valido(self):
        """Verifica si el código aún es válido"""
        return not self.usado and timezone.now() < self.expira_en
    
    def __str__(self):
        return f"Código {self.codigo} para {self.usuario.username}"