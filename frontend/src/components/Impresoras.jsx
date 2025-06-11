import React, { useEffect, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/auth';
import API_BASE from '../utils/config';

const initialForm = {
  centro: '',
  direccion: '',
  telefono_direccion: '',
  modelo: '',
  numero_serie: '',
  ipv4: ''
};

const CENTROS = [
  'CENTRAL','CPM I','CPM II','RGA III','CPM IV',
  'DISL V','CPM VII','CPM X','ISL XI','ISL XII',
  'ISL XIII','CAL XIV','CPM XV'
];

function Impresoras() {
  const [impresoras, setImpresoras] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const cargarDatos = async () => {
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/impresoras/?page=${pagina}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setImpresoras(data.results);
      setTotalPaginas(Math.ceil(data.count / 5));
    } catch {
      setError('Error al cargar impresoras');
    }
  };

  useEffect(() => { cargarDatos(); }, [pagina]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCrear = async e => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(''); setError('');
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/impresoras/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMensaje('✅ Impresora creada correctamente');
        setTimeout(() => setMensaje(''), 3000);
        setForm(initialForm);
        cargarDatos();
      } else {
        const data = await res.json();
        setError(data.detail || 'Error creando impresora');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  const enterEditMode = () => {
    setForm({ ...seleccionado });
    setEditMode(true);
    setMensaje(''); setError('');
  };

  const handleActualizar = async () => {
    setGuardando(true);
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/impresoras/${seleccionado.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        setSeleccionado(updated);
        setMensaje('✅ Impresora actualizada');
        cargarDatos();
        setEditMode(false);
        setTimeout(() => setMensaje(''), 3000);
      } else {
        const data = await res.json();
        setError(data.detail || 'Error actualizando');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar esta impresora?')) return;
    setEliminando(true);
    try {
      const token = await refreshTokenIfNeeded();
      const res = await fetch(`${API_BASE}/impresoras/${seleccionado.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMensaje('✅ Impresora eliminada');
        setSeleccionado(null);
        cargarDatos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setError('Error eliminando');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Registro de impresoras</h3>
      { mensaje && <div className="alert alert-success">{mensaje}</div> }
      { error   && <div className="alert alert-danger">{error}</div> }

      {!seleccionado ? (
        <>
          <form onSubmit={handleCrear} className="mb-5">
            <div className="row g-2">
              <div className="col-md-4">
                <label>Centro:</label>
                <select
                  name="centro"
                  className="form-select"
                  value={form.centro}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona centro...</option>
                  {CENTROS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label>Dirección:</label>
                <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Teléfono dirección:</label>
                <input name="telefono_direccion" className="form-control" value={form.telefono_direccion} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Modelo:</label>
                <input name="modelo" className="form-control" value={form.modelo} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>Nº de serie:</label>
                <input name="numero_serie" className="form-control" value={form.numero_serie} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label>IPv4:</label>
                <input name="ipv4" className="form-control" value={form.ipv4} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-4" disabled={guardando}>
              {guardando
                ? <span className="spinner-border spinner-border-sm" role="status" />
                : 'Crear impresora'}
            </button>
          </form>

          <h5 className="mb-3">Listado</h5>
          {impresoras.map(imp => (
            <div
              key={imp.id}
              className="card mb-3 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => setSeleccionado(imp)}
            >
              <div className="card-body">
                <h5>{imp.modelo} — {imp.centro}</h5>
                <p>Dirección: {imp.direccion} — IPv4: {imp.ipv4}</p>
              </div>
            </div>
          ))}
          <div className="text-center my-3">
            <button className="btn btn-secondary mx-2" disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
            Página {pagina} de {totalPaginas}
            <button className="btn btn-secondary mx-2" disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
          </div>
        </>
      ) : (
        <>
          <div className="card shadow p-4 mb-3">
            <h4>Detalles de la impresora</h4>
            {Object.entries(seleccionado).map(([key, val]) => (
              <p key={key}><b>{key.replaceAll('_',' ')}</b>: {val?.toString() || '—'}</p>
            ))}
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-primary" onClick={enterEditMode}>Modificar</button>
              <button className="btn btn-danger" disabled={eliminando} onClick={handleEliminar}>
                {eliminando
                  ? <span className="spinner-border spinner-border-sm" role="status" />
                  : 'Eliminar'}
              </button>
              <button className="btn btn-secondary" onClick={() => setSeleccionado(null)}>Volver</button>
            </div>
          </div>

          {editMode && (
            <div className="card shadow p-4">
              <h4>Editar impresora</h4>
              <form onSubmit={e => { e.preventDefault(); handleActualizar(); }} className="mb-3">
                <div className="row g-2">
                  <div className="col-md-4">
                    <label>Centro:</label>
                    <select
                      name="centro"
                      className="form-select"
                      value={form.centro}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona centro...</option>
                      {CENTROS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label>Dirección:</label>
                    <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label>Teléfono dirección:</label>
                    <input name="telefono_direccion" className="form-control" value={form.telefono_direccion} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label>Modelo:</label>
                    <input name="modelo" className="form-control" value={form.modelo} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label>Nº Serie:</label>
                    <input name="numero_serie" className="form-control" value={form.numero_serie} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label>IPv4:</label>
                    <input name="ipv4" className="form-control" value={form.ipv4} onChange={handleChange} />
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={guardando}
                    onClick={handleActualizar}
                  >
                    {guardando
                      ? <span className="spinner-border spinner-border-sm" role="status" />
                      : 'Guardar cambios'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Impresoras;
