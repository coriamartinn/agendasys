import { conn } from "../utils/sequelize.js";
import { DataTypes } from "sequelize";

export const Admin = conn.define("Admins", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  business_id: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});

Admin.sync({ alter: true });
