var mysql = require("mysql");
var inquirer = require("inquirer");

// Create the connection information for the SQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
});

// Connect to the MySQL server and SQL database
connection.connect(function (err) {
    if (err) throw err;
    // Run the start function after the connection is made to prompt the user
    start();
});

// Initial function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do? ",
            choices: ["View All Employees", "Add Employee", "Remove Employee", "Update Manager", "Exit"]
        })
        .then((data) => {
            // Based on user answer, call the appropriate functions
            switch (data.action) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Manager":
                    updateManager();
                    break;
                default: connection.end();
            }
        });
}

// function to view all employees
function viewEmployees() {
    // Display chart in console.table()
    console.log("");
    connection.query("SELECT employee.id, " +
    "employee.first_name AS FirstName, " +
    "employee.last_name AS LastName, " +
    "title AS Title, " +
    "department_name AS Department, " +
    "salary AS Salary, " +
    "employee.manager_id AS Manager " + 
    "FROM employee " + 
    "LEFT JOIN employee ON employee.manager_id = employee.id " + 
    "INNER JOIN role ON employee.role_id = role.id " + 
    "INNER JOIN department ON role.department_id = department.id ", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}
