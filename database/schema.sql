CREATE DATABASE IF NOT EXISTS faculty_analyzer;
USE faculty_analyzer;

CREATE TABLE IF NOT EXISTS Departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  hod_user_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'hod', 'faculty', 'student') NOT NULL,
  department_id INT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES Departments(department_id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Faculty (
  faculty_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department_id INT NOT NULL,
  qualification VARCHAR(120) NOT NULL,
  years_of_experience INT NOT NULL,
  subjects_handled INT NOT NULL,
  course_difficulty_score DECIMAL(4,2) DEFAULT 3.00,
  joined_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (department_id) REFERENCES Departments(department_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  roll_no VARCHAR(50) UNIQUE,
  semester INT,
  program VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Subjects (
  subject_id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(120) NOT NULL,
  department_id INT NOT NULL,
  credits INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES Departments(department_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Feedback (
  feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  faculty_id INT NOT NULL,
  subject_id INT NOT NULL,
  rating_teaching TINYINT NOT NULL,
  rating_knowledge TINYINT NOT NULL,
  rating_interaction TINYINT NOT NULL,
  rating_communication TINYINT NOT NULL,
  comments VARCHAR(255),
  semester VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Attendance (
  attendance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  semester VARCHAR(30) NOT NULL,
  attendance_percentage DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ResearchPublications (
  publication_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  publication_type ENUM('journal', 'conference', 'book_chapter', 'patent') DEFAULT 'journal',
  citation_count INT DEFAULT 0,
  impact_factor DECIMAL(4,2) DEFAULT 0,
  published_year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS MLScores (
  score_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  risk_level ENUM('low', 'medium', 'high') DEFAULT 'low',
  promotion_eligible TINYINT(1) DEFAULT 0,
  model_version VARCHAR(50) DEFAULT 'xgb-v1',
  predicted_for_semester VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_faculty_semester (faculty_id, predicted_for_semester),
  FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE Departments
  ADD CONSTRAINT fk_departments_hod
  FOREIGN KEY (hod_user_id) REFERENCES Users(user_id)
  ON DELETE SET NULL ON UPDATE CASCADE;
