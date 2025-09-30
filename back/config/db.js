const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("kpiDB", "admin", "8888", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true,
    },
  },
});

module.exports = sequelize;

