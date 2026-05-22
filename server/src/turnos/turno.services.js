import { TurnosEntity } from "./turno.entity.js";

// GET
export const getTurnos = async () => {
  return await TurnosEntity.findAll({
    where: {},
  });
};
// GET FECHA

export const getFecha = async (fecha) => {
  return await TurnosEntity.findAll({
    where: { fecha },
  });
};

export const checkTurnoOcupado = async (fecha, horario, bssId) => {
  return await TurnosEntity.findOne({
    where: { fecha, horario, bssId },
  });
};
// POST
export const postTurno = async (turno) => {
  return await TurnosEntity.create(turno);
};
