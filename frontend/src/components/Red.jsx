import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Red() {
  const [redes, setRedes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    centro: '', proveedor: '', nombre_equipo: '', detalles_conexion: '',
    ip_publica_fija: '', linea_movil: '', linea_sim: '', linea_pin: '', linea_puk: '',
    tarifa_sin_iva: '', terminal_imei: '', terminal_num_serie: '', wifi_clave: '', comentarios: ''
  });
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    const token = await refreshTokenIfNeeded();
    const res = await fetch(`${API_BASE}/red/?page=${pagina}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRedes(data.results);
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
    const res = await fetch(`${API_BASE}/red/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setMensaje('✅ Equipo de red creado correctamente');
      setTimeout(() => setMensaje(''), 3000);
      setForm({
        centro: '', proveedor: '', nombre_equipo: '', detalles_conexion: '', ip_publica_fija: '',
        linea_movil: '', linea_sim: '', linea_pin: '', linea_puk: '', tarifa_sin_iva: '',
        terminal_imei: '', terminal_num_serie: '', wifi_clave: '', comentarios: ''
      });
      cargarDatos();
    }
    setCargando(false);
  };

  return (
    <div className="container mt-4">
      <h3>Registro de equipos de red</h3>

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
            <label>Proveedor:</label>
            <input name="proveedor" className="form-control" value={form.proveedor} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Nombre equipo:</label>
            <input name="nombre_equipo" className="form-control" value={form.nombre_equipo} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label>Detalles conexión:</label>
            <textarea name="detalles_conexion" className="form-control" value={form.detalles_conexion} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label>IP pública fija:</label>
            <input name="ip_publica_fija" className="form-control" value={form.ip_publica_fija} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Línea móvil:</label>
            <input name="linea_movil" className="form-control" value={form.linea_movil} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Línea SIM:</label>
            <input name="linea_sim" className="form-control" value={form.linea_sim} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Línea PIN:</label>
            <input name="linea_pin" className="form-control" value={form.linea_pin} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Línea PUK:</label>
            <input name="linea_puk" className="form-control" value={form.linea_puk} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Tarifa sin IVA:</label>
            <input name="tarifa_sin_iva" className="form-control" value={form.tarifa_sin_iva} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Terminal IMEI:</label>
            <input name="terminal_imei" className="form-control" value={form.terminal_imei} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Terminal Nº serie:</label>
            <input name="terminal_num_serie" className="form-control" value={form.terminal_num_serie} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Wifi clave:</label>
            <input name="wifi_clave" className="form-control" value={form.wifi_clave} onChange={handleChange} />
          </div>

          <div className="col-md-12">
            <label>Comentarios:</label>
            <textarea name="comentarios" className="form-control" value={form.comentarios} onChange={handleChange} />
          </div>

        </div>

        <button type="submit" className="btn btn-success mt-4" disabled={cargando}>
          {cargando ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Crear equipo de red'
          )}
        </button>
      </form>

      <h5 className="mb-3">Listado</h5>

      {redes.map(red => (
        <div key={red.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5>{red.nombre_equipo} - {red.centro}</h5>
            <p>Proveedor: {red.proveedor} — IP pública: {red.ip_publica_fija}</p>
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

export default Red;
