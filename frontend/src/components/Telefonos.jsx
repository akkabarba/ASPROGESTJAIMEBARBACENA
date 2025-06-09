import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Ordenadores() {
  const [ordenadores, setOrdenadores] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [form, setForm] = useState({
    centro: '', empresa: '', tipo_equipo: '', marca: '', modelo: '',
    numero_serie: '', fecha_compra: '', garantia: '', sistema_operativo: '',
    nombre_equipo: '', cuenta_usuario: '', clave: '', descripcion_estado: '',
    observaciones: '', registro: ''
  });
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    const token = await refreshTokenIfNeeded();
    const res = await fetch(`${API_BASE}/ordenadores/?page=${pagina}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setOrdenadores(data.results);
    setTotalPaginas(Math.ceil(data.count / 5));
  };

  useEffect(() => { cargarDatos() }, [pagina]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setCargando(true);
    const token = await refreshTokenIfNeeded();
    await fetch(`${API_BASE}/ordenadores/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ centro: '', empresa: '', tipo_equipo: '', marca: '', modelo: '', numero_serie: '', fecha_compra: '', garantia: '', sistema_operativo: '', nombre_equipo: '', cuenta_usuario: '', clave: '', descripcion_estado: '', observaciones: '', registro: '' });
    setCargando(false);
    cargarDatos();
  };

  return (
    <div className="container mt-4">
      <h3>Registro de ordenadores</h3>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row g-2">
          <div className="col-md-4">
            <label>Centro:</label>
            <select name="centro" className="form-select" value={form.centro} onChange={handleChange} required>
              <option value="">Selecciona centro...</option>
              <option value="CENTRAL">CENTRAL</option>
              <option value="CPM I">CPM I</option>
              <option value="CPM II">CPM II</option>
              <option value="RGA III">RGA III</option>
              <option value="CPM IV">CPM IV</option>
              <option value="DISL V">OISL V</option>
              <option value="CPM VII">CPM VII</option>
              <option value="CPM X">CPM X</option>
              <option value="ISL XI">ISL XI</option>
              <option value="ISL XII">ISL XII</option>
              <option value="ISL XIII">ISL XIII</option>
              <option value="CAL XIV">CAI XIV</option>
              <option value="CPM XV">CPM XV</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Empresa:</label>
            <input type="text" name="empresa" className="form-control" value={form.empresa} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Tipo equipo:</label>
            <input type="text" name="tipo_equipo" className="form-control" value={form.tipo_equipo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Marca:</label>
            <input type="text" name="marca" className="form-control" value={form.marca} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Modelo:</label>
            <input type="text" name="modelo" className="form-control" value={form.modelo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Número serie:</label>
            <input type="text" name="numero_serie" className="form-control" value={form.numero_serie} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Fecha compra:</label>
            <input type="date" name="fecha_compra" className="form-control" value={form.fecha_compra} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Garantía:</label>
            <input type="date" name="garantia" className="form-control" value={form.garantia} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Sistema operativo:</label>
            <input type="text" name="sistema_operativo" className="form-control" value={form.sistema_operativo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Nombre equipo:</label>
            <input type="text" name="nombre_equipo" className="form-control" value={form.nombre_equipo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Cuenta usuario:</label>
            <input type="text" name="cuenta_usuario" className="form-control" value={form.cuenta_usuario} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Clave:</label>
            <input type="text" name="clave" className="form-control" value={form.clave} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label>Descripción estado:</label>
            <textarea name="descripcion_estado" className="form-control" value={form.descripcion_estado} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label>Observaciones:</label>
            <textarea name="observaciones" className="form-control" value={form.observaciones} onChange={handleChange} />
          </div>

          <div className="col-md-12">
            <label>Registro:</label>
            <textarea name="registro" className="form-control" value={form.registro} onChange={handleChange} />
          </div>

        </div>

        <button type="submit" className="btn btn-success mt-4" disabled={cargando}>
          {cargando ? "Guardando..." : "Crear ordenador"}
        </button>
      </form>

      <h5 className="mb-3">Listado</h5>

      {ordenadores.map(ord => (
        <div key={ord.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5>{ord.marca} {ord.modelo} - {ord.centro}</h5>
            <p>{ord.empresa} - SN: {ord.numero_serie}</p>
          </div>
        </div>
      ))}

      <div className="text-center my-3">
        <button className="btn btn-secondary mx-2" disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
        Página {pagina} de {totalPaginas}
        <button className="btn btn-secondary mx-2" disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
      </div>

    </div>
  );
}

export default Ordenadores;
