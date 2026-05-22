import { Router } from "express";
import { getServicios, crearServicio } from "./servicio.controllers.js";
import { validateDatosServicios } from "../helpers/validaciones.js";
import { midAuthToken } from "../middlewares/middlewareAuth.js";

export const routerServicios = Router();

routerServicios.get("/servicios", getServicios);
routerServicios.post(
  "/servicios",
  validateDatosServicios,
  midAuthToken,
  crearServicio,
);
