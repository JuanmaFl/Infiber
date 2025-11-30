from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtra los tickets para mostrar solo los del usuario autenticado
        """
        usuario = self.request.user
        
        # Si es admin, mostrar todos
        if usuario.rol == 'admin':
            return Ticket.objects.all()
        
        # Si es cliente, solo sus tickets
        return Ticket.objects.filter(cliente=usuario)
