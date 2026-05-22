import { Negocio } from "../negocios/negocio.entity.js";

export const helperNegocio = async (nombre) => {
  try {
    const creador = await Negocio.create({ nombre });

    return creador;
  } catch (e) {
    throw new Error("Error al crear el negocio!");
  }
};
