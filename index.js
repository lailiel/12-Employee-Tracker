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
        case "add a employee":
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
        name: "id",
        message: "What is the id of the department?",
      },
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO department (id, name) VALUES (?, ?);",
        [answers.id, answers.name],
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
        name: "id",
        message: "What is the id of the role?",
      },
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
        type: "input",
        name: "department_id",
        message: "What is the role's department ID?",
      },

    ])
    .then((answers) => {
      db.query(
        "INSERT INTO role (id, title, salary, department_id) VALUES (?, ?, ?, ?);",
        [answers.id, answers.title, answers.salary, answers.department_id],
        function (err, results) {
          if (err) console.log(err);
          console.log("Role added!");
          mainMenu();
        }
      );
    });
}


function addEmployee() {
    console.log("adding an employee");
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
          type: "input",
          name: "role_id",
          message: "What is the employee's role ID?",
        },
        {
          type: "input",
          name: "manager_id",
          message: "Who is the employee's manager's ID?",
        },
  
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
          [answers.first_name, answers.last_name, answers.role_id, answers.manager_id],
          function (err, results) {
            if (err) console.log(err);
            console.log("Employee added!");
            mainMenu();
          }
        );
      });
  }

mainMenu();
