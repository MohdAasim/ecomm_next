import { Dialect, Sequelize } from "sequelize";
import mysql2 from "mysql2";

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT as string),
    dialect: process.env.DB_DIALECT as Dialect,
    dialectModule: mysql2,
    logging: false,
  },
);
