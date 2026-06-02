import { Router } from "express";
import {
  getServicios,
  crearServicio,
  getServiciosPublico,
} from "./servicio.controllers.js";
import { validateDatosServicios } from "../helpers/validaciones.js";
import { midAuthToken } from "../middlewares/middlewareAuth.js";

export const routerServicios = Router();

routerServicios.get("/servicios/publico/:business_id", getServiciosPublico);
routerServicios.get("/servicios", getServicios);
routerServicios.post(
  "/servicios",
  validateDatosServicios,
  midAuthToken,
  crearServicio,
);
