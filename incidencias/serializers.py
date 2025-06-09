from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Incidencia, Ordenador, Impresora, EquipoRed, Telefono

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get('username')
        password = attrs.get('password')

        user = None

        try:
            user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                raise self.fail('no_active_account')

        if not user.check_password(password):
            raise self.fail('no_active_account')

        data = super().get_token(user)
        return {
            'refresh': str(data),
            'access': str(data.access_token),
        }

class IncidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidencia
        fields = '__all__'
        read_only_fields = ['creada_por', 'fecha_creacion']

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if not user.is_superuser:
            validated_data.pop('estado', None)
            validated_data.pop('observaciones', None)
        return super().update(instance, validated_data)

class OrdenadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ordenador
        fields = '__all__'

class TelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefono
        fields = '__all__'

class ImpresoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Impresora
        fields = '__all__'

class EquipoRedSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipoRed
        fields = '__all__'