const mysql = require("mysql");
const util = require("util");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
const { listenerCount } = require("events");

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
    console.log("__________________________________________");
    console.log("");
    console.log("  ___        __        __       ___  ___");
    console.log(" |__   |\\/| |__) |    /  \\ \\ / |__  |__ ");
    console.log(" |___  |  | |    |___ \\__/  |  |___ |___");
    console.log("");
    console.log("   ___  __        __        ___  __  ");
    console.log("    |  |__)  /\\  /  ` |__/ |__  |__) ");
    console.log("    |  |  \\ /~~\\ \\__, |  \\ |___ |  \\ ");
    console.log("__________________________________________");
    console.log("");
    console.log("WELCOME! ");
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
            choices: ["Add Department", "Add Role", "Add Employee", "<= Back"]
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
            case "<= Back":
                mainMenu();
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
            choices: ["View Departments", "View Roles", "View Employees", "View Employees By Manager", "View Departments Total Budget", "<= Back"]
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
            case "<= Back":
                mainMenu();
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
            choices: ["Update Roles", "Update Managers", "<= Back"]
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
            case "<= Back":
                mainMenu();
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
            choices: ["Delete Departments", "Delete Roles", "Delete Employees", "<= Back"]
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
            case "<= Back":
                mainMenu();
                break;
            default: connection.end();
        }
    });
}
let roleArr = [];
function roles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
    });
    return roleArr;
}
let managerArr = [];
function managers() {
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name + " " + res[i].last_name);
        }
    });
    return managerArr;
}
// function to view all departments
function viewDepartments() {
    // Display chart in console.table()
    connection.query("SELECT d.id AS ID, " +
        "d.department_name AS Department " +
        "FROM department d").then(res => {
            printTable(res);
            mainMenu();
        });
}
// function to view all employees
function viewEmployees() {
    // Display chart in console.table()
    connection.query("SELECT e.id AS ID, " +
        "e.first_name AS FirstName, " +
        "e.last_name AS LastName, " +
        "r.title AS Title, " +
        "d.department_name AS Department, " +
        "r.salary AS Salary, " +
        "concat(m.first_name, ' ' ,  m.last_name) AS Manager " +
        "FROM employee e " +
        "LEFT JOIN employee m ON e.manager_id = m.id " +
        "INNER JOIN role r ON e.role_id = r.id " +
        "INNER JOIN department d ON r.department_id = d.id " +
        "ORDER BY ID ASC").then(res => {
            printTable(res);
            mainMenu();
        });
}
function viewEmployeesByManager() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "list",
            message: "All employees will be shown. Select under which worker's employees you want to see. ",
            choices: ["OK", "<= Back"]
        },
        {
            name: "manager",
            type: "list",
            message: "Which manager's employees do you want to view? ",
            choices: managers()
        }
    ]).then(data => {
        switch (data.confirm) {
            case "OK":
                break;
            case "<= Back":
                mainMenu();
                break;
            default: connection.end();
        }
        const managerID = managers().indexOf(data.manager) + 1;
        console.log("Showing employees working for " + data.manager + "...");
        connection.query("SELECT employee.id AS ID, " +
            "employee.first_name AS FirstName, " +
            "employee.last_name AS LastName " +
            "FROM employee " +
            "WHERE employee.manager_id = " + managerID).then(res => {
                if (res[1] === undefined) {
                    console.log("There are no employees working for " + data.manager + ".");
                    mainMenu();
                }
                else {
                    printTable(res);
                    mainMenu();
                }
            });
    })
}
// function viewBudget() {
//     connection.query("SELECT d.id AS ID, " +"d.department_name AS Department " + "FROM department d")

//         .then(res => {
//             console.log(res);
//         });
// }
// function to view all roles
function viewRoles() {
    // Display chart in console.table()
    connection.query("SELECT r.id AS ID, " +
        "r.title AS Title, " +
        "r.salary AS Salary, " +
        "d.department_name AS Department " +
        "FROM role r " +
        "INNER JOIN department d ON r.department_id = d.id ").then(res => {
            printTable(res);
            mainMenu();
        });
}
// Function to add new department
function addDepartment() {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "What is the name of the new department? "
    }]).then(data => {
        connection.query("INSERT INTO department SET department_name=?", data.department).then(res => {
            console.log("Success! ");
            viewDepartments();
        });
    })
}
// Function to add new role
async function addRole() {
    const departments = await connection.query("SELECT * FROM department");
    const deptArray = departments.map(({ department_name, id }) => ({
        name: department_name,
        value: id
    }));
    console.log(deptArray);
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
        connection.query(`INSERT INTO role (title, salary, department_id) 
        VALUES ('${data.title}', ${data.salary}, ${data.department})`, (err, res) => {
            if (err) throw err;
            console.log("Success! ");
            viewRoles();
        })
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "What is the employee's first name? "
        },
        {
            name: "last",
            type: "input",
            message: "What is the employee's last name? "
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's role? ",
            choices: roles()
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager? ",
            choices: managers()
        }
    ]).then(data => {
        const roleID = roles().indexOf(data.role) + 1;
        const managerID = managers().indexOf(data.manager) + 1;
        console.log(data.manager);
        console.log(managerID);
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: data.first,
                last_name: data.last,
                role_id: roleID,
                manager_id: managerID
            },
            function (err, res) {
                if (err) throw err;
                console.log("Success! ");
                viewEmployees();
            });
    })
}
function updateRoles() {
    console.log(managers());
    // connection.query();
}
// function updateManagers() {

// }
// function deleteDepartments() {

// }
// function deleteRoles() {

// }
// function deleteEmployees() {

// }