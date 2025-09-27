const Section = require('./section');
const Kpi = require('./kpi');
const SectionKpi = require('./SectionKpi');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mssql'
});
// Association Section → Kpi
Section.belongsToMany(Kpi, {
  through: SectionKpi,
  foreignKey: 'section_id',
  otherKey: 'kpi_id'
});

// Association Kpi → Section
Kpi.belongsToMany(Section, {
  through: SectionKpi,
  foreignKey: 'kpi_id',
  otherKey: 'section_id'
});

module.exports = {
  sequelize, 
  Section,
  Kpi,
  SectionKpi
};
