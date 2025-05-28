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

  const cargarUsuarios = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/usuarios/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setError('Error al cargar usuarios');
    }
  };

  const cargarIncidencias = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/incidencias/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Respuesta inesperada:", data);
        setError("Token inválido o no autorizado");
        return;
      }

      setIncidencias(data);
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

  const separarPorEstado = (estado) =>
    incidencias
      .filter(i => i.estado === estado)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>

      <div className="alert alert-info mt-4">
        Tienes <strong>{nuevas}</strong> incidencias nuevas.{' '}
        {nuevas > 0 ? 'Revísalas en el apartado de abajo.' : 'No hay nuevas incidencias por revisar.'}
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Crear nuevo usuario</h5>
          {mensaje && <div className="alert alert-success">{mensaje}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleCrear}>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={nuevo.username}
                  onChange={handleInputChange}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
              <div className="col-md-4 mb-2">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={nuevo.email}
                  onChange={handleInputChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="col-md-4 mb-2">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={nuevo.password}
                  onChange={handleInputChange}
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-2">Crear usuario</button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <h4>Usuarios registrados</h4>
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Admin</th>
              <th>Activo</th>
              <th>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email || '-'}</td>
                <td>{u.is_superuser ? 'Sí' : 'No'}</td>
                <td>{u.is_active ? 'Sí' : 'No'}</td>
                <td>{new Date(u.date_joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <h4>Gestión de Incidencias</h4>

        {['nueva', 'en_curso', 'cerrada'].map((estado, idx) => (
          <div className="mt-4" key={idx}>
            <h5 className="text-primary">
              {estado === 'nueva' ? 'Nuevas' : estado === 'en_curso' ? 'En curso' : 'Cerradas'}
            </h5>
            {separarPorEstado(estado).map((inc) => (
              <GestionarIncidencia
                key={inc.id}
                incidencia={inc}
                onActualizada={cargarIncidencias}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Administracion;
