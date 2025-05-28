from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Empleado, Dispositivo, Incidencia

admin.site.register(Empleado)
admin.site.register(Dispositivo)
admin.site.register(Incidencia)
