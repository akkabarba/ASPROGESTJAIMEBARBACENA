import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function ListadoIncidencias({ usuario }) {
  const estados = [
    { clave: 'nueva', titulo: 'Nuevas' },
    { clave: 'en_curso', titulo: 'En curso' },
    { clave: 'cerrada', titulo: 'Cerradas' },
  ];

  const [dataByEstado, setDataByEstado] = useState({
    nueva:    { items: [], page: 1, totalPages: 1, loading: false, error: '' },
    en_curso:{ items: [], page: 1, totalPages: 1, loading: false, error: '' },
    cerrada:  { items: [], page: 1, totalPages: 1, loading: false, error: '' },
  });

  const pageSize = 5; 

  const fetchEstado = async (clave) => {
    setDataByEstado(d => ({
      ...d,
      [clave]: { ...d[clave], loading: true, error: '' }
    }));
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(
        `${API_BASE}/incidencias/?estado=${clave}&page=${dataByEstado[clave].page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Error cargando');
      const json = await res.json();
      const items = json.results ?? [];
      const total = json.count ?? items.length;
      const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;
      setDataByEstado(d => ({
        ...d,
        [clave]: {
          ...d[clave],
          items,
          totalPages,
          loading: false
        }
      }));
    } catch {
      setDataByEstado(d => ({
        ...d,
        [clave]: {
          ...d[clave],
          loading: false,
          error: 'Error al cargar incidencias'
        }
      }));
    }
  };

  useEffect(() => {
    estados.forEach(({ clave }) => fetchEstado(clave));
    
  }, [
    dataByEstado.nueva.page,
    dataByEstado.en_curso.page,
    dataByEstado.cerrada.page
  ]);

  const renderCamposTipo = (inc) => {
    switch (inc.relativa) {
      case '1': return (
        <>
          <strong>IMEI:</strong> {inc.imei}<br />
          <strong>Tipo teléfono:</strong> {inc.tipo_incidencia_telefono}
        </>
      );
      case '2': return (
        <>
          <strong>Nº Serie:</strong> {inc.numero_serie}<br />
          <strong>Sesión:</strong> {inc.sesion}<br />
          <strong>Tipo ordenador:</strong> {inc.tipo_incidencia_ordenador}
        </>
      );
      case '3': return (
        <>
          <strong>Internet:</strong> {inc.tipo_incidencia_internet}<br />
          <strong>Inicio:</strong> {new Date(inc.fecha_inicio_incidencia).toLocaleString()}
        </>
      );
      case '4': return (
        <>
          <strong>Cuenta GSuite:</strong> {inc.cuenta_gsuite}<br />
          <strong>Tipo GSuite:</strong> {inc.tipo_incidencia_gsuite}
        </>
      );
      case '5': return (
        <>
          <strong>Tipo impresora:</strong> {inc.tipo_incidencia_impresora}
        </>
      );
      case '6': return (
        <>
          <strong>Trabajador plataforma:</strong> {inc.trabajador_plataforma}<br />
          <strong>Tipo plataforma:</strong> {inc.tipo_incidencia_plataforma}
        </>
      );
      case '7': return (
        <>
          <strong>Trabajador dispositivo:</strong> {inc.trabajador_dispositivo}<br />
          <strong>Modelo personal:</strong> {inc.modelo_personal}
        </>
      );
      case '8': return (
        <>
          <strong>Centro ANIDE:</strong> {inc.centro_anide}<br />
          <strong>Puesto de trabajo:</strong> {inc.puesto_trabajo}
        </>
      );
      default:
        return null;
    }
  };

  const estadoTexto = (estado) => {
    if (estado === 'nueva')    return 'Nueva';
    if (estado === 'en_curso') return 'En curso';
    if (estado === 'cerrada')  return 'Cerrada';
    return estado;
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Incidencias</h2>

      {estados.map(({ clave, titulo }) => {
        const { items, page, totalPages, loading, error } = dataByEstado[clave];
        const vacio = items.length === 0;

        return (
          <div key={clave} className="mt-4">
            <h4 className="text-primary">{titulo}</h4>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
              <p>Cargando…</p>
            ) : vacio ? (
              <>
                <p className="text-muted">No hay incidencias {titulo.toLowerCase()}.</p>
                <p>Página 0 de 0</p>
              </>
            ) : (
              <>
                {items.map(inc => (
                  <div className="card my-3 shadow-sm" key={inc.id}>
                    <div className="card-body">
                      <h5 className="card-title">{inc.descripcion}</h5>
                      <p className="card-text">
                        <strong>Centro:</strong> {inc.centro}<br />
                        <strong>Fecha:</strong> {new Date(inc.fecha_creacion).toLocaleString()}<br />
                        <strong>Teléfono:</strong> {inc.telefono_contacto}<br />
                        <strong>Prioridad:</strong> {inc.prioridad}<br />
                        <strong>Estado:</strong> {estadoTexto(inc.estado)}<br />
                        {renderCamposTipo(inc)}
                        {inc.observaciones && (
                          <>
                            <br /><strong>Observaciones:</strong> {inc.observaciones}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-secondary"
                    disabled={page <= 1}
                    onClick={() =>
                      setDataByEstado(d => ({
                        ...d,
                        [clave]: { ...d[clave], page: page - 1 }
                      }))
                    }
                  >
                    Anterior
                  </button>

                  <span>Página {page} de {totalPages}</span>

                  <button
                    className="btn btn-secondary"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setDataByEstado(d => ({
                        ...d,
                        [clave]: { ...d[clave], page: page + 1 }
                      }))
                    }
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListadoIncidencias;
