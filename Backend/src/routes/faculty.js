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
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: "Z"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

router.get("/dashboard/examsConductedCount/examScdeduled", verifyToken, checkRole("Faculty"), async (req, res) => {
    const userId = req.user.userID;
  
    // Updated query to count both completed and not started exams created by the user
    const examsCountQuery = `
      SELECT 
        SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) AS completedExamsCount,
        SUM(CASE WHEN Status = 'Not Started' THEN 1 ELSE 0 END) AS notStartedExamsCount
      FROM exams
      WHERE CreatorID = ?
    `;
  
    try {
      // Execute the query
      const examsCountResult = await new Promise((resolve, reject) => {
        connection.query(examsCountQuery, [userId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0]); // results[0] will be the row with both counts
        });
      });
  
      // Extract counts from the result
      const completedExamsCount = examsCountResult.completedExamsCount;
      const notStartedExamsCount = examsCountResult.notStartedExamsCount;
  
      // Send the response with both counts
      res.json({
        totalExamConducted: completedExamsCount,
        totalExamScheduled: notStartedExamsCount
      });
    } catch (err) {
      console.error("Error fetching exams count:", err);
      res.status(500).json({ error: "Could not fetch exams count" });
    }
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
});  // tested


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
});  // tested


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




router.get('/allQuizzes', verifyToken, checkRole('Faculty'), (req, res) => {
    const userid = req.user.userID;
    const query = 'SELECT * FROM exams WHERE CreatorID = ? ORDER BY updated_at DESC';
  
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
// router.get('/quizDetails/:id', verifyToken, checkRole('Faculty'), (req, res) => {
    
//     const quizId = req.params.id;
//     const examQuery = "SELECT * FROM Exams WHERE ExamID = ?";
//     const questionsQuery = "SELECT * FROM Questions WHERE ExamID = ?";
//     const optionsQuery = "SELECT * FROM QuestionOptions WHERE QuestionID = ?";
//     const feedbackQuery = "SELECT COUNT(*) AS no_of_feedback FROM quiz_feedback WHERE quiz_id = ?";
//     const attemptsQuery = "SELECT COUNT(DISTINCT UserID) AS no_of_attempts FROM exam_logs WHERE ExamID = ?";
//     const startedSubmissionsQuery = "SELECT COUNT(*) AS no_of_started_submissions FROM quizsubmissions WHERE ExamID = ? AND status = 'started'";

//     // Fetch exam details
//     connection.query(examQuery, [quizId], (err, examResults) => {
//         if (err) {
//             console.error('Error fetching quiz details:', err);
//             return res.status(500).json({ error: 'Could not fetch quiz details' });
//         }

//         if (examResults.length === 0) {
//             return res.status(404).json({ error: 'Quiz not found' });
//         }

//         // Fetch questions related to the exam
//         connection.query(questionsQuery, [quizId], (err, questionsResults) => {
//             if (err) {
//                 console.error('Error fetching questions:', err);
//                 return res.status(500).json({ error: 'Could not fetch questions' });
//             }

//             if (questionsResults.length === 0) {
//                 return res.json({
//                     exam: examResults[0],
//                     questions: [],
//                     no_of_feedback: 0,
//                     no_of_attempts: 0,
//                     no_of_started_submissions: 0
//                 });
//             }

//             // Fetch options for each question
//             const fetchOptionsPromises = questionsResults.map(question => {
//                 return new Promise((resolve, reject) => {
//                     connection.query(optionsQuery, [question.QuestionID], (err, optionsResults) => {
//                         if (err) {
//                             reject(err);
//                         } else {
//                             question.options = optionsResults;
//                             resolve(question);
//                         }
//                     });
//                 });
//             });

//             // Fetch feedback count
//             connection.query(feedbackQuery, [quizId], (err, feedbackResults) => {
//                 if (err) {
//                     console.error('Error fetching feedback count:', err);
//                     return res.status(500).json({ error: 'Could not fetch feedback count' });
//                 }

//                 const no_of_feedback = feedbackResults[0].no_of_feedback;

//                 // Fetch the number of student attempts
//                 connection.query(attemptsQuery, [quizId], (err, attemptsResults) => {
//                     if (err) {
//                         console.error('Error fetching attempts count:', err);
//                         return res.status(500).json({ error: 'Could not fetch attempts count' });
//                     }

//                     const no_of_attempts = attemptsResults[0].no_of_attempts;

//                     // Fetch the number of started submissions
//                     connection.query(startedSubmissionsQuery, [quizId], (err, startedResults) => {
//                         if (err) {
//                             console.error('Error fetching started submissions count:', err);
//                             return res.status(500).json({ error: 'Could not fetch started submissions count' });
//                         }

//                         const no_of_started_submissions = startedResults[0].no_of_started_submissions;

//                         // Wait for all options to be fetched
//                         Promise.all(fetchOptionsPromises)
//                             .then(questionsWithOptions => {
//                                 res.json({
//                                     exam: examResults[0],
//                                     questions: questionsWithOptions,
//                                     no_of_feedback: no_of_feedback,
//                                     no_of_attempts: no_of_attempts,
//                                     no_of_started_submissions: no_of_started_submissions
//                                 });
//                             })
//                             .catch(err => {
//                                 console.error('Error fetching question options:', err);
//                                 res.status(500).json({ error: 'Could not fetch question options' });
//                             });
//                     });
//                 });
//             });
//         });
//     });
// });  //tested

// GET details of Quizzes API
router.get('/quizDetails/:id', verifyToken, checkRole('Faculty'), (req, res) => {
    const quizId = req.params.id;
    const examQuery = `
        SELECT
            *,
            (SELECT MAX(total_marks) FROM student_quiz_details WHERE exam_id = ?) AS max_marks,
            (SELECT MIN(total_marks) FROM student_quiz_details WHERE exam_id = ?) AS min_marks,
            (SELECT AVG(total_marks) FROM student_quiz_details WHERE exam_id = ?) AS avg_marks,
            (SELECT COUNT(*) FROM quiz_feedback WHERE quiz_id = ?) AS total_feedback,
            (SELECT COUNT(*) FROM exam_logs WHERE ExamID = ? AND Status = 'Attempted') AS total_attempted,
            (SELECT COUNT(DISTINCT UserID) FROM quizsubmissions WHERE ExamID = ? AND status = 'Attempted') AS total_attendance,
            (SELECT COUNT(*) FROM quizsubmissions WHERE ExamID = ? AND status = 'started') AS no_of_started_submissions
        FROM Exams WHERE ExamID = ?`;
    const questionsQuery = 'SELECT * FROM Questions WHERE ExamID = ?';
    const optionsQuery = 'SELECT * FROM QuestionOptions WHERE QuestionID = ?';

    // Fetch exam details
    connection.query(examQuery, [quizId, quizId, quizId, quizId, quizId, quizId, quizId, quizId, quizId], (err, examResults) => {
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
                    total_feedback: examResults[0].total_feedback,
                    total_attempted: examResults[0].total_attempted,
                    total_attendance: examResults[0].total_attendance,
                    no_of_started_submissions: examResults[0].no_of_started_submissions
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

            // Wait for all options to be fetched
            Promise.all(fetchOptionsPromises)
                .then(questionsWithOptions => {
                    res.json({
                        exam: examResults[0],
                        questions: questionsWithOptions,
                        max_marks: examResults[0].max_marks,
                        min_marks: examResults[0].min_marks,
                        avg_marks: examResults[0].avg_marks,
                        total_feedback: examResults[0].total_feedback,
                        total_attempted: examResults[0].total_attempted,
                        total_attendance: examResults[0].total_attendance,
                        no_of_started_submissions: examResults[0].no_of_started_submissions
                    });
                })
                .catch(err => {
                    console.error('Error fetching question options:', err);
                    res.status(500).json({ error: 'Could not fetch question options' });
                });
        });
    });
});


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






// // GET Total Students Markes in Quizzes
// router.get("/quizzes/history",verifyToken,checkRole("Faculty"),(req, res) => {
//     const userId = req.user.userID;
//     const query = `SELECT s.SubmissionID,e.Title,s.SubmissionDate,sqd.total_marks AS obtain_Marks, 
//       e.Number_of_Questions AS total_question,e.Exam_Total_Marks AS total_marks,(SELECT SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN 1 ELSE 0 END) 
//        FROM questionanswers a JOIN questions q ON a.QuestionID = q.QuestionID WHERE a.SubmissionID = s.SubmissionID) AS score,
//       (SELECT MAX(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID) AS max_marks,
//       (SELECT MIN(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID) AS min_marks,
//       (SELECT AVG(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID) AS avg_marks
//     FROM quizsubmissions s JOIN exams e ON s.ExamID = e.ExamID JOIN student_quiz_details sqd ON s.ExamID = sqd.exam_id AND s.UserID = sqd.student_id
//     WHERE e.CreatorID = ?`;

//     connection.query(query, [userId], (error, results) => {
//       if (error) {
//         console.error("Error fetching quiz history:", error);
//         return res.status(500).json({ error: "Internal server error" });
//       }
//       res.json(results);
//     });
//   }
// );  // tested

// GET Total Students Markes in Quizzes
router.get("/quizzes/history",verifyToken,checkRole("Faculty"),(req, res) => {
    const userId = req.user.userID;
    const query = `SELECT s.SubmissionID,e.Title,s.SubmissionDate,sqd.total_marks AS obtain_Marks, 
      e.Number_of_Questions AS total_question,e.Exam_Total_Marks AS total_marks,(SELECT SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN 1 ELSE 0 END) 
       FROM questionanswers a JOIN questions q ON a.QuestionID = q.QuestionID WHERE a.SubmissionID = s.SubmissionID) AS score,
      (SELECT MAX(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID) AS max_marks,
      (SELECT MIN(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID) AS min_marks,
      (SELECT AVG(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID) AS avg_marks
    FROM quizsubmissions s JOIN exams e ON s.ExamID = e.ExamID JOIN student_quiz_details sqd ON s.ExamID = sqd.exam_id AND s.UserID = sqd.student_id
    WHERE e.CreatorID = ? LIMIT 5` ;

    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error fetching quiz history:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    });
  }
);  // tested
  
  

router.get(
    "/facultyQuizzes/feedback",
    verifyToken,
    checkRole("Faculty"),
    (req, res) => {
      const facultyId = req.user.userID;
  
      const feedbackQuery = `
        SELECT e.title,e.ExamID, e.subject, e.ExamDate, COUNT(qf.feedback) AS total_feedback
        FROM exams e
        LEFT JOIN quiz_feedback qf ON e.ExamID = qf.quiz_id
        WHERE e.CreatorID = ?
        GROUP BY e.ExamID, e.Title, e.Subject, e.ExamDate ORDER BY e.created_at DESC
      `;
  
      connection.query(feedbackQuery, [facultyId], (err, results) => {
        if (err) {
          console.error("Error fetching quiz feedback:", err);
          return res.status(500).json({ error: "Failed to fetch quiz feedback" });
        }
        res.json(results);
      });
    }
  );  //tested


//   router.get(
//     "/quizzes/:id/allStudentResults",
//     verifyToken,
//     checkRole("Faculty"),
//     (req, res) => {
//       const examId = req.params.id;
  
//       const query = `
//       SELECT 
//         u.Username AS username,
//         sqd.total_marks AS totalMarks,
//         e.Exam_Total_Marks AS examTotalMarks,
//         (SELECT COUNT(*) 
//          FROM questionanswers qa 
//          JOIN questions q ON qa.QuestionID = q.QuestionID 
//          WHERE qa.SubmissionID IN (SELECT SubmissionID FROM quizsubmissions WHERE UserID = sqd.student_id AND ExamID = sqd.exam_id) AND qa.AnswerText = q.Correct_Option) AS correct_answers,
//         (SELECT COUNT(*) 
//          FROM questionanswers qa 
//          JOIN questions q ON qa.QuestionID = q.QuestionID 
//          WHERE qa.SubmissionID IN (SELECT SubmissionID FROM quizsubmissions WHERE UserID = sqd.student_id AND ExamID = sqd.exam_id) AND qa.AnswerText != q.Correct_Option) AS wrong_answers,
//         qf.feedback
//       FROM 
//         student_quiz_details sqd
//       LEFT JOIN 
//         quiz_feedback qf ON sqd.exam_id = qf.quiz_id AND sqd.student_id = qf.student_id
//       JOIN 
//         users u ON sqd.student_id = u.UserID
//       JOIN 
//         exams e ON sqd.exam_id = e.ExamID
//       WHERE 
//         sqd.exam_id = ?`;
  
//       connection.query(query, [examId], (error, results) => {
//         if (error) {
//           console.error("Error fetching quiz results:", error);
//           return res.status(500).json({ error: "Internal server error" });
//         }
        
//         // Calculate marks obtained and marks deducted
//         results.forEach((result) => {
//           result.obtain_marks = result.correct_answers;
//           result.wrong = result.totalMarks - result.correct_answers;
//           // Delete temporary columns
//           delete result.correct_answers;
//           delete result.totalMarks;
//         });
        
//         res.json(results);
//       });
//     }
//   );  //tested



// GET /api/faculty/quizzes/:id/allStudentResults - View all student results for a specific quiz
router.get(
    "/quizzes/:id/allStudentResults",
    verifyToken,
    checkRole("Faculty"),
    (req, res) => {
      const examId = req.params.id;
  
      const query = `
        SELECT 
          u.UserID AS userID,
          u.Username AS username,
          sqd.total_marks AS totalMarks,
          e.Exam_Total_Marks AS examTotalMarks,
          (SELECT COUNT(*) 
           FROM questionanswers qa 
           JOIN questions q ON qa.QuestionID = q.QuestionID 
           WHERE qa.SubmissionID IN (SELECT SubmissionID FROM quizsubmissions WHERE UserID = sqd.student_id AND ExamID = sqd.exam_id) 
             AND qa.AnswerText = q.Correct_Option) AS correct_answers,
          (SELECT COUNT(*) 
           FROM questionanswers qa 
           JOIN questions q ON qa.QuestionID = q.QuestionID 
           WHERE qa.SubmissionID IN (SELECT SubmissionID FROM quizsubmissions WHERE UserID = sqd.student_id AND ExamID = sqd.exam_id) 
             AND qa.AnswerText != q.Correct_Option) AS wrong_answers,
          qf.feedback
        FROM 
          student_quiz_details sqd
        LEFT JOIN 
          quiz_feedback qf ON sqd.exam_id = qf.quiz_id AND sqd.student_id = qf.student_id
        JOIN 
          users u ON sqd.student_id = u.UserID
        JOIN 
          exams e ON sqd.exam_id = e.ExamID
        WHERE 
          sqd.exam_id = ?`;
  
      connection.query(query, [examId], (error, results) => {
        if (error) {
          console.error("Error fetching quiz results:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
  
        // Calculate marks obtained and marks deducted
        results.forEach((result) => {
          result.obtain_marks = result.correct_answers;
          result.wrong = result.wrong_answers;
          // Delete temporary columns
          delete result.correct_answers;
          delete result.wrong_answers;
        });
  
        res.json(results);
      });
    }
  );



  router.get("/recentExam/details", verifyToken, checkRole("Faculty"), (req, res) => {
    const query = `
      SELECT 
        e.ExamID,
        e.Title,
        e.Number_of_Questions AS total_questions,
        e.Exam_Total_Marks AS total_marks,
        COALESCE((SELECT MAX(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID), 0) AS max_marks,
        COALESCE((SELECT MIN(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID), 0) AS min_marks,
        COALESCE((SELECT AVG(sqd.total_marks) FROM student_quiz_details sqd WHERE sqd.exam_id = e.ExamID), 0) AS avg_marks,
        (SELECT COUNT(qf.id) FROM quiz_feedback qf WHERE qf.quiz_id = e.ExamID) AS feedback_count
      FROM exams e
      ORDER BY e.created_at DESC
      LIMIT 5
    `;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching exam details:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "No exams found" });
      }
  
      res.json(results);
    });
  });  //tested

  
  
  



// ==================================================   not required  ============================================================================

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

module.exports = router;