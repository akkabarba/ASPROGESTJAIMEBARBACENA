import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function ListadoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/usuarios/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError('Error al cargar usuarios');
      }
    };

    cargarUsuarios();
  }, []);

  return (
    <div className="mt-4">
      <h5>Usuarios registrados</h5>
      {error && <p className="text-danger">{error}</p>}
      {usuarios.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Superadmin</th>
              <th>Activo</th>
              <th>Fecha registro</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.is_superuser ? '✔️' : ''}</td>
                <td>{user.is_active ? '✔️' : '✖️'}</td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListadoUsuarios;
