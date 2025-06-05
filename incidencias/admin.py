from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Incidencia, Equipo


admin.site.register(Incidencia)
admin.site.register(Equipo)
