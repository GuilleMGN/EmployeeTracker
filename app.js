const mysql = require("mysql");
const util = require("util");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");

// Create the connection information for the SQL database
const connection = mysql.createConnection({
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

connection.query = util.promisify(connection.query);

// Initial function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do? ",
            choices: ["View All Employees", "Add Employee", "Remove Employee", "Update Manager", "View Departments", "View Roles", "Create Department", "Add Role", "Exit"]
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
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "Create Department":
                    createDepartment();
                    break;
                case "Add Role":
                    addRoles();
                    break;
                default: connection.end();
            }
        });
}

// function to view all employees
function viewEmployees() {
    // Display chart in console.table()
    connection.query("SELECT * FROM employee").then(res => {
        console.log("\n");
        printTable(res);
        start();
    });
}

function viewDepartments() {
    // Display chart in console.table()
    connection.query("SELECT * FROM department").then(res => {
        console.log("\n");
        printTable(res);
        start();
    });
}

function viewRoles() {
    // Display chart in console.table()
    connection.query("SELECT * FROM role").then(res => {
        console.log("\n");
        printTable(res);
        start();
    });
}

function createDepartment() {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "What is the name of the new department? "
    }]).then(data => {
        connection.query("INSERT INTO department SET department_name=?", data.department).then(res => {
            console.log(res);
            viewDepartments();
        });
    })
}
async function addRoles() {
    const departments = await connection.query("SELECT * FROM department");
    console.log(departments);
    const deptArray = departments.map(({ department_name, id }) => ({
        name: department_name,
        value: id
    }
    ))
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title for this role? "
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for the new role? "
        },
        {
            name: "department",
            type: "list",
            message: "What department is this role assigned to?",
            choices: deptArray
        }
    ]).then(data => {
        console.log(data);
    })
}

// connection.query("SELECT employee.id, " +
// "employee.first_name AS FirstName, " +
// "employee.last_name AS LastName, " +
// "title AS Title, " +
// "department_name AS Department, " +
// "salary AS Salary, " +
// "employee.manager_id AS Manager " + 
// "FROM employee " + 
// "LEFT JOIN employee ON employee.manager_id = employee.id " + 
// "INNER JOIN role ON employee.role_id = role.id " + 
// "INNER JOIN department ON role.department_id = department.id ", (err, res) => {
//     if (err) throw err;
//     console.table(res);