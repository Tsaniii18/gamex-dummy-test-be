import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Game from './Game.js';

const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  waktu_ditambah: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('terinstall', 'belum'),
    defaultValue: 'belum'
  }
});

Gallery.belongsTo(User, { foreignKey: 'user_id' });
Gallery.belongsTo(Game, { foreignKey: 'game_id' });

export default Gallery;