from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, CodigoVerificacion
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ['username', 'email', 'rol', 'is_active']
    list_filter = ['rol', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('rol', 'telefono', 'direccion', 'cedula')}),
    )

@admin.register(CodigoVerificacion)
class CodigoVerificacionAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'codigo', 'creado_en', 'expira_en', 'usado']
    list_filter = ['usado', 'creado_en']
    search_fields = ['usuario__username', 'usuario__email', 'codigo']
    readonly_fields = ['creado_en', 'expira_en']