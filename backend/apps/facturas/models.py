from django.db import models
from apps.contratos.models import Contrato

class Factura(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('pagada', 'Pagada'),
        ('vencida', 'Vencida'),
        ('cancelada', 'Cancelada'),
    ]
    
    contrato = models.ForeignKey(Contrato, on_delete=models.CASCADE)
    numero_factura = models.CharField(max_length=50, unique=True)
    periodo = models.CharField(max_length=20)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_emision = models.DateField(auto_now_add=True)
    fecha_vencimiento = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    archivo_pdf = models.FileField(upload_to='facturas/', blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'facturas'
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'
    
    def __str__(self):
        return f"Factura {self.numero_factura} - {self.estado}"
