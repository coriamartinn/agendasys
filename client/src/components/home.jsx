import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>TuCupo</h1>

      <p>
        Sistema de gestión de turnos para barberías, peluquerías y negocios.
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link to="/login">
          <button>Iniciar sesión</button>
        </Link>

        <Link to="/register">
          <button>Crear cuenta</button>
        </Link>
      </div>
    </div>
  );
};
