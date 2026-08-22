const mysql = require("mysql2");
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();















// [8/19/2026 3:31 PM] 𝕸𝖚𝖍𝖆𝖒𝖒𝖊𝖉: -- 1. USER (no dependencies)
// CREATE TABLE User (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   username VARCHAR(100) NOT NULL UNIQUE,
//   password_hash VARCHAR(255) NOT NULL,
//   role ENUM('admin', 'doctor', 'pharmacist', 'card_officer', 'lab_technician') NOT NULL,
//   full_name VARCHAR(255) NOT NULL,
//   is_active BOOLEAN NOT NULL DEFAULT TRUE,
//   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
// );

// -- 2. PATIENT (no dependencies)
// CREATE TABLE Patient (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   card_number VARCHAR(50) NOT NULL UNIQUE,
//   first_name VARCHAR(100) NOT NULL,
//   last_name VARCHAR(100) NOT NULL,
//   age INT NOT NULL,
//   phone_number VARCHAR(20),
//   address VARCHAR(255),
//   registered_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
// );

// -- 3. MEDICINE (no dependencies)
// CREATE TABLE Medicine (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   category VARCHAR(100),
//   unit VARCHAR(50) NOT NULL,
//   unit_price DECIMAL(10,2) NOT NULL,
//   minimum_stock INT NOT NULL DEFAULT 5,
//   is_active BOOLEAN NOT NULL DEFAULT TRUE
// );

// -- 4. DOCTOR (depends on User)
// CREATE TABLE Doctor (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id INT NOT NULL UNIQUE,
//   first_name VARCHAR(100) NOT NULL,
//   last_name VARCHAR(100) NOT NULL,
//   department ENUM('child', 'adult', 'emergency') NOT NULL,
//   phone_number VARCHAR(20),
//   license_number VARCHAR(100),
//   is_active BOOLEAN NOT NULL DEFAULT TRUE,
//   FOREIGN KEY (user_id) REFERENCES User(id)
// );

// -- 5. STOCK (depends on Medicine)
// CREATE TABLE Stock (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   medicine_id INT NOT NULL,
//   batch_number VARCHAR(100) NOT NULL,
//   quantity INT NOT NULL,
//   expiry_date DATE NOT NULL,
//   received_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   supplier_name VARCHAR(255),
//   FOREIGN KEY (medicine_id) REFERENCES Medicine(id)
// );

// -- 6. VISIT (depends on Patient, Doctor, User)
// CREATE TABLE Visit (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   patient_id INT NOT NULL,
//   doctor_id INT,
//   department ENUM('child', 'adult', 'emergency') NOT NULL,
//   visit_type ENUM('normal', 'emergency') NOT NULL DEFAULT 'normal',
//   status ENUM('registered', 'vitals_done', 'with_doctor', 'lab_pending', 'completed') NOT NULL DEFAULT 'registered',
//   visit_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   created_by INT NOT NULL,
//   FOREIGN KEY (patient_id) REFERENCES Patient(id),
//   FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
//   FOREIGN KEY (created_by) REFERENCES User(id)
// );

// -- 7. VITALS (depends on Visit, one-to-one)
// CREATE TABLE Vitals (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   visit_id INT NOT NULL UNIQUE,
//   weight DECIMAL(5,2) NOT NULL,
//   body_temperature DECIMAL(4,2) NOT NULL,
//   recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (visit_id) REFERENCES Visit(id)
// );

// -- 8. PRESCRIPTION (depends on Visit, Doctor)
// CREATE TABLE Prescription (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   visit_id INT NOT NULL,
//   doctor_id INT NOT NULL,
//   medicine_name VARCHAR(255) NOT NULL,
//   dosage VARCHAR(255) NOT NULL,
//   notes TEXT,
//   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (visit_id) REFERENCES Visit(id),
//   FOREIGN KEY (doctor_id) REFERENCES Doctor(id)
// );

// -- 9. LABREQUEST (depends on Visit, Doctor, User)
// CREATE TABLE LabRequest (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   visit_id INT NOT NULL,
//   doctor_id INT NOT NULL,
//   test_name VARCHAR(255) NOT NULL,
//   status ENUM('requested', 'payment_pending', 'payment_approved', 'in_progress', 'result_ready', 'sent_to_doctor') NOT NULL DEFAULT 'requested',
//   requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   approved_by INT,
//   FOREIGN KEY (visit_id) REFERENCES Visit(id),
//   FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
//   FOREIGN KEY (approved_by) REFERENCES User(id)
// );

// -- 10. LABRESULT (depends on LabRequest, User)
// CREATE TABLE LabResult (
//   id INT AUTO_INCREMENT PRIMARY KEY,lab_request_id INT NOT NULL UNIQUE,
//   result_details TEXT NOT NULL,
//   performed_by INT,
//   result_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   sent_to_doctor_at DATETIME,
//   FOREIGN KEY (lab_request_id) REFERENCES LabRequest(id),
//   FOREIGN KEY (performed_by) REFERENCES User(id)
// );

// -- 11. PAYMENT (depends on Visit, User)
// CREATE TABLE Payment (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   visit_id INT NOT NULL,
//   payment_type ENUM('registration', 'lab') NOT NULL,
//   amount DECIMAL(10,2) NOT NULL,
//   payment_method ENUM('cash', 'telebirr', 'cbe_birr', 'other') NOT NULL,
//   transaction_reference VARCHAR(100),
//   collected_by INT NOT NULL,
//   paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (visit_id) REFERENCES Visit(id),
//   FOREIGN KEY (collected_by) REFERENCES User(id)
// );

// -- 12. PHARMACYSALE (depends on User)
// CREATE TABLE PharmacySale (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   sold_by INT NOT NULL,
//   total_amount DECIMAL(10,2) NOT NULL,
//   payment_method ENUM('cash', 'telebirr', 'cbe_birr', 'other') NOT NULL,
//   transaction_reference VARCHAR(100),
//   sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (sold_by) REFERENCES User(id)
// );

// -- 13. SALEITEM (depends on PharmacySale, Medicine)
// CREATE TABLE SaleItem (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   sale_id INT NOT NULL,
//   medicine_id INT NOT NULL,
//   quantity INT NOT NULL,
//   price_at_sale DECIMAL(10,2) NOT NULL,
//   subtotal DECIMAL(10,2) NOT NULL,
//   FOREIGN KEY (sale_id) REFERENCES PharmacySale(id),
//   FOREIGN KEY (medicine_id) REFERENCES Medicine(id)
// );