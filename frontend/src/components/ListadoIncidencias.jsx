import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function ListadoIncidencias({ usuario }) {
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarIncidencias = async () => {
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/incidencias/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Error de autenticación');
        const data = await res.json();
        setIncidencias(data);
      } catch {
        setError('No se pudieron cargar las incidencias.');
      }
    };

    cargarIncidencias();
  }, []);

  const relativaTexto = (codigo) => {
    const opciones = {
      '1': 'Línea y/o dispositivo telefónico corporativo',
      '2': 'Ordenador',
      '3': 'Internet',
      '4': 'Cuenta Corporativa GSuite',
      '5': 'Impresora',
      '6': 'Plataforma gestion.grupoanide.es',
      '7': 'Dispositivos personales autorizados',
      '8': 'Control de accesos',
      '9': 'Otro',
    };
    return opciones[codigo] || codigo;
  };

  const estadoTexto = (valor) => {
    switch (valor) {
      case 'nueva': return 'Nueva';
      case 'en_curso': return 'En curso';
      case 'cerrada': return 'Cerrada';
      default: return valor;
    }
  };

  const renderGrupo = (titulo, estadoClave) => {
    const grupo = incidencias
      .filter((i) => i.estado === estadoClave)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

    return (
      <div className="mt-4">
        <h3 className="text-primary">{titulo}</h3>
        {grupo.length === 0 ? (
          <p className="text-muted">No hay incidencias {titulo.toLowerCase()}.</p>
        ) : (
          grupo.map((inc) => (
            <div className="card my-3" key={inc.id}>
              <div className="card-body">
                <h5 className="card-title">{inc.descripcion}</h5>
                <p className="card-text">
                  <strong>Centro:</strong> {inc.centro}<br />
                  <strong>Fecha:</strong> {new Date(inc.fecha_creacion).toLocaleString()}<br />
                  <strong>Teléfono:</strong> {inc.telefono_contacto}<br />
                  <strong>Urgencia:</strong> {inc.urgencia ? 'Sí' : 'No'}<br />
                  <strong>Prioridad:</strong> {inc.prioridad}<br />
                  <strong>Relativa a:</strong> {relativaTexto(inc.relativa)}<br />
                  <strong>Estado:</strong> {estadoTexto(inc.estado)}<br />
                  {inc.observaciones && (
                    <>
                      <strong>Observaciones:</strong><br />
                      <em>{inc.observaciones}</em>
                    </>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Listado de Incidencias</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {usuario.is_superuser ? (
        <>
          {renderGrupo('Nuevas', 'nueva')}
          {renderGrupo('En curso', 'en_curso')}
          {renderGrupo('Cerradas', 'cerrada')}
        </>
      ) : (
        incidencias.length > 0
          ? renderGrupo('Tus incidencias', 'nueva')
          : <p className="text-muted mt-3">No tienes incidencias registradas.</p>
      )}
    </div>
  );
}

export default ListadoIncidencias;
