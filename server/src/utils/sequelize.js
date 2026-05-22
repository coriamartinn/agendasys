import { Sequelize } from "sequelize";

const DB_URL =
  process.env.DB_URL || "mysql://root:root@localhost:3306/TURNOS_DB";

export const conn = new Sequelize(DB_URL);
