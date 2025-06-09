import React, { useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

const CENTROS = [
  'CENTRAL', 'CPM I', 'CPM II', 'RGA III', 'CPM IV', 'DISL V',
  'CPM VII', 'CPM X', 'ISL XI', 'ISL XII', 'ISL XIII', 'CAL XIV', 'CPM XV'
];

function Ordenadores() {
  const [form, setForm] = useState({
    centro: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    procesador: '',
    ram: '',
    almacenamiento: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setGuardando(true);

    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/ordenadores/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMensaje('Ordenador registrado correctamente.');
        setForm({ centro: '', marca: '', modelo: '', numero_serie: '', procesador: '', ram: '', almacenamiento: '' });
      } else {
        setError('Error al registrar ordenador');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Registro de ordenadores</h3>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Centro</label>
        <select name="centro" className="form-select mb-2" value={form.centro} onChange={handleChange} required>
          <option value="">Selecciona centro...</option>
          {CENTROS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label>Marca</label>
        <input name="marca" className="form-control mb-2" value={form.marca} onChange={handleChange} required />

        <label>Modelo</label>
        <input name="modelo" className="form-control mb-2" value={form.modelo} onChange={handleChange} required />

        <label>Número de serie</label>
        <input name="numero_serie" className="form-control mb-2" value={form.numero_serie} onChange={handleChange} required />

        <label>Procesador</label>
        <input name="procesador" className="form-control mb-2" value={form.procesador} onChange={handleChange} required />

        <label>Ram</label>
        <input name="ram" className="form-control mb-2" value={form.ram} onChange={handleChange} required />

        <label>Almacenamiento</label>
        <input name="almacenamiento" className="form-control mb-2" value={form.almacenamiento} onChange={handleChange} required />

        <button className="btn btn-success mt-2" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear'}
        </button>
        <div className="mb-5"></div>
      </form>
    </div>
  );
}

export default Ordenadores;
