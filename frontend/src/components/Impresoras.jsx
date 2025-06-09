import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Impresoras() {
  const [impresoras, setImpresoras] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    centro: '', direccion: '', telefono_direccion: '', modelo: '', numero_serie: '', ipv4: ''
  });
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    const token = await refreshTokenIfNeeded();
    const res = await fetch(`${API_BASE}/impresoras/?page=${pagina}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setImpresoras(data.results);
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
    const res = await fetch(`${API_BASE}/impresoras/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setMensaje('✅ Impresora creada correctamente');
      setTimeout(() => setMensaje(''), 3000);
      setForm({ centro: '', direccion: '', telefono_direccion: '', modelo: '', numero_serie: '', ipv4: '' });
      cargarDatos();
    }
    setCargando(false);
  };

  return (
    <div className="container mt-4">
      <h3>Registro de impresoras</h3>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

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
            <label>Dirección:</label>
            <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Teléfono dirección:</label>
            <input name="telefono_direccion" className="form-control" value={form.telefono_direccion} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Modelo:</label>
            <input name="modelo" className="form-control" value={form.modelo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Nº de serie:</label>
            <input name="numero_serie" className="form-control" value={form.numero_serie} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>IPv4:</label>
            <input name="ipv4" className="form-control" value={form.ipv4} onChange={handleChange} />
          </div>

        </div>

        <button type="submit" className="btn btn-success mt-4" disabled={cargando}>
          {cargando ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Crear impresora'
          )}
        </button>
      </form>

      <h5 className="mb-3">Listado</h5>

      {impresoras.map(imp => (
        <div key={imp.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5>{imp.modelo} - {imp.centro}</h5>
            <p>Dirección: {imp.direccion} — IPv4: {imp.ipv4}</p>
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

export default Impresoras;
