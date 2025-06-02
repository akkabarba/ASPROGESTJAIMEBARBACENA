import React, { useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function GestionarIncidencia({ incidencia, onActualizada }) {
  const [estado, setEstado] = useState(incidencia.estado);
  const [observaciones, setObservaciones] = useState(incidencia.observaciones || '');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje('');

    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/incidencias/${incidencia.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado, observaciones })
      });

      if (res.ok) {
        setMensaje('Actualizado correctamente');
        onActualizada();
      } else {
        const data = await res.json();
        setMensaje(data.error || 'Error al actualizar');
      }
    } catch {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleString();
  };

  const renderCamposPorTipo = () => {
    switch (incidencia.relativa) {
      case '1': return (
        <>
          <p><b>IMEI:</b> {incidencia.imei}</p>
          <p><b>Tipo Incidencia Teléfono:</b> {incidencia.tipo_incidencia_telefono}</p>
        </>
      );
      case '2': return (
        <>
          <p><b>Número de Serie:</b> {incidencia.numero_serie}</p>
          <p><b>Sesión:</b> {incidencia.sesion}</p>
          <p><b>Tipo Incidencia Ordenador:</b> {incidencia.tipo_incidencia_ordenador}</p>
        </>
      );
      case '3': return (
        <>
          <p><b>Tipo Incidencia Internet:</b> {incidencia.tipo_incidencia_internet}</p>
          <p><b>Fecha Inicio Incidencia:</b> {formatearFecha(incidencia.fecha_inicio_incidencia)}</p>
        </>
      );
      case '4': return (
        <>
          <p><b>Cuenta GSuite:</b> {incidencia.cuenta_gsuite}</p>
          <p><b>Tipo Incidencia GSuite:</b> {incidencia.tipo_incidencia_gsuite}</p>
        </>
      );
      case '5': return (
        <p><b>Tipo Incidencia Impresora:</b> {incidencia.tipo_incidencia_impresora}</p>
      );
      case '6': return (
        <>
          <p><b>Trabajador plataforma:</b> {incidencia.trabajador_plataforma}</p>
          <p><b>Tipo incidencia plataforma:</b> {incidencia.tipo_incidencia_plataforma}</p>
        </>
      );
      case '7': return (
        <>
          <p><b>Trabajador dispositivo:</b> {incidencia.trabajador_dispositivo}</p>
          <p><b>Contacto:</b> {incidencia.contacto_dispositivo}</p>
          <p><b>Cuenta:</b> {incidencia.cuenta_dispositivo}</p>
          <p><b>Tipo solicitud:</b> {incidencia.tipo_solicitud_dispositivo}</p>
          <p><b>IMEI Personal:</b> {incidencia.imei_personal}</p>
          <p><b>Modelo:</b> {incidencia.modelo_personal}</p>
          <p><b>Motivo intervención:</b> {incidencia.motivo_intervencion}</p>
          <p><b>Intervención solicitada:</b> {incidencia.intervencion_solicitada}</p>
        </>
      );
      case '8': return (
        <>
          <p><b>Centro Anide:</b> {incidencia.centro_anide}</p>
          <p><b>Puesto trabajo:</b> {incidencia.puesto_trabajo}</p>
          <p><b>Eliminar Nombre:</b> {incidencia.eliminar_nombre}</p>
          <p><b>Eliminar Fecha:</b> {formatearFecha(incidencia.eliminar_fecha)}</p>
          <p><b>Eliminar Urgente:</b> {incidencia.eliminar_urgente ? 'Sí' : 'No'}</p>
          <p><b>Otorgar Nombre:</b> {incidencia.otorgar_nombre}</p>
          <p><b>Otorgar Fecha:</b> {formatearFecha(incidencia.otorgar_fecha)}</p>
          <p><b>Otorgar Urgente:</b> {incidencia.otorgar_urgente ? 'Sí' : 'No'}</p>
        </>
      );
      default: return null;
    }
  };

  return (
    <div className="card my-3 shadow">
      <div className="card-body">
        <h5 className="card-title">{incidencia.descripcion}</h5>

        <p><b>Centro:</b> {incidencia.centro}</p>
        <p><b>Fecha:</b> {incidencia.fecha}</p>
        <p><b>Urgencia:</b> {incidencia.urgencia ? 'Sí' : 'No'}</p>
        <p><b>Prioridad:</b> {incidencia.prioridad}</p>
        <p><b>Teléfono contacto:</b> {incidencia.telefono_contacto}</p>

        {renderCamposPorTipo()}

        <div className="mb-2">
          <label>Estado:</label>
          <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="nueva">Nueva</option>
            <option value="en_curso">En curso</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        <div className="mb-2">
          <label>Observaciones:</label>
          <textarea className="form-control" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
        </div>

        <button className="btn btn-primary" onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {mensaje && <div className="mt-2 alert alert-info">{mensaje}</div>}
      </div>
    </div>
  );
}

export default GestionarIncidencia;
