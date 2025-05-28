import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function Home({ usuario, setVista }) {
  const [nuevas, setNuevas] = useState(null);

  useEffect(() => {
    const fetchNuevas = async () => {
      if (!usuario.is_superuser) return;

      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/incidencias/nuevas/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setNuevas(data.nuevas);
      } catch {
        setNuevas(0);
      }
    };

    fetchNuevas();
  }, [usuario]);

  return (
    <div className="text-center mt-5">
      <h2 className="mb-4 text-primary">Bienvenido a ASPROGEST</h2>
      <p className="lead">Hola, <strong>{usuario.username}</strong>.</p>

      {usuario.is_superuser ? (
        <>
          <p className="mt-3">
            {nuevas === 0
              ? 'No hay incidencias nuevas.'
              : `Tienes ${nuevas} incidencia${nuevas > 1 ? 's' : ''} nueva${nuevas > 1 ? 's' : ''}.`}
          </p>
          <button className="btn btn-primary mt-2" onClick={() => setVista('admin')}>
            Revisar incidencias
          </button>
        </>
      ) : (
        <>
          <p className="mt-3">Puedes revisar tus propias incidencias.</p>
          <button className="btn btn-primary mt-2" onClick={() => setVista('mis')}>
            Ver mis incidencias
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
