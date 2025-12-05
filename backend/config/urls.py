from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apps.usuarios.views import (
    UsuarioViewSet,
    solicitar_codigo_recuperacion,
    verificar_codigo_y_resetear,
    cambiar_password_autenticado,
    estadisticas_dashboard
)
from apps.planes.views import PlanViewSet
from apps.contratos.views import ContratoViewSet, verificar_facturas_pendientes, cambiar_plan_contrato, cancelar_contrato
from apps.facturas.views import FacturaViewSet, descargar_factura_pdf
from apps.pagos.views import PagoViewSet
from apps.tickets.views import (
    TicketViewSet, 
    agregar_comentario, 
    listar_comentarios,
    asignar_tecnico,
    cambiar_estado_ticket,
    cambiar_prioridad_ticket
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.chatbot.views import chat
from apps.pagos.views import crear_transaccion_wompi, crear_transaccion_payu, confirmar_pago


router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'planes', PlanViewSet)
router.register(r'contratos', ContratoViewSet, basename='contrato')  # ✅ Agregar basename
router.register(r'facturas', FacturaViewSet)
router.register(r'pagos', PagoViewSet, basename='pago')  # ✅ Agregar basename también aquí
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/password/solicitar-codigo/', solicitar_codigo_recuperacion, name='solicitar_codigo'),
    path('api/password/verificar-resetear/', verificar_codigo_y_resetear, name='verificar_resetear'),
    path('api/password/cambiar/', cambiar_password_autenticado, name='cambiar_password'),
    path('api/chat/', chat, name='chat'),
    path('api/pagos/wompi/', crear_transaccion_wompi, name='pago_wompi'),
    path('api/pagos/payu/', crear_transaccion_payu, name='pago_payu'),
    path('api/pagos/confirmar/', confirmar_pago, name='confirmar_pago'),
    path('api/contratos/<int:contrato_id>/verificar-pendientes/', verificar_facturas_pendientes),
    path('api/contratos/<int:contrato_id>/cambiar-plan/', cambiar_plan_contrato),
    path('api/contratos/<int:contrato_id>/cancelar/', cancelar_contrato),
    path('api/facturas/<int:factura_id>/descargar/', descargar_factura_pdf),
    path('api/tickets/<int:ticket_id>/comentarios/', listar_comentarios),
    path('api/tickets/<int:ticket_id>/comentarios/crear/', agregar_comentario),
    path('api/tickets/<int:ticket_id>/asignar-tecnico/', asignar_tecnico),
    path('api/tickets/<int:ticket_id>/cambiar-estado/', cambiar_estado_ticket),
    path('api/tickets/<int:ticket_id>/cambiar-prioridad/', cambiar_prioridad_ticket),
    path('api/estadisticas/', estadisticas_dashboard, name='estadisticas-dashboard'),
]
