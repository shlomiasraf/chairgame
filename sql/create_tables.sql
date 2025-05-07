CREATE DATABASE room_manager;
USE room_manager;

CREATE TABLE infrastructure (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supports_tablet BOOLEAN,
    supports_phone_red BOOLEAN,
    supports_phone_blue BOOLEAN,
    supports_pc_red BOOLEAN,
    supports_pc_blue BOOLEAN
);

CREATE TABLE requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    need_tablet BOOLEAN,
    need_phone_red BOOLEAN,
    need_phone_blue BOOLEAN,
    need_pc_red BOOLEAN,
    need_pc_blue BOOLEAN
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(50),
    needs_id INT,  -- קישור לטבלת הדרישות
    FOREIGN KEY (needs_id) REFERENCES requirements(id)
);

CREATE TABLE action_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_by VARCHAR(50),         -- מי ביצע (אפשר גם NULL)
    equipment_column VARCHAR(64),  -- איזה סוג ציוד (העמודה שהוזזה)
    source_slot INT,               -- מספר עמדה מקור
    target_slot INT,               -- מספר עמדה יעד
    description TEXT               -- תיאור חופשי של הפעולה
);

CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_number INT,
    has_tablet BOOLEAN,
    has_phone_red BOOLEAN,
    has_phone_blue BOOLEAN,
    has_pc_red BOOLEAN,
    has_pc_blue BOOLEAN,
    assigned_employee_id INT,
    infra_id INT,
    status_colors SET('red', 'orange', 'green', 'purple') DEFAULT NULL,
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id),
    FOREIGN KEY (infra_id) REFERENCES infrastructure(id)
);
