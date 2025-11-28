from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import requests
from .models import Pago
from .serializers import PagoSerializer

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer

@api_view(['POST'])
def crear_pago_wompi(request):
    """Crear transacción en Wompi"""
    monto = request.data.get('monto')
    referencia = request.data.get('referencia')
    email = request.data.get('email')
    
    # URL de Wompi (sandbox)
    url = 'https://sandbox.wompi.co/v1/transactions'
    
    headers = {
        'Authorization': f'Bearer {settings.WOMPI_PUBLIC_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'amount_in_cents': int(float(monto) * 100),
        'currency': 'COP',
        'customer_email': email,
        'reference': referencia,
        'redirect_url': f'{settings.FRONTEND_URL}/pago-exitoso'
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        return Response(response.json())
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def crear_pago_payu(request):
    """Crear transacción en PayU"""
    monto = request.data.get('monto')
    referencia = request.data.get('referencia')
    email = request.data.get('email')
    
    # URL de PayU (sandbox)
    url = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
    
    payload = {
        'language': 'es',
        'command': 'SUBMIT_TRANSACTION',
        'merchant': {
            'apiKey': settings.PAYU_API_KEY,
            'apiLogin': settings.PAYU_API_LOGIN
        },
        'transaction': {
            'order': {
                'accountId': settings.PAYU_ACCOUNT_ID,
                'referenceCode': referencia,
                'description': 'Pago Infiber ISP',
                'language': 'es',
                'buyer': {
                    'emailAddress': email
                }
            },
            'type': 'AUTHORIZATION_AND_CAPTURE',
            'paymentMethod': 'PSE',
            'paymentCountry': 'CO',
            'amount': {
                'value': monto,
                'currency': 'COP'
            }
        }
    }
    
    try:
        response = requests.post(url, json=payload)
        return Response(response.json())
    except Exception as e:
        return Response({'error': str(e)}, status=500)
