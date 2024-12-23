import { DataTypes, sequelize } from "../lib/index.js";

export const role = sequelize.define("role", {
  title: DataTypes.STRING,
});
