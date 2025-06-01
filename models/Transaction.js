import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Game from './Game.js';

const Transaction = sequelize.define('Transaction', {
  id_transaksi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  metode_pembayaran: DataTypes.STRING,
  tanggal_pembelian: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  harga_awal: DataTypes.FLOAT,
  discount: DataTypes.FLOAT,
  harga_discount: DataTypes.FLOAT
});

Transaction.belongsTo(User, { foreignKey: 'id_pembeli' });
Transaction.belongsTo(Game, { foreignKey: 'id_game' });

export default Transaction;