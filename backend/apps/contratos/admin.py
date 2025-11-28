from django.contrib import admin
from .models import Contrato

@admin.register(Contrato)
class ContratoAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'plan', 'zona', 'estado', 'fecha_inicio']
    list_filter = ['estado', 'zona']
    search_fields = ['cliente__username']
