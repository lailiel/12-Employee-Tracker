USE employee_tracker;

INSERT INTO department (id, name) VALUES 
(1, "Engineering"), 
(2, "HR"), 
(3, "Sales"), 
(4, "Design"), 
(5, "Management");

INSERT INTO role (id, title, salary, department_id) VALUES 
(1, "Engineer", 100000, 1), 
(2, "HR Assistant", 50000, 2), 
(3, "Salesman", 100000, 3), 
(4, "Design", 80000, 4), 
(5, "Manager", 100000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES 
(1, "Sage", "Livick", 5, null), 
(2, "Andrew", "Johnson", 1, 1), 
(3, "Sandra", "Baner", 2, 1), 
(4, "Barbara", "Miller", 3, 1), 
(5, "Kathrine", "Ringger", 4, 1);