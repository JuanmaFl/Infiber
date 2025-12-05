from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.facturas.models import Factura
from apps.facturas.utils import enviar_recordatorio_factura_proxima_vencer

class Command(BaseCommand):
    help = 'Envía recordatorios semanales de facturas próximas a vencer'

    def handle(self, *args, **options):
        hoy = timezone.now().date()
        
        self.stdout.write(
            self.style.WARNING(
                f'\n🔔 Iniciando envío de recordatorios - {hoy.strftime("%d/%m/%Y")}\n'
            )
        )
        
        # Facturas pendientes
        facturas_pendientes = Factura.objects.filter(estado='pendiente')
        
        self.stdout.write(
            f'📋 Total de facturas pendientes: {facturas_pendientes.count()}\n'
        )
        
        recordatorios_enviados = 0
        facturas_procesadas = {
            'vencidas': [],
            'vence_pronto': [],
            'vence_en_7_dias': []
        }
        
        for factura in facturas_pendientes:
            dias_restantes = (factura.fecha_vencimiento - hoy).days
            cliente = factura.contrato.cliente
            
            # Categorizar facturas
            if dias_restantes <= 0:
                facturas_procesadas['vencidas'].append(factura)
                enviar = True
            elif dias_restantes <= 3:
                facturas_procesadas['vence_pronto'].append(factura)
                enviar = True
            elif dias_restantes == 7:
                facturas_procesadas['vence_en_7_dias'].append(factura)
                enviar = True
            else:
                enviar = False
            
            if enviar:
                exito = enviar_recordatorio_factura_proxima_vencer(factura, dias_restantes)
                if exito:
                    recordatorios_enviados += 1
                    if dias_restantes <= 0:
                        estado = self.style.ERROR(f'⚠️  VENCIDA')
                    elif dias_restantes <= 3:
                        estado = self.style.WARNING(f'🔔 Vence en {dias_restantes} día(s)')
                    else:
                        estado = self.style.NOTICE(f'📅 Vence en {dias_restantes} días')
                    
                    self.stdout.write(
                        f'{estado} - Factura #{factura.numero_factura} '
                        f'- Cliente: {cliente.username} ({cliente.email})'
                    )
        
        # Resumen
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('\n📊 RESUMEN DE RECORDATORIOS\n'))
        self.stdout.write('='*60 + '\n')
        
        if facturas_procesadas['vencidas']:
            self.stdout.write(
                self.style.ERROR(
                    f'⚠️  Facturas vencidas: {len(facturas_procesadas["vencidas"])}'
                )
            )
        
        if facturas_procesadas['vence_pronto']:
            self.stdout.write(
                self.style.WARNING(
                    f'🔔 Facturas por vencer (≤3 días): {len(facturas_procesadas["vence_pronto"])}'
                )
            )
        
        if facturas_procesadas['vence_en_7_dias']:
            self.stdout.write(
                self.style.NOTICE(
                    f'📅 Facturas que vencen en 7 días: {len(facturas_procesadas["vence_en_7_dias"])}'
                )
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ Total de recordatorios enviados: {recordatorios_enviados}'
            )
        )
        
        if recordatorios_enviados == 0:
            self.stdout.write(
                self.style.NOTICE(
                    '\nℹ️  No hay facturas que requieran recordatorio en este momento.'
                )
            )
        
        self.stdout.write('\n' + '='*60 + '\n')
