import React, { useState } from 'react';

function Navbar({ usuario, setVista, onLogout }) {
  const [showEquipos, setShowEquipos] = useState(false);

  const toggleEquipos = () => {
    setShowEquipos(!showEquipos);
  };

  const handleSelectVista = (vista) => {
    setVista(vista);
    setShowEquipos(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 rounded shadow">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold" style={{ cursor: 'pointer' }} onClick={() => setVista('home')}>
          ASPROGEST
        </span>

        <div className="collapse navbar-collapse">
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
                  <button className="btn btn-link nav-link" onClick={toggleEquipos}>
                    Equipos ▼
                  </button>
                  
                  {}
                  <div className={`dropdown-menu show ${showEquipos ? 'dropdown-fade-in' : 'dropdown-fade-out'}`} 
                       style={{ position: 'absolute', top: '100%', transition: 'opacity 0.3s ease' }}>
                    <button className="dropdown-item" onClick={() => handleSelectVista('ordenadores')}>Ordenadores</button>
                    <button className="dropdown-item" onClick={() => handleSelectVista('telefonos')}>Teléfonos</button>
                    <button className="dropdown-item" onClick={() => handleSelectVista('impresoras')}>Impresoras</button>
                    <button className="dropdown-item" onClick={() => handleSelectVista('red')}>Equipos de Red</button>
                  </div>
                </li>
              </>
            )}
          </ul>

          <span className="navbar-text me-3">Bienvenido, <strong>{usuario.username}</strong></span>
          <button className="btn btn-outline-light" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
