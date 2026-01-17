import requests
import hashlib
from django.conf import settings
from decimal import Decimal


class WompiService:
    """
    Servicio para integración con Wompi
    """

    def __init__(self):
        self.base_url = settings.WOMPI_BASE_URL
        self.public_key = settings.WOMPI_PUBLIC_KEY
        self.private_key = settings.WOMPI_PRIVATE_KEY
        self.integrity_secret = settings.WOMPI_INTEGRITY_SECRET

    def get_acceptance_token(self):
        """
        Obtiene el acceptance token de Wompi (requerido para transacciones directas)
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
            
            response = requests.get(
                f'{self.base_url}/merchants/{self.public_key}',
                headers=headers,
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                return data['data']['presigned_acceptance']['acceptance_token']

            print(f"❌ Error obteniendo acceptance token: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return None

        except Exception as e:
            print(f"❌ Error obteniendo acceptance token: {e}")
            return None

    def crear_link_pago(self, factura, email_cliente):
        """
        Crea un link de pago con Wompi según documentación oficial

        Args:
            factura: Objeto Factura
            email_cliente: Email del cliente

        Returns:
            dict con el permalink y datos de la transacción
        """

        # Generar referencia única
        referencia = f"INFIBER-FAC-{factura.id}-{factura.numero_factura}"

        # Monto en centavos
        monto_centavos = int(factura.monto * 100)

        # Datos de la transacción según documentación oficial de Wompi
        payload = {
            'name': f'Factura {factura.numero_factura}',
            'description': f'Pago de internet - {factura.periodo}',
            'single_use': True,  # Link de un solo uso
            'collect_shipping': False,  # No recolectar información de envío
            'currency': 'COP',
            'amount_in_cents': monto_centavos,
            'redirect_url': f'{settings.FRONTEND_URL}/dashboard/cliente/pagos/confirmacion',
        }

        # Headers según documentación
        headers = {
            'Authorization': f'Bearer {self.private_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
        }

        try:
            print(f"🔍 Enviando request a Wompi...")
            print(f"URL: {self.base_url}/payment_links")
            print(f"Payload: {payload}")
            
            response = requests.post(
                f'{self.base_url}/payment_links',
                json=payload,
                headers=headers,
                timeout=30
            )

            print(f"📋 Wompi Response Status: {response.status_code}")
            print(f"📋 Wompi Response Headers: {dict(response.headers)}")
            print(f"📋 Wompi Response Body: {response.text[:500]}")

            if response.status_code in [200, 201]:
                try:
                    data = response.json()
                    link_id = data['data']['id']
                    
                    # Construir URL del checkout según documentación
                    payment_link = f'https://checkout.wompi.co/l/{link_id}'
                    
                    return {
                        'success': True,
                        'data': data['data'],
                        'payment_link': payment_link,
                        'id': link_id,
                        'reference': referencia
                    }
                except ValueError as e:
                    print(f"❌ Error parseando JSON: {e}")
                    return {
                        'success': False,
                        'error': f'Respuesta inválida de Wompi: {response.text[:100]}'
                    }
            else:
                error_msg = response.text if response.text else f'HTTP {response.status_code}'
                print(f"❌ Error de Wompi: {error_msg}")
                return {
                    'success': False,
                    'error': error_msg,
                    'status_code': response.status_code
                }

        except requests.exceptions.Timeout:
            return {
                'success': False,
                'error': 'Timeout al conectar con Wompi'
            }
        except requests.exceptions.ConnectionError:
            return {
                'success': False,
                'error': 'Error de conexión con Wompi'
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'Error de red: {str(e)}'
            }
        except Exception as e:
            print(f"❌ Error inesperado: {e}")
            return {
                'success': False,
                'error': f'Error interno: {str(e)}'
            }

    def consultar_transaccion(self, transaction_id):
        """
        Consulta el estado de una transacción por su ID
        """
        try:
            headers = {
                'Authorization': f'Bearer {self.public_key}',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }

            response = requests.get(
                f'{self.base_url}/transactions/{transaction_id}',
                headers=headers,
                timeout=30
            )

            if response.status_code == 200:
                return {
                    'success': True,
                    'data': response.json()['data']
                }

            return {
                'success': False,
                'error': 'Transacción no encontrada'
            }

        except Exception as e:
            print(f"❌ Error consultando transacción: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    def verificar_firma_webhook(self, event_data):
        """
        Verifica la firma del webhook de Wompi para seguridad
        """
        try:
            # Datos que Wompi usa para la firma
            event = event_data.get('event')
            timestamp = event_data.get('timestamp')

            if not event or not timestamp:
                print("⚠️ Webhook sin event o timestamp")
                return False

            # Concatenar según documentación de Wompi
            concatenated = f"{event}{timestamp}"

            # Generar firma
            signature = hashlib.sha256(
                f"{concatenated}{self.integrity_secret}".encode()
            ).hexdigest()

            # Comparar con la firma recibida
            received_signature = event_data.get('signature', {}).get('checksum', '')

            is_valid = signature == received_signature
            
            if not is_valid:
                print(f"⚠️ Firma inválida")
                print(f"Esperada: {signature}")
                print(f"Recibida: {received_signature}")

            return is_valid

        except Exception as e:
            print(f"❌ Error verificando firma: {e}")
            return False
