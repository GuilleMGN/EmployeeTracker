DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

SET GLOBAL FOREIGN_KEY_CHECKS=0;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL 
);
 CREATE TABLE role (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(30) NOT NULL,
     salary DECIMAL NOT NULL,
     department_id INT NOT NULL,
     FOREIGN KEY (department_id) REFERENCES department(id)
 );

 CREATE TABLE employee (
     id INT AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL, 
     role_id INT NOT NULL, 
     manager_id INT,
     FOREIGN KEY (role_id) REFERENCES role(id),
     FOREIGN KEY (manager_id) REFERENCES role(id)
 );