const { DataTypes } = require("sequelize");
const sequelize = require("../database/postgree");
const User = require("./userModel");

const Note = sequelize.define("note", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// 1:1
Note.belongsTo(User, { foreignKey: "userId" });

(async () => {
  try {
    await Note.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = Note;
