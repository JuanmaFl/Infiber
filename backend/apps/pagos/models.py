from django.db import models
from apps.facturas.models import Factura

class Pago(models.Model):
    METODOS = [
        ('efectivo', 'Efectivo'),
        ('transferencia', 'Transferencia'),
        ('tarjeta', 'Tarjeta'),
        ('wompi', 'Wompi'),
        ('payu', 'PayU'),
    ]
    
    ESTADOS = [
        ('exitoso', 'Exitoso'),
        ('pendiente', 'Pendiente'),
        ('fallido', 'Fallido'),
        ('reembolsado', 'Reembolsado'),
    ]
    
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo = models.CharField(max_length=20, choices=METODOS)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    referencia = models.CharField(max_length=100, blank=True)
    referencia_externa = models.CharField(max_length=200, blank=True, help_text="ID de transacción de Wompi/PayU")
    datos_respuesta = models.JSONField(blank=True, null=True, help_text="Respuesta completa del gateway")
    fecha_pago = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pagos'
        verbose_name = 'Pago'
        verbose_name_plural = 'Pagos'
    
    def __str__(self):
        return f"Pago {self.id} - {self.monto} - {self.estado}"
