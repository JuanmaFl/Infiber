from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status as http_status
from .models import ComentarioTicket
from .serializers import ComentarioTicketSerializer
from rest_framework import viewsets, status as http_status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from apps.usuarios.models import Usuario
from .models import Ticket, ComentarioTicket
from .serializers import TicketSerializer, ComentarioTicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.rol in ['admin', 'superadmin']:
            return Ticket.objects.all()
        return Ticket.objects.filter(cliente=user)
    
    def perform_create(self, serializer):
        # Asignar automáticamente el cliente autenticado
        serializer.save(cliente=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agregar_comentario(request, ticket_id):
    """
    Agrega un comentario a un ticket
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        
        # Verificar que el usuario tenga acceso al ticket
        if ticket.cliente != request.user and not request.user.rol in ['admin', 'superadmin']:
            return Response(
                {'error': 'No tienes permiso para comentar en este ticket'},
                status=http_status.HTTP_403_FORBIDDEN
            )
        
        comentario_text = request.data.get('comentario')
        if not comentario_text:
            return Response(
                {'error': 'El comentario es requerido'},
                status=http_status.HTTP_400_BAD_REQUEST
            )
        
        comentario = ComentarioTicket.objects.create(
            ticket=ticket,
            usuario=request.user,
            comentario=comentario_text,
            es_interno=False  # Los comentarios de clientes nunca son internos
        )
        
        serializer = ComentarioTicketSerializer(comentario)
        return Response(serializer.data, status=http_status.HTTP_201_CREATED)
        
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket no encontrado'},
            status=http_status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_comentarios(request, ticket_id):
    """
    Lista los comentarios de un ticket
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        
        # Verificar que el usuario tenga acceso al ticket
        if ticket.cliente != request.user and not request.user.rol in ['admin', 'superadmin']:
            return Response(
                {'error': 'No tienes permiso para ver este ticket'},
                status=http_status.HTTP_403_FORBIDDEN
            )
        
        # Clientes solo ven comentarios no internos
        if request.user.rol in ['admin', 'superadmin']:
            comentarios = ticket.comentarios.all()
        else:
            comentarios = ticket.comentarios.filter(es_interno=False)
        
        serializer = ComentarioTicketSerializer(comentarios, many=True)
        return Response(serializer.data)
        
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket no encontrado'},
            status=http_status.HTTP_404_NOT_FOUND
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def asignar_tecnico(request, ticket_id):
    """
    Asigna un técnico a un ticket (solo admin/superadmin)
    """
    if request.user.rol not in ['admin', 'superadmin', 'tecnico']:
        return Response(
            {'error': 'No tienes permiso para asignar tickets'},
            status=http_status.HTTP_403_FORBIDDEN
        )
    
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        tecnico_id = request.data.get('tecnico_id')
        
        if tecnico_id:
            tecnico = Usuario.objects.get(id=tecnico_id)
            if tecnico.rol not in ['tecnico', 'admin', 'superadmin']:
                return Response(
                    {'error': 'El usuario seleccionado no es técnico'},
                    status=http_status.HTTP_400_BAD_REQUEST
                )
            ticket.asignado_a = tecnico
        else:
            ticket.asignado_a = None
        
        ticket.save()
        
        # Crear comentario automático
        ComentarioTicket.objects.create(
            ticket=ticket,
            usuario=request.user,
            comentario=f"Ticket asignado a {tecnico.first_name} {tecnico.last_name}" if tecnico_id else "Ticket desasignado",
            es_interno=True
        )
        
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)
        
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket no encontrado'},
            status=http_status.HTTP_404_NOT_FOUND
        )
    except Usuario.DoesNotExist:
        return Response(
            {'error': 'Técnico no encontrado'},
            status=http_status.HTTP_404_NOT_FOUND
        )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cambiar_estado_ticket(request, ticket_id):
    """
    Cambia el estado de un ticket y envía notificación al cliente
    """
    if request.user.rol not in ['admin', 'superadmin', 'tecnico']:
        return Response(
            {'error': 'No tienes permiso para cambiar el estado'},
            status=http_status.HTTP_403_FORBIDDEN
        )
    
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado not in ['abierto', 'en_proceso', 'resuelto', 'cerrado']:
            return Response(
                {'error': 'Estado inválido'},
                status=http_status.HTTP_400_BAD_REQUEST
            )
        
        estado_anterior = ticket.estado
        ticket.estado = nuevo_estado
        ticket.save()
        
        # Crear comentario automático
        estados_nombres = {
            'abierto': 'Abierto',
            'en_proceso': 'En Proceso',
            'resuelto': 'Resuelto',
            'cerrado': 'Cerrado'
        }
        ComentarioTicket.objects.create(
            ticket=ticket,
            usuario=request.user,
            comentario=f"Estado cambiado de '{estados_nombres[estado_anterior]}' a '{estados_nombres[nuevo_estado]}'",
            es_interno=False
        )
        
        # Enviar notificación por email al cliente
        enviar_notificacion_estado(ticket, request.user)
        
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)
        
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket no encontrado'},
            status=http_status.HTTP_404_NOT_FOUND
        )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cambiar_prioridad_ticket(request, ticket_id):
    """
    Cambia la prioridad de un ticket
    """
    if request.user.rol not in ['admin', 'superadmin', 'tecnico']:
        return Response(
            {'error': 'No tienes permiso para cambiar la prioridad'},
            status=http_status.HTTP_403_FORBIDDEN
        )
    
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        nueva_prioridad = request.data.get('prioridad')
        
        if nueva_prioridad not in ['baja', 'media', 'alta', 'urgente']:
            return Response(
                {'error': 'Prioridad inválida'},
                status=http_status.HTTP_400_BAD_REQUEST
            )
        
        prioridad_anterior = ticket.prioridad
        ticket.prioridad = nueva_prioridad
        ticket.save()
        
        # Crear comentario automático
        ComentarioTicket.objects.create(
            ticket=ticket,
            usuario=request.user,
            comentario=f"Prioridad cambiada de '{prioridad_anterior}' a '{nueva_prioridad}'",
            es_interno=True
        )
        
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)
        
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket no encontrado'},
            status=http_status.HTTP_404_NOT_FOUND
        )


def enviar_notificacion_estado(ticket, usuario_actualizador):
    """
    Envía email de notificación al cliente cuando cambia el estado del ticket
    """
    try:
        cliente = ticket.cliente
        
        estados_mensajes = {
            'abierto': 'ha sido reabierto',
            'en_proceso': 'está siendo atendido',
            'resuelto': 'ha sido resuelto',
            'cerrado': 'ha sido cerrado'
        }
        
        asunto = f'Actualización de Ticket #{ticket.id} - INFIBER ISP'
        
        mensaje = f"""
Hola {cliente.first_name},

Tu ticket de soporte ha sido actualizado:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INFORMACIÓN DEL TICKET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ticket ID: #{ticket.id}
Asunto: {ticket.asunto}
Estado: {estados_mensajes.get(ticket.estado, ticket.estado)}
Prioridad: {ticket.prioridad.capitalize()}

Atendido por: {usuario_actualizador.first_name} {usuario_actualizador.last_name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Puedes revisar los detalles y comentarios de tu ticket ingresando a tu panel de cliente en:
https://86.48.21.76/infiber/dashboard/cliente/tickets

Si tienes alguna pregunta adicional, no dudes en responder este ticket.

Atentamente,
Equipo de Soporte INFIBER ISP
"""
        
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [cliente.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Error enviando notificación: {e}")
