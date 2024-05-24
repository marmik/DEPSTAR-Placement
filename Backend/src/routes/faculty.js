// Import required modules
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for JWT (stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to parse JSON bodies
app.use(express.json());

const { vToken, checkRole } = require('./../middlewares/middleware.js');

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    socketPath: process.env.DB_SOCKET_PATH
}); 

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

// Middleware to verify token and extract user
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

// Create a new quiz
router.post('/createNewQuiz', verifyToken, checkRole('Faculty'), (req, res) => {
    const { title, description, questions, subject, number_of_questions, exam_date, start_time, end_time, total_marks, sem, className, batch } = req.body;
    const userID = req.user ? req.user.userID : null;

    const quizInsertQuery = 'INSERT INTO Exams (Title, Description, Subject, CreatorID, Number_of_Questions, ExamDate, StartTime, EndTime, Exam_Total_Marks, Status, sem, className, batch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(quizInsertQuery, [title, description, subject, userID, number_of_questions, exam_date, start_time, end_time, total_marks, 'Not Started', sem, className, batch], (err, result) => {
        if (err) {
            console.error('Error creating quiz:', err);
            return res.status(500).json({ error: 'Could not create quiz' });
        }

        const examID = result.insertId;
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
                        optionsInsertQueries.push([questionIDs[index], option]);
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
router.put('/updateQuiz/:id', verifyToken, checkRole('Faculty'), (req, res) => {
    const quizId = req.params.id;
    const { title, description, subject, number_of_questions, sem, className, batch } = req.body;

    const updateQuery = 'UPDATE Exams SET Title = ?, Description = ?, Subject = ?, Number_of_Questions = ?, sem = ?, className = ?, batch = ? WHERE ExamID = ?';
    connection.query(updateQuery, [title, description, subject, number_of_questions, sem, className, batch, quizId], (err, result) => {
        if (err) {
            console.error('Error updating quiz:', err);
            return res.status(500).json({ error: 'Could not update quiz' });
        }
        res.json({ message: 'Quiz updated successfully' });
    });
});

// Delete a quiz
router.delete('/deleteQuiz/:id', verifyToken, checkRole('Faculty'), (req, res) => {
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

// Create a new class
router.post('/createClass', verifyToken, checkRole('Faculty'), (req, res) => {
    const { className } = req.body;
    const facultyID = req.user ? req.user.userID : null;
    const facultyname = req.user ? req.user.username : null;

    const classInsertQuery = 'INSERT INTO Classes (ClassName, UserID, facultyname) VALUES (?, ?, ?)';
    connection.query(classInsertQuery, [className, facultyID, facultyname], (err, result) => {
        if (err) {
            console.error('Error creating class:', err);
            return res.status(500).json({ error: 'Could not create class' });
        }
        res.status(201).json({ message: 'Class created successfully' });
    });
});

// Assign a student to a class
router.post('/addClassStudent/:classId', verifyToken, checkRole('Faculty'), (req, res) => {
    const classId = req.params.classId;
    const { student_name } = req.body;

    const classStudentInsertQuery = 'INSERT INTO ClassStudents (ClassID, studentname) VALUES (?, ?)';
    connection.query(classStudentInsertQuery, [classId, student_name], (err, result) => {
        if (err) {
            console.error('Error assigning student to class:', err);
            return res.status(500).json({ error: 'Could not assign student to class' });
        }
        res.status(201).json({ message: 'Student assigned to class successfully' });
    });
});

// Assign an exam to a class
router.post('/assignExamToClass/:classId', verifyToken, checkRole('Faculty'), (req, res) => {
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
router.get('/assignments/:id', verifyToken, checkRole('Faculty'), (req, res) => {
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
router.post('/feedback/:submissionId', verifyToken, checkRole('Faculty'), (req, res) => {
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

// GET all quizzes
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

// GET Total Quizzes
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

// GET Display Scheduled Quizzes API 
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

// GET Display Quizzes API
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

// GET Faculty Analytics
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
