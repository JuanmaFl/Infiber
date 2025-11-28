from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apps.usuarios.views import UsuarioViewSet
from apps.planes.views import PlanViewSet
from apps.contratos.views import ContratoViewSet
from apps.facturas.views import FacturaViewSet
from apps.pagos.views import PagoViewSet
from apps.tickets.views import TicketViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.chatbot.views import chat
from apps.pagos.views import crear_pago_wompi, crear_pago_payu

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'planes', PlanViewSet)
router.register(r'contratos', ContratoViewSet)
router.register(r'facturas', FacturaViewSet)
router.register(r'pagos', PagoViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/chat/', chat, name='chat'),
    path('api/pagos/wompi/', crear_pago_wompi, name='pago_wompi'),
    path('api/pagos/payu/', crear_pago_payu, name='pago_payu'),
]
