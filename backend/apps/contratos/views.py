from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Contrato
from .serializers import ContratoSerializer

class ContratoViewSet(viewsets.ModelViewSet):
    serializer_class = ContratoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Devolver solo contratos del usuario autenticado"""
        user = self.request.user
        
        # Si es admin/superadmin, ver todos
        if user.rol in ['admin', 'superadmin']:
            return Contrato.objects.all()
        
        # Si es cliente, solo ver sus contratos
        return Contrato.objects.filter(cliente=user)