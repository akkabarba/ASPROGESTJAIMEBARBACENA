import React, { useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function CrearUsuario() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const token = await refreshTokenIfNeeded();

      const res = await fetch(`${API_BASE}/crear_usuario/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ Usuario creado correctamente');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setMensaje('❌ ' + (data.error || 'Error al crear usuario'));
      }
    } catch {
      setMensaje('❌ Error de conexión con el servidor');
    }

    setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <div className="mt-4">
      <h5>Crear nuevo usuario</h5>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Nombre de usuario:</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Correo electrónico:</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Contraseña:</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
}

export default CrearUsuario;
