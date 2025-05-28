import React, { useState } from 'react';
import API_BASE from '../utils/config';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const guardarCookie = (clave, valor) => {
    document.cookie = `${clave}=${valor}; path=/; SameSite=Lax;`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      guardarCookie('access', data.access);
      guardarCookie('refresh', data.refresh);

      // Obtener el usuario actual
      const whoamiRes = await fetch(`${API_BASE}/whoami/`, {
        headers: {
          Authorization: `Bearer ${data.access}`
        }
      });

      if (!whoamiRes.ok) {
        throw new Error('No se pudo obtener el usuario');
      }

      const userInfo = await whoamiRes.json();
      onLoginSuccess(userInfo);
    } catch (err) {
      setError(err.message || 'Error de conexión');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar sesión</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Usuario o correo electrónico</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
