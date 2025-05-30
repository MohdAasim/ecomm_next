import { Dialect, Sequelize } from "sequelize";
import mysql2 from "mysql2";

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: process.env.DB_DIALECT as Dialect,
    dialectModule: mysql2,
    logging: false,
  },
);

/**
 * Syncs all defined models to the DB.
 * Call this once at app startup to ensure tables exist.
 */
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // alter:true updates tables to match models
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Database synchronization failed:", error);
    throw error;
  }
};
