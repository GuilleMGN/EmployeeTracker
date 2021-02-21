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
// Menu function displaying all add functions
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
// Menu function displaying all view functions
function viewMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to view? ",
            choices: ["View Departments", "View Roles", "View Employees", "View Employees By Manager", "<= Back"]
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
            case "<= Back":
                mainMenu();
                break;
            default: connection.end();
        }
    });
}
// Menu function displaying all update functions
function updateMenu() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to update? ",
            choices: ["Update Roles", "<= Back"]
        }
    ]).then((data) => {
        // Based on user answer, call the appropriate functions
        switch (data.action) {
            case "Update Roles":
                updateRoles();
                break;
            case "<= Back":
                mainMenu();
                break;
            default: connection.end();
        }
    });
}
// Menu function displaying all delete functions
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
// Validation for string inputs
function validateString(str) {
    if (str !== "") {
        return true;
    }
    return "Invalid entry, try again! "
}
// Validation for integer inputs
function validateInt(int) {
    const pass = int.match(/^-?\d+\.?\d*$/);
    if (pass) {
        return true;
    }
    return "Please enter a valid number! ";
}
// Create array for all departments
let departmentArr = [];
function departments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departmentArr.push(res[i].department_name);
        }
    });
    return departmentArr;
}
// Create array for all roles
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
// Create array for all employees
let employeeArr = [];
function employees() {
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            employeeArr.push(res[i].first_name + " " + res[i].last_name);
        }
    });
    return employeeArr;
}
// Function to view all departments
function viewDepartments() {
    // Display chart in console.table()
    connection.query("SELECT d.id AS ID, " +
        "d.department_name AS Department " +
        "FROM department d").then(res => {
            printTable(res);
            mainMenu();
        });
}
// Function to view all roles
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
// Function to view all employees
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
// Function to view all employees by manager
function viewEmployeesByManager() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "list",
            message: "INSTRUCTIONS: All employees will be shown. Select the name under which employees you want to see from them. \n",
            choices: ["Got it"]
        },
        {
            name: "manager",
            type: "list",
            message: "Which manager's employees do you want to view? ",
            choices: employees()
        }
    ]).then(data => {
        switch (data.confirm) {
            case "Got it":
                break;
            default: connection.end();
        }
        const managerID = employees().indexOf(data.manager) + 1;
        console.log("Showing employees working for " + data.manager + "...");
        connection.query("SELECT employee.id AS ID, " +
            "employee.first_name AS FirstName, " +
            "employee.last_name AS LastName " +
            "FROM employee " +
            "WHERE employee.manager_id = " + managerID).then(res => {
                if (res[0] === undefined) {
                    console.log("There are no employees working for " + data.manager + ".");
                    mainMenu();
                }
                else {
                    printTable(res);
                    mainMenu();
                }
            });
    });
}
// Function to add new department
function addDepartment() {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "What is the name of the new department? ",
        validate: validateString
    }]).then(data => {
        connection.query("INSERT INTO department SET department_name=?", data.department.trim()).then(res => {
            console.log("Successfully added " + data.department.trim());
            departmentArr = [];
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
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title for this role? ",
            validate: validateString
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for the new role? ",
            validate: validateInt
        },
        {
            name: "department",
            type: "list",
            message: "What department is this role assigned to?",
            choices: deptArray
        }
    ]).then(data => {
        connection.query(`INSERT INTO role (title, salary, department_id) 
        VALUES ('${data.title.trim()}', ${data.salary}, ${data.department})`, (err, res) => {
            if (err) throw err;
            console.log("Successfully added " + data.title);
            roleArr = [];
            viewRoles();
        })
    });
}
// Function to add new employee
function addEmployee() {
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "What is the employee's first name? ",
            validate: validateString
        },
        {
            name: "last",
            type: "input",
            message: "What is the employee's last name? ",
            validate: validateString
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
            choices: employees()
        }
    ]).then(data => {
        const roleID = roles().indexOf(data.role) + 1;
        const managerID = employees().indexOf(data.manager) + 1;
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: data.first.trim(),
                last_name: data.last.trim(),
                role_id: roleID,
                manager_id: managerID
            },
            function (err, res) {
                if (err) throw err;
                console.log("Successfullly added " + data.first.trim());
                employeeArr = [];
                viewEmployees();
            });
    })
}
// Function to update role
function updateRoles() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "list",
            message: "INSTRUCTIONS: All roles will be displayed. Select the role you wish to update from the list. \n",
            choices: ["Got it"]
        },
        {
            name: "role",
            type: "list",
            message: "Whiat role do you want to update? ",
            choices: roles()
        }
    ]).then(data => {
        switch (data.confirm) {
            case "Got it":
                break;
            default: connection.end();
        }
        console.log("Updating " + data.role + "...");
        console.log(data.role);
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Enter the title for the updated role: "
            }
        ]).then(updates => {
            connection.query("UPDATE role SET ? WHERE ?",
                [
                    {
                        title: updates.title
                    },
                    {
                        title: data.role
                    }
                ], function (err, res) {
                    if (err) throw err;
                    console.log("Role has been successfully updated");
                    roleArr = [];
                    viewRoles();
                })
        })
    });
}
// Function to delete department
function deleteDepartments() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "list",
            message: "INSTRUCTIONS: All departments will be displayed. Select the department you wish to delete from the list. \n",
            choices: ["Got it"]
        },
        {
            name: "department",
            type: "list",
            message: "Which department would you like to delete? ",
            choices: departments()
        }
    ]).then(data => {
        console.log(data.department);
        connection.query("DELETE FROM department WHERE ?",
            {
                department_name: data.department
            }, function (err, res) {
                if (err) throw err;
                console.log("Successfully deleted " + data.department);
                departmentArr = [];
                viewDepartments();
            });
    });
}
// Function to delete role
function deleteRoles() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "list",
            message: "INSTRUCTIONS: All roles will be displayed. Select the role you wish to delete from the list. \n",
            choices: ["Got it"]
        },
        {
            name: "role",
            type: "list",
            message: "Which role would you like to delete? ",
            choices: roles()
        }
    ]).then(data => {
        connection.query("DELETE FROM role WHERE ?",
            {
                title: data.role
            }, function (err, res) {
                if (err) throw err;
                console.log("Successfully deleted " + data.role);
                roleArr = [];
                viewRoles();
            });
    });
}
// Function to delete emplotee
function deleteEmployees() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "list",
            message: "INSTRUCTIONS: All employees will be displayed. Select the employee you wish to delete from the list. \n",
            choices: ["Got it"]
        },
        {
            name: "employee",
            type: "list",
            message: "Which employee would you like to delete? ",
            choices: employees()
        }
    ]).then(data => {
        let names = data.employee,
            namesArray = names.split(" ");
        connection.query(`DELETE FROM employee WHERE first_name = '${namesArray[0]}' AND last_name = '${namesArray[1]}'`, function (err, res) {
            if (err) throw err;
            console.log("Successfully deleted " + data.employee);
            employeeArr = [];
            viewEmployees();
        });
    });
}