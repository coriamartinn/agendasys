import { DataTypes } from "sequelize";
import { conn } from "../utils/sequelize.js";

export const Negocio = conn.define("Negocios", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
  },
});

Negocio.sync({ alter: false });
