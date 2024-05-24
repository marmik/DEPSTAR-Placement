const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const router = express.Router();

const secret = process.env.JWT_SECRET || 'yourSecretKey';

router.use(express.json());
router.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET_PATH,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

router.get("/dashboard", verifyToken, checkRole('Student'), (req, res) => {
  const username = req.user.username;
  res.status(200).json({ message: `Welcome, ${username}! You have access to this protected endpoint` });
});

// Example protected route handlers
router.post('/clarifications', verifyToken,checkRole('Student'), (req, res) => {
  const { examId, questionId, clarification } = req.body;
  const userId = req.user.userID;

  connection.query(
    'INSERT INTO SystemLogs (UserID, ActionTaken) VALUES (?, ?)',
    [userId, `Requested clarification for question ${questionId} in exam ${examId}`],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ message: 'Clarification requested successfully' });
    }
  );
});

router.get('/clarifications/:id', verifyToken, checkRole('Student'),(req, res) => {
  const examId = req.params.id;

  connection.query(
    'SELECT l.LogID, l.ActionTaken, q.QuestionText FROM SystemLogs l JOIN Questions q ON l.ActionTaken LIKE CONCAT("%", q.QuestionID, "%") WHERE l.ActionTaken LIKE CONCAT("%", ?, "%")',
    [examId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    }
  );
});

// 18. POST /api/student/quizzes/:id/start - Start a quiz
router.post('/quizzes/:id/start', verifyToken,checkRole('Student'), (req, res) => {
  const examId = req.params.id;
  const userId = req.user.userID;

  connection.query(
    'INSERT INTO QuizSubmissions (ExamID, UserID) VALUES (?, ?)',
    [examId, userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ message: 'Quiz started successfully' });
    }
  );
});

// 19. POST /api/student/quizzes/:id/submit - Submit quiz answers
router.post('/quizzes/:id/submit', verifyToken,checkRole('Student'), (req, res) => {
  const examId = req.params.id;
  const userId = req.user.userID;
  const answers = req.body.answers;

  connection.query(
    'SELECT SubmissionID FROM QuizSubmissions WHERE ExamID = ? AND UserID = ? ORDER BY SubmissionDate DESC LIMIT 1',
    [examId, userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      } else if (results.length === 0) {
        return res.status(400).json({ error: 'Quiz submission not found' });
      } else {
        const submissionId = results[0].SubmissionID;

        const values = answers.map(answer => [submissionId, answer.questionId, answer.answer]);
        connection.query(
          'INSERT INTO QuestionAnswers (SubmissionID, QuestionID, AnswerText) VALUES ?',
          [values],
          (error, results) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json({ message: 'Answers submitted successfully' });
          }
        );
      }
    }
  );
});

// 20. GET /api/student/quizzes/:id/results - Get quiz results
router.get('/quizzes/:id/results', verifyToken,checkRole('Student'), (req, res) => {
  const examId = req.params.id;
  const userId = req.user.userID;

  connection.query(
    `SELECT s.SubmissionID, s.SubmissionDate, q.QuestionText, q.CorrectAnswer, a.AnswerText 
     FROM QuizSubmissions s 
     JOIN QuestionAnswers a ON s.SubmissionID = a.SubmissionID 
     JOIN Questions q ON a.QuestionID = q.QuestionID 
     WHERE s.ExamID = ? AND s.UserID = ? 
     ORDER BY s.SubmissionDate DESC LIMIT 1`,
    [examId, userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    }
  );
});
// Save Quiz Feedback API
router.post('/quizFeedback', verifyToken,checkRole('Student'), (req, res) => {
  const { quiz_id, feedback } = req.body;
  const student_id = req.user.userID;
  const student_name = req.user.username;

  const feedbackInsertQuery = 'INSERT INTO quiz_feedback (quiz_id, student_id, student_name, feedback) VALUES (?, ?, ?, ?)';
  connection.query(feedbackInsertQuery, [quiz_id, student_id, student_name, feedback], (err, result) => {
    if (err) {
      console.error('Error saving quiz feedback:', err);
      return res.status(500).json({ error: 'Failed to save quiz feedback' });
    }
    res.status(201).json({ message: 'Quiz feedback saved successfully' });
  });
});

// View Quiz Feedback API
router.get('/quizFeedback/:quizId', verifyToken, checkRole('Student'), (req, res) => {
  const quizId = req.params.quizId;

  const feedbackQuery = 'SELECT student_name, feedback FROM quiz_feedback WHERE quiz_id = ?';
  connection.query(feedbackQuery, [quizId], (err, results) => {
    if (err) {
      console.error('Error fetching quiz feedback:', err);
      return res.status(500).json({ error: 'Failed to fetch quiz feedback' });
    }
    res.json(results);
  });
});

// Save Student Quiz Details API
router.post('/saveStudentQuizDetails', verifyToken,checkRole('Student'), (req, res) => {
  const { exam_id, total_questions, total_marks, time } = req.body;
  const student_id = req.user.userID;
  const student_name = req.user.username;

  const detailsInsertQuery = 'INSERT INTO student_quiz_details (student_id, student_name, exam_id, total_questions, total_marks, time) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(detailsInsertQuery, [student_id, student_name, exam_id, total_questions, total_marks, time], (err, result) => {
    if (err) {
      console.error('Error saving student quiz details:', err);
      return res.status(500).json({ error: 'Failed to save student quiz details' });
    }
    res.status(201).json({ message: 'Student quiz details saved successfully' });
  });
});

// View Student Quiz Details API
router.get('/studentQuizDetails', verifyToken,checkRole('Student'), (req, res) => {
  const student_id = req.user.userID;

  const detailsQuery = `
    SELECT sqd.id, sqd.student_name, e.Title as quiz_title, sqd.total_questions, sqd.total_marks, sqd.time
    FROM student_quiz_details sqd
    JOIN exams e ON sqd.exam_id = e.ExamID
    WHERE sqd.student_id = ?
  `;
  connection.query(detailsQuery, [student_id], (err, results) => {
    if (err) {
      console.error('Error fetching student quiz details:', err);
      return res.status(500).json({ error: 'Failed to fetch student quiz details' });
    }
    res.json(results);
  });
});

// 21. GET /api/student/profile - View user profile
router.get('/profile', verifyToken,checkRole('Student'), (req, res) => {
  const userId = req.user.userID;

  connection.query(
    'SELECT Username, Role FROM Users WHERE UserID = ?',
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      } else if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(results[0]);
    }
  );
});

// 22. PUT /api/student/profile - Edit user profile
router.put('/profile', verifyToken,checkRole('Student'), (req, res) => {
  const userId = req.user.userID;
  const { username } = req.body;

  connection.query(
    'UPDATE Users SET Username = ? WHERE UserID = ?',
    [username, userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      } else if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// 23. GET /api/student/quizzes - View available quizzes
router.get('/quizzes', verifyToken,checkRole('Student'), (req, res) => {
  const userId = req.user.userID;

  connection.query(
    `SELECT e.ExamID, e.Title, e.Description, a.AssignedDate, a.DueDate 
     FROM Exams e 
     JOIN ExamAssignments a ON e.ExamID = a.ExamID 
     WHERE a.UserID = ?`,
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    }
  );
});

// 24. GET /api/student/quizzes/:id - View details of a specific quiz
router.get('/quizzes/:id', verifyToken,checkRole('Student'), (req, res) => {
  const examId = req.params.id;

  connection.query(
    `SELECT e.ExamID, e.Title, e.Description, 
            (SELECT COUNT(*) FROM Questions q WHERE q.ExamID = e.ExamID) AS TotalQuestions 
     FROM Exams e 
     WHERE e.ExamID = ?`,
    [examId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      } else if (results.length === 0) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      res.json(results[0]);
    }
  );
});

// 25. GET /api/student/quizzes/history - View past quiz attempts and scores
router.get('/quizzes/history', verifyToken,checkRole('Student'), (req, res) => {
  const userId = req.user.userID;

  connection.query(
    `SELECT s.SubmissionID, e.Title, s.SubmissionDate, 
            (SELECT SUM(CASE WHEN q.CorrectAnswer = a.AnswerText THEN 1 ELSE 0 END) 
             FROM QuestionAnswers a 
             JOIN Questions q ON a.QuestionID = q.QuestionID 
             WHERE a.SubmissionID = s.SubmissionID) AS Score 
     FROM QuizSubmissions s 
     JOIN Exams e ON s.ExamID = e.ExamID 
     WHERE s.UserID = ?`,
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    }
  );
});
//. GET /api/student/upcomingExams - View upcoming exams
router.get('/upcomingExams', verifyToken, checkRole('Student'), (req, res) => {
  const query = `SELECT * FROM Exams WHERE ExamDate >= CURDATE() ORDER BY ExamDate ASC`;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching upcoming exams:', err);
      return res.status(500).json({ error: 'Could not fetch upcoming exams' });
    }
    res.json(results);
  });
});

//. GET /api/student/recentExams - View recent exams
router.get('/recentExams', verifyToken, checkRole('Student'), (req, res) => {
  const query = `SELECT * FROM Exams WHERE ExamDate < CURDATE() ORDER BY ExamDate DESC`;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recent exams:', err);
      return res.status(500).json({ error: 'Could not fetch recent exams' });
    }
    res.json(results);
  });
});

//. GET /api/student/recentAttemptedQuizzes - View recent attempted quizzes
router.get('/recentAttemptedQuizzes', verifyToken, checkRole('Student'), (req, res) => {
  const userId = req.user.userID;
  const query = `
    SELECT e.Title, s.SubmissionDate, q.QuestionText, a.AnswerText
    FROM QuizSubmissions s
    JOIN Exams e ON s.ExamID = e.ExamID
    JOIN QuestionAnswers a ON s.SubmissionID = a.SubmissionID
    JOIN Questions q ON a.QuestionID = q.QuestionID
    WHERE s.UserID = ?
    ORDER BY s.SubmissionDate DESC
  `;
  
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching recent attempted quizzes:', err);
      return res.status(500).json({ error: 'Could not fetch recent attempted quizzes' });
    }
    res.json(results);
  });
});

//. GET /api/student/studentAttemptedQuizDetails - View student attempted quiz details
router.get('/studentAttemptedQuizDetails', verifyToken, checkRole('Student'), (req, res) => {
  const userId = req.user.userID;
  const query = `
    SELECT e.Title, s.SubmissionDate, q.QuestionText, a.AnswerText
    FROM QuizSubmissions s
    JOIN Exams e ON s.ExamID = e.ExamID
    JOIN QuestionAnswers a ON s.SubmissionID = a.SubmissionID
    JOIN Questions q ON a.QuestionID = q.QuestionID
    WHERE s.UserID = ?
    ORDER BY s.SubmissionDate DESC
  `;
  
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching student attempted quiz details:', err);
      return res.status(500).json({ error: 'Could not fetch student attempted quiz details' });
    }
    res.json(results);
  });
});

//. GET /api/student/afterAttemptedQuizDetails - View after attempted quiz details
router.get('/afterAttemptedQuizDetails', verifyToken, checkRole('Student'), (req, res) => {
  const userId = req.user.userID;
  const query = `
    SELECT e.Title, s.SubmissionDate, q.QuestionText, q.CorrectAnswer, a.AnswerText
    FROM QuizSubmissions s
    JOIN Exams e ON s.ExamID = e.ExamID
    JOIN QuestionAnswers a ON s.SubmissionID = a.SubmissionID
    JOIN Questions q ON a.QuestionID = q.QuestionID
    WHERE s.UserID = ?
    ORDER BY s.SubmissionDate DESC
  `;
  
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching after attempted quiz details:', err);
      return res.status(500).json({ error: 'Could not fetch after attempted quiz details' });
    }
    res.json(results);
  });
});

//. GET /api/student/quizFeedback - View quiz feedback
router.post('/systemFeedback', verifyToken, checkRole('Student'), (req, res) => {
  const { feedback } = req.body;
  const student_id = req.user.userID;
  const student_name = req.user.username;

  const feedbackInsertQuery = 'INSERT INTO system_feedback (student_id, student_name, feedback) VALUES (?, ?, ?)';
  connection.query(feedbackInsertQuery, [student_id, student_name, feedback], (err, result) => {
    if (err) {
      console.error('Error saving system feedback:', err);
      return res.status(500).json({ error: 'Failed to save system feedback' });
    }
    res.status(201).json({ message: 'System feedback saved successfully' });
  });
});

//. GET /api/studentPerformanceGraph - View student performance graph
router.get('/studentPerformanceGraph', verifyToken, checkRole('Student'), (req, res) => {
  const student_id = req.user.userID;
  const query = `
    SELECT e.Title, s.SubmissionDate, 
           (SELECT SUM(CASE WHEN q.CorrectAnswer = a.AnswerText THEN 1 ELSE 0 END) 
            FROM QuestionAnswers a 
            JOIN Questions q ON a.QuestionID = q.QuestionID 
            WHERE a.SubmissionID = s.SubmissionID) AS Score
    FROM QuizSubmissions s 
    JOIN Exams e ON s.ExamID = e.ExamID 
    WHERE s.UserID = ?
  `;
  
  connection.query(query, [student_id], (err, results) => {
    if (err) {
      console.error('Error fetching student performance graph:', err);
      return res.status(500).json({ error: 'Failed to fetch student performance graph' });
    }
    res.json(results);
  });
});

//. GET /api/student/upcomingExams/:semester/:batch - View upcoming exams by semester and batch
router.get('/upcomingExams/:semester/:batch', verifyToken, checkRole('Student'), (req, res) => {
  const { semester, batch } = req.params;
  const query = `
    SELECT * FROM Exams 
    WHERE sem = ? AND batch = ? AND ExamDate >= CURDATE() 
    ORDER BY ExamDate ASC
  `;
  
  connection.query(query, [semester, batch], (err, results) => {
    if (err) {
      console.error('Error fetching upcoming exams by semester and batch:', err);
      return res.status(500).json({ error: 'Failed to fetch upcoming exams' });
    }
    res.json(results);
  });
});



module.exports = router;
