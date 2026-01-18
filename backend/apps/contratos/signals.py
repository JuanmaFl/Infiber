from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from .models import Contrato
from apps.facturas.models import Factura
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Contrato)
def crear_primera_factura(sender, instance, created, **kwargs):
    """
    Crea la primera factura automáticamente cuando se crea un contrato.
    La factura es proporcional si se crea a mitad de mes.
    """
    if created and instance.estado == 'activo':
        try:
            # Calcular número de factura
            año_actual = timezone.now().year
            facturas_año = Factura.objects.filter(
                numero_factura__startswith=f'FAC-{año_actual}'
            ).count()
            numero_factura = f'FAC-{año_actual}-{str(facturas_año + 1).zfill(3)}'
            
            # Calcular monto proporcional
            hoy = instance.fecha_inicio
            dias_mes = 30
            dia_actual = hoy.day
            
            if dia_actual <= 5:
                # Si es inicio de mes, cobrar mes completo
                monto = instance.plan.precio
                periodo = hoy.strftime('%B %Y')
            else:
                # Cobro proporcional
                dias_restantes = dias_mes - dia_actual + 1
                monto = (instance.plan.precio / Decimal(dias_mes)) * Decimal(dias_restantes)
                periodo = f"{hoy.strftime('%d/%m/%Y')} - {(hoy + timedelta(days=dias_restantes)).strftime('%d/%m/%Y')}"
            
            # Fecha de vencimiento: 10 días después
            fecha_vencimiento = hoy + timedelta(days=10)
            
            # Crear factura
            factura = Factura.objects.create(
                contrato=instance,
                numero_factura=numero_factura,
                periodo=periodo,
                monto=round(monto, 2),
                fecha_vencimiento=fecha_vencimiento,
                estado='pendiente'
            )
            
            logger.info(f'✅ Factura {numero_factura} creada para contrato {instance.id} - Monto: ${factura.monto}')
            
        except Exception as e:
            logger.error(f'❌ Error creando factura para contrato {instance.id}: {str(e)}')
