import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

function ListadoIncidencias({ usuario }) {
  const estados = [
    { clave: 'nueva',    titulo: 'Nuevas'   },
    { clave: 'en_curso', titulo: 'En curso' },
    { clave: 'cerrada',  titulo: 'Cerradas'  },
  ];

  const pageSize = 5;

  const [all, setAll] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorAll, setErrorAll] = useState('');

  const [dataByEstado, setDataByEstado] = useState({
    nueva:    { page: 1 },
    en_curso: { page: 1 },
    cerrada:  { page: 1 },
  });

  useEffect(() => {
    const loadAll = async () => {
      setLoadingAll(true);
      try {
        const token = await refreshTokenIfNeeded();
        const res = await fetch(`${API_BASE}/incidencias/?page_size=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        setAll(json.results ?? json);
      } catch {
        setErrorAll('Error al cargar incidencias');
      } finally {
        setLoadingAll(false);
      }
    };
    loadAll();
  }, []);

  const handlePageChange = (clave, newPage) => {
    setDataByEstado(d => ({
      ...d,
      [clave]: { page: newPage }
    }));
  };

  const renderCamposTipo = inc => {
    switch (inc.relativa) {
      case '1': return <>
        <strong>IMEI:</strong> {inc.imei}<br />
        <strong>Tipo teléfono:</strong> {inc.tipo_incidencia_telefono}
      </>;
      case '2': return <>
        <strong>Nº Serie:</strong> {inc.numero_serie}<br />
        <strong>Sesión:</strong> {inc.sesion}<br />
        <strong>Tipo ordenador:</strong> {inc.tipo_incidencia_ordenador}
      </>;
      case '3': return <>
        <strong>Internet:</strong> {inc.tipo_incidencia_internet}<br />
        <strong>Inicio:</strong> {new Date(inc.fecha_inicio_incidencia).toLocaleString()}
      </>;
      case '4': return <>
        <strong>Cuenta GSuite:</strong> {inc.cuenta_gsuite}<br />
        <strong>Tipo GSuite:</strong> {inc.tipo_incidencia_gsuite}
      </>;
      case '5': return <>
        <strong>Tipo impresora:</strong> {inc.tipo_incidencia_impresora}
      </>;
      case '6': return <>
        <strong>Trabajador plataforma:</strong> {inc.trabajador_plataforma}<br />
        <strong>Tipo plataforma:</strong> {inc.tipo_incidencia_plataforma}
      </>;
      case '7': return <>
        <strong>Trabajador dispositivo:</strong> {inc.trabajador_dispositivo}<br />
        <strong>Modelo personal:</strong> {inc.modelo_personal}
      </>;
      case '8': return <>
        <strong>Centro ANIDE:</strong> {inc.centro_anide}<br />
        <strong>Puesto de trabajo:</strong> {inc.puesto_trabajo}
      </>;
      default:
        return null;
    }
  };

  const estadoTexto = estado => {
    if (estado === 'nueva')    return 'Nueva';
    if (estado === 'en_curso') return 'En curso';
    if (estado === 'cerrada')  return 'Cerrada';
    return estado;
  };

  if (loadingAll) return <p>Cargando…</p>;
  if (errorAll)   return <div className="alert alert-danger">{errorAll}</div>;

  return (
    <div className="container mt-4">
      <h2>Listado de Incidencias</h2>

      {estados.map(({ clave, titulo }) => {
        const list       = all.filter(i => i.estado === clave);
        const total      = list.length;
        const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;
        const page       = dataByEstado[clave].page;
        const vacio      = total === 0;
        const items      = list.slice((page - 1) * pageSize, page * pageSize);

        return (
          <div key={clave} className="mt-4">
            <h4 className="text-primary">{titulo}</h4>

            {vacio ? (
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
                    onClick={() => handlePageChange(clave, page - 1)}
                  >Anterior</button>

                  <span>Página {page} de {totalPages}</span>

                  <button
                    className="btn btn-secondary"
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(clave, page + 1)}
                  >Siguiente</button>
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
