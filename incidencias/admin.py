from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Incidencia, Ordenador, Telefono, EquipoRed, Impresora


admin.site.register(Incidencia)
admin.site.register(Ordenador)
admin.site.register(Telefono)
admin.site.register(EquipoRed)                
admin.site.register(Impresora)