import React, { useState } from 'react';
import API_BASE from '../utils/config';
import logo from '../assets/LOGO-ASPROINFA_COLOR_Fondo-Tansparente.png';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const guardarCookie = (clave, valor) => {
    document.cookie = `${clave}=${valor}; path=/; SameSite=Lax;`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error('Credenciales inválidas');

      const data = await response.json();
      guardarCookie('access', data.access);
      guardarCookie('refresh', data.refresh);

      const whoamiRes = await fetch(`${API_BASE}/whoami/`, {
        headers: { Authorization: `Bearer ${data.access}` }
      });

      if (!whoamiRes.ok) throw new Error('No se pudo obtener el usuario');

      const userInfo = await whoamiRes.json();
      onLoginSuccess(userInfo);
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="ASPROINFA Logo" style={{ maxWidth: '200px' }} />
        </div>
        <h2 className="h4 text-center mb-3">Bienvenido a ASPROGEST</h2>
        <p className="text-center text-muted mb-4">Inicia sesión para utilizar todas las funciones</p>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="login-username" className="form-label">Usuario o correo electrónico</label>
            <input
              id="login-username"
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="login-password" className="form-label">Contraseña</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              : 'Entrar'
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
