import { useEffect, useState } from "react";
import { toast } from "sonner";
import { wrapperFetch } from "../utils/utilsToken";

/* ───────────────────────── NAV ───────────────────────── */

const NAV_ITEMS = [
  { id: "turnos", label: "Turnos", icon: "📒" },
  { id: "config", label: "Configuración", icon: "⚙️" },
];

/* ───────────────────────── HELPERS ───────────────────────── */

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-400">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      <span className="text-sm mt-2">Cargando…</span>
    </div>
  );
}

function Empty({ text = "Sin resultados" }) {
  return <div className="text-center py-10 text-slate-400 text-sm">{text}</div>;
}

/* ───────────────────────── TURNOS PAGE ───────────────────────── */

export const TurnosPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("fecha");

  const fetchTurnos = async () => {
    try {
      setLoading(true);
      const data = await wrapperFetch("turnos");
      setTurnos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicios = async () => {
    try {
      const data = await wrapperFetch("servicios");
      setServicios(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTurnos();
    fetchServicios();
  }, []);

  const handleDelete = async (id) => {
    try {
      await wrapperFetch(`turnos/${id}`, { method: "DELETE" });
      setTurnos((prev) => prev.filter((turno) => turno.id !== id));
      toast.success("Turno eliminado");
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar turno");
    }
  };

  const sortedTurnos = [...turnos].sort((a, b) => {
    if (sortBy === "fecha") {
      return (
        new Date(`${a.fecha} ${a.horario}`) -
        new Date(`${b.fecha} ${b.horario}`)
      );
    }
    return 0;
  });

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm">
        Error: {error}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-slate-400">Ordenar por:</span>
        <button
          onClick={() => setSortBy("fecha")}
          className={`px-3 py-1 rounded border transition cursor-pointer
          ${sortBy === "fecha" ? "bg-white text-black" : "bg-slate-700 text-white hover:bg-slate-600"}`}
        >
          Fecha
        </button>
        <span className="ml-auto text-sm text-slate-400">
          {sortedTurnos.length} Turnos
        </span>
      </div>

      {sortedTurnos.length === 0 ? (
        <Empty text="No hay turnos" />
      ) : (
        <div className="space-y-3">
          {sortedTurnos.map((t) => {
            const servicioEncontrado = servicios.find(
              (s) => s.id === t.servicio_id,
            );
            return (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-500 transition"
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-white text-base">
                    {t.nombre} {t.apellido}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Servicio:
                    <span className="font-medium text-green-400 ml-1">
                      {servicioEncontrado?.nombre ?? "Sin servicio"}
                    </span>
                  </p>
                  <p className="text-slate-500 text-sm mt-1">{t.fecha}</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="bg-black border border-slate-700 text-white text-md px-4 py-2 rounded-lg font-semibold">
                    {t.horario}
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <button className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition cursor-pointer">
                    <img className="w-6" src="../../icon-wpp.png" />
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition cursor-pointer"
                    onClick={() => handleDelete(t.id)}
                  >
                    eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ───────────────────────── HORARIOS SECTION ───────────────────────── */

function HorariosSection() {
  const [horarios, setHorarios] = useState([]);
  const [nuevaHora, setNuevaHora] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const data = await wrapperFetch("horarios");
      setHorarios(data);
    } catch (e) {
      console.log(e);
      toast.error("Error cargando horarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const handleAdd = async () => {
    if (!nuevaHora) return toast.error("Seleccioná una hora");
    const yaExiste = horarios.some((h) => h.hora === nuevaHora);
    if (yaExiste) return toast.error("Ese horario ya existe");

    try {
      await wrapperFetch("horarios", {
        method: "POST",
        body: JSON.stringify({ hora: nuevaHora }),
      });
      toast.success("Horario agregado");
      setNuevaHora("");
      fetchHorarios();
    } catch (e) {
      console.log(e);
      toast.error("Error agregando horario");
    }
  };

  const handleDelete = async (id) => {
    try {
      await wrapperFetch(`horarios/${id}`, { method: "DELETE" });
      setHorarios((prev) => prev.filter((h) => h.id !== id));
      toast.success("Horario eliminado");
    } catch (e) {
      console.log(e);
      toast.error("Error eliminando horario");
    }
  };

  const handleToggle = async (h) => {
    try {
      await wrapperFetch(`horarios/${h.id}`, {
        method: "PUT",
        body: JSON.stringify({ activo: !h.activo }),
      });
      setHorarios((prev) =>
        prev.map((item) =>
          item.id === h.id ? { ...item, activo: !item.activo } : item,
        ),
      );
    } catch (e) {
      console.log(e);
      toast.error("Error actualizando horario");
    }
  };

  const sortedHorarios = [...horarios].sort((a, b) =>
    a.hora.localeCompare(b.hora),
  );

  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4">
        Horarios disponibles
      </h3>

      {/* AGREGAR */}
      <div className="flex gap-3 mb-4">
        <input
          type="time"
          value={nuevaHora}
          onChange={(e) => setNuevaHora(e.target.value)}
          className="bg-black border border-slate-700 p-3 rounded-lg text-white"
        />
        <button
          onClick={handleAdd}
          className="bg-white text-black px-5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer"
        >
          Agregar
        </button>
      </div>

      {/* LISTA */}
      {loading ? (
        <Spinner />
      ) : sortedHorarios.length === 0 ? (
        <p className="text-slate-500 text-sm">No hay horarios cargados</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sortedHorarios.map((h) => (
            <div
              key={h.id}
              className={`flex items-center gap-2 border rounded-xl px-3 py-2 transition
                ${h.activo ? "bg-slate-800 border-slate-600" : "bg-slate-950 border-slate-800 opacity-50"}`}
            >
              <button
                onClick={() => handleToggle(h)}
                className={`w-2 h-2 rounded-full transition cursor-pointer ${h.activo ? "bg-green-400" : "bg-slate-600"}`}
                title={
                  h.activo
                    ? "Activo — click para desactivar"
                    : "Inactivo — click para activar"
                }
              />
              <span className="text-white text-sm font-medium">{h.hora}</span>
              <button
                onClick={() => handleDelete(h.id)}
                className="text-slate-500 hover:text-red-400 transition cursor-pointer text-xs ml-1"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-slate-600 text-xs mt-3">
        El punto verde indica que el horario está activo. Hacé click para
        activar/desactivar sin eliminar.
      </p>
    </div>
  );
}

/* ───────────────────────── CONFIG PAGE ───────────────────────── */

function ConfigPage() {
  const [loading, setLoading] = useState(false);

  const [config, setConfig] = useState({
    hora_apertura: "08:00",
    hora_cierre: "20:00",
    duracion_turno_default: 60,
    buffer_entre_turnos: 10,
    anticipacion_max_dias: 30,
  });

  const [diasLaborales, setDiasLaborales] = useState({
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: true,
    domingo: false,
  });

  const [diasBloqueados, setDiasBloqueados] = useState([]);
  const [nuevoBloqueo, setNuevoBloqueo] = useState({ fecha: "", motivo: "" });

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await wrapperFetch("configuracion-negocio");
      if (data?.config) setConfig(data.config);
      if (data?.diasLaborales?.length) {
        const diasObj = {};
        data.diasLaborales.forEach((d) => {
          diasObj[d.dia_semana] = d.activo;
        });
        setDiasLaborales(diasObj);
      }
      if (data?.diasBloqueados) setDiasBloqueados(data.diasBloqueados);
    } catch (e) {
      console.log(e);
      toast.error("Error cargando configuración");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      await wrapperFetch("configuracion-negocio", {
        method: "PUT",
        body: JSON.stringify({ config, diasLaborales }),
      });
      toast.success("Configuración guardada");
    } catch (e) {
      console.log(e);
      toast.error("Error al guardar");
    }
  };

  const toggleDay = (day) => {
    setDiasLaborales((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleAddBlockedDay = async () => {
    try {
      if (!nuevoBloqueo.fecha) return toast.error("Seleccioná una fecha");
      await wrapperFetch("dias-bloqueados", {
        method: "POST",
        body: JSON.stringify(nuevoBloqueo),
      });
      toast.success("Día bloqueado agregado");
      setNuevoBloqueo({ fecha: "", motivo: "" });
      fetchConfig();
    } catch (e) {
      console.log(e);
      toast.error("Error agregando bloqueo");
    }
  };

  const handleDeleteBlockedDay = async (id) => {
    try {
      await wrapperFetch(`dias-bloqueados/${id}`, { method: "DELETE" });
      setDiasBloqueados((prev) => prev.filter((d) => d.id !== id));
      toast.success("Día eliminado");
    } catch (e) {
      console.log(e);
      toast.error("Error eliminando");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Configuración del local
        </h2>
        <p className="text-slate-400 mt-1">
          Administrá horarios, reglas y disponibilidad
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-8">
        {/* HORARIOS APERTURA/CIERRE */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Horarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Hora apertura</label>
              <input
                type="time"
                value={config.hora_apertura}
                onChange={(e) =>
                  setConfig({ ...config, hora_apertura: e.target.value })
                }
                className="w-full mt-1 bg-black border border-slate-700 p-3 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Hora cierre</label>
              <input
                type="time"
                value={config.hora_cierre}
                onChange={(e) =>
                  setConfig({ ...config, hora_cierre: e.target.value })
                }
                className="w-full mt-1 bg-black border border-slate-700 p-3 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* REGLAS */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Reglas de turnos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-400">Duración default</label>
              <input
                type="number"
                value={config.duracion_turno_default}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    duracion_turno_default: e.target.value,
                  })
                }
                className="w-full mt-1 bg-black border border-slate-700 p-3 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">
                Buffer entre turnos
              </label>
              <input
                type="number"
                value={config.buffer_entre_turnos}
                onChange={(e) =>
                  setConfig({ ...config, buffer_entre_turnos: e.target.value })
                }
                className="w-full mt-1 bg-black border border-slate-700 p-3 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Máx anticipación</label>
              <input
                type="number"
                value={config.anticipacion_max_dias}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    anticipacion_max_dias: e.target.value,
                  })
                }
                className="w-full mt-1 bg-black border border-slate-700 p-3 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* DIAS LABORALES */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Días laborales
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(diasLaborales).map(([day, active]) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-xl border transition capitalize cursor-pointer
                  ${active ? "bg-green-600 border-green-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* HORARIOS DISPONIBLES ← NUEVO */}
        <div className="border-t border-slate-700 pt-8">
          <HorariosSection />
        </div>

        {/* DIAS BLOQUEADOS */}
        <div className="border-t border-slate-700 pt-8">
          <h3 className="text-white text-lg font-semibold mb-4">
            Días bloqueados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="date"
              value={nuevoBloqueo.fecha}
              onChange={(e) =>
                setNuevoBloqueo({ ...nuevoBloqueo, fecha: e.target.value })
              }
              className="bg-black border border-slate-700 p-3 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Motivo"
              value={nuevoBloqueo.motivo}
              onChange={(e) =>
                setNuevoBloqueo({ ...nuevoBloqueo, motivo: e.target.value })
              }
              className="bg-black border border-slate-700 p-3 rounded-lg text-white"
            />
            <button
              onClick={handleAddBlockedDay}
              className="bg-white text-black rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer"
            >
              Agregar bloqueo
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {diasBloqueados.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay días bloqueados</p>
            ) : (
              diasBloqueados.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between bg-black border border-slate-700 rounded-lg p-3"
                >
                  <div>
                    <p className="text-white">{d.fecha}</p>
                    <p className="text-sm text-slate-400">{d.motivo}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBlockedDay(d.id)}
                    className="bg-red-500 px-3 py-1 rounded-lg text-white hover:bg-red-700 transition cursor-pointer"
                  >
                    eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-slate-200 transition cursor-pointer"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── ADMIN PANEL ───────────────────────── */

export const AdminPanel = () => {
  const [active, setActive] = useState("turnos");
  const [negocio, setNegocio] = useState("");

  const fetchNegocio = async () => {
    try {
      const data = await wrapperFetch("negocios/mi-negocio");
      setNegocio(data.nombre);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNegocio();
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="w-64 bg-slate-950 border-r border-slate-800 text-white flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <h1 className="font-bold text-xl">{negocio ?? "Mi negocio"}</h1>
          <p className="text-slate-500 text-sm mt-1">Panel administrador</p>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer
                ${isActive ? "bg-white text-black font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="mt-auto bg-red-500 hover:bg-red-700 text-white text-sm px-4 py-3 rounded-xl transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {active === "turnos" && <TurnosPage />}
        {active === "config" && <ConfigPage />}
      </main>
    </div>
  );
};
