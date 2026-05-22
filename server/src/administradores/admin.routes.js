import { Router } from "express";
import {
  findTurnos,
  registrarAdmin,
  logearAdmin,
} from "./admin.controllers.js";
import { validateDatosAdmin } from "../helpers/validaciones.js";

export const routerAdmin = Router();

routerAdmin.get("/adminPanel", findTurnos);
routerAdmin.post(
  "/adminPanel/auth/register",
  validateDatosAdmin,
  registrarAdmin,
);
routerAdmin.post("/adminPanel/auth/login", logearAdmin);
