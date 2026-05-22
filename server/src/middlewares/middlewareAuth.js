import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
// autenticacion de campos
export const midAuthCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const midAuthToken = (req, res, next) => {
  try {
    const authorization = req.header("x-auth-token");

    if (!authorization) {
      return res.status(401).json({ msg: "No existe, no fuiste autorizado" });
    }
    const payload = jwt.verify(authorization, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
