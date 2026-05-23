import { Router } from "express";
import { registrarAdmin, logearAdmin } from "./admin.controllers.js";
import { validateDatosAdmin } from "../helpers/validaciones.js";
import { midAuthToken } from "../middlewares/middlewareAuth.js";

export const routerAdmin = Router();

routerAdmin.post(
  "/auth/adminPanel/register",
  validateDatosAdmin,
  registrarAdmin,
);
routerAdmin.post("/auth/adminPanel/login", logearAdmin);
