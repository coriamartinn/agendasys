import { body } from "express-validator";
import { midAuthCampos } from "../middlewares/middlewareAuth.js";

export const validateDatosAdmin = [
  body("email").isEmail().normalizeEmail().withMessage("Correo invalido!"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener un minimo de 6 caracteres!"),
  body("nombre")
    .notEmpty()
    .isString()
    .isLength({ min: 6, max: 50 })
    .withMessage("Deben tener un minimo de 6 caracteres y un maximo de 50!"),
  midAuthCampos,
];

export const validateDatosTurnos = [
  body("nombre")
    .notEmpty()
    .isString()
    .isLength({ max: 15 })
    .withMessage("Deben tener un minimo de 5 caracteres y un maximo de 15!"),
  body("apellido")
    .notEmpty()
    .isString()
    .isLength({ max: 15 })
    .withMessage("Deben tener un minimo de 5 caracteres y un maximo de 15!"),
  body("tel")
    .notEmpty()
    .isNumeric()
    .isLength({ min: 11, max: 15 })
    .withMessage("Deben ser un numero telefonico correcto"),
  body("email")
    .notEmpty()
    .isString()
    .withMessage("Deben tener un formato correcto de email"),
  body("horario")
    .notEmpty()
    .matches(/^([01][0-9]|2[0-3]):[0-5][0-9]$/),
  body("fecha").notEmpty().isDate(),
  midAuthCampos,
];
export const validateDatosServicios = [
  body("nombre")
    .notEmpty()
    .isString()
    .isLength({ min: 5, max: 15 })
    .withMessage("Deben tener un minimo de 5 caracteres y un maximo de 15!"),
  body("precio").notEmpty().isFloat().withMessage("El numero no es valido!"),
  midAuthCampos,
];
