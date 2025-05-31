import React, { useEffect, useState } from 'react';
import GestionarIncidencia from './GestionarIncidencia';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Administracion() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ username: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [incidencias, setIncidencias] = useState([]);
  const [nuevas, setNuevas] = useState(0);

  // Paginación usuarios
  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const usuariosPorPagina = 5;

  // Paginación incidencias
  const [paginaIncidencias, setPaginaIncidencias] = useState(1);
  const incidenciasPorPagina = 5;

  // Modal cambio de contraseña
  const [modal, setModal] = useState({ abierto: false, id: null, username: '', newPassword: '' });

  const cargarUsuarios = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/usuarios/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuarios(data.results);
    } catch {
      setError('Error al cargar usuarios');
    }
  };

  const cargarIncidencias = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/incidencias/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIncidencias(data.results);
      const nuevasIncidencias = data.filter((i) => i.estado === 'nueva').length;
      setNuevas(nuevasIncidencias);
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarIncidencias();
  }, []);

  const handleInputChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/crear_usuario/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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
      setError('Error de conexión con el servidor');
    }
  };

  const handleAbrirModal = (id, username) => {
    setModal({ abierto: true, id, username, newPassword: '' });
  };

  const handleGuardarPassword = async () => {
    if (!modal.newPassword) {
      setError("Debes introducir la nueva contraseña");
      return;
    }

    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/cambiar_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: modal.id,
          new_password: modal.newPassword
        })
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

  const separarPorEstado = (estado) =>
    incidencias
      .filter(i => i.estado === estado)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

  const usuariosPaginados = usuarios.slice((paginaUsuarios - 1) * usuariosPorPagina, paginaUsuarios * usuariosPorPagina);
  const incidenciasPaginadas = incidencias.slice((paginaIncidencias - 1) * incidenciasPorPagina, paginaIncidencias * incidenciasPorPagina);

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>

      <div className="alert alert-info mt-4">
        Tienes <strong>{nuevas}</strong> incidencias nuevas.
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h5>Crear nuevo usuario</h5>
          {mensaje && <div className="alert alert-success">{mensaje}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleCrear}>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input type="text" className="form-control" name="username" value={nuevo.username} onChange={handleInputChange} placeholder="Usuario" required />
              </div>
              <div className="col-md-4 mb-2">
                <input type="email" className="form-control" name="email" value={nuevo.email} onChange={handleInputChange} placeholder="Correo" required />
              </div>
              <div className="col-md-4 mb-2">
                <input type="password" className="form-control" name="password" value={nuevo.password} onChange={handleInputChange} placeholder="Contraseña" required />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-2">Crear</button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <h4>Usuarios registrados</h4>
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-light">
            <tr>
              <th>Usuario</th><th>Correo</th><th>Admin</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.is_superuser ? '✔️' : '❌'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleAbrirModal(u.id, u.username)}>Cambiar contraseña</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center">
          {Array.from({ length: Math.ceil(usuarios.length / usuariosPorPagina) }, (_, i) => (
            <button key={i} className={`btn ${paginaUsuarios === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`} onClick={() => setPaginaUsuarios(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h4>Gestión de Incidencias</h4>
        {incidenciasPaginadas.map((inc) => (
          <GestionarIncidencia key={inc.id} incidencia={inc} onActualizada={cargarIncidencias} />
        ))}

        <div className="text-center mt-3">
          {Array.from({ length: Math.ceil(incidencias.length / incidenciasPorPagina) }, (_, i) => (
            <button key={i} className={`btn ${paginaIncidencias === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`} onClick={() => setPaginaIncidencias(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {modal.abierto && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Cambiar contraseña de {modal.username}</h5>
              <input type="password" className="form-control mt-3" placeholder="Nueva contraseña" value={modal.newPassword} onChange={(e) => setModal({...modal, newPassword: e.target.value})} />
              <div className="mt-3 text-end">
                <button className="btn btn-secondary me-2" onClick={() => setModal({ abierto: false })}>Cancelar</button>
                <button className="btn btn-success" onClick={handleGuardarPassword}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Administracion;
