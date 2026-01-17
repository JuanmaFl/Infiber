from django.contrib import admin
from .models import Pago

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ['id', 'factura', 'monto', 'metodo_pago', 'estado', 'fecha_pago']
    list_filter = ['estado', 'metodo_pago', 'fecha_pago']
    search_fields = ['factura__numero_factura', 'referencia_transaccion', 'wompi_transaction_id']
    readonly_fields = ['fecha_pago', 'wompi_transaction_id', 'wompi_reference', 'wompi_status', 'wompi_response']
    
    fieldsets = (
        ('Información del Pago', {
            'fields': ('factura', 'monto', 'metodo_pago', 'estado', 'referencia_transaccion')
        }),
        ('Información de Wompi', {
            'fields': ('wompi_transaction_id', 'wompi_reference', 'wompi_payment_method_type', 'wompi_status', 'wompi_response'),
            'classes': ('collapse',)
        }),
        ('Fechas', {
            'fields': ('fecha_pago',)
        }),
    )
    
    def has_delete_permission(self, request, obj=None):
        # Solo superadmins pueden eliminar pagos
        return request.user.is_superuser
