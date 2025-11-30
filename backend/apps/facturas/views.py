from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Factura
from .serializers import FacturaSerializer

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtra las facturas para mostrar solo las del usuario autenticado
        """
        usuario = self.request.user
        
        # Si es admin, mostrar todas
        if usuario.rol == 'admin':
            return Factura.objects.all()
        
        # Si es cliente, solo sus facturas
        return Factura.objects.filter(contrato__cliente=usuario)
