from django.db import models
from apps.usuarios.models import Usuario
from apps.planes.models import Plan
import logging

logger = logging.getLogger(__name__)

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
    motivo_suspension = models.TextField(blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contratos'
        verbose_name = 'Contrato'
        verbose_name_plural = 'Contratos'

    def __str__(self):
        return f"Contrato {self.id} - {self.cliente.username}"
    
    def suspender_por_mora(self):
        """Suspende el contrato por falta de pago"""
        if self.estado == 'activo':
            self.estado = 'suspendido'
            self.motivo_suspension = 'Suspendido por mora en el pago'
            self.save()
            logger.info(f'🔴 Contrato {self.id} suspendido por mora')
            return True
        return False
    
    def reactivar(self):
        """Reactiva el contrato cuando se paga"""
        if self.estado == 'suspendido':
            self.estado = 'activo'
            self.motivo_suspension = None
            self.save()
            logger.info(f'🟢 Contrato {self.id} reactivado')
            return True
        return False
