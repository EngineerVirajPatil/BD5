import { DataTypes, sequelize } from "../lib/index.js";

export const department = sequelize.define("department", {
  name: DataTypes.STRING,
});
