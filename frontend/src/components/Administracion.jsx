import React, { useEffect, useState } from 'react';
import GestionarIncidencia from './GestionarIncidencia';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

const CENTROS = [
  'CENTRAL','CPM I','CPM II','RGA III','CPM IV',
  'OISL V','CPM VII','CPM X','ISL XI','ISL XII',
  'ISL XIII','CAI XIV','CPM XV'
];

function Administracion() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ username: '', email: '', password: '' });
  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const [totalPaginasUsuarios, setTotalPaginasUsuarios] = useState(1);

  const [allIncidencias, setAllIncidencias] = useState([]);
  const [loadingAllIncidencias, setLoadingAllIncidencias] = useState(false);
  const [errorAllIncidencias, setErrorAllIncidencias] = useState('');

  const [paginaIncidencias, setPaginaIncidencias] = useState(1);

  const [pendingType, setPendingType] = useState('');
  const [pendingValue, setPendingValue] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [modal, setModal] = useState({ abierto: false, id: null, username: '', newPassword: '' });
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: null, email: '', confirmEmail: '' });
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAll = async () => {
      setLoadingAllIncidencias(true);
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/incidencias/?page_size=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAllIncidencias(data.results ?? data);
      } catch {
        setErrorAllIncidencias('Error al cargar incidencias');
      } finally {
        setLoadingAllIncidencias(false);
      }
    };
    loadAll();
  }, []);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/usuarios/?page=${paginaUsuarios}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsuarios(data.results);
        setTotalPaginasUsuarios(Math.ceil(data.count / 5));
      } catch {
        setError('Error al cargar usuarios');
      }
    };
    loadUsuarios();
  }, [paginaUsuarios]);

  const estadoTexto = v =>
    v === 'nueva'     ? 'Nueva'
  : v === 'en_curso'  ? 'En curso'
  :                     'Cerrada';

  const estadoClase = v =>
    v === 'nueva'     ? 'bg-danger text-white'
  : v === 'en_curso'  ? 'bg-warning text-dark'
  :                     'bg-success text-white';

  const renderCamposTipo = inc => {
    switch (inc.relativa) {
      case '1': return <>
        <strong>IMEI:</strong> {inc.imei}<br/>
        <strong>Tipo teléfono:</strong> {inc.tipo_incidencia_telefono}
      </>;
      case '2': return <>
        <strong>Nº Serie:</strong> {inc.numero_serie}<br/>
        <strong>Sesión:</strong> {inc.sesion}<br/>
        <strong>Tipo ordenador:</strong> {inc.tipo_incidencia_ordenador}
      </>;
      case '3': return <>
        <strong>Internet:</strong> {inc.tipo_incidencia_internet}<br/>
        <strong>Inicio:</strong> {new Date(inc.fecha_inicio_incidencia).toLocaleString()}
      </>;
      case '4': return <>
        <strong>Cuenta GSuite:</strong> {inc.cuenta_gsuite}<br/>
        <strong>Tipo GSuite:</strong> {inc.tipo_incidencia_gsuite}
      </>;
      case '5': return <>
        <strong>Tipo impresora:</strong> {inc.tipo_incidencia_impresora}
      </>;
      case '6': return <>
        <strong>Trabajador plataforma:</strong> {inc.trabajador_plataforma}<br/>
        <strong>Tipo plataforma:</strong> {inc.tipo_incidencia_plataforma}
      </>;
      case '7': return <>
        <strong>Trabajador disp.:</strong> {inc.trabajador_dispositivo}<br/>
        <strong>Modelo personal:</strong> {inc.modelo_personal}
      </>;
      case '8': return <>
        <strong>Centro ANIDE:</strong> {inc.centro_anide}<br/>
        <strong>Puesto trabajo:</strong> {inc.puesto_trabajo}
      </>;
      default: return null;
    }
  };

  const PAGE_SIZE = 5;
  let filtered = allIncidencias;
  if (filterType === 'centro' && filterValue)    filtered = filtered.filter(i => i.centro === filterValue);
  if (filterType === 'estado' && filterValue)    filtered = filtered.filter(i => i.estado === filterValue);
  if (filterType === 'antiguedad' && filterValue) {
    filtered = filtered.slice().sort((a, b) => (
      filterValue === 'mas_reciente'
        ? new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        : new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
    ));
  }
  const total = filtered.length;
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;
  const start = (paginaIncidencias - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const handleCrearUsuario = async e => {
    e.preventDefault();
    setMensaje(''); setError('');
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/crear_usuario/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(nuevo)
      });
      if (res.ok) {
        setMensaje('Usuario creado correctamente.');
        setNuevo({ username: '', email: '', password: '' });
        setPaginaUsuarios(1);
      } else {
        const d = await res.json();
        setError(d.error || 'Error al crear usuario');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const handleCambioPassword = async () => {
    if (!modal.newPassword) {
      setError('Introduce nueva contraseña');
      return;
    }
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/cambiar_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: modal.id, new_password: modal.newPassword })
      });
      if (res.ok) {
        setMensaje('Contraseña actualizada');
        setModal({ abierto: false, id: null, username: '', newPassword: '' });
      } else {
        setError('Error al cambiar contraseña');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const handleEliminarUsuario = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/usuarios/${modalEliminar.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMensaje('Usuario eliminado correctamente.');
        setModalEliminar({ abierto: false, id: null, email: '', confirmEmail: '' });
      } else {
        setError('Error al eliminar usuario');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const applyFilters = () => {
    setFilterType(pendingType);
    setFilterValue(pendingValue);
    setPaginaIncidencias(1);
  };

  const resetFiltros = () => {
    setPendingType('');
    setPendingValue('');
    setFilterType('');
    setFilterValue('');
    setPaginaIncidencias(1);
  };

  if (loadingAllIncidencias) return <p>Cargando incidencias…</p>;
  if (errorAllIncidencias) return <div className="alert alert-danger">{errorAllIncidencias}</div>;

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>

      <div className="alert alert-info mt-4">
        Tienes <strong>{filtered.filter(i => i.estado === 'nueva').length}</strong> incidencias nuevas.
      </div>

      <div className="card mt-3 p-3">
        <h5>Crear nuevo usuario</h5>
        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error   && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleCrearUsuario}>
          <div className="row">
            <div className="col-md-4 mb-2">
              <input className="form-control" name="username" placeholder="Usuario"
                value={nuevo.username}
                onChange={e => setNuevo({ ...nuevo, username: e.target.value })}
                required />
            </div>
            <div className="col-md-4 mb-2">
              <input className="form-control" name="email" placeholder="Correo"
                value={nuevo.email}
                onChange={e => setNuevo({ ...nuevo, email: e.target.value })}
                required />
            </div>
            <div className="col-md-4 mb-2">
              <input className="form-control" name="password" type="password" placeholder="Contraseña"
                value={nuevo.password}
                onChange={e => setNuevo({ ...nuevo, password: e.target.value })}
                required />
            </div>
          </div>
          <button className="btn btn-success mt-2" type="submit">Crear usuario</button>
        </form>
      </div>

      <div className="mt-5">
        <h4>Usuarios registrados</h4>
        <table className="table table-bordered table-striped mt-3">
          <thead>
            <tr>
              <th>Usuario</th><th>Correo</th><th>Admin</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.is_superuser ? '✔️' : '❌'}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => setModal({ abierto: true, id: u.id, username: u.username, newPassword: '' })}>
                    Cambiar contraseña
                  </button>
                  <button className="btn btn-outline-danger btn-sm"
                    onClick={() => setModalEliminar({ abierto: true, id: u.id, email: u.email, confirmEmail: '' })}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center my-3">
          <button className="btn btn-outline-secondary mx-1"
            disabled={paginaUsuarios <= 1}
            onClick={() => setPaginaUsuarios(paginaUsuarios - 1)}>◀</button> Página {paginaUsuarios} de {totalPaginasUsuarios} <button className="btn btn-outline-secondary mx-1"
            disabled={paginaUsuarios >= totalPaginasUsuarios}
            onClick={() => setPaginaUsuarios(paginaUsuarios + 1)}>▶</button>
        </div>
      </div>

      <div className="mt-5">
        <h4>Gestión de Incidencias</h4>
        {incidenciaSeleccionada ? (
          <>
            <button className="btn btn-secondary mb-3"
              onClick={() => setIncidenciaSeleccionada(null)}>⬅ Volver</button>
            <GestionarIncidencia incidencia={incidenciaSeleccionada} onActualizada={() => {}}/>
          </>
        ) : (
          <>
            <div className="row g-2 mb-3 align-items-end">
              <div className="col-md-3">
                <label>Filtrar por:</label>
                <select className="form-select"
                  value={pendingType}
                  onChange={e => { setPendingType(e.target.value); setPendingValue(''); setPaginaIncidencias(1); }}>
                  <option value="">—</option>
                  <option value="centro">Centro</option>
                  <option value="estado">Estado</option>
                  <option value="antiguedad">Antigüedad</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Valor:</label>
                <select className="form-select"
                  value={pendingValue}
                  onChange={e => setPendingValue(e.target.value)}
                  disabled={!pendingType}>
                  <option value="">—</option>
                  {pendingType === 'centro' && CENTROS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {pendingType === 'estado' && (
                    <>
                      <option value="nueva">Nueva</option>
                      <option value="en_curso">En curso</option>
                      <option value="cerrada">Cerrada</option>
                    </>
                  )}
                  {pendingType === 'antiguedad' && (
                    <>
                      <option value="mas_reciente">Más recientes</option>
                      <option value="mas_antiguo">Más antiguas</option>
                    </>
                  )}
                </select>
              </div>
              <div className="col-md-3 text-end">
                <button className="btn btn-primary w-100" onClick={applyFilters}>Aplicar filtros</button>
              </div>
              <div className="col-md-3 text-end">
                <button className="btn btn-outline-secondary w-100" onClick={resetFiltros}>Reset filtros</button>
              </div>
            </div>

            {pageItems.map(inc => (
              <div key={inc.id}
                className={`card my-2 shadow-sm ${estadoClase(inc.estado)}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setIncidenciaSeleccionada(inc)}>
                <div className="card-body">
                  <h5>{inc.descripcion}</h5>
                  <p>
                    <strong>Centro:</strong> {inc.centro}<br/>
                    <strong>Estado:</strong> {estadoTexto(inc.estado)}
                  </p>
                  {renderCamposTipo(inc)}
                  {inc.observaciones && <>
                    <br/><strong>Observaciones:</strong> {inc.observaciones}
                  </>}
                </div>
              </div>
            ))}

            <div className="text-center my-3">
              <button className="btn btn-outline-secondary mx-1"
                disabled={paginaIncidencias <= 1}
                onClick={() => setPaginaIncidencias(paginaIncidencias - 1)}>◀</button> Página {paginaIncidencias} de {totalPages} <button className="btn btn-outline-secondary mx-1"
                disabled={paginaIncidencias >= totalPages}
                onClick={() => setPaginaIncidencias(paginaIncidencias + 1)}>▶</button>
            </div>
          </>
        )}
      </div>

      {modal.abierto && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Cambiar contraseña de {modal.username}</h5>
              <input type="password" className="form-control mt-3" placeholder="Nueva contraseña"
                value={modal.newPassword}
                onChange={e => setModal({ ...modal, newPassword: e.target.value })} />
              <div className="mt-3 text-end">
                <button className="btn btn-secondary me-2"
                  onClick={() => setModal({ abierto: false, id: null, username: '', newPassword: '' })}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleCambioPassword}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalEliminar.abierto && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Eliminar usuario: {modalEliminar.email}</h5>
              <p className="text-danger mb-2">Escribe el correo completo para confirmarlo:</p>
              <input type="email" className="form-control"
                value={modalEliminar.confirmEmail}
                onChange={e => setModalEliminar({ ...modalEliminar, confirmEmail: e.target.value })} />
              <div className="mt-3 text-end">
                <button className="btn btn-secondary me-2"
                  onClick={() => setModalEliminar({ abierto: false, id: null, email: '', confirmEmail: '' })}>
                  Cancelar
                </button>
                <button className="btn btn-danger"
                  disabled={modalEliminar.confirmEmail !== modalEliminar.email}
                  onClick={handleEliminarUsuario}>
                  Eliminar usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Administracion;
