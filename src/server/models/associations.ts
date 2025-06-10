import { User } from './User';
import { UserAddress } from './UserAddress';
import { sequelize } from '../config/database.config';

// Associations
User.hasMany(UserAddress, { foreignKey: 'userId', as: 'addresses' });
UserAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
};

export { User, UserAddress, syncDatabase };
