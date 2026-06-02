import { DataTypes } from "sequelize";
import { conn } from "../../utils/sequelize.js";

export const configDiasL = conn.define("dias_laborales", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dia_semana: {
    type: DataTypes.STRING,
  },
  activo: {
    type: DataTypes.BOOLEAN,
  },
});

configDiasL.sync();
