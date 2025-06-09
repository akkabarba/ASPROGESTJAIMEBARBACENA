import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Telefonos() {
  const [telefonos, setTelefonos] = useState([]);
  const [form, setForm] = useState({
    centro: '', puesto: '', marca: '', modelo: '', numero_serie: '',
    imei: '', desbloqueo: '', datos_sim: '', pin: '', puk1: '', puk2: '', ext_vpn: '',
    fijo: '', tarifa: '', restriccion: '', linea: ''
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
    const res = await fetch(`${API_BASE}/equipos/telefonos/?page=${pagina}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTelefonos(data.results);
    setTotalPaginas(Math.ceil(data.count / 5));
  };

  useEffect(() => { cargarDatos(); }, [pagina]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await refreshTokenIfNeeded();
    await fetch(`${API_BASE}/equipos/telefonos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({
      centro: '', puesto: '', marca: '', modelo: '', numero_serie: '',
      imei: '', desbloqueo: '', datos_sim: '', pin: '', puk1: '', puk2: '', ext_vpn: '',
      fijo: '', tarifa: '', restriccion: '', linea: ''
    });
    cargarDatos();
  };

  return (
    <div className="container mt-4">
      <h3>Gestión de Teléfonos</h3>
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <label>Centro:</label>
        <select className="form-select mb-2" name="centro" value={form.centro} onChange={handleChange}>
          <option value="">Selecciona centro</option>
          {centros.map(c => <option key={c}>{c}</option>)}
        </select>
        <label>Puesto:</label><input className="form-control mb-2" name="puesto" value={form.puesto} onChange={handleChange} />
        <label>Marca:</label><input className="form-control mb-2" name="marca" value={form.marca} onChange={handleChange} />
        <label>Modelo:</label><input className="form-control mb-2" name="modelo" value={form.modelo} onChange={handleChange} />
        <label>Número de serie:</label><input className="form-control mb-2" name="numero_serie" value={form.numero_serie} onChange={handleChange} />
        <label>IMEI:</label><input className="form-control mb-2" name="imei" value={form.imei} onChange={handleChange} />
        <label>Desbloqueo:</label><input className="form-control mb-2" name="desbloqueo" value={form.desbloqueo} onChange={handleChange} />
        <label>Datos SIM:</label><input className="form-control mb-2" name="datos_sim" value={form.datos_sim} onChange={handleChange} />
        <label>PIN:</label><input className="form-control mb-2" name="pin" value={form.pin} onChange={handleChange} />
        <label>PUK1:</label><input className="form-control mb-2" name="puk1" value={form.puk1} onChange={handleChange} />
        <label>PUK2:</label><input className="form-control mb-2" name="puk2" value={form.puk2} onChange={handleChange} />
        <label>Ext VPN:</label><input className="form-control mb-2" name="ext_vpn" value={form.ext_vpn} onChange={handleChange} />
        <label>Fijo:</label><input className="form-control mb-2" name="fijo" value={form.fijo} onChange={handleChange} />
        <label>Tarifa:</label><input className="form-control mb-2" name="tarifa" value={form.tarifa} onChange={handleChange} />
        <label>Restricción:</label><input className="form-control mb-2" name="restriccion" value={form.restriccion} onChange={handleChange} />
        <button type="submit" className="btn btn-success">Crear teléfono</button>
      </form>

      <h5>Listado:</h5>
      {telefonos.map(t => (
        <div key={t.id} className="card mb-2 p-2">
          <b>{t.centro} - {t.marca} {t.modelo}</b>
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

export default Telefonos;
