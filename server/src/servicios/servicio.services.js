import { ServicioEntity } from "./servicio.entity.js";

// GET TODOS LOS SERVICIOS
export const getAll = async () => {
  return await ServicioEntity.findAll();
};

export const getServForId = async (business_id) => {
  return ServicioEntity.findAll({ where: { business_id } });
};

// POST SERVICIOS
export const createServicio = async (srv) => {
  return await ServicioEntity.create(srv);
};

// delete servicios
