from django.contrib import admin
from .models import Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'velocidad_bajada', 'velocidad_subida', 'precio', 'activo']
    list_filter = ['activo']
    search_fields = ['nombre']
