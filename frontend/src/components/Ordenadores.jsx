import React, { useState } from 'react';
import API_BASE from '../utils/config';
import { refreshTokenIfNeeded } from '../utils/auth';

function Ordenadores() {
  const [form, setForm] = useState({
    tipo: "ordenador", centro: "", registro: "", empresa: "", tipo_equipo: "", marca: "", modelo: "", sn: "", compra: "",
    garantia: "", sistema: "", nombre_equipo: "", cuenta_usuario: "", clave: "", descripcion_estado: "", comentarios: ""
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
      const res = await fetch(`${API_BASE}/equipos/ordenadores/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) setMensaje("Ordenador creado correctamente.");
      else setError("Error al guardar.");
    } catch { setError("Error de conexión."); }
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Ordenador</h2>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Centro:</label><input name="centro" value={form.centro} onChange={handleChange} className="form-control mb-2"/>
        <label>Registro:</label><input name="registro" value={form.registro} onChange={handleChange} className="form-control mb-2"/>
        <label>Empresa:</label><input name="empresa" value={form.empresa} onChange={handleChange} className="form-control mb-2"/>
        <label>Tipo Equipo:</label><input name="tipo_equipo" value={form.tipo_equipo} onChange={handleChange} className="form-control mb-2"/>
        <label>Marca:</label><input name="marca" value={form.marca} onChange={handleChange} className="form-control mb-2"/>
        <label>Modelo:</label><input name="modelo" value={form.modelo} onChange={handleChange} className="form-control mb-2"/>
        <label>SN:</label><input name="sn" value={form.sn} onChange={handleChange} className="form-control mb-2"/>
        <label>Compra:</label><input name="compra" value={form.compra} onChange={handleChange} className="form-control mb-2"/>
        <label>Garantía:</label><input name="garantia" value={form.garantia} onChange={handleChange} className="form-control mb-2"/>
        <label>Sistema:</label><input name="sistema" value={form.sistema} onChange={handleChange} className="form-control mb-2"/>
        <label>Nombre Equipo:</label><input name="nombre_equipo" value={form.nombre_equipo} onChange={handleChange} className="form-control mb-2"/>
        <label>Cuenta Usuario:</label><input name="cuenta_usuario" value={form.cuenta_usuario} onChange={handleChange} className="form-control mb-2"/>
        <label>Clave:</label><input name="clave" value={form.clave} onChange={handleChange} className="form-control mb-2"/>
        <label>Descripción Estado:</label><input name="descripcion_estado" value={form.descripcion_estado} onChange={handleChange} className="form-control mb-2"/>
        <label>Comentarios:</label><textarea name="comentarios" value={form.comentarios} onChange={handleChange} className="form-control mb-2"/>
        <button className="btn btn-success" type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default Ordenadores;
