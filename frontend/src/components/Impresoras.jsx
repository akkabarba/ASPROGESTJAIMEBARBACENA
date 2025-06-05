import React, { useState } from 'react';
import API_BASE from '../utils/config';
import { refreshTokenIfNeeded } from '../utils/auth';

function Impresoras() {
  const [form, setForm] = useState({
    tipo: "impresora", centro: "", registro: "", empresa: "", tipo_equipo: "", marca: "", modelo: "",
    numero_serie: "", ip: "", descripcion_estado: "", comentarios: ""
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/equipos/impresoras/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) setMensaje("Impresora creada correctamente.");
      else setError("Error al guardar.");
    } catch { setError("Error de conexión."); }
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Impresora</h2>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((campo, idx) => (
          campo !== "tipo" &&
          <div key={idx} className="mb-2">
            <label>{campo.replace(/_/g, " ").toUpperCase()}:</label>
            <input name={campo} value={form[campo]} onChange={handleChange} className="form-control" />
          </div>
        ))}
        <button className="btn btn-success" type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default Impresoras;
