import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

async function apiFetch(ruta, options = {}) {
  if (options.body) {
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }
  const res = await fetch(`${BASE_URL}/${ruta}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-400 rounded-full animate-spin" />
      <span className="text-sm mt-3">Cargando…</span>
    </div>
  );
}

function Steps({ current }) {
  const steps = ["Servicio", "Datos", "Confirmación"];
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = current > idx;
        const active = current === idx;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${done ? "bg-green-500 text-white" : active ? "bg-white text-black" : "bg-slate-800 text-slate-500 border border-slate-700"}`}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={`text-xs ${active ? "text-white" : "text-slate-500"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-12 h-px mb-4 ${done ? "bg-green-500" : "bg-slate-700"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepServicio({ onSelect, negocioId }) {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`servicios/publico/${negocioId}`)
      .then(setServicios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">
        ¿Qué servicio necesitás?
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Elegí uno de nuestros servicios disponibles
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {servicios.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="bg-black border border-white rounded-xl p-5 text-left hover:border-white hover:bg-slate-800 transition-all group cursor-pointer"
          >
            <p className="font-semibold text-white text-base group-hover:text-green-400 transition">
              {s.nombre}
            </p>
            {s.descripcion && (
              <p className="text-slate-400 text-sm mt-1">{s.descripcion}</p>
            )}
            {s.precio && (
              <span className="inline-block mt-3 ml-2 text-xs bg-slate-800 border border-slate-700 text-green-400 px-2 py-1 rounded-lg">
                ${s.precio}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDatos({ servicio, onBack, onConfirm, businessId }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fecha: "",
    tel: "",
    email: "",
  });
  const [horarios, setHorarios] = useState([]);
  const [horarioSel, setHorarioSel] = useState(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [errors, setErrors] = useState({});

  const hoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!form.fecha || form.fecha.length < 10) return;
    const year = parseInt(form.fecha.split("-")[0]);
    if (year < 2000) return;

    setHorarioSel(null);
    setLoadingHorarios(true);
    apiFetch(
      `horarios-disponibles?fecha=${form.fecha}&business_id=${businessId}&servicio_id=${servicio.id}`,
    )
      .then(setHorarios)
      .catch(() => setHorarios([]))
      .finally(() => setLoadingHorarios(false));
  }, [form.fecha, servicio.id, businessId]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.apellido.trim()) e.apellido = "Requerido";
    if (!form.fecha) e.fecha = "Requerido";
    if (!form.tel) {
      e.tel = "Requerido";
    } else if (!/^[0-9]{10,13}$/.test(form.tel.trim())) {
      e.tel = "Numero telefonico incorrecto";
    }
    if (!form.email) {
      e.email = "Requerido";
    } else if (
      !/^[a-z0-9A-Z._-]+@[a-zA-Z]+\.[a-zA-Z]{2,4}$/.test(form.email.trim())
    ) {
      e.email = "Formato de email incorrecto";
    }
    if (!horarioSel) e.horario = "Seleccioná un horario";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    onConfirm({ ...form, horario: horarioSel, servicio });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Completá tus datos</h2>
      <p className="text-slate-400 text-sm mb-6">
        Servicio seleccionado:{" "}
        <span className="text-green-400 font-medium">{servicio.nombre}</span>
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input
              type="text"
              placeholder="Juan"
              value={form.nombre}
              onChange={(e) => {
                setForm({ ...form, nombre: e.target.value });
                setErrors({ ...errors, nombre: null });
              }}
              className={`w-full bg-black border rounded-lg px-3 py-3 text-white text-sm placeholder-slate-600 outline-none transition
                ${errors.nombre ? "border-red-500" : "border-slate-700 focus:border-slate-400"}`}
            />
            {errors.nombre && (
              <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Apellido
            </label>
            <input
              type="text"
              placeholder="Pérez"
              value={form.apellido}
              onChange={(e) => {
                setForm({ ...form, apellido: e.target.value });
                setErrors({ ...errors, apellido: null });
              }}
              className={`w-full bg-black border rounded-lg px-3 py-3 text-white text-sm placeholder-slate-600 outline-none transition
                ${errors.apellido ? "border-red-500" : "border-slate-700 focus:border-slate-400"}`}
            />
            {errors.apellido && (
              <p className="text-red-400 text-xs mt-1">{errors.apellido}</p>
            )}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Número de telefono
          </label>
          <input
            type="tel"
            value={form.tel}
            onChange={(e) => {
              setForm({ ...form, tel: e.target.value });
              setErrors({ ...errors, tel: null });
            }}
            className={`w-full bg-black border rounded-lg px-3 py-3 text-white text-sm outline-none transition
              ${errors.fecha ? "border-red-500" : "border-slate-700 focus:border-slate-400"}`}
          />
          {errors.tel && (
            <p className="text-red-400 text-xs mt-1">{errors.tel}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setErrors({ ...errors, email: null });
            }}
            className={`w-full bg-black border rounded-lg px-3 py-3 text-white text-sm outline-none transition
              ${errors.fecha ? "border-red-500" : "border-slate-700 focus:border-slate-400"}`}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Fecha</label>
          <input
            type="date"
            min={hoy}
            value={form.fecha}
            onChange={(e) => {
              setForm({ ...form, fecha: e.target.value });
              setErrors({ ...errors, fecha: null });
            }}
            className={`w-full bg-black border rounded-lg px-3 py-3 text-white text-sm outline-none transition
              ${errors.fecha ? "border-red-500" : "border-slate-700 focus:border-slate-400"}`}
          />
          {errors.fecha && (
            <p className="text-red-400 text-xs mt-1">{errors.fecha}</p>
          )}
        </div>
        {form.fecha && (
          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Horario disponible
            </label>
            {loadingHorarios ? (
              <Spinner />
            ) : horarios.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">
                No hay horarios disponibles para esta fecha
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {horarios.map((h) => {
                  const hora = typeof h === "string" ? h : h.horario;
                  const ocupado = h.ocupado ?? false;
                  return (
                    <button
                      key={hora}
                      disabled={ocupado}
                      onClick={() => {
                        setHorarioSel(hora);
                        setErrors({ ...errors, horario: null });
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition cursor-pointer
                        ${
                          ocupado
                            ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed line-through"
                            : horarioSel === hora
                              ? "bg-white text-black border-white font-bold"
                              : "bg-slate-900 border-slate-700 text-white hover:border-slate-400"
                        }`}
                    >
                      {hora}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.horario && (
              <p className="text-red-400 text-xs mt-2">{errors.horario}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 border border-slate-700 text-slate-400 py-3 rounded-xl hover:border-slate-500 hover:text-white transition cursor-pointer"
        >
          ← Volver
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-white text-black py-3 rounded-xl font-semibold hover:bg-slate-200 transition cursor-pointer"
        >
          Confirmar turno
        </button>
      </div>
    </div>
  );
}

function StepConfirmacion({ datos, onNuevo, loading }) {
  if (loading) return <Spinner />;
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
        ✓
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">¡Turno confirmado!</h2>
      <p className="text-slate-400 text-sm mb-8">
        Te esperamos en la fecha y horario elegidos
      </p>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 text-left space-y-3 mb-8">
        <Row label="Nombre" value={`${datos.nombre} ${datos.apellido}`} />
        <Row label="Servicio" value={datos.servicio.nombre} accent />
        <Row label="Fecha" value={datos.fecha} />
        <Row label="Horario" value={datos.horario} />
      </div>
      <button
        onClick={onNuevo}
        className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-slate-200 transition cursor-pointer"
      >
        Sacar otro turno
      </button>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-sm">{label}</span>
      <span
        className={`text-sm font-medium ${accent ? "text-green-400" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export const BookingPublic = () => {
  const { negocioId } = useParams();
  const [step, setStep] = useState(1);
  const [servicio, setServicio] = useState(null);
  const [datosFinal, setDatosFinal] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [negocio, setNegocio] = useState(null);

  useEffect(() => {
    apiFetch(`negocios/publico/${negocioId}`)
      .then(setNegocio)
      .catch(console.error);
  }, [negocioId]);

  const handleSelectServicio = (s) => {
    setServicio(s);
    setStep(2);
  };

  const handleConfirm = async (datos) => {
    setConfirmLoading(true);
    setDatosFinal(datos);
    setStep(3);
    try {
      await apiFetch(`turnos/${negocioId}`, {
        method: "POST",
        body: JSON.stringify({
          nombre: datos.nombre,
          apellido: datos.apellido,
          tel: datos.tel,
          email: datos.email,
          fecha: datos.fecha,
          horario: datos.horario,
          servicio_id: datos.servicio.id,
          business_id: negocioId,
        }),
      });
    } catch (e) {
      console.error("Error creando turno:", e);
    } finally {
      setConfirmLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setServicio(null);
    setDatosFinal(null);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {negocio?.nombre ?? "Cargando..."}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Reservá tu turno online</p>
        </div>
        <Steps current={step} />
        <div className="bg-black border border-white rounded-2xl p-6">
          {step === 1 && (
            <StepServicio
              onSelect={handleSelectServicio}
              negocioId={negocioId}
            />
          )}
          {step === 2 && (
            <StepDatos
              servicio={servicio}
              onBack={() => setStep(1)}
              onConfirm={handleConfirm}
              businessId={negocioId}
            />
          )}
          {step === 3 && (
            <StepConfirmacion
              datos={datosFinal}
              onNuevo={reset}
              loading={confirmLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};
