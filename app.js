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
    // Run the main menu function after the connection is made to prompt the user
    mainMenu();
});

connection.query = util.promisify(connection.query);

// Initial function which prompts the user for what action they should take
function mainMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do? ",
            choices: ["Add", "View", "Update", "Delete", "Exit"]
        }
    ]).then((data) => {
        // Based on user answer, call the appropriate functions
        switch (data.action) {
            case "Add":
                addMenu();
                break;
            case "View":
                viewMenu();
                break;
            case "Update":
                updateMenu();
                break;
            case "Delete":
                deleteMenu();
                break;
            default: connection.end();
        }
    });
}

function addMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to add? ",
            choices: ["Add Department", "Add Role", "Add Employee"]
        }
    ]).then((data) => {
        // Based on user answer, call the appropriate functions
        switch (data.action) {
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            default: connection.end();
        }
    });
}

function viewMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to view? ",
            choices: ["View Departments", "View Roles", "View Employees"]
        }
    ]).then((data) => {
        // Based on user answer, call the appropriate functions
        switch (data.action) {
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "View Employees By Manager":
                viewEmployeesByManager();
                break;
            case "View Departments Total Budget":
                viewBudget();
                break;
            default: connection.end();
        }
    });
}

function updateMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to update? ",
            choices: ["Update Roles", "Update Managers"]
        }
    ]).then((data) => {
        // Based on user answer, call the appropriate functions
        switch (data.action) {
            case "Update Roles":
                updateRoles();
                break;
            case "Update Managers":
                updateManagers();
                break;
            default: connection.end();
        }
    });
}

function deleteMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to delete? ",
            choices: ["Delete Departments", "Delete Roles", "Delete Employees"]
        }
    ]).then((data) => {
        // Based on user answer, call the appropriate functions
        switch (data.action) {
            case "Delete Departments":
                deleteDepartments();
                break;
            case "Delete Roles":
                deleteRoles();
                break;
            case "Delete Employees":
                deleteEmployees();
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
        mainMenu();
    });
}

function viewDepartments() {
    // Display chart in console.table()
    connection.query("SELECT * FROM department").then(res => {
        console.log("\n");
        printTable(res);
        mainMenu();
    });
}

function viewRoles() {
    // Display chart in console.table()
    connection.query("SELECT * FROM role").then(res => {
        console.log("\n");
        printTable(res);
        mainMenu();
    });
}

function addDepartment() {
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
async function addRole() {
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