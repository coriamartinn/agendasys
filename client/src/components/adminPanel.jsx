import { useEffect, useState } from "react";
import { wrapperFetch } from "../utils/utilsToken";

/* ───────────────────────── NAV ───────────────────────── */

const NAV_ITEMS = [
  { id: "turnos", label: "Turnos", icon: "📒" },
  { id: "config", label: "configuración", icon: "⚙️" },
];

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
  const [filter, setFilter] = useState("todos");

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
      setError(null);
    } catch (err) {
      setError(err.message);
      setTurnos([]);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleDelete = async (id) => {
    try {
      await wrapperFetch(`turnos/${id}`, { method: "DELETE" });
      setTurnos((prev) => prev.filter((turno) => turno.id !== id));
    } catch (e) {
      console.error("Error al eliminar turno:", e);
    }
  };

  const filtered =
    filter === "todos" ? turnos : turnos.filter((t) => t.status === filter);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm">
        Error: {error}
      </div>
    );

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="ml-auto text-sm text-slate-400">
          {filtered.length} turnos
        </span>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <Empty text="No hay turnos " />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => {
            const servicioEncontrado = servicios.find(
              (s) => s.id === t.servicio_id,
            );
            return (
              <div
                key={t.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:-translate-y-[1px] transition"
              >
                {/* LEFT */}
                <div className="flex flex-col">
                  <p className="font-semibold text-slate-900 text-base">
                    {t.nombre} {t.apellido}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Servicio:{" "}
                    <span className="font-medium text-slate-700">
                      {servicioEncontrado?.nombre ?? "Sin servicio"}
                    </span>
                  </p>
                </div>
                {/* CENTER */}
                <div className="flex flex-col items-center">
                  <span className="bg-slate-900 text-white text-sm px-3 py-1 rounded-lg font-semibold">
                    {t.horario}
                  </span>

                  <span className="text-xs text-slate-400 mt-1">{t.fecha}</span>
                </div>
                {/* CENTER */}
                <div className="flex flex-col items-center">
                  <button
                    class="bg-red-500 text-white px-1.5 rounded-sm hover:bg-red-700 cursor-pointer"
                    onClick={() => handleDelete(t.id)}
                  >
                    eliminar
                  </button>

                  <span className="text-xs text-slate-400 mt-1">{t.fecha}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ───────────────────────── PLACEHOLDER ───────────────────────── */

function Placeholder({ label }) {
  return (
    <div className="flex items-center justify-center min-h-[200px] text-slate-400 text-sm">
      Módulo de {label} próximamente
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
      console.log(data.nombre);
      setNegocio(data.nombre);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNegocio();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-white/10 font-bold">
          {negocio ?? "Mi negocio"}
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
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
            className="mt-auto mx-2 mb-4 bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg transition cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6"></header>

        {/* CONTENT */}
        <section className="p-6">
          {active === "turnos" && <TurnosPage />}
          {active === "configuracion" && <Placeholder label="Configuración" />}
        </section>
      </main>
    </div>
  );
};
