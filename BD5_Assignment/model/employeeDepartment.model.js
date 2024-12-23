import { DataTypes, sequelize } from "../lib/index.js";
import { employee } from "../model/employee.model.js";
import { department } from "../model/department.model.js";

export const employeeDepartment = sequelize.define("employeeDepartment", {
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
      model: department,
      key: "id",
    },
  },
});

employee.belongsToMany(department, { through: employeeDepartment });
department.belongsToMany(employee, { through: employeeDepartment });
