from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apps.usuarios.views import (
    UsuarioViewSet,
    solicitar_codigo_recuperacion,
    verificar_codigo_y_resetear,
    cambiar_password_autenticado
)
from apps.planes.views import PlanViewSet
from apps.contratos.views import ContratoViewSet
from apps.facturas.views import FacturaViewSet
from apps.pagos.views import PagoViewSet
from apps.tickets.views import TicketViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.chatbot.views import chat
from apps.pagos.views import crear_transaccion_wompi, crear_transaccion_payu, confirmar_pago


router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'planes', PlanViewSet)
router.register(r'contratos', ContratoViewSet, basename='contrato')  # ✅ Agregar basename
router.register(r'facturas', FacturaViewSet)
router.register(r'pagos', PagoViewSet, basename='pago')  # ✅ Agregar basename también aquí
router.register(r'tickets', TicketViewSet)

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
]