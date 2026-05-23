import { TurnosEntity } from "./turno.entity.js";

// GET por business_id
export const getTurnosAll = async () => {
  return await TurnosEntity.findAll();
};

// GET por business_id
export const getTurnos = async (business_id) => {
  return await TurnosEntity.findAll({ where: { business_id: business_id } });
};
// GET FECHA

export const getFecha = async (fecha) => {
  return await TurnosEntity.findAll({
    where: { fecha },
  });
};

export const checkTurnoOcupado = async (fecha, horario, business_id) => {
  return await TurnosEntity.findOne({
    where: { fecha, horario, business_id },
  });
};
// POST
export const postTurno = async (turno) => {
  return await TurnosEntity.create(turno);
};

export const deleteTurno = async (id) => {
  return await TurnosEntity.destroy({ where: { id } });
};
