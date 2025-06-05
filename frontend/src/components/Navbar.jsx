import React from 'react';

function Navbar({ usuario, setVista, onLogout }) {
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

                <li className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle"
                    id="equiposDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Equipos
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="equiposDropdown">
                    <li><button className="dropdown-item" onClick={() => setVista('ordenadores')}>Ordenadores</button></li>
                    <li><button className="dropdown-item" onClick={() => setVista('telefonos')}>Teléfonos</button></li>
                    <li><button className="dropdown-item" onClick={() => setVista('impresoras')}>Impresoras</button></li>
                    <li><button className="dropdown-item" onClick={() => setVista('red')}>Equipos de Red</button></li>
                  </ul>
                </li>
              </>
            )}
          </ul>

          <span className="navbar-text me-3">Bienvenido, <strong>{usuario.username}</strong></span>
          <button className="btn btn-outline-light" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
