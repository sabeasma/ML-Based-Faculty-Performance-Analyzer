USE faculty_analyzer;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE MLScores;
TRUNCATE TABLE Notifications;
TRUNCATE TABLE Reports;
TRUNCATE TABLE CourseFeedback;
TRUNCATE TABLE Feedback;
TRUNCATE TABLE Attendance;
TRUNCATE TABLE ResearchPublications;
TRUNCATE TABLE Subjects;
TRUNCATE TABLE Students;
TRUNCATE TABLE Faculty;
TRUNCATE TABLE Users;
TRUNCATE TABLE Departments;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Departments (name) VALUES
('Computer Science'),
('Information Technology'),
('Electronics'),
('Mechanical'),
('Civil'),
('Electrical'),
('Mathematics'),
('Physics');

-- Admin user (password: admin123)
INSERT INTO Users (full_name, email, password_hash, role, department_id) VALUES
('System Admin', 'admin@college.edu', 'admin123', 'admin', 1);

-- One HOD per first 4 departments (password: hod123)
INSERT INTO Users (full_name, email, password_hash, role, department_id)
SELECT CONCAT('HOD ', name), CONCAT('hod', department_id, '@college.edu'), 'hod123', 'hod', department_id
FROM Departments
WHERE department_id <= 4;

UPDATE Departments d
JOIN Users u ON u.role = 'hod' AND u.department_id = d.department_id
SET d.hod_user_id = u.user_id;

DELIMITER $$

CREATE PROCEDURE seed_faculty()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE dep INT;
  DECLARE exp_years INT;
  DECLARE subjects INT;
  DECLARE difficulty DECIMAL(4,2);

  WHILE i <= 100 DO
    SET dep = 1 + FLOOR(RAND() * 8);
    SET exp_years = 2 + FLOOR(RAND() * 22);
    SET subjects = 1 + FLOOR(RAND() * 6);
    SET difficulty = 2 + (RAND() * 3);

    INSERT INTO Users (full_name, email, password_hash, role, department_id)
    VALUES (
      CONCAT('Dr Faculty ', LPAD(i, 3, '0')),
      CONCAT('faculty', i, '@college.edu'),
      'faculty123',
      'faculty',
      dep
    );

    INSERT INTO Faculty (user_id, department_id, qualification, years_of_experience, subjects_handled, course_difficulty_score, joined_at)
    VALUES (
      LAST_INSERT_ID(),
      dep,
      IF(RAND() > 0.55, 'PhD', 'M.Tech'),
      exp_years,
      subjects,
      ROUND(difficulty, 2),
      DATE_SUB(CURDATE(), INTERVAL (exp_years * 365) DAY)
    );

    SET i = i + 1;
  END WHILE;
END$$

CREATE PROCEDURE seed_students()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE dep INT;
  WHILE i <= 1000 DO
    SET dep = 1 + FLOOR(RAND() * 8);

    INSERT INTO Users (full_name, email, password_hash, role, department_id)
    VALUES (
      CONCAT('Student ', LPAD(i, 4, '0')),
      CONCAT('student', i, '@college.edu'),
      'student123',
      'student',
      dep
    );

    INSERT INTO Students (user_id, roll_no, semester, program)
    VALUES (
      LAST_INSERT_ID(),
      CONCAT('CSE', LPAD(i, 4, '0')),
      1 + FLOOR(RAND() * 8),
      'B.E.'
    );

    SET i = i + 1;
  END WHILE;
END$$

CREATE PROCEDURE seed_subjects()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE dep INT;
  WHILE i <= 48 DO
    SET dep = 1 + FLOOR(RAND() * 8);
    INSERT INTO Subjects (code, title, department_id, credits)
    VALUES (
      CONCAT('SUB', LPAD(i, 3, '0')),
      CONCAT('Subject ', i),
      dep,
      2 + FLOOR(RAND() * 3)
    );
    SET i = i + 1;
  END WHILE;
END$$

CREATE PROCEDURE seed_attendance_publications_scores()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE attendance DECIMAL(5,2);
  DECLARE pubs INT;
  DECLARE cits INT;
  DECLARE score DECIMAL(5,2);

  WHILE i <= 100 DO
    SET attendance = 70 + (RAND() * 30);
    SET pubs = FLOOR(RAND() * 20);
    SET cits = FLOOR(RAND() * 200);

    INSERT INTO Attendance (faculty_id, semester, attendance_percentage)
    VALUES (i, '2025-ODD', ROUND(attendance, 2));

    INSERT INTO ResearchPublications (faculty_id, title, publication_type, citation_count, impact_factor, published_year)
    VALUES
      (i, CONCAT('Research Paper A', i), 'journal', cits, ROUND(1 + RAND() * 8, 2), 2024),
      (i, CONCAT('Research Paper B', i), 'conference', FLOOR(cits * 0.6), ROUND(1 + RAND() * 6, 2), 2023);

    SET score = LEAST(100, ROUND((attendance * 0.25) + (pubs * 1.6) + (cits * 0.08) + (40 + RAND() * 20), 2));

    INSERT INTO MLScores (faculty_id, score, risk_level, promotion_eligible, model_version, predicted_for_semester)
    VALUES (
      i,
      score,
      CASE
        WHEN score < 60 THEN 'high'
        WHEN score < 80 THEN 'medium'
        ELSE 'low'
      END,
      IF(score >= 85, 1, 0),
      'xgb-v1',
      '2025-ODD'
    );

    SET i = i + 1;
  END WHILE;
END$$

CREATE PROCEDURE seed_feedback()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE sid INT;
  DECLARE fid INT;
  DECLARE subid INT;
  WHILE i <= 5000 DO
    SET sid = 1 + FLOOR(RAND() * 1000);
    SET fid = 1 + FLOOR(RAND() * 100);
    SET subid = 1 + FLOOR(RAND() * 48);

    INSERT INTO Feedback (
      student_id,
      faculty_id,
      subject_id,
      rating_teaching,
      rating_knowledge,
      rating_interaction,
      rating_communication,
      course_difficulty,
      comments,
      semester
    ) VALUES (
      sid,
      fid,
      subid,
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      ELT(1 + FLOOR(RAND() * 5),
        'Excellent teaching clarity',
        'Good classroom interaction',
        'Needs more practical examples',
        'Very supportive and punctual',
        'Strong subject understanding'
      ),
      ELT(1 + FLOOR(RAND() * 4), '2024-ODD', '2024-EVEN', '2025-ODD', '2025-EVEN')
    );

    SET i = i + 1;
  END WHILE;
END$$

CREATE PROCEDURE seed_course_feedback()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE sid INT;
  DECLARE cid INT;

  WHILE i <= 2000 DO
    SET sid = 1 + FLOOR(RAND() * 1000);
    SET cid = 1 + FLOOR(RAND() * 48);

    INSERT INTO CourseFeedback (
      student_id,
      course_id,
      rating_content,
      rating_difficulty,
      rating_resources,
      rating_organization,
      rating_overall,
      comments,
      semester
    ) VALUES (
      sid,
      cid,
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      2 + FLOOR(RAND() * 4),
      ELT(1 + FLOOR(RAND() * 4),
        'Well-structured course',
        'Could include more case studies',
        'Resources were very helpful',
        'Good pacing and organization'
      ),
      ELT(1 + FLOOR(RAND() * 4), '2024-ODD', '2024-EVEN', '2025-ODD', '2025-EVEN')
    );

    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

CALL seed_faculty();
CALL seed_students();
CALL seed_subjects();
CALL seed_attendance_publications_scores();
CALL seed_feedback();
CALL seed_course_feedback();

DROP PROCEDURE IF EXISTS seed_faculty;
DROP PROCEDURE IF EXISTS seed_students;
DROP PROCEDURE IF EXISTS seed_subjects;
DROP PROCEDURE IF EXISTS seed_attendance_publications_scores;
DROP PROCEDURE IF EXISTS seed_feedback;
DROP PROCEDURE IF EXISTS seed_course_feedback;

INSERT INTO Notifications (user_id, role, title, message, category)
SELECT user_id, role,
  CASE role
    WHEN 'admin' THEN 'System update available'
    WHEN 'hod' THEN 'New departmental feedback received'
    WHEN 'faculty' THEN 'Your ranking has changed'
    ELSE 'Feedback submission reminder'
  END,
  CASE role
    WHEN 'admin' THEN 'ML model xgb-v1 metrics refreshed successfully.'
    WHEN 'hod' THEN 'Fresh feedback entries were added for your department.'
    WHEN 'faculty' THEN 'You have new feedback and performance trends to review.'
    ELSE 'Please complete pending faculty and course feedback this week.'
  END,
  CASE role
    WHEN 'admin' THEN 'ml'
    WHEN 'hod' THEN 'feedback'
    WHEN 'faculty' THEN 'ranking'
    ELSE 'system'
  END
FROM Users
WHERE role IN ('admin', 'hod', 'faculty', 'student')
LIMIT 300;

INSERT INTO Reports (generated_by, role, report_type, format, file_name, generated_for_department)
SELECT u.user_id,
  u.role,
  CASE
    WHEN u.role = 'admin' THEN 'faculty_performance'
    ELSE 'department_performance'
  END,
  'csv',
  CONCAT(
    CASE
      WHEN u.role = 'admin' THEN 'faculty_performance'
      ELSE 'department_performance'
    END,
    '_',
    u.user_id,
    '.csv'
  ),
  u.department_id
FROM Users u
WHERE u.role IN ('admin', 'hod')
LIMIT 30;
