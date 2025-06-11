import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

const initialForm = {
  centro: '',
  proveedor: '',
  nombre_equipo: '',
  detalles_conexion: '',
  ip_publica_fija: '',
  linea_movil: '',
  linea_sim: '',
  linea_pin: '',
  linea_puk: '',
  tarifa_sin_iva: '',
  terminal_imei: '',
  terminal_num_serie: '',
  wifi_clave: '',
  comentarios: ''
};

const CENTROS = [
  'CENTRAL','CPM I','CPM II','RGA III','CPM IV',
  'DISL V','CPM VII','CPM X','ISL XI','ISL XII',
  'ISL XIII','CAL XIV','CPM XV'
];

function Red() {
  const [redes, setRedes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    id: null,
    linea_movil: '',
    confirmLinea: ''
  });

  const cargarDatos = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/red/?page=${pagina}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRedes(data.results);
      setTotalPaginas(Math.ceil(data.count / 5));
    } catch {
      setError('Error al cargar equipos de red');
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
      const res = await fetch(`${API_BASE}/red/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMensaje('✅ Equipo de red creado correctamente');
        setTimeout(() => setMensaje(''), 3000);
        setForm(initialForm);
        cargarDatos();
      } else {
        const data = await res.json();
        setError(data.detail || 'Error creando equipo de red');
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
      const res = await fetch(`${API_BASE}/red/${seleccionado.id}/`, {
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
        setMensaje('✅ Equipo de red actualizado');
        cargarDatos();
        setEditMode(false);
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

  const abrirModalEliminar = () => {
    setModalEliminar({
      abierto: true,
      id: seleccionado.id,
      linea_movil: seleccionado.linea_movil,
      confirmLinea: ''
    });
  };

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/red/${modalEliminar.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMensaje('✅ Equipo de red eliminado');
        setSeleccionado(null);
        cargarDatos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setError('Error eliminando equipo de red');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEliminando(false);
      setModalEliminar({ abierto: false, id: null, linea_movil: '', confirmLinea: '' });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Registro de equipos de red</h3>
      { mensaje && <div className="alert alert-success">{mensaje}</div> }
      { error   && <div className="alert alert-danger">{error}</div> }

      {!seleccionado ? (
        <>
          <form onSubmit={handleCrear} className="mb-5">
            <div className="row g-2">
              <div className="col-md-4">
                <label>Centro:</label>
                <select name="centro" className="form-select" value={form.centro} onChange={handleChange} required>
                  <option value="">Selecciona centro…</option>
                  {CENTROS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label>Proveedor:</label>
                <input name="proveedor" className="form-control" value={form.proveedor} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Nombre equipo:</label>
                <input name="nombre_equipo" className="form-control" value={form.nombre_equipo} onChange={handleChange}/>
              </div>
              <div className="col-md-6">
                <label>Detalles conexión:</label>
                <textarea name="detalles_conexion" className="form-control" value={form.detalles_conexion} onChange={handleChange}/>
              </div>
              <div className="col-md-6">
                <label>IP pública fija:</label>
                <input name="ip_publica_fija" className="form-control" value={form.ip_publica_fija} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Línea móvil:</label>
                <input name="linea_movil" className="form-control" value={form.linea_movil} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Línea SIM:</label>
                <input name="linea_sim" className="form-control" value={form.linea_sim} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Línea PIN:</label>
                <input name="linea_pin" className="form-control" value={form.linea_pin} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Línea PUK:</label>
                <input name="linea_puk" className="form-control" value={form.linea_puk} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Tarifa sin IVA:</label>
                <input name="tarifa_sin_iva" className="form-control" value={form.tarifa_sin_iva} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Terminal IMEI:</label>
                <input name="terminal_imei" className="form-control" value={form.terminal_imei} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Terminal Nº serie:</label>
                <input name="terminal_num_serie" className="form-control" value={form.terminal_num_serie} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <label>Wifi clave:</label>
                <input name="wifi_clave" className="form-control" value={form.wifi_clave} onChange={handleChange}/>
              </div>
              <div className="col-md-12">
                <label>Comentarios:</label>
                <textarea name="comentarios" className="form-control" value={form.comentarios} onChange={handleChange}/>
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-4" disabled={guardando}>
              {guardando 
                ? <span className="spinner-border spinner-border-sm" role="status" /> 
                : 'Crear equipo de red'}
            </button>
          </form>

          <h5 className="mb-3">Listado</h5>
          {redes.map(red => (
            <div key={red.id} className="card mb-3 shadow-sm" style={{cursor:'pointer'}} onClick={() => setSeleccionado(red)}>
              <div className="card-body">
                <h5>{red.nombre_equipo} — {red.centro}</h5>
                <p>Proveedor: {red.proveedor} — IP pública: {red.ip_publica_fija}</p>
              </div>
            </div>
          ))}
          <div className="text-center my-3">
            <button className="btn btn-secondary mx-2" disabled={pagina<=1} onClick={()=>setPagina(p=>p-1)}>Anterior</button>
            Página {pagina} de {totalPaginas}
            <button className="btn btn-secondary mx-2" disabled={pagina>=totalPaginas} onClick={()=>setPagina(p=>p+1)}>Siguiente</button>
          </div>
        </>
      ) : (
        <>
          <div className="card shadow p-4 mb-3">
            <h4>Detalles del equipo de red</h4>
            {Object.entries(seleccionado).map(([key,val])=>(
              <p key={key}><b>{key.replaceAll('_',' ')}</b>: {val?.toString()||'—'}</p>
            ))}
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-primary" onClick={enterEditMode}>Modificar</button>
              <button className="btn btn-danger" onClick={abrirModalEliminar}>
                Eliminar
              </button>
              <button className="btn btn-secondary" onClick={()=>setSeleccionado(null)}>Volver</button>
            </div>
          </div>

          {editMode && (
            <div className="card shadow p-4 mb-3">
              <h4>Editar equipo de red</h4>
              <form onSubmit={e=>{e.preventDefault(); handleActualizar()}} className="mb-3">
                <div className="row g-2">
                  {Object.keys(initialForm).map(field=>(
                    <div className="col-md-4" key={field}>
                      <label>{field.replaceAll('_',' ')}</label>
                      {field==='centro' ? (
                        <select name="centro" className="form-select" value={form.centro} onChange={handleChange} required>
                          <option value="">Selecciona centro…</option>
                          {CENTROS.map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : ['detalles_conexion','comentarios'].includes(field) ? (
                        <textarea name={field} className="form-control" value={form[field]} onChange={handleChange}/>
                      ) : (
                        <input type="text" name={field} className="form-control" value={form[field]} onChange={handleChange}/>
                      )}
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button type="button" className="btn btn-success" disabled={guardando} onClick={handleActualizar}>
                    {guardando
                      ? <span className="spinner-border spinner-border-sm" role="status"/>
                      : 'Guardar cambios'}
                  </button>
                  <button className="btn btn-secondary" onClick={()=>setEditMode(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {modalEliminar.abierto && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="text-danger">Eliminar equipo de red</h5>
              <p>Escribe la <strong>línea móvil</strong> para confirmar:</p>
              <input
                className="form-control mb-3"
                placeholder="Línea móvil"
                value={modalEliminar.confirmLinea}
                onChange={e=>setModalEliminar(me=>({
                  ...me,
                  confirmLinea: e.target.value
                }))}
              />
              <div className="text-end">
                <button className="btn btn-secondary me-2" onClick={()=>setModalEliminar({
                  abierto:false,id:null,linea_movil:'',confirmLinea:''
                })}>
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  disabled={modalEliminar.confirmLinea!==modalEliminar.linea_movil}
                  onClick={handleEliminar}
                >
                  {eliminando
                    ? <span className="spinner-border spinner-border-sm" role="status"/>
                    : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Red;