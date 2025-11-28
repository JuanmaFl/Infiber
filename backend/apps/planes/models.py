from django.db import models

class Plan(models.Model):
    nombre = models.CharField(max_length=100)
    velocidad_bajada = models.IntegerField(help_text="Mbps")
    velocidad_subida = models.IntegerField(help_text="Mbps")
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'planes'
        verbose_name = 'Plan de Servicio'
        verbose_name_plural = 'Planes de Servicio'
    
    def __str__(self):
        return f"{self.nombre} - {self.velocidad_bajada}Mbps"
