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
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    id: null,
    numero_serie: '',
    confirmSerie: ''
  });

  // Fetch paginated data
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

  // Form handlers
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

  // Enter edit mode
  const enterEditMode = () => {
    setForm({ ...seleccionado });
    setEditMode(true);
    setMensaje(''); setError('');
    setModalEliminar({ abierto: false, id: null, numero_serie: '', confirmSerie: '' });
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
        setError(data.detail || 'Error actualizando teléfono');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  // Delete modal
  const abrirModalEliminar = () => {
    setModalEliminar({
      abierto: true,
      id: seleccionado.id,
      numero_serie: seleccionado.numero_serie,
      confirmSerie: ''
    });
  };
  const handleEliminar = async () => {
    setEliminando(true);
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/telefonos/${modalEliminar.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMensaje('✅ Teléfono eliminado');
        setSeleccionado(null);
        cargarDatos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setError('Error eliminando teléfono');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEliminando(false);
      setModalEliminar({ abierto: false, id: null, numero_serie: '', confirmSerie: '' });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Registro de teléfonos</h3>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {!seleccionado ? (
        <>
          <form onSubmit={handleCrear} className="mb-5">
            <div className="row g-2">
              {Object.entries(initialForm).map(([name]) => (
                <div className="col-md-4" key={name}>
                  <label>{name.replaceAll('_',' ')}:</label>
                  {name === 'centro' ? (
                    <select
                      name="centro"
                      className="form-select"
                      value={form.centro}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona centro...</option>
                      {[
                        'CENTRAL','CPM I','CPM II','RGA III','CPM IV','OISL V',
                        'CPM VII','CPM X','ISL XI','ISL XII','ISL XIII','CAI XIV','CPM XV'
                      ].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={name}
                      className="form-control"
                      value={form[name]}
                      onChange={handleChange}
                      type={name.includes('fecha') ? 'date' : 'text'}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="btn btn-success mt-4"
              disabled={guardando}
            >
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
              <p key={key}><b>{key.replaceAll('_',' ')}</b>: {val?.toString()||'—'}</p>
            ))}
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-primary" onClick={enterEditMode}>Modificar</button>
              <button className="btn btn-danger" onClick={abrirModalEliminar}>Eliminar</button>
              <button className="btn btn-secondary" onClick={() => setSeleccionado(null)}>Volver</button>
            </div>
          </div>

          {editMode && (
            <div className="card shadow p-4 mb-3">
              <h4>Editar teléfono</h4>
              <form onSubmit={e => { e.preventDefault(); handleActualizar(); }} className="mb-3">
                <div className="row g-2">
                  {Object.entries(initialForm).map(([name]) => (
                    <div className="col-md-4" key={name}>
                      <label>{name.replaceAll('_',' ')}:</label>
                      {name === 'centro' ? (
                        <select
                          name="centro"
                          className="form-select"
                          value={form.centro}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecciona centro...</option>
                          {[
                            'CENTRAL','CPM I','CPM II','RGA III','CPM IV','OISL V',
                            'CPM VII','CPM X','ISL XI','ISL XII','ISL XIII','CAI XIV','CPM XV'
                          ].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={name}
                          className="form-control"
                          value={form[name]}
                          onChange={handleChange}
                          type={name.includes('fecha') ? 'date' : 'text'}
                        />
                      )}
                    </div>
                  ))}
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
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancelar</button>
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
              <h5 className="text-danger">Eliminar teléfono</h5>
              <p>Escribe el Nº de serie exacto para confirmar:</p>
              <input
                className="form-control mb-3"
                placeholder="Nº de serie"
                value={modalEliminar.confirmSerie}
                onChange={e => setModalEliminar(me => ({
                  ...me,
                  confirmSerie: e.target.value
                }))}
              />
              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setModalEliminar({ abierto: false, id: null, numero_serie: '', confirmSerie: '' })}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  disabled={modalEliminar.confirmSerie !== modalEliminar.numero_serie}
                  onClick={handleEliminar}
                >
                  {eliminando
                    ? <span className="spinner-border spinner-border-sm" role="status" />
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

export default Telefonos;