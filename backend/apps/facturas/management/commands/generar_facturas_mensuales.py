from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from apps.contratos.models import Contrato
from apps.facturas.models import Factura
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Genera facturas mensuales para todos los contratos activos'

    def handle(self, *args, **options):
        hoy = timezone.now().date()
        
        self.stdout.write(self.style.WARNING(f'\n💰 Generando facturas mensuales - {hoy.strftime("%d/%m/%Y")}\n'))
        
        # Solo generar el día 1 de cada mes
        if hoy.day != 1:
            self.stdout.write(self.style.NOTICE('ℹ️  Las facturas solo se generan el día 1 de cada mes'))
            return
        
        # Contratos activos
        contratos_activos = Contrato.objects.filter(estado='activo')
        self.stdout.write(f'📋 Contratos activos: {contratos_activos.count()}\n')
        
        facturas_creadas = 0
        errores = 0
        
        for contrato in contratos_activos:
            try:
                # Verificar si ya existe factura para este mes
                periodo = hoy.strftime('%B %Y')
                existe = Factura.objects.filter(
                    contrato=contrato,
                    periodo=periodo
                ).exists()
                
                if existe:
                    self.stdout.write(f'⏭️  Contrato {contrato.id} ya tiene factura para {periodo}')
                    continue
                
                # Generar número de factura
                año_actual = hoy.year
                facturas_año = Factura.objects.filter(
                    numero_factura__startswith=f'FAC-{año_actual}'
                ).count()
                numero_factura = f'FAC-{año_actual}-{str(facturas_año + 1).zfill(3)}'
                
                # Fecha de vencimiento: día 10 del mes
                fecha_vencimiento = hoy.replace(day=10)
                
                # Crear factura
                factura = Factura.objects.create(
                    contrato=contrato,
                    numero_factura=numero_factura,
                    periodo=periodo,
                    monto=contrato.plan.precio,
                    fecha_vencimiento=fecha_vencimiento,
                    estado='pendiente'
                )
                
                facturas_creadas += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Factura {numero_factura} creada - Cliente: {contrato.cliente.username} - ${factura.monto}'
                    )
                )
                
            except Exception as e:
                errores += 1
                self.stdout.write(
                    self.style.ERROR(f'❌ Error en contrato {contrato.id}: {str(e)}')
                )
        
        # Resumen
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('\n📊 RESUMEN\n'))
        self.stdout.write('='*60)
        self.stdout.write(self.style.SUCCESS(f'✅ Facturas creadas: {facturas_creadas}'))
        if errores > 0:
            self.stdout.write(self.style.ERROR(f'❌ Errores: {errores}'))
        self.stdout.write('\n' + '='*60 + '\n')
