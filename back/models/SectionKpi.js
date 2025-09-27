const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const SectionKpi = sequelize.define('SectionKpi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  section_id: { type: DataTypes.INTEGER, allowNull: false },
  kpi_id: { type: DataTypes.INTEGER, allowNull: false },
  parent_kpi_id: { type: DataTypes.INTEGER }
}, {
  tableName: 'section_kpi',
  timestamps: false
});
module.exports = SectionKpi;
