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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .utils import generar_pdf_factura

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def descargar_factura_pdf(request, factura_id):
    """
    Genera y descarga el PDF de una factura
    """
    try:
        # Si es admin o superadmin, puede ver todas las facturas
        if request.user.rol in ['admin', 'superadmin']:
            factura = Factura.objects.get(id=factura_id)
        else:
            # Si es cliente, solo puede ver sus facturas
            factura = Factura.objects.get(
                id=factura_id,
                contrato__cliente=request.user
            )
        
        # Generar PDF
        pdf_buffer = generar_pdf_factura(factura)
        
        # Crear respuesta HTTP con el PDF
        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Factura_{factura.numero_factura}.pdf"'
        
        return response
        
    except Factura.DoesNotExist:
        return HttpResponse('Factura no encontrada', status=404)
    except Exception as e:
        return HttpResponse(f'Error al generar PDF: {str(e)}', status=500)
