const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

// Secret key for JWT (in a real application, store this securely and not in the source code)
const secret = 'secretKey'; // Replace 'secretKey' with your actual secret key

app.use(express.json()); // Middleware to parse JSON bodies

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Malformed token' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    
    // Save the decoded token to the request object
    req.user = decoded;
    next();
  });
};

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'db_QuizApp',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

// Create a new quiz
router.post('/quizzes', verifyToken, (req, res) => {
  const { title, description, questions, subject, number_of_questions, exam_date, start_time, end_time, total_marks } = req.body;
  const userID = req.user ? req.user.UserID : null; // Check if req.user exists

  // Insert quiz into Exams table
  const quizInsertQuery = 'INSERT INTO Exams (Title, Description, Subject, CreatorID, Number_of_Questions, ExamDate, StartTime, EndTime, Exam_Total_Marks, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(quizInsertQuery, [title, description, subject, userID, number_of_questions, exam_date, start_time, end_time, total_marks, 'Not Started'], (err, result) => {
    if (err) {
      console.error('Error creating quiz:', err);
      return res.status(500).json({ error: 'Could not create quiz' });
    }

    const examID = result.insertId;

    // Insert questions into Questions table
    const questionInsertQuery = 'INSERT INTO Questions (ExamID, QuestionText, QuestionType, CorrectAnswer, Mark) VALUES ?';
    const values = questions.map(question => [examID, question.text, question.type, question.correctAnswer, question.mark]);

    connection.query(questionInsertQuery, [values], (err, result) => {
      if (err) {
        console.error('Error inserting questions:', err);
        return res.status(500).json({ error: 'Could not create quiz' });
      }

      const questionIDs = Array.from({ length: questions.length }, (_, i) => result.insertId + i);
      
      const optionsInsertQueries = [];
      questions.forEach((question, index) => {
        if (question.type === 'Multiple Choice' && question.options) {
          question.options.forEach(option => {
            optionsInsertQueries.push([
              questionIDs[index], // Matching each question ID with its options
              option
            ]);
          });
        }
      });

      if (optionsInsertQueries.length > 0) {
        const optionsInsertQuery = 'INSERT INTO QuestionOptions (QuestionID, OptionText) VALUES ?';
        connection.query(optionsInsertQuery, [optionsInsertQueries], (err, result) => {
          if (err) {
            console.error('Error inserting options:', err);
            return res.status(500).json({ error: 'Could not create quiz' });
          }
          res.status(201).json({ message: 'Quiz created successfully' });
        });
      } else {
        res.status(201).json({ message: 'Quiz created successfully' });
      }
    });
  });
});

// Update quiz information
router.put('/quizzes/:id', verifyToken, (req, res) => {
  const quizId = req.params.id;
  const { title, description, subject, number_of_questions } = req.body;

  const updateQuery = 'UPDATE Exams SET Title = ?, Description = ?, Subject = ?, Number_of_Questions = ? WHERE ExamID = ?';
  connection.query(updateQuery, [title, description, subject, number_of_questions, quizId], (err, result) => {
    if (err) {
      console.error('Error updating quiz:', err);
      return res.status(500).json({ error: 'Could not update quiz' });
    }
    res.json({ message: 'Quiz updated successfully' });
  });
});

// Delete a quiz
router.delete('/quizzes/:id', verifyToken, (req, res) => {
  const quizId = req.params.id;

  const deleteQuery = 'DELETE FROM Exams WHERE ExamID = ?';
  connection.query(deleteQuery, [quizId], (err, result) => {
    if (err) {
      console.error('Error deleting quiz:', err);
      return res.status(500).json({ error: 'Could not delete quiz' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  });
});

// Assign a quiz to students or classes
router.post('/assignments', verifyToken, (req, res) => {
  const { examID, userID, assignedDate, dueDate } = req.body;

  const assignmentInsertQuery = 'INSERT INTO ExamAssignments (ExamID, UserID, AssignedDate, DueDate) VALUES (?, ?, ?, ?)';
  connection.query(assignmentInsertQuery, [examID, userID, assignedDate, dueDate], (err, result) => {
    if (err) {
      console.error('Error assigning quiz:', err);
      return res.status(500).json({ error: 'Could not assign quiz' });
    }
    res.status(201).json({ message: 'Quiz assigned successfully' });
  });
});

// Get assignments for a specific quiz
router.get('/assignments/:id', verifyToken, (req, res) => {
  const quizId = req.params.id;

  const assignmentsQuery = 'SELECT * FROM ExamAssignments WHERE ExamID = ?';
  connection.query(assignmentsQuery, [quizId], (err, results) => {
    if (err) {
      console.error('Error getting assignments:', err);
      return res.status(500).json({ error: 'Could not get assignments' });
    }
    res.json(results);
  });
});

// Provide feedback on a quiz submission
router.post('/feedback/:submissionId', verifyToken, (req, res) => {
  const submissionId = req.params.submissionId;
  const { feedback } = req.body;

  const feedbackInsertQuery = 'UPDATE QuizSubmissions SET Feedback = ? WHERE SubmissionID = ?';
  connection.query(feedbackInsertQuery, [feedback, submissionId], (err, result) => {
    if (err) {
      console.error('Error providing feedback:', err);
      return res.status(500).json({ error: 'Error providing feedback' });
    }
    res.json({ message: 'Feedback provided successfully' });
  });
});

// Create a new class
router.post('/classes', verifyToken, (req, res) => {
  const { className } = req.body;
  const teacherID = req.user ? req.user.UserID : null; // Check if req.user exists

  const classInsertQuery = 'INSERT INTO Classes (ClassName, TeacherID) VALUES (?, ?)';
  connection.query(classInsertQuery, [className, teacherID], (err, result) => {
    if (err) {
      console.error('Error creating class:', err);
      return res.status(500).json({ error: 'Could not create class' });
    }
    res.status(201).json({ message: 'Class created successfully' });
  });
});

// Assign a student to a class
router.post('/classes/:classId/students', verifyToken, (req, res) => {
  const classId = req.params.classId;
  const { studentID } = req.body;

  const classStudentInsertQuery = 'INSERT INTO ClassStudents (ClassID, StudentID) VALUES (?, ?)';
  connection.query(classStudentInsertQuery, [classId, studentID], (err, result) => {
    if (err) {
      console.error('Error assigning student to class:', err);
      return res.status(500).json({ error: 'Could not assign student to class' });
    }
    res.status(201).json({ message: 'Student assigned to class successfully' });
  });
});

// Assign an exam to a class
router.post('/classes/:classId/exams', verifyToken, (req, res) => {
  const classId = req.params.classId;
  const { examID } = req.body;

  const classExamInsertQuery = 'INSERT INTO ClassExams (ClassID, ExamID) VALUES (?, ?)';
  connection.query(classExamInsertQuery, [classId, examID], (err, result) => {
    if (err) {
      console.error('Error assigning exam to class:', err);
      return res.status(500).json({ error: 'Could not assign exam to class' });
    }
    res.status(201).json({ message: 'Exam assigned to class successfully' });
  });
});

module.exports = router;
