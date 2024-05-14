// dashboard.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

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

// Teacher dashboard route
router.get('/dashboard', (req, res) => {
  res.send('Teacher dashboard');
});

// Create a new quiz
router.post('/quizzes', (req, res) => {
  const { title, description, questions } = req.body;
  const userID = req.user ? req.user.UserID : null; // Check if req.user exists

  // Insert quiz into Exams table
  const quizInsertQuery = 'INSERT INTO Exams (Title, Description, CreatorID) VALUES (?, ?, ?)';
  connection.query(quizInsertQuery, [title, description, userID], (err, result) => {
    if (err) {
      console.error('Error creating quiz:', err);
      return res.status(500).json({ error: 'Could not create quiz' });
    }

    const examID = result.insertId;

    // Insert questions into Questions table
    const questionInsertQuery = 'INSERT INTO Questions (ExamID, QuestionText, QuestionType, CorrectAnswer) VALUES ?';
    const values = questions.map(question => [examID, question.text, question.type, question.correctAnswer]);

    console.log('Question Insert Query:', questionInsertQuery);
    console.log('Values:', values);

    connection.query(questionInsertQuery, [values], (err, result) => {
      if (err) {
        console.error('Error inserting questions:', err);
        return res.status(500).json({ error: 'Could not create quiz' });
      }
      res.status(201).json({ message: 'Quiz created successfully' });
    });
  });
});

// Update quiz information
router.put('/quizzes/:id', (req, res) => {
  const quizId = req.params.id;
  const { title, description } = req.body;

  const updateQuery = 'UPDATE Exams SET Title = ?, Description = ? WHERE ExamID = ?';
  connection.query(updateQuery, [title, description, quizId], (err, result) => {
    if (err) {
      console.error('Error updating quiz:', err);
      return res.status(500).json({ error: 'Could not update quiz' });
    }
    res.json({ message: 'Quiz updated successfully' });
  });
});

// Delete a quiz
router.delete('/quizzes/:id', (req, res) => {
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
router.post('/assignments', (req, res) => {
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
router.get('/assignments/:id', (req, res) => {
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
router.post('/feedback/:submissionId', (req, res) => {
  const submissionId = req.params.submissionId;
  const { feedback } = req.body;

  const feedbackInsertQuery = 'UPDATE QuizSubmissions SET Feedback = ? WHERE SubmissionID = ?';
  connection.query(feedbackInsertQuery, [feedback, submissionId], (err, result) => {
    if (err) {
      console.error('Error providing feedback:', err);
      return res.status(500).json({ error: 'Could not provide feedback' });
    }
    res.json({ message: 'Feedback provided successfully' });
  });
});

module.exports = router;
