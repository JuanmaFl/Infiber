from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

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
