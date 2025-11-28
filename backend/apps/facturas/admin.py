from django.contrib import admin
from .models import Factura

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):
    list_display = ['numero_factura', 'contrato', 'periodo', 'monto', 'estado', 'fecha_vencimiento']
    list_filter = ['estado', 'fecha_emision']
    search_fields = ['numero_factura', 'contrato__cliente__username']
