from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.facturas.models import Factura
from apps.usuarios.models import Usuario

class Command(BaseCommand):
    help = 'Suspende contratos con facturas vencidas hace más de 5 días'

    def handle(self, *args, **options):
        hoy = timezone.now().date()
        
        self.stdout.write(
            self.style.WARNING(f'\n🔴 Verificando contratos para suspensión - {hoy.strftime("%d/%m/%Y")}\n')
        )
        
        # Facturas vencidas hace más de 5 días
        fecha_limite = hoy - timedelta(days=5)
        facturas_morosas = Factura.objects.filter(
            estado='pendiente',
            fecha_vencimiento__lt=fecha_limite
        ).select_related('contrato', 'contrato__cliente')
        
        self.stdout.write(f'📋 Facturas vencidas (+5 días): {facturas_morosas.count()}\n')
        
        suspendidos = 0
        ya_suspendidos = 0
        bloqueados = 0
        
        for factura in facturas_morosas:
            contrato = factura.contrato
            cliente = contrato.cliente
            dias_mora = (hoy - factura.fecha_vencimiento).days
            
            # Verificar si el contrato ya está suspendido
            if contrato.estado == 'suspendido':
                ya_suspendidos += 1
                continue
            
            # Suspender contrato
            if contrato.suspender_por_mora():
                suspendidos += 1
                
                # Bloquear usuario si no está bloqueado
                if not cliente.bloqueado:
                    cliente.bloqueado = True
                    cliente.is_active = False
                    cliente.motivo_bloqueo = f'Suspendido por mora - Factura {factura.numero_factura} ({dias_mora} días de retraso)'
                    cliente.fecha_bloqueo = timezone.now()
                    cliente.save()
                    bloqueados += 1
                    
                    self.stdout.write(
                        self.style.ERROR(
                            f'🔴 SUSPENDIDO - Contrato {contrato.id} - Cliente: {cliente.username} - '
                            f'Factura: {factura.numero_factura} ({dias_mora} días mora)'
                        )
                    )
        
        # Resumen
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.WARNING('\n📊 RESUMEN DE SUSPENSIONES\n'))
        self.stdout.write('='*60)
        
        if suspendidos > 0:
            self.stdout.write(self.style.ERROR(f'🔴 Contratos suspendidos: {suspendidos}'))
            self.stdout.write(self.style.ERROR(f'🚫 Usuarios bloqueados: {bloqueados}'))
        
        if ya_suspendidos > 0:
            self.stdout.write(self.style.WARNING(f'⏭️  Ya suspendidos: {ya_suspendidos}'))
        
        if suspendidos == 0 and ya_suspendidos == 0:
            self.stdout.write(self.style.SUCCESS('✅ No hay contratos para suspender'))
        
        self.stdout.write('\n' + '='*60 + '\n')
