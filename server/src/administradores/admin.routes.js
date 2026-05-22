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
  "/auth/adminPanel/register",
  validateDatosAdmin,
  registrarAdmin,
);
routerAdmin.post("/auth/adminPanel/login", logearAdmin);
