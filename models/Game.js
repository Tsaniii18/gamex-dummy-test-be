import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gambar: DataTypes.STRING,
  harga: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  tag: DataTypes.STRING,
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
    min: 0,
    max: 100
  }
  },
  deskripsi: DataTypes.TEXT
});

Game.belongsTo(User, { foreignKey: 'uploader_id' });
User.hasMany(Game, { foreignKey: 'uploader_id' });

export default Game;