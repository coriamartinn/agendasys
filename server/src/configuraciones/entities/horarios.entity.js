import { conn } from "../../utils/sequelize.js";
import { DataTypes } from "sequelize";

export const HorariosEntity = conn.define("Horario", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  business_id: { type: DataTypes.INTEGER, allowNull: false },
  hora: { type: DataTypes.STRING, allowNull: false }, // "09:00"
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
});

HorariosEntity.sync();
