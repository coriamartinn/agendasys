import {
  checkTurnoOcupado,
  deleteTurno,
  getFecha,
  getTurnos,
  getTurnosAll,
  postTurno,
} from "./turno.services.js";
import { ServicioEntity } from "../servicios/servicio.entity.js";
import { helperNegocio } from "../helpers/helperNegocio.js";

//GET
export const findTurnosAll = async (req, res) => {
  let turnos;
  if (req.query.fecha) {
    turnos = await getFecha(req.query.fecha);
  } else {
    turnos = await getTurnosAll();
  }
  res.send(turnos);
};
//GET por id de negocio
export const findTurnos = async (req, res) => {
  const { business_id } = req.admin;
  const turnos = await getTurnos(business_id);
  res.send(turnos);
};
// POST
export const createTurno = async (req, res) => {
  try {
    const { business_id } = req.params;
    const { nombre, apellido, horario, servicio_id, fecha } = req.body;

    const servicio = await ServicioEntity.findByPk(servicio_id);
    if (!servicio)
      return res
        .status(400)
        .json({ msg: "El id del servicio no se pudo encontrar!" });

    if (Number(business_id) !== servicio.business_id) {
      return res.status(400).json({ msg: "Los id de servicio no coinciden!" });
    }
    const horarioOcupado = await checkTurnoOcupado(fecha, horario, business_id);
    if (horarioOcupado) {
      return res.status(400).json({ msg: "El horario esta ocupado!" });
    }

    const turnoBuild = {
      nombre,
      apellido,
      horario,
      servicio_id,
      business_id,
      fecha,
    };

    const turno = await postTurno(turnoBuild);

    res.status(200).send(turno);
  } catch (e) {
    res
      .status(400)
      .json({ msj: `Ha ocurrido un error y no se pudo crear! -> ${e}` });
  }
};

export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTr = deleteTurno(id);

    res.status(200).json({ msg: `Turno eliminado con exito!` });
  } catch (e) {
    res
      .status(401)
      .json({ msg: `no ha sido posible eliminar el turno -> ${e}` });
  }
};
