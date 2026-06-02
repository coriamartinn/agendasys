import {
  getAll,
  updateConfig,
  addDiaBloqueado,
  deleteDiaBloqueado,
  getHorariosDisponibles,
} from "./configs.services.js";
import {
  getHorarios,
  createHorario,
  updateHorario,
  deleteHorario,
} from "./configs.services.js";
// get
export const buscarTodo = async (req, res) => {
  try {
    const { business_id } = req.admin;

    const busquedaBodys = await getAll(business_id);

    res.status(200).send(busquedaBodys);
  } catch (e) {
    res.status(400).send("No se han encontrado!");
  }
};

export const actualizarConfiguracion = async (req, res) => {
  try {
    const { business_id } = req.admin;

    const updated = await updateConfig(business_id, req.body);

    res.status(200).send(updated);
  } catch (e) {
    console.log(e);

    res.status(400).send(e.message);
  }
};

export const agregarDiaBloqueado = async (req, res) => {
  try {
    const { business_id } = req.admin;
    const nuevo = await addDiaBloqueado(business_id, req.body);
    res.status(201).send(nuevo);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
};

export const eliminarDiaBloqueado = async (req, res) => {
  try {
    const { business_id } = req.admin;
    const { id } = req.params;
    const result = await deleteDiaBloqueado(business_id, id);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
};

export const horariosDisponibles = async (req, res) => {
  try {
    const { fecha, business_id = 1 } = req.query;
    if (!fecha) return res.status(400).send("Fecha requerida");

    const horarios = await getHorariosDisponibles(business_id, fecha);
    res.status(200).json(horarios);
  } catch (e) {
    console.error(e);
    res.status(400).send(e.message);
  }
};

export const findHorarios = async (req, res) => {
  try {
    const { business_id } = req.admin;
    const data = await getHorarios(business_id);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const addHorario = async (req, res) => {
  try {
    const { business_id } = req.admin;
    const { hora } = req.body;
    const data = await createHorario(business_id, hora);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const editHorario = async (req, res) => {
  try {
    const { business_id } = req.admin;
    const { id } = req.params;
    const { activo } = req.body;
    const data = await updateHorario(id, business_id, activo);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const removeHorario = async (req, res) => {
  try {
    const { business_id } = req.admin;
    const { id } = req.params;
    const data = await deleteHorario(id, business_id);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).send(e.message);
  }
};
