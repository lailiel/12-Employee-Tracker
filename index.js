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
        case "add a department":
          addDepartment();
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

mainMenu();
