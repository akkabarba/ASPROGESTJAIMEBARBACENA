from django import forms
from .models import Incidencia

class IncidenciaForm(forms.ModelForm):
    class Meta:
        model = Incidencia
        fields = [
            'centro', 'fecha', 'urgencia', 'prioridad', 'relativa',
            'descripcion', 'telefono_contacto'
        ]

        exclude = ['creada_por', 'fecha_creacion', 'vista_por_admin']
        widgets = {
            'fecha': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'urgencia': forms.RadioSelect(choices=[(True, 'Sí'), (False, 'No')]),
            'prioridad': forms.Select(attrs={'class': 'form-select'}),
            'relativa': forms.Select(attrs={'class': 'form-select'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'telefono_contacto': forms.TextInput(attrs={'class': 'form-control'}),

            # Campos específicos
            'imei': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_incidencia_telefono': forms.TextInput(attrs={'class': 'form-control'}),

            'numero_serie': forms.TextInput(attrs={'class': 'form-control'}),
            'sesion': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_incidencia_ordenador': forms.TextInput(attrs={'class': 'form-control'}),

            'tipo_incidencia_internet': forms.TextInput(attrs={'class': 'form-control'}),
            'fecha_inicio_incidencia': forms.DateTimeInput(attrs={'class': 'form-control', 'type': 'datetime-local'}),

            'cuenta_gsuite': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_incidencia_gsuite': forms.TextInput(attrs={'class': 'form-control'}),

            'tipo_incidencia_impresora': forms.TextInput(attrs={'class': 'form-control'}),

            'trabajador_plataforma': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_incidencia_plataforma': forms.TextInput(attrs={'class': 'form-control'}),

            'trabajador_dispositivo': forms.TextInput(attrs={'class': 'form-control'}),
            'contacto_dispositivo': forms.TextInput(attrs={'class': 'form-control'}),
            'cuenta_dispositivo': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_solicitud_dispositivo': forms.TextInput(attrs={'class': 'form-control'}),

            'imei_personal': forms.TextInput(attrs={'class': 'form-control'}),
            'modelo_personal': forms.TextInput(attrs={'class': 'form-control'}),
            'archivo_autorizacion': forms.ClearableFileInput(attrs={'class': 'form-control'}),

            'motivo_intervencion': forms.TextInput(attrs={'class': 'form-control'}),
            'intervencion_solicitada': forms.TextInput(attrs={'class': 'form-control'}),

            'centro_anide': forms.TextInput(attrs={'class': 'form-control'}),
            'puesto_trabajo': forms.TextInput(attrs={'class': 'form-control'}),
            'eliminar_nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'eliminar_fecha': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'eliminar_urgente': forms.RadioSelect(choices=[(True, 'Sí'), (False, 'No')]),
            'otorgar_nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'otorgar_fecha': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'otorgar_urgente': forms.RadioSelect(choices=[(True, 'Sí'), (False, 'No')]),
        }

class GestionIncidenciaForm(forms.ModelForm):
    class Meta:
        model = Incidencia
        fields = ['estado', 'observaciones']
        widgets = {
            'estado': forms.Select(attrs={'class': 'form-select'}),
            'observaciones': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
        }