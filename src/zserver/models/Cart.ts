import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config";
import { Product } from "./Product";
import { User } from "./User";

export const CartItem = sequelize.define("CartItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

User.hasMany(CartItem, { foreignKey: "userId", as: "cartItems" });
CartItem.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(CartItem, { foreignKey: "productId", as: "productCartItems" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

// export CartItem;
