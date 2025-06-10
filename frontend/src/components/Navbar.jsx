import React, { useState } from 'react';
import LogoHome from '../assets/LOGO_ASPROINFA_CASITA-COLOR.png';

function Navbar({ usuario, setVista, onLogout }) {
  const [showEquipos, setShowEquipos] = useState(false);

  const toggleEquipos = () => setShowEquipos(prev => !prev);
  const handleSelectVista = (v) => {
    setVista(v);
    setShowEquipos(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 rounded shadow">
      <div className="container-fluid">
        {}
        <button
          className="navbar-brand btn btn-link p-0 d-flex align-items-center"
          onClick={() => setVista('home')}
        >
          <img
            src={LogoHome}
            alt="Inicio"
            style={{ width: 28, height: 28, marginRight: 8 }}
          />
          ASPROGEST
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={() => setVista('crear')}>
                Crear Incidencia
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={() => setVista('mis')}>
                Mis Incidencias
              </button>
            </li>
            {usuario?.is_superuser && (
              <>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={() => setVista('admin')}>
                    Administración
                  </button>
                </li>
                <li className="nav-item position-relative">
                  <button
                    className="btn btn-link nav-link"
                    onClick={toggleEquipos}
                  >
                    Equipos ▼
                  </button>
                  {showEquipos && (
                    <ul
                      className="dropdown-menu show"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <li>
                        <button className="dropdown-item" onClick={() => handleSelectVista('ordenadores')}>
                          Ordenadores
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleSelectVista('telefonos')}>
                          Teléfonos
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleSelectVista('impresoras')}>
                          Impresoras
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleSelectVista('red')}>
                          Equipos de Red
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            )}
          </ul>

          <span className="navbar-text me-3">
            Bienvenido, <strong>{usuario.username}</strong>
          </span>
          <button className="btn btn-outline-light" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
