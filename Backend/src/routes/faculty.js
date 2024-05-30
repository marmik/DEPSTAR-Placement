// Import required modules
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const moment = require('moment');
const vverifyToken = require('./../middlewares/middleware.js');

// Secret key for JWT (stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to parse JSON bodies
app.use(express.json());

const { verifyToken, checkRole } = vverifyToken;

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME
}); 

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});



router.post('/createNewQuiz', verifyToken, checkRole('Faculty'), (req, res) => {
    const { title, description, QuestionList, subject, totalQuestions, status, date, startTime, endTime, totalMarks, sem, className, batch } = req.body;
    const userID = req.user ? req.user.userID : null;
    const questions = QuestionList;

    const quizInsertQuery = 'INSERT INTO Exams (Title, Description, Subject, CreatorID, Number_of_Questions, ExamDate, StartTime, EndTime, Exam_Total_Marks, Status, sem, className, batch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(quizInsertQuery, [title, description, subject, userID, totalQuestions, date, startTime, endTime, totalMarks, status, sem, className, batch], (err, result) => {
        if (err) {
            console.error('Error creating quiz:', err);
            return res.status(500).json({ error: 'Could not create quiz' });
        }
        console.log(questions);
        const examID = result.insertId;
        console.log(examID);
        const questionInsertQuery = 'INSERT INTO questions (ExamID, QuestionText, QuestionType, Correct_Option, Mark) VALUES ?';
        const values = questions.map(question => [examID, question.qString, question.type, question.correctOption, question.marks]);
        console.log(values);

        connection.query(questionInsertQuery, [values], (err, result) => {
            if (err) {
                console.error('Error inserting questions:', err);
                return res.status(500).json({ error: 'Could not create quiz' });
            }

            const questionIDs = Array.from({ length: questions.length }, (_, i) => result.insertId + i);
            console.log(questionIDs);
            const optionsInsertQueries = [];
            
            questions.forEach((question, index) => {
                if (question.type === 'Multiple Choice') {
                    const options = [question.OptionA, question.OptionB, question.OptionC, question.OptionD];
                    console.log("option : ", options);
                    options.forEach(option => {
                        optionsInsertQueries.push([questionIDs[index], option]); // Push each option individually
                    });
                }
            });

            console.log(optionsInsertQueries);

            if (optionsInsertQueries.length > 0) {
                const optionsInsertQuery = 'INSERT INTO QuestionOptions(QuestionID, OptionText) VALUES ?';
                connection.query(optionsInsertQuery, [optionsInsertQueries], (err, result) => {
                    if (err) {
                        console.error('Error inserting options:', err);
                        return res.status(500).json({ error: 'Could not create quiz' });
                    }
                    res.status(201).json({ message: 'Quiz created successfully' });
                    console.log("done");
                });
            } else {
                res.status(201).json({ message: 'Quiz not created successfully' });
            }
            console.log("done2");
        });
    });
}); //tested










  // tested

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
});  // tested

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
}); // tested

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
});  // not tested

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
}); // not tested
 
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
}); // not tested

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
}); // not tested

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
}); // not tested

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
});  // not required

router.get('/allQuizzes', verifyToken, checkRole('Faculty'), (req, res) => {
    const userid = req.user.userID;
    const query = 'SELECT * FROM exams WHERE CreatorID = ? ORDER BY ExamDate DESC';
  
    connection.query(query, [userid], (err, results) => {
      if (err) {
        console.error('Error fetching all quizzes:', err);
        return res.status(500).json({ error: 'Could not fetch quizzes' });
      }
      res.json(results);
    });
  }); //tested


// GET Total Quizzes
router.get('/totalQuizzes/:userid', verifyToken, checkRole('Faculty'), (req, res) => {
  const userid = req.params.userid;
  const query = `SELECT COUNT(*) as totalQuizzes FROM Exams WHERE creatorID = ?`;

  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error('Error fetching total quizzes:', err);
      return res.status(500).json({ error: 'Could not fetch total quizzes' });
    }
    res.json(results[0]);
  });
}); // tested


// GET Display Scheduled Quizzes API 
router.get('/scheduledQuizzes/:userid', verifyToken, checkRole('Faculty'), (req, res) => {
  const userid = req.params.userid;
  const query = `SELECT * FROM Exams WHERE ExamDate >= CURDATE() AND creatorID = ? ORDER BY ExamDate ASC`;

  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error('Error fetching scheduled quizzes:', err);
      return res.status(500).json({ error: 'Could not fetch scheduled quizzes' });
    }
    res.json(results);
  });
});  //tested


// GET details of  Quizzes API
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
}); // tested


// POST Save Quiz Questions
router.post('/saveQuizQuestion/:quizId', verifyToken, checkRole('Faculty'), (req, res) => {
    const quizId = req.params.quizId;
    const { questionText, questionType, correctOption, mark, optionA, optionB, optionC, optionD } = req.body;

    const questionInsertQuery = 'INSERT INTO Questions (ExamID, QuestionText, QuestionType, Correct_Option, Mark) VALUES (?, ?, ?, ?, ?)';
    connection.query(questionInsertQuery, [quizId, questionText, questionType, correctOption, mark], (err, result) => {
        if (err) {
            console.error('Error saving quiz question:', err);
            return res.status(500).json({ error: 'Failed to save quiz question' });
        }

        const questionId = result.insertId;

        if (questionType === 'Multiple Choice') {
            const optionsInsertQuery = 'INSERT INTO QuestionOptions (QuestionID, OptionText) VALUES ?';
            const optionsValues = [[questionId, optionA], [questionId, optionB], [questionId, optionC], [questionId, optionD]];
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
});   // tested


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
}); // error


// Function to check and update exam status
const checkAndUpdateExamStatus = () => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = `UPDATE Exams SET Status = 'started' WHERE StartTime = ? AND Status = 'Not Started'`;

    connection.query(query, [currentTime], (err, results) => {
        if (err) {
            console.error('Error updating exam status:', err);
        } else {
            // console.log(`Updated ${results.affectedRows} rows to 'started'`);
        }
    });
};
const checkAndUpdateExamStatusToCompleted = () => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = `UPDATE Exams SET Status = 'Completed' WHERE EndTime = ? AND Status = 'started'`;

    connection.query(query, [currentTime], (err, results) => {
        if (err) {
            console.error('Error updating exam status to completed:', err);
        } else {
            // console.log(`Updated ${results.affectedRows} rows to 'Completed'`);
        }
    });
};
setInterval(checkAndUpdateExamStatus, 1000);
setInterval(checkAndUpdateExamStatusToCompleted, 1000);

module.exports = router;