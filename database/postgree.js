const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGREE_CONN);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
