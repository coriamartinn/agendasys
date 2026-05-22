import { Negocio } from "./negocio.entity.js";

// GET
export const getAll = async () => {
  return await Negocio.findAll();
};

// get por id
export const getById = async (id) => {
  return await Negocio.findByPk(id);
};
