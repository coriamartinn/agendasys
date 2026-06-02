import { Router } from "express";
import { midAuthToken } from "../middlewares/middlewareAuth.js";
import {
  actualizarConfiguracion,
  buscarTodo,
  agregarDiaBloqueado,
  eliminarDiaBloqueado,
  horariosDisponibles,
  getConfigPublico,
} from "./configs.controllers.js";

import {
  findHorarios,
  addHorario,
  editHorario,
  removeHorario,
} from "./configs.controllers.js";

export const routerConfigs = Router();
routerConfigs.get("/horarios-disponibles", horariosDisponibles);
routerConfigs.get(
  "/configuracion-negocio/publico/:negocioId",
  getConfigPublico,
);
routerConfigs.get("/configuracion-negocio", midAuthToken, buscarTodo);
routerConfigs.put(
  "/configuracion-negocio",
  midAuthToken,
  actualizarConfiguracion,
);
routerConfigs.post("/dias-bloqueados", midAuthToken, agregarDiaBloqueado);
routerConfigs.delete(
  "/dias-bloqueados/:id",
  midAuthToken,
  eliminarDiaBloqueado,
);

routerConfigs.get("/horarios", midAuthToken, findHorarios);
routerConfigs.post("/horarios", midAuthToken, addHorario);
routerConfigs.put("/horarios/:id", midAuthToken, editHorario);
routerConfigs.delete("/horarios/:id", midAuthToken, removeHorario);
