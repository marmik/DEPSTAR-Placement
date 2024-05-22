
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const vToken = require('./../middlewares/middleware.js');
require('dotenv').config();


// Secret key for JWT (in a real application, store this securely and not in the source code)
const JWT_SECRET = process.env.JWT_SECRET; // Replace 'secretKey' with your actual secret key

app.use(express.json()); // Middleware to parse JSON bodies

const { verifyToken, checkRole } = vToken;

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Use environment variable for the password
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    path: process.env.DB_SOCKET_PATH
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

// Create a new quiz
router.post('/createNewQuiz',verifyToken, checkRole('Faculty'),(req, res) => {
  const { title, description, questions, subject, number_of_questions, exam_date, start_time, end_time, total_marks } = req.body;
  const userID = req.user ? req.user.userID : null;
  console.log(userID); // Check if req.user exists

  // Insert quiz into Exams table
  const quizInsertQuery = 'INSERT INTO Exams (Title, Description, Subject, CreatorID, Number_of_Questions, ExamDate, StartTime, EndTime, Exam_Total_Marks, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(quizInsertQuery, [title, description, subject, userID, number_of_questions, exam_date, start_time, end_time, total_marks, 'Not Started'], (err, result) => {
    if (err) {
      console.error('Error creating quiz:', err);
      return res.status(500).json({ error: 'Could not create quiz' });
    }

    const examID = result.insertId;
    

    // Insert questions into Questions table
    const questionInsertQuery = 'INSERT INTO Questions (ExamID, QuestionText, QuestionType, Correct_Option, Mark) VALUES ?';
    const values = questions.map(question => [examID, question.text, question.type, question.Correct_Option, question.mark]);

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
});  // tested

// Update quiz information
router.put('/updateQuiz/:id',verifyToken, checkRole('Faculty'), (req, res) => {
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
router.delete('/deleteQuiz/:id',verifyToken, checkRole('Faculty'), (req, res) => {
  const quizId = req.params.id;

  const deleteQuery = 'DELETE FROM exams WHERE ExamID = ?';
  connection.query(deleteQuery, [quizId], (err, result) => {
    if (err) {
      console.error('Error deleting quiz:', err);
      return res.status(500).json({ error: 'Could not delete quiz' });
    }
    res.json({ message: 'Quiz deleted successfully'});
  });
});  // tested


// Create a new class
router.post('/creteClasses', verifyToken, checkRole('Faculty'), (req, res) => {
  const { className } = req.body;
  const facultyID = req.user ? req.user.userID : null;
  const facultyname =  req.user ? req.user.username : null;// Check if req.user exists
  console.log(facultyID);
  console.log(facultyname);

  const classInsertQuery = 'INSERT INTO Classes (ClassName, UserID , facultyname) VALUES (?, ? , ?)';
  connection.query(classInsertQuery, [className, facultyID , facultyname], (err, result) => {
    if (err) {
      console.error('Error creating class:', err);
      return res.status(500).json({ error: 'Could not create class' });
    }
    res.status(201).json({ message: 'Class created successfully' });
  });
}); //tested

// Assign a student to a class

router.post('/add_student_classes/:classId',verifyToken, checkRole('Faculty'), (req, res) => {
  const classId = req.params.classId;
  const student_name = req.body.student_name;
  

  const classStudentInsertQuery = 'INSERT INTO ClassStudents (ClassID, studentname) VALUES (?, ?)';
  connection.query(classStudentInsertQuery, [classId, student_name], (err, result) => {
    if (err) {
      console.error('Error assigning student to class:', err);
      return res.status(500).json({ error: 'Could not assign student to class' });
    }
    res.status(201).json({ message: 'Student assigned to class successfully' });
  });
});  // tested


// Assign an exam to a class
router.post('/classes/:classId/exams',verifyToken, checkRole('Faculty'), (req, res) => {
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


// Assign a quiz to students or classes
router.post('/assignments', verifyToken, checkRole('Faculty'), (req, res) => {
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
router.get('/assignments/:id',verifyToken, checkRole('Faculty'), (req, res) => {
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
router.post('/feedback/:submissionId',verifyToken, checkRole('Faculty'), (req, res) => {
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





module.exports = router;
