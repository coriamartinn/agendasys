import { DataTypes } from "sequelize";
import { conn } from "../../utils/sequelize.js";

export const ConfigNegocio = conn.define("Configuracion_negocio", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hora_apertura: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_cierre: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  buffer_entre_turnos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  duracion_turno_default: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  anticipacion_max_dias: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
});

ConfigNegocio.sync();
