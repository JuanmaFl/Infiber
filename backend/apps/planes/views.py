from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Plan
from .serializers import PlanSerializer

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    
    def get_permissions(self):
        """
        Permite lectura pública de planes
        Requiere autenticación para crear/editar/eliminar
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
