const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const verifyToken = require('../auth/middleware/authMiddleware');

// Define the dashboard route handler
router.get("/dashboard", verifyToken, (req, res) => {
    // Access the username from the decoded token
    const username = req.user.username;

    res.status(200).json({ message: `Welcome, ${username}! You have access to this protected endpoint` });
});

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'db_QuizApp',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// Use the authentication middleware for routes that require authentication
router.use(verifyToken);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

// 16. POST /api/student/clarifications - Request clarification on quiz questions
router.post('/clarifications', (req, res) => {
    const { examId, questionId, clarification } = req.body;
    const userId = req.user.id; // Assuming you have middleware to get the current user

    console.log('Received request for clarifications');
    console.log('User ID:', userId);
    console.log('Exam ID:', examId);
    console.log('Question ID:', questionId);
    console.log('Clarification:', clarification);

    // Insert the clarification request into the database
    connection.query(
      'INSERT INTO SystemLogs (UserID, ActionTaken) VALUES (?, ?)',
      [userId, `Requested clarification for question ${questionId} in exam ${examId}`],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(201).json({ message: 'Clarification requested successfully' });
        }
      }
    );
  });
 
  // 17. GET /api/student/clarifications/:id - Get clarifications for a specific quiz
  router.get('/clarifications/:id', (req, res) => {
    const examId = req.params.id;
  
    // Retrieve clarifications for the specified exam from the database
    connection.query(
      'SELECT l.LogID, l.ActionTaken, q.QuestionText FROM SystemLogs l JOIN Questions q ON l.ActionTaken LIKE CONCAT("%", q.QuestionID, "%") WHERE l.ActionTaken LIKE CONCAT("%", ?, "%")',
      [examId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json(results);
        }
      }
    );
  });
  
  // 18. POST /api/student/quizzes/:id/start - Start a quiz
  router.post('/quizzes/:id/start', (req, res) => {
    const examId = req.params.id;
    const userId = req.user.id; // Assuming you have middleware to get the current user
  
    // Start a new quiz attempt for the user
    connection.query(
      'INSERT INTO QuizSubmissions (ExamID, UserID) VALUES (?, ?)',
      [examId, userId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(201).json({ message: 'Quiz started successfully' });
        }
      }
    );
  });
  
  // 19. POST /api/student/quizzes/:id/submit - Submit quiz answers
  router.post('/quizzes/:id/submit', (req, res) => {
    const examId = req.params.id;
    const userId = req.user.id; // Assuming you have middleware to get the current user
    const answers = req.body.answers; // Assuming answers are sent in the request body
  
    // Find the latest quiz submission for the user
    connection.query(
      'SELECT SubmissionID FROM QuizSubmissions WHERE ExamID = ? AND UserID = ? ORDER BY SubmissionDate DESC LIMIT 1',
      [examId, userId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
          res.status(400).json({ error: 'Quiz submission not found' });
        } else {
          const submissionId = results[0].SubmissionID;
  
          // Insert the answers into the database
          const values = answers.map(answer => [submissionId, answer.questionId, answer.answer]);
          connection.query(
            'INSERT INTO QuestionAnswers (SubmissionID, QuestionID, AnswerText) VALUES ?',
            [values],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                res.status(200).json({ message: 'Answers submitted successfully' });
              }
            }
          );
        }
      }
    );
  });
  
  // 20. GET /api/student/quizzes/:id/results - Get quiz results
  router.get('/quizzes/:id/results', (req, res) => {
    const examId = req.params.id;
    const userId = req.user.id; // Assuming you have middleware to get the current user
  
    // Retrieve the latest quiz submission and results for the user
    connection.query(
      'SELECT s.SubmissionID, s.SubmissionDate, q.QuestionText, q.CorrectAnswer, a.AnswerText FROM QuizSubmissions s JOIN QuestionAnswers a ON s.SubmissionID = a.SubmissionID JOIN Questions q ON a.QuestionID = q.QuestionID WHERE s.ExamID = ? AND s.UserID = ? ORDER BY s.SubmissionDate DESC LIMIT 1',
      [examId, userId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json(results);
        }
      }
    );
  });
  
  // 21. GET /api/student/profile - View user profile
  router.get('/profile', (req, res) => {
    const userId = req.user.id; // Assuming you have middleware to get the current user
  
    // Retrieve user profile information from the database
    connection.query(
      'SELECT Username, Role FROM Users WHERE UserID = ?',
      [userId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.json(results[0]);
        }
      }
    );
  });
  
  // 22. PUT /api/student/profile - Edit user profile
  router.put('/profile', (req, res) => {
    const userId = req.user.id; // Assuming you have middleware to get the current user
    const { username } = req.body;
  
    // Update user profile information in the database
    connection.query(
      'UPDATE Users SET Username = ? WHERE UserID = ?',
      [username, userId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else if (results.affectedRows === 0) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.json({ message: 'Profile updated successfully' });
        }
      }
    );
  });
  
  // 23. GET /api/student/quizzes - View available quizzes
  router.get('/quizzes', (req, res) => {
      const userId = req.user.id; // Assuming you have middleware to get the current user
    
      // Retrieve available quizzes from the database
      connection.query(
        'SELECT e.ExamID, e.Title, e.Description, a.AssignedDate, a.DueDate FROM Exams e JOIN ExamAssignments a ON e.ExamID = a.ExamID WHERE a.UserID = ?',
        [userId],
        (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json(results);
          }
        }
      );
    });
    
    // 24. GET /api/student/quizzes/:id - View details of a specific quiz
    router.get('/quizzes/:id', (req, res) => {
      const examId = req.params.id;
    
      // Retrieve details of the specified exam from the database
      connection.query(
        'SELECT e.ExamID, e.Title, e.Description, (SELECT COUNT(*) FROM Questions q WHERE q.ExamID = e.ExamID) AS TotalQuestions FROM Exams e WHERE e.ExamID = ?',
        [examId],
        (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          } else if (results.length === 0) {
            res.status(404).json({ error: 'Exam not found' });
          } else {
            res.json(results[0]);
          }
        }
      );
    });
    
    // 25. GET /api/student/quizzes/history - View past quiz attempts and scores
    router.get('/quizzes/history', (req, res) => {
      const userId = req.user.id; // Assuming you have middleware to get the current user
    
      // Retrieve past quiz attempts and scores for the user from the database
      connection.query(
        'SELECT s.SubmissionID, e.Title, s.SubmissionDate, (SELECT SUM(CASE WHEN q.CorrectAnswer = a.AnswerText THEN 1 ELSE 0 END) FROM QuestionAnswers a JOIN Questions q ON a.QuestionID = q.QuestionID WHERE a.SubmissionID = s.SubmissionID) AS Score FROM QuizSubmissions s JOIN Exams e ON s.ExamID = e.ExamID WHERE s.UserID = ?',
        [userId],
        (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.json(results);
          }
        }
      );
    });

module.exports = router;
