import Sequelize from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
});

export const DataTypes = Sequelize.DataTypes;
export { sequelize };
