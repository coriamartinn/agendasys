import {
  checkEmailExistente,
  checkPassHash,
  createAdmin,
} from "./admin.services.js";
import { getTurnos } from "../turnos/turno.services.js";
import bcrypt from "bcrypt";
import { helperNegocio } from "../helpers/helperNegocio.js";
import { genJWT } from "../helpers/generadorJWT.js";

export const findTurnos = async (req, res) => {
  try {
    const turnos = await getTurnos();
    res.status(200).send(turnos);
  } catch (e) {
    res.status(400).json({ msj: `Turnos no encontrados!!-> ${e}` });
  }
};

export const registrarAdmin = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    const saltRounds = 12;

    const emailExistente = await checkEmailExistente(email);

    if (emailExistente) {
      return res.status(400).json({
        msg: `El email ya existe, debe usar uno que no este registrado!`,
      });
    }
    const negocio = await helperNegocio(nombre);
    const passHash = await bcrypt.hash(password, saltRounds);

    const buildAdmin = {
      email,
      password: passHash,
      business_id: negocio.id,
    };

    const adminCreado = await createAdmin(buildAdmin);
    res.status(200).json(adminCreado);
  } catch (e) {
    res
      .status(400)
      .json({ msg: `El admin no ha sido posible crearse! -> ${e}` });
  }
};

export const logearAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkAdmin = await checkEmailExistente(email);

    if (!checkAdmin) {
      return res.status(400).json({ msg: `Credenciales Invalidas!` });
    }

    const passHash = checkAdmin.password;
    const passCheck = await bcrypt.compare(password, passHash);

    if (!passCheck) {
      return res.status(400).json({ msg: `Credenciales Invalidas!` });
    }

    const payloadBuild = {
      id: checkAdmin.id,
      email: checkAdmin.email,
      business_id: checkAdmin.business_id,
    };

    const payloadToken = await genJWT(payloadBuild);

    res.status(200).json({ token: payloadToken, msg: `Login exitoso!` });
  } catch (e) {
    res.status(400).json({ msg: `No ha sido posible loguearse! -> ${e}` });
  }
};
