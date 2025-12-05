from django.db import models
from apps.usuarios.models import Usuario

class Ticket(models.Model):
    TIPOS = [
        ('problema_conexion', 'Problema de Conexión'),
        ('traslado', 'Traslado de Servicio'),
        ('router_adicional', 'Router Adicional'),
        ('cambio_plan', 'Cambio de Plan'),
        ('otro', 'Otro'),
    ]
    
    PRIORIDADES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    ESTADOS = [
        ('abierto', 'Abierto'),
        ('en_proceso', 'En Proceso'),
        ('resuelto', 'Resuelto'),
        ('cerrado', 'Cerrado'),
    ]
    
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='tickets_cliente')
    asignado_a = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_asignados')
    
    tipo = models.CharField(max_length=50, choices=TIPOS, default='otro')
    asunto = models.CharField(max_length=200)
    descripcion = models.TextField()
    prioridad = models.CharField(max_length=20, choices=PRIORIDADES, default='media')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='abierto')
    
    # Campos específicos según tipo de ticket
    datos_adicionales = models.JSONField(null=True, blank=True, help_text='Datos específicos del tipo de ticket')
    
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tickets'
        verbose_name = 'Ticket de Soporte'
        verbose_name_plural = 'Tickets de Soporte'
        ordering = ['-creado']
    
    def __str__(self):
        return f"Ticket #{self.id} - {self.asunto}"


class ComentarioTicket(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    comentario = models.TextField()
    es_interno = models.BooleanField(default=False, help_text='Comentario solo visible para personal')
    creado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'comentarios_ticket'
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering = ['creado']
    
    def __str__(self):
        return f"Comentario de {self.usuario.username} en Ticket #{self.ticket.id}"
