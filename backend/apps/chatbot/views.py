from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from openai import OpenAI

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # ✅ AGREGAR ESTA LÍNEA
def chat(request):
    mensaje = request.data.get('mensaje', '')
    
    if not mensaje:
        return Response({'error': 'Mensaje requerido'}, status=400)
    
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'Eres un asistente de Infiber ISP, ayudas a clientes con consultas sobre planes de internet, procesos de instalacion y cobertura, ademas alivias tarbajo de los operarios resolviendo dudas tecnicas sobre como reiniciar el router en caso de falla y otros problemas.'},
                {'role': 'user', 'content': mensaje}
            ]
        )
        return Response({'respuesta': response.choices[0].message.content})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
