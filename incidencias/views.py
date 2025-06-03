from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import User
from .models import Incidencia
from .serializers import IncidenciaSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.pagination import PageNumberPagination




class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ==========================
# USUARIOS (ADMIN)
# ==========================

@api_view(['POST'])
@permission_classes([IsAdminUser])
def crear_usuario_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response({'error': 'Todos los campos son obligatorios'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'El usuario ya existe'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Ese correo ya está en uso'}, status=400)

    User.objects.create_user(username=username, password=password, email=email)
    return Response({'success': 'Usuario creado correctamente'}, status=201)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def listar_usuarios_api(request):
    page = int(request.GET.get('page', 1))
    size = 5

    usuarios = User.objects.all().order_by('-date_joined')
    total = usuarios.count()

    start = (page - 1) * size
    end = start + size
    usuarios_pagina = usuarios[start:end]

    data = [
        {
            'id': u.id, 'username': u.username, 'email': u.email,
            'is_superuser': u.is_superuser, 'is_active': u.is_active, 
            'date_joined': u.date_joined
        } 
        for u in usuarios_pagina
    ]

    return Response({
        'count': total,
        'results': data
    })

@api_view(['POST'])
@permission_classes([IsAdminUser])
def cambiar_password_api(request):
    user_id = request.data.get('user_id')
    new_password = request.data.get('new_password')
    
    if not user_id or not new_password:
        return Response({'error': 'Datos incompletos'}, status=400)

    try:
        usuario = User.objects.get(id=user_id)
        usuario.set_password(new_password)
        usuario.save()
        return Response({'success': 'Contraseña actualizada'})
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)



# ==========================
# API WHOAMI (identidad)
# ==========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoami(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'is_superuser': request.user.is_superuser
    })

# ==========================
# API REST INCIDENCIAS
# ==========================

class IncidenciaPagination(PageNumberPagination):
    page_size = 5

class IncidenciaViewSet(ModelViewSet):
    serializer_class = IncidenciaSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = IncidenciaPagination

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Incidencia.objects.all().order_by('-fecha_creacion')
        return Incidencia.objects.filter(creada_por=self.request.user).order_by('-fecha_creacion')

    def perform_create(self, serializer):
        serializer.save(creada_por=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

@api_view(['GET'])
@permission_classes([IsAdminUser])
def contar_incidencias_nuevas(request):
    nuevas = Incidencia.objects.filter(estado='nueva').count()
    return Response({'nuevas': nuevas})

token_obtain_pair = CustomTokenObtainPairView.as_view()
token_refresh = TokenRefreshView.as_view()
