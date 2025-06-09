import React, { useState } from 'react';

function Navbar({ usuario, setVista, onLogout }) {
  const [equiposOpen, setEquiposOpen] = useState(false);

  const toggleEquipos = () => setEquiposOpen(!equiposOpen);
  const closeMenu = () => setEquiposOpen(false);

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

                <li className="nav-item">
                  <div className="btn-group">
                    <button className="btn btn-link nav-link dropdown-toggle" onClick={toggleEquipos}>
                      Equipos
                    </button>
                    {equiposOpen && (
                      <div className="dropdown-menu show">
                        <button className="dropdown-item" onClick={() => { setVista('ordenadores'); closeMenu(); }}>Ordenadores</button>
                        <button className="dropdown-item" onClick={() => { setVista('telefonos'); closeMenu(); }}>Teléfonos</button>
                        <button className="dropdown-item" onClick={() => { setVista('impresoras'); closeMenu(); }}>Impresoras</button>
                        <button className="dropdown-item" onClick={() => { setVista('red'); closeMenu(); }}>Equipos de Red</button>
                      </div>
                    )}
                  </div>
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
