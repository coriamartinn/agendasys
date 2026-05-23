import { conn } from "../utils/sequelize.js";
import { DataTypes } from "sequelize";

export const ServicioEntity = conn.define(
  "Servicio",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
    },
    precio: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: false,
  },
);

ServicioEntity.sync({ alter: false });
