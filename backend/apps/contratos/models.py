from django.db import models
from apps.usuarios.models import Usuario
from apps.planes.models import Plan

class Contrato(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('suspendido', 'Suspendido'),
        ('cancelado', 'Cancelado'),
    ]
    
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    direccion_instalacion = models.TextField()
    zona = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'contratos'
        verbose_name = 'Contrato'
        verbose_name_plural = 'Contratos'
    
    def __str__(self):
        return f"Contrato {self.id} - {self.cliente.username}"
