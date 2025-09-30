const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Kpi = sequelize.define('Kpi', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  unit: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'kpi',
  timestamps: false // si tu n’as pas de colonnes createdAt/updatedAt
});

module.exports = Kpi;
