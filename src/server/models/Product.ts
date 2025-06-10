import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Product = sequelize.define(
  'Product',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image_url: DataTypes.STRING,
    category: DataTypes.STRING,
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['name'] }, // Index for faster search by name
      { fields: ['category'] }, // Index for filtering by category
      { fields: ['price'] }, // Index for sorting/filtering by price
    ],
  }
);
