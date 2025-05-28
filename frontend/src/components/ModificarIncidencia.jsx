import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function ModificarIncidencia({ incidenciaId, onActualizada }) {
  const [incidencia, setIncidencia] = useState(null);
  const [estado, setEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarIncidencia = async () => {
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/incidencias/${incidenciaId}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setIncidencia(data);
        setEstado(data.estado);
        setObservaciones(data.observaciones || '');
      } catch {
        setError('Error al cargar la incidencia');
      }
    };

    if (incidenciaId) {
      cargarIncidencia();
    }
  }, [incidenciaId]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const token = await refreshTokenIfNeeded();
      const response = await fetch(`${API_BASE}/incidencias/${incidenciaId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado, observaciones })
      });

      if (response.ok) {
        setMensaje('Incidencia actualizada correctamente.');
        if (onActualizada) onActualizada();
      } else {
        setError('Error al guardar los cambios');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  if (!incidencia) return <p className="text-muted">Cargando incidencia...</p>;

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Modificar Incidencia</h5>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleGuardar}>
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)} required>
              <option value="nueva">Nueva</option>
              <option value="en_curso">En curso</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Observaciones</label>
            <textarea
              className="form-control"
              rows="4"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}

export default ModificarIncidencia;
