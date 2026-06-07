import { Sequelize } from "sequelize";

const DB_URL = process.env.DB_URL;

export const conn = new Sequelize(DB_URL, {
  dialect: "mysql",
});
