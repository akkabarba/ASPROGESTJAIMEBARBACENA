from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import IncidenciaViewSet, OrdenadorViewSet, TelefonoViewSet, ImpresoraViewSet, RedViewSet


router = DefaultRouter()
router.register(r'incidencias', IncidenciaViewSet, basename='incidencias')
router.register(r'equipos/ordenadores', OrdenadorViewSet, basename='ordenadores')
router.register(r'equipos/telefonos', TelefonoViewSet, basename='telefonos')
router.register(r'equipos/impresoras', ImpresoraViewSet, basename='impresoras')
router.register(r'equipos/red', RedViewSet, basename='red')

urlpatterns = [
    path('token/', views.token_obtain_pair, name='token_obtain_pair'),
    path('token/refresh/', views.token_refresh, name='token_refresh'),
    path('whoami/', views.whoami, name='whoami'),
    path('crear_usuario/', views.crear_usuario_api, name='crear_usuario_api'),
    path('usuarios/', views.listar_usuarios_api, name='listar_usuarios_api'),
    path('usuarios/<int:user_id>/', views.eliminar_usuario_api),
    path('incidencias_nuevas/', views.contar_incidencias_nuevas, name='contar_incidencias_nuevas'),
    path('cambiar_password/', views.cambiar_password_api, name='cambiar_password_api'),
    path('', include(router.urls)),  
]
