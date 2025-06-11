import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

const initialForm = {
  centro: '',
  puesto: '',
  linea: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  imei: '',
  desbloqueo: '',
  datos_sim: '',
  pin: '',
  puk1: '',
  puk2: '',
  ext_vpn: '',
  fijo: '',
  tarifa: '',
  restriccion: ''
};

function Telefonos() {
  const [telefonos, setTelefonos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const cargarDatos = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/telefonos/?page=${pagina}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTelefonos(data.results);
      setTotalPaginas(Math.ceil(data.count / 5));
    } catch {
      setError('Error al cargar teléfonos');
    }
  };

  useEffect(() => { cargarDatos(); }, [pagina]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCrear = async e => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(''); setError('');
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/telefonos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMensaje('✅ Teléfono creado correctamente');
        setTimeout(() => setMensaje(''), 3000);
        setForm(initialForm);
        cargarDatos();
      } else {
        const data = await res.json();
        setError(data.detail || 'Error creando teléfono');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  const enterEditMode = () => {
    setForm({ ...seleccionado });
    setEditMode(true);
    setMensaje(''); setError('');
  };

  const handleActualizar = async () => {
    setGuardando(true);
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/telefonos/${seleccionado.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        setSeleccionado(updated);
        setMensaje('✅ Teléfono actualizado');
        setEditMode(false);
        cargarDatos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        const data = await res.json();
        setError(data.detail || 'Error actualizando');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar este teléfono?')) return;
    setEliminando(true);
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/telefonos/${seleccionado.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMensaje('✅ Teléfono eliminado');
        setSeleccionado(null);
        cargarDatos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setError('Error eliminando');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Registro de teléfonos</h3>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!seleccionado ? (
        <>
          <form onSubmit={handleCrear} className="mb-5">
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
                  <option value="DISL V">DISL V</option>
                  <option value="CPM VII">CPM VII</option>
                  <option value="CPM X">CPM X</option>
                  <option value="ISL XI">ISL XI</option>
                  <option value="ISL XII">ISL XII</option>
                  <option value="ISL XIII">ISL XIII</option>
                  <option value="CAL XIV">CAL XIV</option>
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

            <button type="submit" className="btn btn-success mt-4" disabled={guardando}>
              {guardando 
                ? <span className="spinner-border spinner-border-sm" role="status" /> 
                : 'Crear teléfono'}
            </button>
          </form>

          <h5 className="mb-3">Listado</h5>
          {telefonos.map(tel => (
            <div
              key={tel.id}
              className="card mb-3 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => setSeleccionado(tel)}
            >
              <div className="card-body">
                <h5>{tel.marca} {tel.modelo} – {tel.centro}</h5>
                <p>IMEI: {tel.imei} — Nº serie: {tel.numero_serie}</p>
                <p><strong>Línea:</strong> {tel.linea} — <strong>Tarifa:</strong> {tel.tarifa}</p>
              </div>
            </div>
          ))}

          <div className="text-center my-3">
            <button className="btn btn-secondary mx-2" disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
            Página {pagina} de {totalPaginas}
            <button className="btn btn-secondary mx-2" disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
          </div>
        </>
      ) : (
        <>
          <div className="card shadow p-4 mb-3">
            <h4>Detalles del teléfono</h4>
            {Object.entries(seleccionado).map(([key, val]) => (
              <p key={key}><b>{key.replaceAll('_',' ')}</b>: {val?.toString() || '—'}</p>
            ))}
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-primary" onClick={enterEditMode}>Modificar</button>
              <button className="btn btn-danger" disabled={eliminando} onClick={handleEliminar}>
                {eliminando 
                  ? <span className="spinner-border spinner-border-sm" role="status" /> 
                  : 'Eliminar'}
              </button>
              <button className="btn btn-secondary" onClick={() => setSeleccionado(null)}>Volver</button>
            </div>
          </div>

          {editMode && (
            <div className="card shadow p-4">
              <h4>Editar teléfono</h4>
              <form onSubmit={e => { e.preventDefault(); handleActualizar(); }} className="mb-3">
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
                      <option value="DISL V">DISL V</option>
                      <option value="CPM VII">CPM VII</option>
                      <option value="CPM X">CPM X</option>
                      <option value="ISL XI">ISL XI</option>
                      <option value="ISL XII">ISL XII</option>
                      <option value="ISL XIII">ISL XIII</option>
                      <option value="CAL XIV">CAL XIV</option>
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
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={guardando}
                    onClick={handleActualizar}
                  >
                    {guardando
                      ? <span className="spinner-border spinner-border-sm" role="status" />
                      : 'Guardar cambios'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Telefonos;
