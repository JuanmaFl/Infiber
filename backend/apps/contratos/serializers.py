from rest_framework import serializers
from .models import Contrato
from apps.usuarios.serializers import UsuarioSerializer
from apps.planes.serializers import PlanSerializer

class ContratoSerializer(serializers.ModelSerializer):
    cliente_detalle = UsuarioSerializer(source='cliente', read_only=True)
    plan_detalle = PlanSerializer(source='plan', read_only=True)
    
    class Meta:
        model = Contrato
        fields = '__all__'
        read_only_fields = ['id', 'creado']
