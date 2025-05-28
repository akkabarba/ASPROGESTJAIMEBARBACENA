from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import IncidenciaViewSet


router = DefaultRouter()
router.register(r'incidencias', IncidenciaViewSet, basename='incidencias')

urlpatterns = [
    path('api/token/', views.token_obtain_pair, name='token_obtain_pair'),
    path('api/token/refresh/', views.token_refresh, name='token_refresh'),
    path('api/whoami/', views.whoami, name='whoami'),
    path('api/crear_usuario/', views.crear_usuario_api, name='crear_usuario_api'),
    path('api/usuarios/', views.listar_usuarios_api, name='listar_usuarios_api'),
    path('api/incidencias_nuevas/', views.contar_incidencias_nuevas, name='contar_incidencias_nuevas'),
    path('api/', include(router.urls)),
]

