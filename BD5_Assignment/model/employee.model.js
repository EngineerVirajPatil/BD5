import { DataTypes, sequelize } from "../lib/index.js";

export const employee = sequelize.define("employee", {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});
