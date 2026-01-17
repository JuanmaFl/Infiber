from django.db import models
from apps.facturas.models import Factura

class Pago(models.Model):
    METODOS_PAGO = [
        ('wompi_card', 'Tarjeta de Crédito/Débito (Wompi)'),
        ('wompi_pse', 'PSE (Wompi)'),
        ('wompi_nequi', 'Nequi (Wompi)'),
        ('wompi_bancolombia', 'Transferencia Bancolombia (Wompi)'),
        ('transferencia_bancaria', 'Transferencia Bancaria Manual'),
        ('efectivo', 'Efectivo'),
    ]
    
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('error', 'Error'),
    ]
    
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE, related_name='pagos')
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50, choices=METODOS_PAGO)
    referencia_transaccion = models.CharField(max_length=200, null=True, blank=True)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    
    # Campos específicos de Wompi
    wompi_transaction_id = models.CharField(max_length=200, null=True, blank=True, unique=True)
    wompi_reference = models.CharField(max_length=200, null=True, blank=True)
    wompi_payment_method_type = models.CharField(max_length=50, null=True, blank=True)
    wompi_status = models.CharField(max_length=50, null=True, blank=True)
    wompi_response = models.JSONField(null=True, blank=True)
    
    class Meta:
        ordering = ['-fecha_pago']
    
    def __str__(self):
        return f"Pago {self.id} - Factura {self.factura.numero_factura} - {self.estado}"
