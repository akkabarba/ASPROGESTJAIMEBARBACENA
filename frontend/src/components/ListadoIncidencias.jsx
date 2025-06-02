import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function ListadoIncidencias({ usuario }) {
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState('');
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  useEffect(() => {
    const cargarIncidencias = async () => {
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/incidencias/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error de autenticación');
        const data = await res.json();
        setIncidencias(data.results || data);
      } catch {
        setError('No se pudieron cargar las incidencias.');
      }
    };

    cargarIncidencias();
  }, []);

  const renderCamposTipo = (inc) => {
    switch (inc.relativa) {
      case '1':
        return (
          <>
            <strong>IMEI:</strong> {inc.imei} <br />
            <strong>Tipo teléfono:</strong> {inc.tipo_incidencia_telefono}
          </>
        );
      case '2':
        return (
          <>
            <strong>Número serie:</strong> {inc.numero_serie} <br />
            <strong>Sesión:</strong> {inc.sesion} <br />
            <strong>Tipo ordenador:</strong> {inc.tipo_incidencia_ordenador}
          </>
        );
      case '3':
        return (
          <>
            <strong>Tipo internet:</strong> {inc.tipo_incidencia_internet} <br />
            <strong>Inicio:</strong> {inc.fecha_inicio_incidencia}
          </>
        );
      case '4':
        return (
          <>
            <strong>Cuenta GSuite:</strong> {inc.cuenta_gsuite} <br />
            <strong>Tipo GSuite:</strong> {inc.tipo_incidencia_gsuite}
          </>
        );
      case '5':
        return (
          <>
            <strong>Tipo impresora:</strong> {inc.tipo_incidencia_impresora}
          </>
        );
      case '6':
        return (
          <>
            <strong>Trabajador plataforma:</strong> {inc.trabajador_plataforma} <br />
            <strong>Tipo plataforma:</strong> {inc.tipo_incidencia_plataforma}
          </>
        );
      case '7':
        return (
          <>
            <strong>Trabajador:</strong> {inc.trabajador_dispositivo} <br />
            <strong>Modelo:</strong> {inc.modelo_personal}
          </>
        );
      case '8':
        return (
          <>
            <strong>Centro Anide:</strong> {inc.centro_anide} <br />
            <strong>Puesto trabajo:</strong> {inc.puesto_trabajo}
          </>
        );
      default:
        return null;
    }
  };

  const incidenciasPaginadas = incidencias.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="container mt-4">
      <h2>Listado de Incidencias</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {incidenciasPaginadas.map(inc => (
        <div className="card my-3 shadow-sm" key={inc.id}>
          <div className="card-body">
            <h5 className="card-title">{inc.descripcion}</h5>
            <p className="card-text">
              <strong>Centro:</strong> {inc.centro} <br />
              <strong>Fecha:</strong> {inc.fecha_creacion ? new Date(inc.fecha_creacion).toLocaleString() : ''} <br />
              <strong>Urgencia:</strong> {inc.urgencia ? 'Sí' : 'No'} <br />
              <strong>Prioridad:</strong> {inc.prioridad} <br />
              <strong>Estado:</strong> {inc.estado} <br />
              <strong>Teléfono:</strong> {inc.telefono_contacto} <br />
              {renderCamposTipo(inc)}
              {inc.observaciones && (
                <>
                  <br />
                  <strong>Observaciones:</strong> {inc.observaciones}
                </>
              )}
            </p>
          </div>
        </div>
      ))}

      <div className="text-center">
        {Array.from({ length: Math.ceil(incidencias.length / porPagina) }, (_, i) => (
          <button
            key={i}
            className={`btn ${pagina === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
            onClick={() => setPagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ListadoIncidencias;
