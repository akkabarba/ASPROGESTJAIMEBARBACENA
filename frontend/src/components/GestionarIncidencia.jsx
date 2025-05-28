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
    } catch (err) {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card my-2">
      <div className="card-body">
        <h5 className="card-title">{incidencia.descripcion}</h5>
        <p className="card-text">
          <strong>Centro:</strong> {incidencia.centro} <br />
          <strong>Fecha:</strong> {new Date(incidencia.fecha_creacion).toLocaleString()} <br />
          <strong>Teléfono:</strong> {incidencia.telefono_contacto}
        </p>

        <div className="mb-2">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
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
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleGuardar}
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {mensaje && (
          <div className="mt-2 alert alert-info">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionarIncidencia;
