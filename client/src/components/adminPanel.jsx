import { useEffect, useState } from "react";
import { toast } from "sonner";
import { wrapperFetch } from "../utils/utilsToken";
import { CalendarDays, Settings, Link2, LogOut, Menu, X } from "lucide-react";
/* ───────────────────────── NAV ───────────────────────── */

const NAV_ITEMS = [
  {
    id: "turnos",
    label: "Turnos",
    icon: CalendarDays,
  },
  {
    id: "config",
    label: "Configuración",
    icon: Settings,
  },
  {
    id: "link",
    label: "Turnos disponibles",
    icon: Link2,
  },
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
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <span className="text-sm text-gray-300">Ordenar por:</span>

        <button
          onClick={() => setSortBy("fecha")}
          className={`px-3 py-1 rounded border border-white transition cursor-pointer
        ${
          sortBy === "fecha"
            ? "bg-white text-black"
            : "bg-black text-white hover:bg-white hover:text-black"
        }`}
        >
          Fecha
        </button>

        <span className="sm:ml-auto mt-2 sm:mt-0 text-sm text-gray-300">
          {sortedTurnos.length} {sortedTurnos.length === 1 ? "Turno" : "Turnos"}
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
                className="bg-black border border-white rounded-xl p-4 md:p-5 transition hover:border-white max-w-full"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                  {/* DATOS */}
                  <div className="flex-1 text-center xl:text-left min-w-0 space-y-1">
                    <p className="font-semibold text-white text-base break-words">
                      {t.nombre} {t.apellido}
                    </p>
                    <p className="font-semibold text-white text-base break-words">
                      {t.tel}
                    </p>
                    <p className="font-semibold text-white text-base break-words">
                      {t.email}
                    </p>

                    <p className="text-sm text-gray-300 mt-1">
                      Servicio:
                      <span className="font-medium text-green-400 ml-1 break-words">
                        {servicioEncontrado?.nombre ?? "Sin servicio"}
                      </span>
                    </p>

                    <p className="text-gray-400 text-sm mt-1">{t.fecha}</p>
                  </div>

                  {/* HORA */}
                  <div className="flex justify-center my-2">
                    <span className="bg-black border border-white text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
                      {t.horario}
                    </span>
                  </div>

                  {/* BOTONES */}
                  <div className="flex flex-col sm:flex-row justify-center gap-2 w-full sm:w-auto mt-2">
                    <button className="bg-green-700 text-white h-12 px-4 rounded-lg flex items-center justify-center">
                      <img
                        className="w-6 h-6 object-contain"
                        src="../../icon-wpp.png"
                        alt="WhatsApp"
                      />
                    </button>

                    <button
                      className="bg-red-500 text-white h-12 px-4 rounded-lg"
                      onClick={() => handleDelete(t.id)}
                    >
                      Eliminar
                    </button>
                  </div>
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
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="time"
          value={nuevaHora}
          onChange={(e) => setNuevaHora(e.target.value)}
          className="bg-black border border-white p-3 rounded-lg text-white"
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
                ${h.activo ? "bg-black border-white" : "bg-black border-white opacity-50"}`}
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
    anticipacion_max_dias: 10,
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
  const [servicio, setServicio] = useState({
    nombre: "",
    precio: 0,
  });

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

  const armarServicio = async () => {
    try {
      await wrapperFetch(`servicios`, {
        method: "POST",
        body: JSON.stringify(servicio),
      });
      toast.success("Servicio creado con exito!");
      setServicio({ nombre: "", precio: 0 });
    } catch (e) {
      console.log(e);
      toast.error("Error creando servicio");
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

      <div className="bg-black border border-white rounded-2xl p-4 md:p-6 space-y-8">
        {/* HORARIOS APERTURA/CIERRE */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Crear servicios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">
                Nombre del servicio
              </label>
              <input
                type="text"
                value={servicio.nombre}
                onChange={(e) =>
                  setServicio({ ...servicio, nombre: e.target.value })
                }
                className="w-full mt-1 bg-black border border-white p-3 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">
                Precio del servicio
              </label>
              <input
                type="number"
                value={servicio.precio}
                onChange={(e) =>
                  setServicio({ ...servicio, precio: e.target.value })
                }
                className="w-full mt-1 bg-black border border-white p-3 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
        <button
          onClick={armarServicio}
          className="bg-white py-2 px-2 text-black rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer"
        >
          Crear servicio
        </button>
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
                className="w-full mt-1 bg-black border border-white p-3 rounded-lg text-white"
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
                className="w-full mt-1 bg-black border border-white p-3 rounded-lg text-white"
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
                className="w-full mt-1 bg-black border border-white p-3 rounded-lg text-white"
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
                className="w-full mt-1 bg-black border border-white p-3 rounded-lg text-white"
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
                className="w-full mt-1 bg-black border border-white p-3 rounded-lg text-white"
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
                  ${active ? "bg-green-600 border-green-500 text-white" : "bg-black border-white text-slate-400"}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* HORARIOS DISPONIBLES ← NUEVO */}
        <div className="border-t border-white pt-8">
          <HorariosSection />
        </div>

        {/* DIAS BLOQUEADOS */}
        <div className="border-t border-white pt-8">
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
              className="bg-black border border-white p-3 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Motivo"
              value={nuevoBloqueo.motivo}
              onChange={(e) =>
                setNuevoBloqueo({ ...nuevoBloqueo, motivo: e.target.value })
              }
              className="bg-black border border-white p-3 rounded-lg text-white"
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
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-black border border-white rounded-lg p-3"
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
  const [negocio, setNegocio] = useState({ nombre: "", id: null });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const fetchNegocio = async () => {
    try {
      const data = await wrapperFetch("negocios/mi-negocio");
      setNegocio({ nombre: data.nombre, id: data.id });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNegocio();
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      {/* BOTON MOBILE */}
      {!mobileMenu && (
        <button
          onClick={() => setMobileMenu(true)}
          className="md:hidden fixed top-4 left-4 z-[70] bg-white text-black w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
        >
          <Menu size={20} />
        </button>
      )}

      {/* OVERLAY MOBILE */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed md:relative
        top-0 left-0 h-screen
        bg-black border-r border-white text-white flex flex-col
        transition-all duration-300 z-50

        ${mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}

        ${collapsed ? "md:w-20" : "md:w-64"}
        w-64
      `}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-white flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="font-bold text-xl truncate">
                {negocio.nombre ?? "Mi negocio"}
              </h1>

              <p className="text-slate-500 text-sm">Panel administrador</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-2 rounded-lg hover:bg-zinc-900"
            >
              ☰
            </button>

            <button
              onClick={() => setMobileMenu(false)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 flex flex-col gap-2 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "link") {
                    window.open(
                      `${window.location.origin}/elegirTurnos/${negocio.id}`,
                      "_blank",
                    );
                    return;
                  }

                  setActive(item.id);
                  setMobileMenu(false);
                }}
                className={`
                flex items-center
                ${collapsed ? "md:justify-center" : "gap-3"}
                px-4 py-3 rounded-xl transition

                ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-slate-400 hover:text-white"
                }
              `}
              >
                <item.icon size={20} />

                {(!collapsed || window.innerWidth < 768) && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="mt-auto bg-red-500 hover:bg-red-700 text-white py-3 rounded-xl"
          >
            {collapsed ? (
              <LogOut size={20} className="mx-auto" />
            ) : (
              "Cerrar sesión"
            )}
          </button>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main
        className={`
    flex-1 overflow-auto
    pt-20 md:pt-8
    p-4 md:p-8
    w-full

        ${collapsed ? "md:ml-20" : "md:ml-64"}
      `}
      >
        {active === "turnos" && <TurnosPage />}
        {active === "config" && <ConfigPage />}
      </main>
    </div>
  );
};
