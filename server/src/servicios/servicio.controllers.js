import { getAll, createServicio } from "./servicio.services.js";

// get controlador
export const getServicios = async (req, res) => {
  try {
    const dataServicio = req.body;

    const servicio = await getAll();

    res.send(servicio);
  } catch (e) {
    res.status(400).json({ msg: `No se pudo obtener los servicios -> ${e}` });
  }
};

// post controlador
export const crearServicio = async (req, res) => {
  try {
    const { business_id } = req.params;
    const { nombre, precio } = req.body;

    const buildServicio = {
      business_id,
      nombre,
      precio,
    };
    const servicio = await createServicio(buildServicio);

    res.send(servicio);
  } catch (e) {
    res.status(400).json({ msg: `No se pudo crear el servicio! -> ${e}` });
  }
};
