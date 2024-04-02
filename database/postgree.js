const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://default:e0myQVxOiXf8@ep-still-tooth-a1g004t1.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require"
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
