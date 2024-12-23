import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./datbase.sqlite",
});

export const DataTypes = Sequelize.DataTypes;
