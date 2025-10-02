const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KpiData = sequelize.define("KpiData", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  kpi_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  target: DataTypes.FLOAT,
  actual: DataTypes.FLOAT,
  col1: DataTypes.STRING,
  col2: DataTypes.STRING,
  comment: DataTypes.TEXT,
  year: DataTypes.STRING,
  month: DataTypes.STRING,
  unit: DataTypes.STRING
}, {
  tableName: "kpi_data",
  timestamps: false
});

module.exports = KpiData;
