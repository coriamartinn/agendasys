import { Sequelize } from "sequelize";

export const conn = new Sequelize(process.env.DB_URL_PROD, {
  dialect: "mysql",
});
