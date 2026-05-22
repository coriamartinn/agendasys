import express from "express";
import cors from "cors";
import "dotenv/config.js";

import { routerTurnos } from "./turnos/turno.routes.js";
import { routerAdmin } from "./administradores/admin.routes.js";
import { routerServicios } from "./servicios/servicio.routes.js";
import { routerNegocios } from "./negocios/negocio.routes.js";
const app = express();

const PORT = process.env.PORT || 3030;

// CONFIGS
app.use(express.json());

// CONFIG CORS
const corsOptions = {
  origin: process.env.URL_FRONT || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  credentials: true,
};
app.use(cors(corsOptions));

// endpoint turnos
app.use("/api/v1", routerTurnos);

// endpoint servicios
app.use("/api/v1", routerServicios);

// endpoint negocios
app.use("/api/v1", routerNegocios);

// endpoint admin
app.use("/api/v1", routerAdmin);

app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en: http://localhost:${PORT}/api/v1`);
});
