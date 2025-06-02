  import React, { useState } from 'react';
  import { refreshTokenIfNeeded } from '../utils/auth';
  import API_BASE from '../utils/config';

  function CrearIncidencia() {
    const [form, setForm] = useState({
      centro: '',
      fecha: '',
      urgencia: false,
      prioridad: 'Media',
      relativa: '',
      descripcion: '',
      telefono_contacto: '',

      imei: '', tipo_incidencia_telefono: '',
      numero_serie: '', sesion: '', tipo_incidencia_ordenador: '',
      tipo_incidencia_internet: '', fecha_inicio_incidencia: '',
      cuenta_gsuite: '', tipo_incidencia_gsuite: '',
      tipo_incidencia_impresora: '',
      trabajador_plataforma: '', tipo_incidencia_plataforma: '',
      trabajador_dispositivo: '', contacto_dispositivo: '', cuenta_dispositivo: '', tipo_solicitud_dispositivo: '',
      imei_personal: '', modelo_personal: '', motivo_intervencion: '', intervencion_solicitada: '',
      centro_anide: '', puesto_trabajo: '', eliminar_nombre: '', eliminar_fecha: '', eliminar_urgente: false,
      otorgar_nombre: '', otorgar_fecha: '', otorgar_urgente: false
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setMensaje('');
      setError('');

      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/incidencias/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });

        if (res.ok) {
          setMensaje('Incidencia creada correctamente.');
          resetForm();
        } else {
          const data = await res.json();
          setError(data.detail || 'Error al crear la incidencia');
        }
      } catch {
        setError('Error de conexión');
      }
    };

    const resetForm = () => {
      setForm({
        centro: '', fecha: '', urgencia: false, prioridad: 'Media', relativa: '',
        descripcion: '', telefono_contacto: '',
        imei: '', tipo_incidencia_telefono: '',
        numero_serie: '', sesion: '', tipo_incidencia_ordenador: '',
        tipo_incidencia_internet: '', fecha_inicio_incidencia: '',
        cuenta_gsuite: '', tipo_incidencia_gsuite: '',
        tipo_incidencia_impresora: '',
        trabajador_plataforma: '', tipo_incidencia_plataforma: '',
        trabajador_dispositivo: '', contacto_dispositivo: '', cuenta_dispositivo: '', tipo_solicitud_dispositivo: '',
        imei_personal: '', modelo_personal: '', motivo_intervencion: '', intervencion_solicitada: '',
        centro_anide: '', puesto_trabajo: '', eliminar_nombre: '', eliminar_fecha: '', eliminar_urgente: false,
        otorgar_nombre: '', otorgar_fecha: '', otorgar_urgente: false
      });
    };

  const renderCamposTipo = () => {
    switch (form.relativa) {
      case '1': return <>
        <label>IMEI:</label>
        <input name="imei" value={form.imei} onChange={handleChange} className="form-control mb-2" />
        <label>Tipo incidencia teléfono:</label>
        <input name="tipo_incidencia_telefono" value={form.tipo_incidencia_telefono} onChange={handleChange} className="form-control mb-2" />
      </>;

      case '2': return <>
        <label>Número de serie:</label>
        <input name="numero_serie" value={form.numero_serie} onChange={handleChange} className="form-control mb-2" />
        <label>Sesión:</label>
        <input name="sesion" value={form.sesion} onChange={handleChange} className="form-control mb-2" />
        <label>Tipo incidencia ordenador:</label>
        <input name="tipo_incidencia_ordenador" value={form.tipo_incidencia_ordenador} onChange={handleChange} className="form-control mb-2" />
      </>;

      case '3': return <>
        <label>Tipo incidencia Internet:</label>
        <input name="tipo_incidencia_internet" value={form.tipo_incidencia_internet} onChange={handleChange} className="form-control mb-2" />
        <label>Fecha inicio incidencia:</label>
        <input type="datetime-local" name="fecha_inicio_incidencia" value={form.fecha_inicio_incidencia} onChange={handleChange} className="form-control mb-2" />
      </>;

      case '4': return <>
        <label>Cuenta GSuite:</label>
        <input name="cuenta_gsuite" value={form.cuenta_gsuite} onChange={handleChange} className="form-control mb-2" />
        <label>Tipo incidencia GSuite:</label>
        <input name="tipo_incidencia_gsuite" value={form.tipo_incidencia_gsuite} onChange={handleChange} className="form-control mb-2" />
      </>;

      case '5': return <>
        <label>Tipo incidencia impresora:</label>
        <input name="tipo_incidencia_impresora" value={form.tipo_incidencia_impresora} onChange={handleChange} className="form-control mb-2" />
      </>;

      case '6': return <>
        <label>Trabajador plataforma:</label>
        <input name="trabajador_plataforma" value={form.trabajador_plataforma} onChange={handleChange} className="form-control mb-2" />
        <label>Tipo incidencia plataforma:</label>
        <input name="tipo_incidencia_plataforma" value={form.tipo_incidencia_plataforma} onChange={handleChange} className="form-control mb-2" />
      </>;

      case '7': return <>
        <label>Trabajador:</label>
        <input name="trabajador_dispositivo" value={form.trabajador_dispositivo} onChange={handleChange} className="form-control mb-2" />
        <label>Contacto:</label>
        <input name="contacto_dispositivo" value={form.contacto_dispositivo} onChange={handleChange} className="form-control mb-2" />
        <label>Cuenta:</label>
        <input name="cuenta_dispositivo" value={form.cuenta_dispositivo} onChange={handleChange} className="form-control mb-2" />
        <label>Tipo solicitud:</label>
        <input name="tipo_solicitud_dispositivo" value={form.tipo_solicitud_dispositivo} onChange={handleChange} className="form-control mb-2" />
        <label>IMEI personal:</label>
        <input name="imei_personal" value={form.imei_personal} onChange={handleChange} className="form-control mb-2" />
        <label>Modelo:</label>
        <input name="modelo_personal" value={form.modelo_personal} onChange={handleChange} className="form-control mb-2" />
        <label>Motivo intervención:</label>
        <input name="motivo_intervencion" value={form.motivo_intervencion} onChange={handleChange} className="form-control mb-2" />
        <label>Intervención solicitada:</label>
        <input name="intervencion_solicitada" value={form.intervencion_solicitada} onChange={handleChange} className="form-control mb-2" />
      </>;

      case '8': return <>
        <label>Centro Anide:</label>
        <input name="centro_anide" value={form.centro_anide} onChange={handleChange} className="form-control mb-2" />
        <label>Puesto trabajo:</label>
        <input name="puesto_trabajo" value={form.puesto_trabajo} onChange={handleChange} className="form-control mb-2" />
        <label>Eliminar nombre:</label>
        <input name="eliminar_nombre" value={form.eliminar_nombre} onChange={handleChange} className="form-control mb-2" />
        <label>Eliminar fecha:</label>
        <input type="datetime-local" name="eliminar_fecha" value={form.eliminar_fecha} onChange={handleChange} className="form-control mb-2" />
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" name="eliminar_urgente" checked={form.eliminar_urgente} onChange={handleChange} />
          <label className="form-check-label">Eliminar urgente</label>
        </div>
        <label>Otorgar nombre:</label>
        <input name="otorgar_nombre" value={form.otorgar_nombre} onChange={handleChange} className="form-control mb-2" />
        <label>Otorgar fecha:</label>
        <input type="datetime-local" name="otorgar_fecha" value={form.otorgar_fecha} onChange={handleChange} className="form-control mb-2" />
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" name="otorgar_urgente" checked={form.otorgar_urgente} onChange={handleChange} />
          <label className="form-check-label">Otorgar urgente</label>
        </div>
      </>;

      default: return null;
    }
  };


    return (
      <div className="container mt-4">
        <h2>Crear Incidencia</h2>
        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Centro:</label>
          <select 
    name="centro" 
    value={form.centro} 
    onChange={handleChange} 
    className="form-select mb-2" 
    required
  >
    <option value="">Seleccione un centro...</option>
    <option value="CENTRAL">CENTRAL</option>
    <option value="CPM I">CPM I</option>
    <option value="CPM II">CPM II</option>
    <option value="RGA III">RGA III</option>
    <option value="CPM IV">CPM IV</option>
    <option value="DISL V">DISL V</option>
    <option value="CPM VII">CPM VII</option>
    <option value="CPM X">CPM X</option>
    <option value="ISL XI">ISL XI</option>
    <option value="ISL XII">ISL XII</option>
    <option value="ISL XIII">ISL XIII</option>
    <option value="CAL XIV">CAL XIV</option>
    <option value="CPM XV">CPM XV</option>
  </select>

          <label>Fecha:</label>
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="form-control mb-2" />

          <div className="form-check mb-2">
            <input type="checkbox" name="urgencia" checked={form.urgencia} onChange={handleChange} className="form-check-input" />
            <label className="form-check-label">¿Urgente?</label>
          </div>

          <label>Prioridad:</label>
          <select name="prioridad" value={form.prioridad} onChange={handleChange} className="form-select mb-2">
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>

          <label>Relativa a:</label>
          <select name="relativa" value={form.relativa} onChange={handleChange} className="form-select mb-2">
            <option value="">Seleccione...</option>
            <option value="1">Teléfono corporativo</option>
            <option value="2">Ordenador</option>
            <option value="3">Internet</option>
            <option value="4">Cuenta GSuite</option>
            <option value="5">Impresora</option>
            <option value="6">Plataforma</option>
            <option value="7">Dispositivo personal</option>
            <option value="8">Control de accesos</option>
          </select>

          <label>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control mb-2" />

          <label>Teléfono de contacto:</label>
          <input name="telefono_contacto" value={form.telefono_contacto} onChange={handleChange} className="form-control mb-2" />

          {renderCamposTipo()}

          <button type="submit" className="btn btn-success">Enviar</button>
        </form>
      </div>
    );
  }

  export default CrearIncidencia;
