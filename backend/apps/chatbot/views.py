from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from openai import OpenAI

@api_view(['POST'])
def chat(request):
    mensaje = request.data.get('mensaje', '')
    
    if not mensaje:
        return Response({'error': 'Mensaje requerido'}, status=400)
    
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'Eres un asistente de Infiber ISP, ayudas a clientes con consultas sobre planes de internet.'},
                {'role': 'user', 'content': mensaje}
            ]
        )
        return Response({'respuesta': response.choices[0].message.content})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
