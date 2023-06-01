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
          "update an employee role",
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
        case "update an employee role":
          updateRole();
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
  db.query("SELECT * FROM role;", function (err, results) {
    if (err) console.log(err);
    console.table(results);
    mainMenu();
  });
}

function viewAllEmployees() {
  console.log("Viewing all employees");
  db.query("SELECT * FROM employee;", function (err, results) {
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

function addRole() {
  console.log("adding a role");
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
      // ------------------update to list of departments vs id number- connect department name to department ID number
      {
        type: "input",
        name: "department_id",
        message: "What is the role's department ID?",
      },
      // --------------------------
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
      // --------------Need to connect role to role ID and create list of available roles- connect role to role id
      {
        type: "input",
        name: "role_id",
        message: "What is the employee's role ID?",
      },
      // --------------------------------
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: arr,
      },
    ])
    // ------------Need to connect managers name to employee ID, reference a reference.
    // .then((answers) => {
    //   const newArr = answers.manager_id.split(" ");
    //   const managerID = ""
    //   db.query(
    //     "SELECT id FROM employee WHERE first_name = (?) AND last_name = (?);"
    //     [ answers.newArr[0], answers.newArr[1]]
    //   )
    //   return manager_id = results
    // })
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

function employeeArrayQuery() {
  const employeeNames = [];
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT concat(first_name, ' ', last_name)as name FROM employee;",
      function (err, results) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
          employeeNames.push(results);
          return employeeNames;
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

  inquirer
    .prompt([
      {
        type: "list",
        name: "update_employee",
        message: "Which employee's role do you want to update?",
        choices: arr,
      },
      // -----update this so the department names populate vs entering an ID number
      {
        type: "input",
        name: "role_id",
        message: "What is the id of the new role?",
      },
    ])

    .then((answers) => {
      const newArr = answers.update_employee.split(" ");

      db.query(
        "UPDATE employee SET role_id = (?) WHERE first_name = (?) AND last_name = (?);",
        [answers.role_id, newArr[0], newArr[1]],
        function (err, results) {
          if (err) console.log(err);
          console.log("Role Updated!");
          mainMenu();
        }
      );
    });
}



mainMenu();
