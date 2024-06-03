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
<<<<<<< HEAD
});
=======
}); 
>>>>>>> 4224bf2ffd4c25740dc225606853c463ee6d1135

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
        const examID = result.insertId;

        const questionInsertQuery = 'INSERT INTO questions (ExamID, QuestionText, QuestionType, Correct_Option, Mark) VALUES ?';
        const values = questions.map(question => [examID, question.qString, question.type, question.correctOption, question.marks]);

        connection.query(questionInsertQuery, [values], (err, result) => {
            if (err) {
                console.error('Error inserting questions:', err);
                return res.status(500).json({ error: 'Could not create quiz' });
            }

            const questionIDs = Array.from({ length: questions.length }, (_, i) => result.insertId + i);

            const optionsInsertValues = [];
            questions.forEach((question, index) => {
                if (question.type === 'Multiple Choice') {
                    optionsInsertValues.push([
                        questionIDs[index],
                        question.OptionA || null,
                        question.OptionB || null,
                        question.OptionC || null,
                        question.OptionD || null
                    ]);
                }
            });

            if (optionsInsertValues.length > 0) {
                const optionsInsertQuery = 'INSERT INTO questionoptions (QuestionID, OptionA, OptionB, OptionC, OptionD) VALUES ?';
                connection.query(optionsInsertQuery, [optionsInsertValues], (err, result) => {
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
    const ExamID = req.params.id;
    const {
        title, description, subject, number_of_questions, exam_total_marks, status, examdate, starttime, endtime, creatorid, sem, classname, batch, QuestionList
    } = req.body;

    const updateQuizQuery = `UPDATE exams SET Title = ?, Description = ?, Subject = ?, Number_of_Questions = ?, Exam_Total_Marks = ?, Status = ?, 
                             ExamDate = ?, StartTime = ?, EndTime = ?, CreatorID = ?, sem = ?, className = ?, batch = ? 
                             WHERE ExamID = ?`;

    connection.query(updateQuizQuery, [
        title, description, subject, number_of_questions, exam_total_marks, status, examdate, starttime, endtime, creatorid, sem, classname, batch, ExamID
    ], (err, result) => {
        if (err) {
            console.error('Error updating quiz:', err);
            return res.status(500).json({ error: 'Could not update quiz' });
        }

        const deleteQuestionsQuery = 'DELETE FROM questions WHERE ExamID = ?';
        connection.query(deleteQuestionsQuery, [ExamID], (err, result) => {
            if (err) {
                console.error('Error deleting old questions:', err);
                return res.status(500).json({ error: 'Could not update quiz' });
            }

            const deleteOptionsQuery = 'DELETE FROM questionoptions WHERE QuestionID IN (SELECT QuestionID FROM questions WHERE ExamID = ?)';
            connection.query(deleteOptionsQuery, [ExamID], (err, result) => {
                if (err) {
                    console.error('Error deleting old options:', err);
                    return res.status(500).json({ error: 'Could not update quiz' });
                }

                const questionInsertQuery = 'INSERT INTO questions (ExamID, QuestionText, QuestionType, Correct_Option, Mark) VALUES ?';
                const questionValues = QuestionList.map(question => [ExamID, question.QuestionText, question.QuestionType, question.Correct_Option, question.Mark]);

                connection.query(questionInsertQuery, [questionValues], (err, result) => {
                    if (err) {
                        console.error('Error inserting new questions:', err);
                        return res.status(500).json({ error: 'Could not update quiz' });
                    }

                    const newQuestionIDs = Array.from({ length: QuestionList.length }, (_, i) => result.insertId + i);

                    const optionsInsertValues = [];
                    QuestionList.forEach((question, index) => {
                            if (question.QuestionType === 'Multiple Choice') {
                                optionsInsertValues.push([
                                    newQuestionIDs[index],
                                    question.options[0].OptionA || null,
                                    question.options[0].OptionB || null,
                                    question.options[0].OptionC || null,
                                    question.options[0].OptionD || null
                                ]);
                            }
                    });
                    if (optionsInsertValues.length > 0) {
                        const optionsInsertQuery = 'INSERT INTO questionoptions (QuestionID, OptionA, OptionB, OptionC, OptionD) VALUES ?';
                        connection.query(optionsInsertQuery, [optionsInsertValues], (err, result) => {
                            if (err) {
                                console.error('Error inserting options:', err);
                                return res.status(500).json({ error: 'Could not update quiz' });
                            }
                            res.json({ message: 'Quiz updated successfully' });
                        });
                    } else {
                        res.json({ message: 'Quiz updated successfully' });
                    }
                });
            });
        });
    });
});

//Create Question API
router.post('/createQuestion', verifyToken, checkRole('Faculty'), (req, res) => {
    const { examId, questionText, mark, questionType, correctOption } = req.body;

    const insertQuery = `
        INSERT INTO questions (ExamID, QuestionText, Mark, QuestionType, Correct_Option)
        VALUES (?, ?, ?, ?, ?)`;
    
    connection.query(insertQuery, [
        examId, 
        questionText, 
        mark, 
        questionType, 
        correctOption
    ], (err, result) => {
        if (err) {
            console.error('Error creating question:', err);
            return res.status(500).json({ error: 'Could not create question' });
        }
        res.json({ message: 'Question created successfully', questionId: result.insertId });
    });
});


//Update Question API
router.put('/updateQuestion/:id', verifyToken, checkRole('Faculty'), (req, res) => {
    const questionId = req.params.id;
    const { questionText, mark, questionType, correctOption } = req.body;

    const updateQuery = `
        UPDATE questions 
        SET 
            QuestionText = ?, 
            Mark = ?, 
            QuestionType = ?, 
            Correct_Option = ? 
        WHERE QuestionID = ?`;
    
    connection.query(updateQuery, [
        questionText, 
        mark, 
        questionType, 
        correctOption, 
        questionId
    ], (err, result) => {
        if (err) {
            console.error('Error updating question:', err);
            return res.status(500).json({ error: 'Could not update question' });
        }
        res.json({ message: 'Question updated successfully' });
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
}); // tested

// Create a new class
// router.post('/createClass', verifyToken, checkRole('Faculty'), (req, res) => {
//     const { className } = req.body;
//     const facultyID = req.user ? req.user.userID : null;
//     const facultyname = req.user ? req.user.username : null;

//     const classInsertQuery = 'INSERT INTO Classes (ClassName, UserID, facultyname) VALUES (?, ?, ?)';
//     connection.query(classInsertQuery, [className, facultyID, facultyname], (err, result) => {
//         if (err) {
//             console.error('Error creating class:', err);
//             return res.status(500).json({ error: 'Could not create class' });
//         }
//         res.status(201).json({ message: 'Class created successfully' });
//     });
// });  // not tested

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
router.get('/totalQuizzes/', verifyToken, checkRole('Faculty'), (req, res) => {
  const userid = req.user.userID;
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
router.get('/scheduledQuizzes/', verifyToken, checkRole('Faculty'), (req, res) => {
    const userid = req.user.userID;
    const query = `
      SELECT * 
      FROM Exams 
      WHERE ExamDate >= CURDATE() 
        AND EndTime >= CURRENT_TIME()
        AND creatorID = ? 
      ORDER BY ExamDate ASC`;
  
    connection.query(query, [userid], (err, results) => {
      if (err) {
        console.error('Error fetching scheduled quizzes:', err);
        return res.status(500).json({ error: 'Could not fetch scheduled quizzes' });
      }
      res.json(results);
    });
  });  // tested


// GET details of  Quizzes API
router.get('/quizDetails/:id', verifyToken, checkRole('Faculty'), (req, res) => {
    
    const quizId = req.params.id;
    const examQuery = `SELECT * FROM Exams WHERE ExamID = ?`;
    const questionsQuery = `SELECT * FROM Questions WHERE ExamID = ?`;
    const optionsQuery = `SELECT * FROM QuestionOptions WHERE QuestionID = ?`;
    const feedbackQuery = `SELECT COUNT(*) AS no_of_feedback FROM quiz_feedback WHERE quiz_id = ?`;
    const attemptsQuery = `SELECT COUNT(DISTINCT UserID) AS no_of_attempts FROM exam_logs WHERE ExamID = ?`;
    const startedSubmissionsQuery = `SELECT COUNT(*) AS no_of_started_submissions FROM quizsubmissions WHERE ExamID = ? AND status = 'started'`;

    // Fetch exam details
    connection.query(examQuery, [quizId], (err, examResults) => {
        if (err) {
            console.error('Error fetching quiz details:', err);
            return res.status(500).json({ error: 'Could not fetch quiz details' });
        }

        if (examResults.length === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Fetch questions related to the exam
        connection.query(questionsQuery, [quizId], (err, questionsResults) => {
            if (err) {
                console.error('Error fetching questions:', err);
                return res.status(500).json({ error: 'Could not fetch questions' });
            }

            if (questionsResults.length === 0) {
                return res.json({
                    exam: examResults[0],
                    questions: [],
                    no_of_feedback: 0,
                    no_of_attempts: 0,
                    no_of_started_submissions: 0
                });
            }

            // Fetch options for each question
            const fetchOptionsPromises = questionsResults.map(question => {
                return new Promise((resolve, reject) => {
                    connection.query(optionsQuery, [question.QuestionID], (err, optionsResults) => {
                        if (err) {
                            reject(err);
                        } else {
                            question.options = optionsResults;
                            resolve(question);
                        }
                    });
                });
            });

            // Fetch feedback count
            connection.query(feedbackQuery, [quizId], (err, feedbackResults) => {
                if (err) {
                    console.error('Error fetching feedback count:', err);
                    return res.status(500).json({ error: 'Could not fetch feedback count' });
                }

                const no_of_feedback = feedbackResults[0].no_of_feedback;

                // Fetch the number of student attempts
                connection.query(attemptsQuery, [quizId], (err, attemptsResults) => {
                    if (err) {
                        console.error('Error fetching attempts count:', err);
                        return res.status(500).json({ error: 'Could not fetch attempts count' });
                    }

                    const no_of_attempts = attemptsResults[0].no_of_attempts;

                    // Fetch the number of started submissions
                    connection.query(startedSubmissionsQuery, [quizId], (err, startedResults) => {
                        if (err) {
                            console.error('Error fetching started submissions count:', err);
                            return res.status(500).json({ error: 'Could not fetch started submissions count' });
                        }

                        const no_of_started_submissions = startedResults[0].no_of_started_submissions;

                        // Wait for all options to be fetched
                        Promise.all(fetchOptionsPromises)
                            .then(questionsWithOptions => {
                                res.json({
                                    exam: examResults[0],
                                    questions: questionsWithOptions,
                                    no_of_feedback: no_of_feedback,
                                    no_of_attempts: no_of_attempts,
                                    no_of_started_submissions: no_of_started_submissions
                                });
                            })
                            .catch(err => {
                                console.error('Error fetching question options:', err);
                                res.status(500).json({ error: 'Could not fetch question options' });
                            });
                    });
                });
            });
        });
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



// POST /api/faculty/feedback - Submit faculty feedback
router.post("/feedback", verifyToken, checkRole("Faculty"), (req, res) => {
    const { feedback, email } = req.body;
    const { userID } = req.user;
  
    const getUserQuery = "SELECT username FROM users WHERE UserID = ?";
    
    connection.query(getUserQuery, [userID], (err, results) => {
      if (err) {
        console.error("Error fetching username:", err);
        return res.status(500).json({ error: "Failed to fetch username" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const username = results[0].username;
  
      const feedbackInsertQuery = 
        "INSERT INTO feedback (username, user_id, email, feedback) VALUES (?, ?, ?, ?)";
  
      connection.query(
        feedbackInsertQuery,
        [username, userID, email, feedback],
        (err, result) => {
          if (err) {
            console.error("Error saving faculty feedback:", err);
            return res.status(500).json({ error: "Failed to save faculty feedback" });
          }
          res.status(201).json({ message: "Faculty feedback saved successfully" });
        }
      );
    });
  });

module.exports = router;