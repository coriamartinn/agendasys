import { ServicioEntity } from "./servicio.entity.js";

// GET TODOS LOS SERVICIOS
export const getAll = async () => {
  return await ServicioEntity.findAll();
};



// POST SERVICIOS
export const createServicio = async (srv) => {
  return await ServicioEntity.create(srv);
};

// delete servicios
