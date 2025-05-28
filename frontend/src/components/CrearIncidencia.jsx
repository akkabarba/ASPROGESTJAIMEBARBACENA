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
    telefono_contacto: ''
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

    const token = await refreshTokenIfNeeded();

    try {
      const res = await fetch(`${API_BASE}/incidencias/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMensaje('Incidencia creada correctamente.');
        setForm({
          centro: '',
          fecha: '',
          urgencia: false,
          prioridad: 'Media',
          relativa: '',
          descripcion: '',
          telefono_contacto: ''
        });
      } else {
        const data = await res.json();
        setError(data.detail || 'Error al crear la incidencia');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Crear Incidencia</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* centro */}
        <div className="mb-3">
          <label className="form-label">Centro *</label>
          <select className="form-select" name="centro" value={form.centro} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            <option>CENTRAL</option>
            <option>CPM I</option>
            <option>CPM II</option>
            <option>RGA III</option>
            <option>CPM IV</option>
            <option>OISL V</option>
            <option>CPM VII</option>
            <option>CPM X</option>
            <option>ISL XI</option>
            <option>ISL XII</option>
            <option>ISL XIII</option>
            <option>CAI XIV</option>
            <option>CPM XV</option>
          </select>
        </div>

        {/* fecha */}
        <div className="mb-3">
          <label className="form-label">Fecha *</label>
          <input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} required />
        </div>

        {/* urgencia */}
        <div className="mb-3">
          <label className="form-label">¿Urgente?</label>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" name="urgencia" checked={form.urgencia} onChange={handleChange} />
            <label className="form-check-label">Sí</label>
          </div>
        </div>

        {/* prioridad */}
        <div className="mb-3">
          <label className="form-label">Prioridad *</label>
          <select className="form-select" name="prioridad" value={form.prioridad} onChange={handleChange} required>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        {/* relativa */}
        <div className="mb-3">
          <label className="form-label">Relativa a *</label>
          <select className="form-select" name="relativa" value={form.relativa} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            <option value="1">Línea y/o dispositivo telefónico corporativo</option>
            <option value="2">Ordenador</option>
            <option value="3">Internet</option>
            <option value="4">Cuenta Corporativa GSuite</option>
            <option value="5">Impresora</option>
            <option value="6">Plataforma gestion.grupoanide.es</option>
            <option value="7">Dispositivos personales autorizados</option>
            <option value="8">Control de accesos</option>
            <option value="9">Otro</option>
          </select>
        </div>

        {/* descripción */}
        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} rows="4" required />
        </div>

        {/* teléfono */}
        <div className="mb-3">
          <label className="form-label">Teléfono de contacto *</label>
          <input type="text" className="form-control" name="telefono_contacto" value={form.telefono_contacto} onChange={handleChange} required />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-success px-5">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default CrearIncidencia;
