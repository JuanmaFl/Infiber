from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apps.usuarios.views import UsuarioViewSet
from apps.planes.views import PlanViewSet
from apps.contratos.views import ContratoViewSet
from apps.facturas.views import FacturaViewSet
from apps.pagos.views import PagoViewSet
from apps.tickets.views import TicketViewSet

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
]
