import { DataTypes } from "sequelize";
import { conn } from "../../utils/sequelize.js";

export const configDiasB = conn.define("dias_bloqueados", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
  },
});

configDiasB.sync();
