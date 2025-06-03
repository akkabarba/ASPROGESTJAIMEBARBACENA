  import { useEffect, useState } from 'react';
  import { refreshTokenIfNeeded } from './utils/auth';
  import Login from './components/Login';
  import Navbar from './components/Navbar';
  import CrearIncidencia from './components/CrearIncidencia';
  import ListadoIncidencias from './components/ListadoIncidencias';
  import Administracion from './components/Administracion';
  import Home from './components/Home';
  import API_BASE from './utils/config';


  function App() {
    const [usuario, setUsuario] = useState(null);
    const [vista, setVista] = useState('crear');

    const cargarUsuario = async () => {
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/whoami/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUsuario(data);
        }
      } catch (err) {
        console.warn('No se pudo cargar sesión automáticamente');
      }
    };

    useEffect(() => {
      cargarUsuario();
    }, []);

    const handleLogout = () => {
      document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setUsuario(null);
    };

    const handleLoginSuccess = (userInfo) => {
      setUsuario(userInfo);
      setVista('home');
    };

    return (
      <div className="container mt-4">
        {!usuario ? (
    <Login onLoginSuccess={handleLoginSuccess} />
  ) : (
    <>
      <Navbar usuario={usuario} setVista={setVista} onLogout={handleLogout} />
      {vista === 'home' && <Home usuario={usuario} setVista={setVista} />}
      {vista === 'crear' && <CrearIncidencia />}
      {vista === 'mis' && <ListadoIncidencias usuario={usuario} />}
      {vista === 'admin' && usuario.is_superuser && <Administracion />}
    </>
  )}

      </div>
    );
  }

  export default App;
