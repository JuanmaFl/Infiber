from django.urls import path
from . import views

urlpatterns = [
    path('wompi/', views.crear_transaccion_wompi, name='crear_transaccion_wompi'),
    path('payu/', views.crear_transaccion_payu, name='crear_transaccion_payu'),
    path('confirmar/', views.confirmar_pago, name='confirmar_pago'),
]