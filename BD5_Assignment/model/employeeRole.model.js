import { DataTypes, sequelize } from "../lib/index.js";
import { employee } from "../model/employee.model.js";
import { role } from "../model/role.model.js";

export const employeeRole = sequelize.define("employeeRole", {
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
      model: employee,
      key: "id",
    },
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: role,
      key: "id",
    },
  },
});

employee.belongsToMany(role, { through: employeeRole });
role.belongsToMany(employee, { through: employeeRole });
