import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Telefonos() {
  const [telefonos, setTelefonos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [form, setForm] = useState({
    centro: '', puesto: '', marca: '', modelo: '', numero_serie: '', imei: '', desbloqueo: '',
    datos_sim: '', pin: '', puk1: '', puk2: '', ext_vpn: '', fijo: '', tarifa: '', restriccion: '', linea: ''
  });
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    const token = await refreshTokenIfNeeded();
    const res = await fetch(`${API_BASE}/telefonos/?page=${pagina}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTelefonos(data.results);
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
    await fetch(`${API_BASE}/telefonos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ centro: '', puesto: '', marca: '', modelo: '', numero_serie: '', imei: '', desbloqueo: '', datos_sim: '', pin: '', puk1: '', puk2: '', ext_vpn: '', fijo: '', tarifa: '', restriccion: '', linea: '' });
    setCargando(false);
    cargarDatos();
  };

  return (
    <div className="container mt-4">
      <h3>Registro de teléfonos</h3>
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
            <label>Puesto:</label>
            <input name="puesto" className="form-control" value={form.puesto} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Línea:</label>
            <input name="linea" className="form-control" value={form.linea} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Marca:</label>
            <input name="marca" className="form-control" value={form.marca} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Modelo:</label>
            <input name="modelo" className="form-control" value={form.modelo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Nº serie:</label>
            <input name="numero_serie" className="form-control" value={form.numero_serie} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>IMEI:</label>
            <input name="imei" className="form-control" value={form.imei} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Desbloqueo:</label>
            <input name="desbloqueo" className="form-control" value={form.desbloqueo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Datos SIM:</label>
            <input name="datos_sim" className="form-control" value={form.datos_sim} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label>PIN:</label>
            <input name="pin" className="form-control" value={form.pin} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label>PUK1:</label>
            <input name="puk1" className="form-control" value={form.puk1} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label>PUK2:</label>
            <input name="puk2" className="form-control" value={form.puk2} onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label>Ext VPN:</label>
            <input name="ext_vpn" className="form-control" value={form.ext_vpn} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Fijo:</label>
            <input name="fijo" className="form-control" value={form.fijo} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Tarifa:</label>
            <input name="tarifa" className="form-control" value={form.tarifa} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Restricción:</label>
            <input name="restriccion" className="form-control" value={form.restriccion} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-success mt-4" disabled={cargando}>
          {cargando ? "Guardando..." : "Crear teléfono"}
        </button>
      </form>

      <h5 className="mb-3">Listado</h5>

      {telefonos.map(tel => (
        <div key={tel.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5>{tel.marca} {tel.modelo} - {tel.centro}</h5>
            <p>IMEI: {tel.imei} — Nº serie: {tel.numero_serie}</p>
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

export default Telefonos;
