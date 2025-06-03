import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config";

export const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
  },
});
