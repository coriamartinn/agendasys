import { Router } from "express";
import {
  buscarNegocios,
  buscarNegocio,
  getNegocioPublico,
} from "./negocio.controllers.js";
import { midAuthToken } from "../middlewares/middlewareAuth.js";

export const routerNegocios = Router();

routerNegocios.get("/negocios/publico/:id", getNegocioPublico);
routerNegocios.get("/negocios", buscarNegocios);
routerNegocios.get("/negocios/mi-negocio", midAuthToken, buscarNegocio);
