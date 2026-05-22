import { Router } from "express";
import { createTurno, findTurnos } from "./turno.controllers.js";
import { validateDatosTurnos } from "../helpers/validaciones.js";

export const routerTurnos = Router();

routerTurnos.get("/turnos", findTurnos);
routerTurnos.post("/turnos/:business_id", validateDatosTurnos, createTurno);
