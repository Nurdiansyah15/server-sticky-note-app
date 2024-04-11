const { DataTypes } = require("sequelize");
const sequelize = require("../database/postgree");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = User;
