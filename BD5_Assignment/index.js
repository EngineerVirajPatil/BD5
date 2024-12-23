import express from "express";
const app = express();
import { sequelize } from "./lib/index.js";
import { Op } from "@sequelize/core";
import { employee } from "./model/employee.model.js";
import { department } from "./model/department.model.js";
import { role } from "./model/role.model.js";
import { employeeDepartment } from "./model/employeeDepartment.model.js";
import { employeeRole } from "./model/employeeRole.model.js";

app.use(express.json());

app.get("/seed_db", async (req, res) => {
  await sequelize.sync({ force: true });

  const employees = await employee.bulkCreate([
    { name: "Rahul Sharma", email: "rahul.sharma@example.com" },
    { name: "Priya Singh", email: "priya.singh@example.com" },
    { name: "Ankit Verma", email: "ankit.verma@example.com" },
  ]);

  const departments = await department.bulkCreate([
    { name: "Engineering" },
    { name: "Marketing" },
  ]);

  const roles = await role.bulkCreate([
    { title: "Software Engineer" },
    { title: "Marketing Specialist" },
    { title: "Product Manager" },
  ]);

  await employeeDepartment.create({
    employeeId: employees[0].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[0].id,
    roleId: roles[0].id,
  });

  await employeeDepartment.create({
    employeeId: employees[1].id,
    departmentId: departments[1].id,
  });
  await employeeRole.create({
    employeeId: employees[1].id,
    roleId: roles[1].id,
  });

  await employeeDepartment.create({
    employeeId: employees[2].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[2].id,
    roleId: roles[2].id,
  });

  return res.json({ message: "Database seeded!" });
});

async function getEmployeeDepartments(employeeId) {
  const employeeDepartments = await employeeDepartment.findAll({
    where: { employeeId },
  });

  let departmentData;
  for (let empDep of employeeDepartments) {
    departmentData = await department.findOne({
      where: { id: empDep.departmentId },
    });
  }

  return departmentData;
}

async function getEmployeeRoles(employeeId) {
  const employeeRoles = await employeeRole.findAll({
    where: { employeeId },
  });

  let roleData;
  for (let empRole of employeeRoles) {
    roleData = await role.findOne({
      where: { id: empRole.roleId },
    });
  }

  return roleData;
}

async function getEmployeeDetails(employeeData) {
  const department = await getEmployeeDepartments(employeeData.id);
  const role = await getEmployeeRoles(employeeData.id);

  return {
    ...employeeData.dataValues,
    department,
    role,
  };
}

async function fetchAllEmployees() {
  const employees = await employee.findAll();
  const employeeData = [];

  for (let employee of employees) {
    employeeData.push(await getEmployeeDetails(employee));
  }

  return employeeData;
}

function fetchEmployeeById(employees, id) {
  for (let employee of employees) {
    if (employee.id === id) {
      return employee;
    }
  }
  return {};
}

function fetchEmployeeByDepartmentId(employees, id) {
  for (let employee of employees) {
    if (employee.department.id === id) {
      return employee;
    }
  }
  return {};
}

function fetchEmployeeByRoleId(employees, id) {
  for (let employee of employees) {
    if (employee.role.id === id) {
      return employee;
    }
  }
  return {};
}

async function sortEmployeeByName(order) {
  let employees = await employee.findAll({ order: [["name", order]] });
  const employeeData = [];

  for (let employee of employees) {
    employeeData.push(await getEmployeeDetails(employee));
  }
  return employeeData;
}

async function createEmployee(newEmployee) {
  const createdEmployee = await employee.create({
    name: newEmployee.name,
    email: newEmployee.email,
  });

  await employeeDepartment.create({
    employeeId: createdEmployee.id,
    departmentId: newEmployee.departmentId,
  });

  await employeeRole.create({
    employeeId: createdEmployee.id,
    roleId: newEmployee.roleId,
  });

  return createdEmployee;
}

async function updateEmployeeById(newData, id) {
  let foundEmployee = await employee.findOne({ where: { id } });
  if (foundEmployee) {
    if (newData.name) {
      foundEmployee.name = newData.name;
    }
    if (newData.email) {
      foundEmployee.email = newData.email;
    }
    await foundEmployee.save();
    if (newData.departmentId) {
      await employeeDepartment.destroy({
        where: {
          employeeId: foundEmployee.id,
        },
      });
      await employeeDepartment.create({
        employeeId: parseInt(foundEmployee.id),
        departmentId: newData.departmentId,
      });
    }

    if (newData.roleId) {
      await employeeRole.destroy({
        where: {
          employeeId: parseInt(foundEmployee.id),
        },
      });
      employeeRole.create({
        employeeId: foundEmployee.id,
        roleId: newData.roleId,
      });
    }
  }
  return foundEmployee;
}

async function deleteEmployeeById(id) {
  let foundEmployee = await employee.findOne({ where: { id } });
  if (foundEmployee) {
    await foundEmployee.destroy();
  }
  return foundEmployee;
}

app.get("/employees", async (req, res) => {
  try {
    let result = await fetchAllEmployees();
    res.status(200).json({ employee: result });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

// employees/details/2
app.get("/employees/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let allEmployees = await fetchAllEmployees();
    let result = fetchEmployeeById(allEmployees, id);
    res.status(200).json({ employee: result });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

// employees/department/1
app.get("/employees/department/:departmentId", async (req, res) => {
  try {
    let id = parseInt(req.params.departmentId);
    let allEmployees = await fetchAllEmployees();
    let result = fetchEmployeeByDepartmentId(allEmployees, id);
    res.status(200).json({ employee: result });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

// employees/role/2
app.get("/employees/role/:roleId", async (req, res) => {
  try {
    let id = parseInt(req.params.roleId);
    let allEmployees = await fetchAllEmployees();
    let result = fetchEmployeeByRoleId(allEmployees, id);
    res.status(200).json({ employee: result });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

// employees/sort-by-name?order=ASC
app.get("/employees/sort-by-name", async (req, res) => {
  try {
    let order = req.query.order;
    let allEmployees = await fetchAllEmployees();
    let result = await sortEmployeeByName(order);
    res.status(200).json({ employee: result });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});
/*
{
    "newEmployee":{
  "name": "Karan Mehta",
  "email": "karan.mehta@example.com",
  "departmentId": 1,
  "roleId": 1
}   
}
*/
app.post("/employees/new", async (req, res) => {
  try {
    let newEmployee = req.body.newEmployee;
    let createdEmployee = await createEmployee(newEmployee);
    let result = await getEmployeeDetails(createdEmployee);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in Creating Data",
      error: error.message,
    });
  }
});

/* 

{
  "email": "karan.m@example.com"
}

*/
// employees/update/4
app.post("/employees/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newData = req.body.newEmployee;
    let result = await updateEmployeeById(newData, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in Updating Data",
      error: error.message,
    });
  }
});

// employees/delete/4
app.post("/employees/delete/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await deleteEmployeeById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in Deleting Data",
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Express server initialized");
});
