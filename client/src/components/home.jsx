import { Link } from "react-router-dom";
import logo from "/tucupo-logo.png";

export const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-3xl p-8 md:p-14 text-center shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-28 w-28 rounded-full border border-white/15 flex items-center justify-center bg-white/[0.03]">
              <img
                src={logo}
                alt="TuCupo"
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            TuCupo{" "}
            <span className="text-sm text-gray-300/60 font-medium">
              By coriadev
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Gestioná los turnos de tu barbería, peluquería o negocio desde un
            solo lugar.
          </p>

          {/* Botones */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-black font-semibold transition hover:scale-105 hover:bg-zinc-200">
                Iniciar sesión
              </button>
            </Link>

            <Link to="/register">
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl border border-white/20 bg-transparent font-semibold transition hover:bg-white hover:text-black hover:scale-105">
                Crear cuenta
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            {[
              "📅 Gestión de turnos",
              "✂️ Barberías",
              "💇 Peluquerías",
              "🏢 Negocios",
            ].map((item) => (
              <div
                key={item}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow decorativo */}
      <div className="absolute top-20 left-20 h-72 w-72 bg-white/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-20 h-72 w-72 bg-white/5 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
};
