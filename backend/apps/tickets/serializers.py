from rest_framework import serializers
from .models import Ticket, ComentarioTicket


class ComentarioTicketSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = ComentarioTicket
        fields = ['id', 'ticket', 'usuario', 'usuario_nombre', 'comentario', 'es_interno', 'creado']
        read_only_fields = ['usuario', 'creado']
    
    def get_usuario_nombre(self, obj):
        return f"{obj.usuario.first_name} {obj.usuario.last_name}" if obj.usuario.first_name else obj.usuario.username


class TicketSerializer(serializers.ModelSerializer):
    comentarios = ComentarioTicketSerializer(many=True, read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'cliente', 'asignado_a', 'tipo', 'asunto', 'descripcion', 
                  'prioridad', 'estado', 'datos_adicionales', 'comentarios', 'creado', 'actualizado']
        read_only_fields = ['cliente', 'creado', 'actualizado']
