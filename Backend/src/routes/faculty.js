const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add this line
const vToken = require('./../middlewares/middleware.js');
require('dotenv').config();

// Secret key for JWT (in a real application, store this securely and not in the source code)
const JWT_SECRET = process.env.JWT_SECRET; // Replace 'secretKey' with your actual secret key

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Add this line to parse cookies

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

// Middleware to verify token from cookies
const verifyTokenFromCookie = (req, res, next) => {
  const token = req.cookies.jwt; // Extract token from cookies
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    // Save the decoded token to the request object
    req.user = decoded;
    next();
  });
};

// Create a new quiz
router.post('/createNewQuiz', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
  const { title, description, questions, subject, number_of_questions, exam_date, start_time, end_time, total_marks, sem, className, batch } = req.body;
  const userID = req.user ? req.user.userID : null;
  console.log(userID); // Check if req.user exists

  // Insert quiz into Exams table
  const quizInsertQuery = 'INSERT INTO Exams (Title, Description, Subject, CreatorID, Number_of_Questions, ExamDate, StartTime, EndTime, Exam_Total_Marks, Status, sem, className, batch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(quizInsertQuery, [title, description, subject, userID, number_of_questions, exam_date, start_time, end_time, total_marks, 'Not Started', sem, className, batch], (err, result) => {
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
router.put('/updateQuiz/:id', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
  const quizId = req.params.id;
  const { title, description, subject, number_of_questions, sem, className, batch } = req.body;


  const updateQuery = 'UPDATE Exams SET Title = ?, Description = ?, Subject = ?, Number_of_Questions = ?, sem = ?, class = ?, batch = ? WHERE ExamID = ?';
  connection.query(updateQuery, [title, description, subject, number_of_questions, sem, className, batch, quizId], (err, result) => {

    if (err) {
      console.error('Error updating quiz:', err);
      return res.status(500).json({ error: 'Could not update quiz' });
    }
    res.json({ message: 'Quiz updated successfully' });
  });
});

// Delete a quiz
router.delete('/deleteQuiz/:id', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
  const quizId = req.params.id;

  const deleteQuery = 'DELETE FROM Exams WHERE ExamID = ?';
  connection.query(deleteQuery, [quizId], (err, result) => {
    if (err) {
      console.error('Error deleting quiz:', err);
      return res.status(500).json({ error: 'Could not delete quiz' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  });
});  // tested

// Create a new class
router.post('/createClass', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
  const { className } = req.body;
  const facultyID = req.user ? req.user.userID : null;
  const facultyname = req.user ? req.user.username : null; // Check if req.user exists
  console.log(facultyID);
  console.log(facultyname);

  const classInsertQuery = 'INSERT INTO Classes (ClassName, UserID, facultyname) VALUES (?, ?, ?)';
  connection.query(classInsertQuery, [className, facultyID, facultyname], (err, result) => {
    if (err) {
      console.error('Error creating class:', err);
      return res.status(500).json({ error: 'Could not create class' });
    }
    res.status(201).json({ message: 'Class created successfully' });
  });
}); // tested

// Assign a student to a class
router.post('/addClassStudent/:classId', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
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
}); // tested

// Assign an exam to a class
router.post('/assignExamToClass/:classId', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
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
router.post('/assignments', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
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
router.get('/assignments/:id', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
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
router.post('/feedback/:submissionId', verifyTokenFromCookie, checkRole('Faculty'), (req, res) => {
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

//.GET all quizzes
router.get('/allQuizzes', verifyToken, checkRole('Faculty'), (req, res) => {
  const query = `SELECT * FROM Exams ORDER BY ExamDate DESC`;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all quizzes:', err);
      return res.status(500).json({ error: 'Could not fetch quizzes' });
    }
    res.json(results);
  });
});

//.GET Total Quizzes
router.get('/totalQuizzes', verifyToken, checkRole('Faculty'), (req, res) => {
  const query = `SELECT COUNT(*) as totalQuizzes FROM Exams`;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching total quizzes:', err);
      return res.status(500).json({ error: 'Could not fetch total quizzes' });
    }
    res.json(results[0]);
  });
});

//.GET Display Scheduled Quizzes API 
router.get('/scheduledQuizzes', verifyToken, checkRole('Faculty'), (req, res) => {
  const query = `SELECT * FROM Exams WHERE ExamDate >= CURDATE() ORDER BY ExamDate ASC`;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching scheduled quizzes:', err);
      return res.status(500).json({ error: 'Could not fetch scheduled quizzes' });
    }
    res.json(results);
  });
});

//GET Display Quizzes API
router.get('/quizDetails/:id', verifyToken, checkRole('Faculty'), (req, res) => {
  const quizId = req.params.id;
  const query = `SELECT * FROM Exams WHERE ExamID = ?`;
  
  connection.query(query, [quizId], (err, results) => {
    if (err) {
      console.error('Error fetching quiz details:', err);
      return res.status(500).json({ error: 'Could not fetch quiz details' });
    }
    res.json(results[0]);
  });
});

// POST Save Quiz Questions
router.post('/saveQuizQuestion/:quizId', verifyToken, checkRole('Faculty'), (req, res) => {
  const quizId = req.params.quizId;
  const { questionText, questionType, correctOption, mark, options } = req.body;

  const questionInsertQuery = 'INSERT INTO Questions (ExamID, QuestionText, QuestionType, Correct_Option, Mark) VALUES (?, ?, ?, ?, ?)';
  connection.query(questionInsertQuery, [quizId, questionText, questionType, correctOption, mark], (err, result) => {
    if (err) {
      console.error('Error saving quiz question:', err);
      return res.status(500).json({ error: 'Failed to save quiz question' });
    }

    const questionId = result.insertId;

    if (questionType === 'Multiple Choice' && options.length > 0) {
      const optionsInsertQuery = 'INSERT INTO QuestionOptions (QuestionID, OptionText) VALUES ?';
      const optionsValues = options.map(option => [questionId, option]);
      connection.query(optionsInsertQuery, [optionsValues], (err, result) => {
        if (err) {
          console.error('Error saving quiz question options:', err);
          return res.status(500).json({ error: 'Failed to save quiz question options' });
        }
        res.status(201).json({ message: 'Quiz question and options saved successfully' });
      });
    } else {
      res.status(201).json({ message: 'Quiz question saved successfully' });
    }
  });
});

//GET Faculty Analytics
router.get('/facultyAnalytics', verifyToken, checkRole('Faculty'), (req, res) => {
  const query = `
    SELECT e.Title, COUNT(s.SubmissionID) AS TotalSubmissions,
           AVG((SELECT SUM(CASE WHEN q.CorrectAnswer = a.AnswerText THEN 1 ELSE 0 END) 
                FROM QuestionAnswers a 
                JOIN Questions q ON a.QuestionID = q.QuestionID 
                WHERE a.SubmissionID = s.SubmissionID)) AS AverageScore
    FROM Exams e 
    LEFT JOIN QuizSubmissions s ON e.ExamID = s.ExamID
    GROUP BY e.ExamID
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching faculty analytics:', err);
      return res.status(500).json({ error: 'Failed to fetch faculty analytics' });
    }
    res.json(results);
  });
});




module.exports = router;

