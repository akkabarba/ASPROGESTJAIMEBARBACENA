from django.db import models
from django.contrib.auth.models import User

class Incidencia(models.Model):
    CENTROS = [
        ('CENTRAL', 'CENTRAL'), ('CPM I', 'CPM I'), ('CPM II', 'CPM II'), ('RGA III', 'RGA III'),
        ('CPM IV', 'CPM IV'), ('OISL V', 'OISL V'), ('CPM VII', 'CPM VII'), ('CPM X', 'CPM X'),
        ('ISL XI', 'ISL XI'), ('ISL XII', 'ISL XII'), ('ISL XIII', 'ISL XIII'),
        ('CAI XIV', 'CAI XIV'), ('CPM XV', 'CPM XV'),
    ]
    RELATIVA_A = [
        ('1', 'Línea y/o dispositivo telefónico corporativo'),
        ('2', 'Ordenador'),
        ('3', 'Internet'),
        ('4', 'Cuenta Corporativa GSuite'),
        ('5', 'Impresora'),
        ('6', 'Plataforma gestion.grupoanide.es'),
        ('7', 'Dispositivos personales autorizados'),
        ('8', 'Control de accesos'),
        ('9', 'Otro'),
    ]
    PRIORIDADES = [('Baja', 'Baja'), ('Media', 'Media'), ('Alta', 'Alta')]
    
    ESTADOS = [
    ('nueva', 'Nueva'),
    ('en_curso', 'En curso'),
    ('cerrada', 'Cerrada'),
    ]


    # Comunes
    centro = models.CharField(max_length=50, choices=CENTROS, default='CENTRAL')
    fecha = models.DateField(default='2025-01-01')
    urgencia = models.BooleanField(default=False)
    prioridad = models.CharField(max_length=10, choices=PRIORIDADES, default='Media')
    relativa = models.CharField(max_length=1, choices=RELATIVA_A, default='1')
    descripcion = models.TextField(default='')
    telefono_contacto = models.CharField(max_length=100, default='')

    # Tipo 1 – Teléfono corporativo
    imei = models.CharField(max_length=100, blank=True, default='')
    tipo_incidencia_telefono = models.CharField(max_length=200, blank=True, default='')

    # Tipo 2 – Ordenador
    numero_serie = models.CharField(max_length=100, blank=True, default='')
    sesion = models.CharField(max_length=100, blank=True, default='')
    tipo_incidencia_ordenador = models.CharField(max_length=200, blank=True, default='')

    # Tipo 3 – Internet
    tipo_incidencia_internet = models.CharField(max_length=200, blank=True, default='')
    fecha_inicio_incidencia = models.DateTimeField(blank=True, null=True)

    # Tipo 4 – GSuite
    cuenta_gsuite = models.CharField(max_length=200, blank=True, default='')
    tipo_incidencia_gsuite = models.CharField(max_length=200, blank=True, default='')

    # Tipo 5 – Impresora
    tipo_incidencia_impresora = models.CharField(max_length=200, blank=True, default='')

    # Tipo 6 – Plataforma gestion
    trabajador_plataforma = models.CharField(max_length=200, blank=True, default='')
    tipo_incidencia_plataforma = models.CharField(max_length=200, blank=True, default='')

    # Tipo 7 – Dispositivos personales
    trabajador_dispositivo = models.CharField(max_length=200, blank=True, default='')
    contacto_dispositivo = models.CharField(max_length=200, blank=True, default='')
    cuenta_dispositivo = models.CharField(max_length=200, blank=True, default='')
    tipo_solicitud_dispositivo = models.CharField(max_length=200, blank=True, default='')
    imei_personal = models.CharField(max_length=100, blank=True, default='')
    modelo_personal = models.CharField(max_length=100, blank=True, default='')
    motivo_intervencion = models.CharField(max_length=200, blank=True, default='')
    intervencion_solicitada = models.CharField(max_length=200, blank=True, default='')

    # Tipo 8 – Control de accesos
    centro_anide = models.CharField(max_length=100, blank=True, default='')
    puesto_trabajo = models.CharField(max_length=100, blank=True, default='')
    eliminar_nombre = models.CharField(max_length=100, blank=True, default='')
    eliminar_fecha = models.DateTimeField(blank=True, null=True)
    eliminar_urgente = models.BooleanField(blank=True, null=True, default=False)
    otorgar_nombre = models.CharField(max_length=100, blank=True, default='')
    otorgar_fecha = models.DateTimeField(blank=True, null=True)
    otorgar_urgente = models.BooleanField(blank=True, null=True, default=False)

    # Sistema
    creada_por = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    vista_por_admin = models.BooleanField(default=False)

    estado = models.CharField(max_length=20, choices=ESTADOS, default='nueva')
    observaciones = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.get_relativa_display()} ({self.creada_por.username})"

# models.py

class Ordenador(models.Model):
    centro = models.CharField(max_length=100)
    empresa = models.CharField(max_length=100, blank=True)
    tipo_equipo = models.CharField(max_length=100, blank=True)
    marca = models.CharField(max_length=100, blank=True)
    modelo = models.CharField(max_length=100, blank=True)
    numero_serie = models.CharField(max_length=100, blank=True)
    fecha_compra = models.DateField(null=True, blank=True)
    garantia = models.DateField(null=True, blank=True)
    sistema_operativo = models.CharField(max_length=100, blank=True)
    nombre_equipo = models.CharField(max_length=100, blank=True)
    cuenta_usuario = models.TextField(blank=True)
    clave = models.TextField(blank=True)
    descripcion_estado = models.TextField(blank=True)
    observaciones = models.TextField(blank=True)

class Telefono(models.Model):
    centro = models.CharField(max_length=100)
    linea = models.CharField(max_length=100, blank=True)
    puesto = models.CharField(max_length=100, blank=True)
    marca = models.CharField(max_length=100, blank=True)
    modelo = models.CharField(max_length=100, blank=True)
    numero_serie = models.CharField(max_length=100, blank=True)
    imei = models.CharField(max_length=100, blank=True)
    desbloqueo = models.CharField(max_length=100, blank=True)
    datos_sim = models.CharField(max_length=100, blank=True)
    pin = models.CharField(max_length=100, blank=True)
    puk1 = models.CharField(max_length=100, blank=True)
    puk2 = models.CharField(max_length=100, blank=True)
    ext_vpn = models.CharField(max_length=100, blank=True)
    fijo = models.CharField(max_length=100, blank=True)
    tarifa = models.CharField(max_length=100, blank=True)
    restriccion = models.CharField(max_length=100, blank=True)

class Impresora(models.Model):
    centro = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255, blank=True)
    telefono_direccion = models.CharField(max_length=100, blank=True)
    modelo = models.CharField(max_length=100, blank=True)
    numero_serie = models.CharField(max_length=100, blank=True)
    ipv4 = models.CharField(max_length=100, blank=True)
    comentarios = models.TextField(blank=True)

class EquipoRed(models.Model):
    centro = models.CharField(max_length=100)
    proveedor = models.CharField(max_length=100, blank=True)
    nombre_equipo = models.CharField(max_length=100, blank=True)
    detalles_conexion = models.TextField(blank=True)
    ip_publica_fija = models.CharField(max_length=100, blank=True)
    linea_movil = models.CharField(max_length=100, blank=True)
    linea_sim = models.CharField(max_length=100, blank=True)
    linea_pin = models.CharField(max_length=100, blank=True)
    linea_puk = models.CharField(max_length=100, blank=True)
    tarifa_sin_iva = models.CharField(max_length=100, blank=True)
    terminal_imei = models.CharField(max_length=100, blank=True)
    terminal_num_serie = models.CharField(max_length=100, blank=True)
    wifi_clave = models.CharField(max_length=100, blank=True)
    comentarios = models.TextField(blank=True)

