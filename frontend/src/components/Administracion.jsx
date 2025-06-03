      import React, { useEffect, useState } from 'react';
      import GestionarIncidencia from './GestionarIncidencia';
      import { refreshTokenIfNeeded } from '../utils/auth';
      import API_BASE from '../utils/config';

      function Administracion() {
        const [usuarios, setUsuarios] = useState([]);
        const [incidencias, setIncidencias] = useState([]);
        const [nuevo, setNuevo] = useState({ username: '', email: '', password: '' });
        const [mensaje, setMensaje] = useState('');
        const [error, setError] = useState('');
        const [nuevas, setNuevas] = useState(0);

        const [paginaUsuarios, setPaginaUsuarios] = useState(1);
        const [totalPaginasUsuarios, setTotalPaginasUsuarios] = useState(1);

        const [paginaIncidencias, setPaginaIncidencias] = useState(1);
        const [totalPaginasIncidencias, setTotalPaginasIncidencias] = useState(1);

        const [modal, setModal] = useState({ abierto: false, id: null, username: '', newPassword: '' });
        const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: null, email: '', confirmEmail: '' });
        const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);

        const cargarUsuarios = async () => {
          try {
            const token = await refreshTokenIfNeeded();
            const res = await fetch(`${API_BASE}/usuarios/?page=${paginaUsuarios}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsuarios(data.results);
            setTotalPaginasUsuarios(Math.ceil(data.count / 5));
          } catch {
            setError("Error al cargar usuarios");
          }
        };

        const cargarIncidencias = async () => {
          try {
            const token = await refreshTokenIfNeeded();
            const res = await fetch(`${API_BASE}/incidencias/?page=${paginaIncidencias}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setIncidencias(data.results);
            setTotalPaginasIncidencias(Math.ceil(data.count / 5));
            const nuevasIncidencias = (data.results || []).filter(i => i.estado === 'nueva').length;
            setNuevas(nuevasIncidencias);
          } catch {
            setError("Error al cargar incidencias");
          }
        };

        useEffect(() => { cargarUsuarios(); }, [paginaUsuarios]);
        useEffect(() => { cargarIncidencias(); }, [paginaIncidencias]);

        const handleCrearUsuario = async (e) => {
          e.preventDefault();
          setMensaje('');
          setError('');
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
              cargarUsuarios();
            } else {
              const data = await res.json();
              setError(data.error || 'Error al crear usuario');
            }
          } catch {
            setError('Error de conexión');
          }
        };

        const handleCambioPassword = async () => {
          if (!modal.newPassword) {
            setError("Introduce nueva contraseña");
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
            cargarUsuarios();
          } else {
            setError('Error al eliminar usuario');
          }
        } catch {
          setError('Error de conexión');
        }
      };


        return (
          <div className="container mt-4">
            <h2>Panel de Administración</h2>

            <div className="alert alert-info mt-4">
              Tienes <strong>{nuevas}</strong> incidencias nuevas.
            </div>

            {/* CREAR USUARIO */}
            <div className="card mt-3 p-3">
              <h5>Crear nuevo usuario</h5>
              {mensaje && <div className="alert alert-success">{mensaje}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleCrearUsuario}>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <input className="form-control" name="username" placeholder="Usuario"
                      value={nuevo.username} onChange={(e) => setNuevo({...nuevo, username: e.target.value})} required />
                  </div>
                  <div className="col-md-4 mb-2">
                    <input className="form-control" name="email" placeholder="Correo"
                      value={nuevo.email} onChange={(e) => setNuevo({...nuevo, email: e.target.value})} required />
                  </div>
                  <div className="col-md-4 mb-2">
                    <input className="form-control" name="password" type="password" placeholder="Contraseña"
                      value={nuevo.password} onChange={(e) => setNuevo({...nuevo, password: e.target.value})} required />
                  </div>
                </div>
                <button className="btn btn-success mt-2" type="submit">Crear usuario</button>
              </form>
            </div>

            {/* USUARIOS */}
            <div className="mt-5">
              <h4>Usuarios registrados</h4>
              <table className="table table-bordered table-striped mt-3">
                <thead><tr><th>Usuario</th><th>Correo</th><th>Admin</th><th>Acciones</th></tr></thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.username}</td><td>{u.email}</td>
                      <td>{u.is_superuser ? '✔️' : '❌'}</td>
                      <td><button className="btn btn-outline-primary btn-sm"
                        onClick={() => setModal({ abierto: true, id: u.id, username: u.username, newPassword: '' })}>
                        Cambiar contraseña</button>
                          | 
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
                <button className="btn btn-outline-secondary mx-1" disabled={paginaUsuarios <= 1} onClick={() => setPaginaUsuarios(paginaUsuarios - 1)}>◀</button>
                Página {paginaUsuarios} de {totalPaginasUsuarios}
                <button className="btn btn-outline-secondary mx-1" disabled={paginaUsuarios >= totalPaginasUsuarios} onClick={() => setPaginaUsuarios(paginaUsuarios + 1)}>▶</button>
              </div>
            </div>

            {/* INCIDENCIAS */}
            <div className="mt-5">
              <h4>Gestión de Incidencias</h4>
              {incidenciaSeleccionada ? (
                <>
                  <button className="btn btn-secondary mb-3" onClick={() => setIncidenciaSeleccionada(null)}>⬅ Volver</button>
                  <GestionarIncidencia incidencia={incidenciaSeleccionada} onActualizada={cargarIncidencias} />
                </>
              ) : (
                <>
                  {incidencias.map(inc => (
                    <div key={inc.id} className="card my-2 shadow-sm" style={{ cursor: 'pointer' }}
                      onClick={() => setIncidenciaSeleccionada(inc)}>
                      <div className="card-body">
                        <h5>{inc.descripcion}</h5>
                        <p><strong>Centro:</strong> {inc.centro} — <strong>Estado:</strong> {inc.estado}</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center my-3">
                    <button className="btn btn-outline-secondary mx-1" disabled={paginaIncidencias <= 1} onClick={() => setPaginaIncidencias(paginaIncidencias - 1)}>◀</button>
                    Página {paginaIncidencias} de {totalPaginasIncidencias}
                    <button className="btn btn-outline-secondary mx-1" disabled={paginaIncidencias >= totalPaginasIncidencias} onClick={() => setPaginaIncidencias(paginaIncidencias + 1)}>▶</button>
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
                      value={modal.newPassword} onChange={(e) => setModal({...modal, newPassword: e.target.value})} />
                    <div className="mt-3 text-end">
                      <button className="btn btn-secondary me-2" onClick={() => setModal({ abierto: false })}>Cancelar</button>
                      <button className="btn btn-success" onClick={handleCambioPassword}>Guardar</button>
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
            <p className="text-danger mb-2">Escribe el correo completo del usuario para confirmar:</p>
            <input type="email" className="form-control"
              value={modalEliminar.confirmEmail}
              onChange={(e) => setModalEliminar({...modalEliminar, confirmEmail: e.target.value})} />
            <div className="mt-3 text-end">
              <button className="btn btn-secondary me-2" onClick={() => setModalEliminar({ abierto: false, id: null, email: '', confirmEmail: '' })}>
                Cancelar
              </button>
              <button className="btn btn-danger" disabled={modalEliminar.confirmEmail !== modalEliminar.email} onClick={handleEliminarUsuario}>
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
