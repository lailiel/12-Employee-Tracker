const inquirer = require("inquirer");
const db = require("./config/connection");
require("console.table");

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee's role",
          "update an employee's manager",
          "view employees by manager",
        ],
      },
    ])
    .then((answers) => {
      console.log(answers);

      switch (answers.action) {
        case "view all departments":
          viewAllDepartments();
          break;
        case "view all roles":
          viewAllRoles();
          break;
        case "view all employees":
          viewAllEmployees();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee's role":
          updateRole();
          break;
        case "update an employee's manager":
          updateManager();
          break;
        case "view employees by manager":
          viewEmployeeByManager();
          break;
      }
    });
}

function viewAllDepartments() {
  console.log("Viewing all departments");
  db.query("SELECT * FROM department;", function (err, results) {
    if (err) console.log(err);
    console.table(results);
    mainMenu();
  });
}

function viewAllRoles() {
  console.log("Viewing all role");
  db.query("SELECT role.id, role.title, role.salary, role.department_id, department.name FROM role INNER JOIN department ON department.id=role.department_id", 
  function (err, results) {
    if (err) console.log(err);
    console.table(results);
    mainMenu();
  });
}

function viewAllEmployees() {
  console.log("Viewing all employees");
  db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager_name FROM employee INNER JOIN role ON role.id=employee.role_id INNER JOIN department ON department.id=role.department_id LEFT JOIN employee AS manager ON manager.id = employee.manager_id", 
  function (err, results) {
    if (err) console.log(err);
    console.table(results);
    mainMenu();
  });
}

function addDepartment() {
  console.log("adding a department");
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO department (name) VALUES (?);",
        [answers.name],
        function (err, results) {
          if (err) console.log(err);
          console.log("Department added!");
          mainMenu();
        }
      );
    });
}

async function addRole() {
  console.log("adding a role");
  const deptsArr = await getDepartments();

  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the role title?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the role salary?",
      },

      {
        type: "list",
        name: "department_id",
        message: "What department does the role belong to?",
        choices: deptsArr,
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);",
        [answers.title, answers.salary, answers.department_id],
        function (err, results) {
          if (err) console.log(err);
          console.log("Role added!");
          mainMenu();
        }
      );
    });
}

async function addEmployee() {
  console.log("adding an employee");
  const arr = await getEmployeeArray();
  const roleArr = await getRoles();
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },

      {
        type: "list",
        name: "role_id",
        message: "What is the employee's role?",
        choices: roleArr,
      },

      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: arr,
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
        [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id,
        ],
        function (err, results) {
          if (err) console.log(err);
          console.log("Employee added!");
          mainMenu();
        }
      );
    });
}

function getRoles() {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, title FROM role", function (err, results) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const roleArray = results.map((row) => {
          return {
            name: row.title,
            value: row.id,
          };
        });
        resolve(roleArray);
      }
    });
  });
}

function getDepartments() {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, name FROM department", function (err, results) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const deptArray = results.map((row) => {
          return {
            name: row.name,
            value: row.id,
          };
        });
        resolve(deptArray);
      }
    });
  });
}

function employeeArrayQuery() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, first_name, last_name FROM employee;",
      function (err, results) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const employeeArray = results.map((row) => {
            return {
              name: row.first_name + " " + row.last_name,
              value: row.id,
            };
          });
          resolve(employeeArray);
        }
      }
    );
  });
}

async function getEmployeeArray() {
  try {
    const employeeArray = await employeeArrayQuery();
    return employeeArray;
  } catch (error) {
    console.error(error);
  }
}

async function updateRole() {
  const arr = await getEmployeeArray();
  const roleArr = await getRoles();
  inquirer
    .prompt([
      {
        type: "list",
        name: "update_employee",
        message: "Which employee's role do you want to update?",
        choices: arr,
      },
      {
        type: "list",
        name: "role_id",
        message: "What is the employee's new role?",
        choices: roleArr,
      },
    ])

    .then((answers) => {
      db.query(
        "UPDATE employee SET role_id = (?) WHERE id = (?);",
        [answers.role_id, answers.update_employee],
        function (err, results) {
          if (err) console.log(err);
          console.log("Role Updated!");
          mainMenu();
        }
      );
    });
}

async function updateManager() {
  const arr = await getEmployeeArray();
  inquirer
    .prompt([
      {
        type: "list",
        name: "update_employee",
        message: "Which employee's manager do you want to update?",
        choices: arr,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: arr,
      },
    ])

    .then((answers) => {
      db.query(
        "UPDATE employee SET manager_id = (?) WHERE id = (?);",
        [answers.manager_id, answers.update_employee],
        function (err, results) {
          if (err) console.log(err);
          console.log("Manager Updated!");
          mainMenu();
        }
      );
    });
}

async function viewEmployeeByManager() {
  const arr = await getEmployeeArray();
  inquirer
    .prompt([
      {
        type: "list",
        name: "manager_id",
        message: "Which manager's employees do you want to view?",
        choices: arr,
      },
    ])
    .then((answers) => {
      db.query(
        "SELECT * FROM employee WHERE manager_id = (?);",
        [answers.manager_id],
        function (err, results) {
          if (err) console.log(err);
          console.table(results);
          console.log("Viewing employees or selected manager");
          mainMenu();
        }
      );
    });
}

mainMenu();
