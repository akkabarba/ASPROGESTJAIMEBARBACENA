import React, { useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function GestionarIncidencia({ incidencia, onActualizada }) {
  const [estado, setEstado] = useState(incidencia.estado);
  const [observaciones, setObservaciones] = useState(incidencia.observaciones || '');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje('');
    setError('');

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
        setMensaje('✅ Cambios guardados correctamente');
        onActualizada();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card my-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-primary">{incidencia.descripcion}</h5>
        <p className="card-text">
          <strong>Centro:</strong> {incidencia.centro}<br />
          <strong>Fecha:</strong> {new Date(incidencia.fecha_creacion).toLocaleString()}<br />
          <strong>Teléfono:</strong> {incidencia.telefono_contacto}
        </p>

        <div className="mb-2">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            disabled={guardando}
          >
            <option value="nueva">Nueva</option>
            <option value="en_curso">En curso</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label">Observaciones</label>
          <textarea
            className="form-control"
            rows="3"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            disabled={guardando}
          />
        </div>

        <button className="btn btn-primary" onClick={handleGuardar} disabled={guardando}>
          {guardando ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : 'Guardar cambios'}
        </button>

        {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default GestionarIncidencia;
