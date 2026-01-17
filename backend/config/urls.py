from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Imports de usuarios
from apps.usuarios.views import (
    UsuarioViewSet,
    solicitar_codigo_recuperacion,
    verificar_codigo_y_resetear,
    cambiar_password_autenticado,
    estadisticas_dashboard
)

# Imports de otros módulos
from apps.planes.views import PlanViewSet
from apps.contratos.views import (
    ContratoViewSet, 
    verificar_facturas_pendientes, 
    cambiar_plan_contrato, 
    cancelar_contrato
)
from apps.facturas.views import FacturaViewSet, descargar_factura_pdf
from apps.pagos.views import (
    PagoViewSet,
    crear_link_pago_wompi,
    consultar_estado_pago,
    webhook_wompi,
    confirmar_pago_manual
)
from apps.tickets.views import (
    TicketViewSet,
    agregar_comentario,
    listar_comentarios,
    asignar_tecnico,
    cambiar_estado_ticket,
    cambiar_prioridad_ticket
)
from apps.chatbot.views import chat

# Router
router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'planes', PlanViewSet)
router.register(r'contratos', ContratoViewSet, basename='contrato')
router.register(r'facturas', FacturaViewSet)
router.register(r'pagos', PagoViewSet, basename='pago')
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Router
    path('api/', include(router.urls)),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password Recovery
    path('api/password/solicitar-codigo/', solicitar_codigo_recuperacion, name='solicitar_codigo'),
    path('api/password/verificar-resetear/', verificar_codigo_y_resetear, name='verificar_resetear'),
    path('api/password/cambiar/', cambiar_password_autenticado, name='cambiar_password'),
    
    # Chatbot
    path('api/chat/', chat, name='chat'),
    
    # Pagos - Wompi Integration
    path('api/pagos/wompi/crear-link/', crear_link_pago_wompi, name='crear_link_pago_wompi'),
    path('api/pagos/wompi/consultar/<str:transaction_id>/', consultar_estado_pago, name='consultar_estado_pago'),
    path('api/pagos/wompi/webhook/', webhook_wompi, name='webhook_wompi'),
    path('api/pagos/confirmar-manual/', confirmar_pago_manual, name='confirmar_pago_manual'),
    
    # Contratos
    path('api/contratos/<int:contrato_id>/verificar-pendientes/', verificar_facturas_pendientes),
    path('api/contratos/<int:contrato_id>/cambiar-plan/', cambiar_plan_contrato),
    path('api/contratos/<int:contrato_id>/cancelar/', cancelar_contrato),
    
    # Facturas
    path('api/facturas/<int:factura_id>/descargar/', descargar_factura_pdf),
    
    # Tickets
    path('api/tickets/<int:ticket_id>/comentarios/', listar_comentarios),
    path('api/tickets/<int:ticket_id>/comentarios/crear/', agregar_comentario),
    path('api/tickets/<int:ticket_id>/asignar-tecnico/', asignar_tecnico),
    path('api/tickets/<int:ticket_id>/cambiar-estado/', cambiar_estado_ticket),
    path('api/tickets/<int:ticket_id>/cambiar-prioridad/', cambiar_prioridad_ticket),
    
    # Estadísticas
    path('api/estadisticas/', estadisticas_dashboard, name='estadisticas-dashboard'),
]
