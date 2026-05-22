import { ServicioEntity } from "../servicios/servicio.entity.js";
import { conn } from "../utils/sequelize.js";
import { DataTypes } from "sequelize";

export const TurnosEntity = conn.define(
  "Turnos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
    },
    apellido: {
      type: DataTypes.STRING,
    },
    horario: {
      type: DataTypes.TIME,
    },
    servicio_id: {
      type: DataTypes.INTEGER,
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    timestamps: false,
  },
);

TurnosEntity.belongsTo(ServicioEntity, { foreignKey: "servicio_id" });

// sincrinizacion

TurnosEntity.sync({ alter: false });
