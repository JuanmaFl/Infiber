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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.facturas.models import Factura
from apps.planes.models import Plan

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verificar_facturas_pendientes(request, contrato_id):
    """
    Verifica si un contrato tiene facturas pendientes
    """
    try:
        facturas_pendientes = Factura.objects.filter(
            contrato_id=contrato_id,
            estado__in=['pendiente', 'vencida']
        ).count()
        
        return Response({
            'tiene_pendientes': facturas_pendientes > 0,
            'cantidad': facturas_pendientes
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_plan_contrato(request, contrato_id):
    """
    Cambia el plan de un contrato si no tiene facturas pendientes
    """
    try:
        from .models import Contrato
        
        contrato = Contrato.objects.get(id=contrato_id, cliente=request.user)
        nuevo_plan_id = request.data.get('nuevo_plan_id')
        
        if not nuevo_plan_id:
            return Response({'error': 'Plan requerido'}, status=400)
        
        # Verificar facturas pendientes
        facturas_pendientes = Factura.objects.filter(
            contrato=contrato,
            estado__in=['pendiente', 'vencida']
        ).count()
        
        if facturas_pendientes > 0:
            return Response({
                'error': f'Tienes {facturas_pendientes} factura(s) pendiente(s). Debes pagarlas antes de cambiar de plan.'
            }, status=400)
        
        # Cambiar plan
        nuevo_plan = Plan.objects.get(id=nuevo_plan_id)
        contrato.plan = nuevo_plan
        contrato.save()
        
        return Response({
            'message': 'Plan actualizado exitosamente',
            'nuevo_plan': nuevo_plan.nombre
        })
        
    except Contrato.DoesNotExist:
        return Response({'error': 'Contrato no encontrado'}, status=404)
    except Plan.DoesNotExist:
        return Response({'error': 'Plan no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancelar_contrato(request, contrato_id):
    """
    Cancela un contrato si no tiene facturas pendientes
    """
    try:
        from .models import Contrato
        
        contrato = Contrato.objects.get(id=contrato_id, cliente=request.user)
        
        # Verificar facturas pendientes
        facturas_pendientes = Factura.objects.filter(
            contrato=contrato,
            estado__in=['pendiente', 'vencida']
        ).count()
        
        if facturas_pendientes > 0:
            return Response({
                'error': f'Tienes {facturas_pendientes} factura(s) pendiente(s). Debes pagarlas antes de cancelar el servicio.'
            }, status=400)
        
        # Cancelar contrato
        contrato.estado = 'cancelado'
        contrato.save()
        
        return Response({
            'message': 'Contrato cancelado exitosamente'
        })
        
    except Contrato.DoesNotExist:
        return Response({'error': 'Contrato no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
