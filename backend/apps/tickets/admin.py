from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'asunto', 'prioridad', 'estado', 'creado']
    list_filter = ['estado', 'prioridad', 'creado']
    search_fields = ['asunto', 'cliente__username']
