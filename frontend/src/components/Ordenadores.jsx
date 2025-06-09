import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Ordenadores() {
  const [ordenadores, setOrdenadores] = useState([]);
  const [form, setForm] = useState({
    centro: '', empresa: '', tipo_equipo: '', marca: '', modelo: '', numero_serie: '',
    fecha_compra: '', garantia: '', sistema_operativo: '', nombre_equipo: '',
    cuenta_usuario: '', clave: '', descripcion_estado: '', observaciones: ''
  });
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const centros = [
    'CENTRAL', 'CPM I', 'CPM II', 'RGA III', 'CPM IV',
    'OISL V', 'CPM VII', 'CPM X', 'ISL XI', 'ISL XII',
    'ISL XIII', 'CAI XIV', 'CPM XV'
  ];

  const cargarDatos = async () => {
    const token = await refreshTokenIfNeeded();
    const res = await fetch(`${API_BASE}/equipos/ordenadores/?page=${pagina}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setOrdenadores(data.results);
    setTotalPaginas(Math.ceil(data.count / 5));
  };

  useEffect(() => { cargarDatos(); }, [pagina]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await refreshTokenIfNeeded();
    await fetch(`${API_BASE}/equipos/ordenadores/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ centro: '', empresa: '', tipo_equipo: '', marca: '', modelo: '', numero_serie: '', fecha_compra: '', garantia: '', sistema_operativo: '', nombre_equipo: '', cuenta_usuario: '', clave: '', descripcion_estado: '', observaciones: '' });
    cargarDatos();
  };

  return (
    <div className="container mt-4">
      <h3>Gestión de Ordenadores</h3>
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <label>Centro:</label>
        <select className="form-select mb-2" name="centro" value={form.centro} onChange={handleChange}>
          <option value="">Selecciona centro</option>
          {centros.map(c => <option key={c}>{c}</option>)}
        </select>

        <label>Empresa:</label><input className="form-control mb-2" name="empresa" value={form.empresa} onChange={handleChange} />
        <label>Tipo equipo:</label><input className="form-control mb-2" name="tipo_equipo" value={form.tipo_equipo} onChange={handleChange} />
        <label>Marca:</label><input className="form-control mb-2" name="marca" value={form.marca} onChange={handleChange} />
        <label>Modelo:</label><input className="form-control mb-2" name="modelo" value={form.modelo} onChange={handleChange} />
        <label>Número serie:</label><input className="form-control mb-2" name="numero_serie" value={form.numero_serie} onChange={handleChange} />
        <label>Fecha compra:</label><input className="form-control mb-2" type="date" name="fecha_compra" value={form.fecha_compra} onChange={handleChange} />
        <label>Garantía:</label><input className="form-control mb-2" type="date" name="garantia" value={form.garantia} onChange={handleChange} />
        <label>Sistema operativo:</label><input className="form-control mb-2" name="sistema_operativo" value={form.sistema_operativo} onChange={handleChange} />
        <label>Nombre equipo:</label><input className="form-control mb-2" name="nombre_equipo" value={form.nombre_equipo} onChange={handleChange} />
        <label>Cuenta usuario:</label><textarea className="form-control mb-2" name="cuenta_usuario" value={form.cuenta_usuario} onChange={handleChange} />
        <label>Clave:</label><textarea className="form-control mb-2" name="clave" value={form.clave} onChange={handleChange} />
        <label>Descripción estado:</label><textarea className="form-control mb-2" name="descripcion_estado" value={form.descripcion_estado} onChange={handleChange} />
        <label>Observaciones:</label><textarea className="form-control mb-2" name="observaciones" value={form.observaciones} onChange={handleChange} />
        <button type="submit" className="btn btn-success">Crear ordenador</button>
      </form>

      <h5>Listado:</h5>
      {ordenadores.map(o => (
        <div key={o.id} className="card mb-2 p-2">
          <b>{o.centro} - {o.marca} {o.modelo}</b>
        </div>
      ))}

      <div className="text-center my-3">
        <button className="btn btn-outline-secondary mx-1" disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>◀</button>
        Página {pagina} de {totalPaginas}
        <button className="btn btn-outline-secondary mx-1" disabled={pagina >= totalPaginas} onClick={() => setPagina(pagina + 1)}>▶</button>
      </div>
    </div>
  );
}

export default Ordenadores;
