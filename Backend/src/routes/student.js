const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const vverifyToken = require("./../middlewares/middleware.js");
const moment = require("moment");
const nodemailer = require('nodemailer');


require("dotenv").config();

const router = express.Router();

const secret = process.env.JWT_SECRET || "yourSecretKey";

const { verifyToken, checkRole } = vverifyToken;

router.use(express.json());
router.use(cookieParser());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "Z",
  // socketPath: process.env.DB_SOCKET_PATH,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id", connection.threadId);
});

router.get("/dashboard", verifyToken, checkRole("Student"), (req, res) => {
  const username = req.user.username;
  res.status(200).json({
    message: `Welcome, ${username}! You have access to this protected endpoint`,
  });
}); // not tested


// student dashboard
router.get("/dashboard/upcomingExamsCount/examClearedCount", verifyToken, checkRole("Student"), async (req, res) => {
  const studentId = req.user.userID;

  // Query to count upcoming exams
  const upcomingExamsQuery = `
    SELECT COUNT(*) AS upcomingExamsCount
    FROM Exams e
    LEFT JOIN quizsubmissions qs ON e.ExamID = qs.ExamID AND qs.UserID = ?
    WHERE (e.ExamDate > CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime >= CURTIME()))
      AND (qs.Status IS NULL OR qs.Status != 'Attempted')
      AND e.className = (SELECT class FROM Users WHERE UserID = ?)
      AND e.sem = (SELECT sem FROM Users WHERE UserID = ?)
  `;

  // Query to count attempted quizzes
  const attemptedQuizzesQuery = `
    SELECT COUNT(*) AS attemptedQuizzesCount
    FROM quizsubmissions
    WHERE UserID = ?
      AND Status = 'Attempted'
  `;

  // Query to fetch quiz details with subject from Exams table
  const studentQuizDetailsQuery = `
    SELECT 
      sqd.exam_id,
      sqd.total_marks,
      e.subject
    FROM student_quiz_details sqd
    INNER JOIN Exams e ON sqd.exam_id = e.ExamID
    WHERE sqd.student_id = ? order by sqd.created_at LIMIT 10
  `;

  try {
    const [upcomingExamsResult, attemptedQuizzesResult, studentQuizDetailsResult] = await Promise.all([
      new Promise((resolve, reject) => {
        connection.query(upcomingExamsQuery, [studentId, studentId, studentId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0].upcomingExamsCount);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(attemptedQuizzesQuery, [studentId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0].attemptedQuizzesCount);
        });
      }),
      new Promise((resolve, reject) => {
        connection.query(studentQuizDetailsQuery, [studentId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      })
    ]);

    res.json({
      upcomingExamsCount: upcomingExamsResult,
      attemptedQuizzesCount: attemptedQuizzesResult,
      studentQuizDetails: studentQuizDetailsResult
    });
  } catch (err) {
    console.error("Error fetching quiz statistics:", err);
    res.status(500).json({ error: "Could not fetch quiz statistics" });
  }
});

// Example protected route handlers
router.post(
  "/clarifications",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const { examId, questionId, clarification } = req.body;
    const userId = req.user.userID;

    connection.query(
      "INSERT INTO SystemLogs (UserID, ActionTaken) VALUES (?, ?)",
      [
        userId,
        `Requested clarification for question ${questionId} in exam ${examId}`,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res
          .status(201)
          .json({ message: "Clarification requested successfully" });
      }
    );
  }
); // not tested

router.get(
  "/clarifications/:id",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const examId = req.params.id;

    connection.query(
      'SELECT l.LogID, l.ActionTaken, q.QuestionText FROM SystemLogs l JOIN Questions q ON l.ActionTaken LIKE CONCAT("%", q.QuestionID, "%") WHERE l.ActionTaken LIKE CONCAT("%", ?, "%")',
      [examId],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
      }
    );
  }
); // not tested


router.post(
  "/quizzes/:examid/start",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const examId = req.params.examid;
    const userId = req.user.userID;

    // Check if the student has already attempted the exam
    const checkSubmissionQuery =
      "SELECT status FROM quizsubmissions WHERE ExamID = ? AND UserID = ?";
    connection.query(
      checkSubmissionQuery,
      [examId, userId],
      (checkError, checkResults) => {
        if (checkError) {
          console.error("Error checking quiz submission status:", checkError);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (checkResults.length > 0 && checkResults[0].status === "Attempted") {
          return res
            .status(400)
            .json({ message: "You have already attempted this exam" });
        } else {
          // Check if the exam status is "started" in the exams table
          const checkExamStatusQuery =
            "SELECT Status FROM exams WHERE ExamID = ?";
          connection.query(
            checkExamStatusQuery,
            [examId],
            (examError, examResults) => {
              if (examError) {
                console.error("Error checking exam status:", examError);
                return res.status(500).json({ error: "Internal server error" });
              }

              // If the exam status is "started"
              if (
                examResults.length > 0 &&
                examResults[0].Status === "Started"
              ) {
                // Check if the status is not "Attempting"
                if (
                  checkResults.length === 0 || 
                  checkResults[0].status !== "Attempting"
                ) {
                  const insertQuery =
                    "INSERT INTO quizsubmissions (ExamID, UserID, status) VALUES (?, ?, ?)";
                  const values = [examId, userId, "Attempting"];

                  connection.query(
                    insertQuery,
                    values,
                    (insertError, insertResults) => {
                      if (insertError) {
                        console.error(
                          "Error inserting into quizsubmissions:",
                          insertError
                        );
                        return res
                          .status(500)
                          .json({ error: "Internal server error" });
                      }

                      // If insertion is successful, send a success response
                      return res
                        .status(200)
                        .json({ message: "Quiz started successfully" });
                    }
                  );
                } else {
                  // If the status is "Attempting", send an error response
                  return res
                    .status(200)
                    .json({ message: "You are already attempting this exam" });
                }
              } else {
                // If the exam status is not "started", send an error response
                return res.status(400).json({ error: "Exam not started yet" });
              }
            }
          );
        }
      }
    );
  }
);


// router.post(
//   "/quizzes/:id/submit",
//   verifyToken,
//   checkRole("Student"),
//   (req, res) => {
//     const examId = req.params.id;
//     const userId = req.user.userID;
//     const answers = req.body.answers;

//     // Validate that answers is defined and is an array
//     if (!answers || !Array.isArray(answers)) {
//       return res.status(400).json({ error: "Invalid or missing answers" });
//     }

//     // Check if the exam is over by comparing the end time
//     connection.query(
//       "SELECT ExamDate, EndTime FROM Exams WHERE ExamID = ?",
//       [examId],
//       (error, results) => {
//         if (error) {
//           console.error(error);
//           return res.status(500).json({ error: "Internal server error" });
//         } else if (results.length === 0) {
//           return res.status(400).json({ error: "Exam not found" });
//         } else {
//           const examDate = moment(results[0].ExamDate).format("YYYY-MM-DD");
//           const endTime = results[0].EndTime;
//           const endDateTime = moment(`${examDate} ${endTime}`, "YYYY-MM-DD HH:mm:ss");
//           const currentTime = moment();

//           console.log("End Date:", examDate);
//           console.log("End Time:", endTime);
//           console.log("End Date Time:", endDateTime.format("YYYY-MM-DD HH:mm:ss"));
//           console.log("Current Time:", currentTime.format("YYYY-MM-DD HH:mm:ss"));

//           const oneMinuteAfterEndTime = endDateTime.clone().add(1, 'minutes');
//           if (currentTime.isAfter(oneMinuteAfterEndTime)) {
//             return res
//               .status(400)
//               .json({ error: "Submission is only allowed within 1 minute after the end time" });
//           } else {
//             // Continue with submission logic
//             // Check if the user has already submitted this exam
//             connection.query(
//               "SELECT SubmissionID FROM QuizSubmissions WHERE ExamID = ? AND UserID = ?",
//               [examId, userId],
//               (error, results) => {
//                 if (error) {
//                   console.error(error);
                  // return res.status(500).json({ error: "Internal server error" });
//                 } else {
//                   if (results.length > 0) {
//                     // Assuming the SubmissionID is the first result's property
//                     const submissionID = results[0].SubmissionID;
//                     // Create a new submission record
//                     insertAnswers(submissionID, answers, res);
//                   } else {
//                     // Handle case where there is no submission found
//                     return res.status(404).json({ error: "Submission not found" });
//                   }
//                 }
//               }
//             );            
//           }
//         }
//       }
//     );
//   }
// );

router.post(
  "/quizzes/:id/submit",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const examId = req.params.id;
    const userId = req.user.userID;
    const answers = req.body.answers;

    // Validate that answers is defined and is an array
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid or missing answers" });
    }

    // Check if the exam is over by comparing the end time
    connection.query(
      "SELECT ExamDate, EndTime FROM Exams WHERE ExamID = ?",
      [examId],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        } else if (results.length === 0) {
          return res.status(400).json({ error: "Exam not found" });
        } else {
          const examDate = moment(results[0].ExamDate).format("YYYY-MM-DD");
          const endTime = results[0].EndTime;
          const endDateTime = moment(`${examDate} ${endTime}`, "YYYY-MM-DD HH:mm:ss");
          const currentTime = moment();

          console.log("End Date:", examDate);
          console.log("End Time:", endTime);
          console.log("End Date Time:", endDateTime.format("YYYY-MM-DD HH:mm:ss"));
          console.log("Current Time:", currentTime.format("YYYY-MM-DD HH:mm:ss"));

          const oneMinuteAfterEndTime = endDateTime.clone().add(1, 'minutes');
          if (currentTime.isAfter(oneMinuteAfterEndTime)) {
            return res
              .status(400)
              .json({ error: "Submission is only allowed within 1 minute after the end time" });
          } else {
            // Continue with submission logic
            // Check if the user has already submitted this exam
            connection.query(
              "SELECT SubmissionID FROM QuizSubmissions WHERE ExamID = ? AND UserID = ?",
              [examId, userId],
              (error, results) => {
                if (error) {
                  console.error(error);
                  return res.status(500).json({ error: "Internal server error" });
                } else {
                  if (results.length > 0) {
                    // Assuming the SubmissionID is the first result's property
                    const submissionID = results[0].SubmissionID;
                    
                    // Update the status to "attempted"
                    connection.query(
                      "UPDATE QuizSubmissions SET Status = 'Attempted' WHERE SubmissionID = ?",
                      [submissionID],
                      (error, results) => {
                        if (error) {
                          console.error(error);
                          return res.status(500).json({ error: "Failed to update submission status" });
                        } else {
                          // Create a new submission record
                          insertAnswers(submissionID, answers, res);
                        }
                      }
                    );
                  } else {
                    // Handle case where there is no submission found
                    return res.status(404).json({ error: "Submission not found" });
                  }
                }
              }
            );
          }
        }
      }
    );
  }
);


const insertAnswers = (submissionId, answers, res) => {
  const values = answers.map((answer) => [
    submissionId,
    answer.questionId,
    answer.selectedOption,
  ]);

  // Insert answers into the database
  connection.query(
    "INSERT INTO QuestionAnswers (SubmissionID, QuestionID, AnswerText) VALUES ?",
    [values],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ message: "Answers submitted successfully" });
    }
  );
}; // function tested

// Function to log exam attempts
const logExamAttempt = (examID, userID, status, callback) => {
  connection.query(
    "INSERT INTO exam_logs (ExamID, UserID, Status) VALUES (?, ?, ?)",
    [examID, userID, status],
    (error) => {
      if (error) return callback(error);
      callback(null);
    }
  );
}; // function tested

// API endpoint for logging "Not Attempted"
router.post(
  "/exams/:id/notAttempted",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const examId = req.params.id;
    const userId = req.user.userID;

    // Check if the exam exists
    connection.query(
      "SELECT * FROM Exams WHERE ExamID = ?",
      [examId],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        } else if (results.length === 0) {
          return res.status(400).json({ error: "Exam not found" });
        } else {
          // Log the "Not Attempted" status
          logExamAttempt(examId, userId, "Not Attempted", (logError) => {
            if (logError) {
              return res.status(500).json({ error: logError.message });
            }
            res.json({ message: "not attempted" });
          });
        }
      }
    );
  }
); //tested

// 20. GET /api/student/quizzes/:id/results - Get quiz results
router.post(
  "/quizzes/:id/results",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const examId = req.params.id;
    const userId = req.user.userID;

    // Query to fetch submission details
    const submissionQuery = `
      SELECT s.SubmissionID, s.SubmissionDate, q.QuestionID, q.QuestionText, q.Correct_Option, q.Mark, a.AnswerText 
      FROM quizsubmissions s 
      JOIN questionanswers a ON s.SubmissionID = a.SubmissionID 
      JOIN questions q ON a.QuestionID = q.QuestionID 
      WHERE s.ExamID = ? AND s.UserID = ? 
      ORDER BY s.SubmissionDate DESC`;

    connection.query(submissionQuery, [examId, userId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No submissions found for this exam" });
      }

      // Calculate total marks
      let totalQuestions = results.length;
      let total_marks = 0;

      results.forEach((result) => {
        if (result.AnswerText === result.Correct_Option) {
          total_marks += result.Mark; // Add the mark for the correct answer
        }
      });

      // Query to get student name
      const studentQuery = "SELECT Username FROM users WHERE UserID = ?";

      connection.query(studentQuery, [userId], (studentError, studentResults) => {
        if (studentError) {
          console.error(studentError);
          return res.status(500).json({ error: "Internal server error" });
        }

        const studentName = studentResults[0]?.Username;

        // Check if data already exists in student_quiz_details
        const checkQuery = "SELECT * FROM student_quiz_details WHERE student_id = ? AND exam_id = ?";

        connection.query(checkQuery, [userId, examId], (checkError, checkResults) => {
          if (checkError) {
            console.error(checkError);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Query to fetch exam details
          const examQuery = `
            SELECT Status, Subject, Title, Description, Number_of_Questions, Exam_Total_Marks, ExamDate, StartTime, EndTime 
            FROM exams 
            WHERE ExamID = ?`;

          connection.query(examQuery, [examId], (examError, examResults) => {
            if (examError) {
              console.error(examError);
              return res.status(500).json({ error: "Internal server error" });
            }

            const examDetails = examResults[0];

            if (checkResults.length > 0) {
              // Data already exists, no need to insert again
              res.json({
                totalQuestions: totalQuestions,
                total_marks: total_marks,
                results: results,
                examDetails: examDetails,
                message: "Data already exists in student_quiz_details"
              });
            } else {
              // Update student_quiz_details table
              const insertQuery = `
                INSERT INTO student_quiz_details 
                (student_id, student_name, exam_id, total_questions, total_marks) 
                VALUES (?, ?, ?, ?, ?)`;

              connection.query(
                insertQuery,
                [userId, studentName, examId, totalQuestions, total_marks],
                (insertError, insertResults) => {
                  if (insertError) {
                    console.error(insertError);
                    return res.status(500).json({ error: "Internal server error" });
                  }

                  res.json({
                    totalQuestions: totalQuestions,
                    total_marks: total_marks,
                    results: results,
                    examDetails: examDetails,
                    message: "Data inserted into student_quiz_details"
                  });
                }
              );
            }
          });
        });
      });
    });
  }
); //tested





// View Quiz Feedback API// Save Quiz Feedback API
router.post("/quizFeedback/:quizId", verifyToken, checkRole("Student"), (req, res) => {
  const quiz_id = req.params.quizId;
  const { ExamFeedback } = req.body;
  const student_id = req.user.userID;

  // Query to fetch student name from users table
  const fetchStudentNameQuery = "SELECT Username FROM users WHERE UserID = ?";
  connection.query(fetchStudentNameQuery, [student_id], (err, results) => {
    if (err) {
      console.error("Error fetching student name:", err);
      return res.status(500).json({ error: "Failed to fetch student name" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student_name = results[0].username;

    const feedbackInsertQuery =
      "INSERT INTO quiz_feedback(quiz_id, student_id, studentname, feedback) VALUES (?, ?, ?, ?)";
    connection.query(
      feedbackInsertQuery,
      [quiz_id, student_id, student_name, ExamFeedback],
      (err, result) => {
        if (err) {
          console.error("Error saving quiz feedback:", err);
          return res.status(500).json({ error: "Failed to save quiz feedback" });
        }
        res.status(201).json({ message: "Quiz feedback saved successfully" });
      }
    );
  });
}); //tested


router.get(
  "/quizFeedback/:quizId",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const quizId = req.params.quizId;

    const feedbackQuery =
      "SELECT studentname, feedback FROM quiz_feedback WHERE quiz_id = ?";
    connection.query(feedbackQuery, [quizId], (err, results) => {
      if (err) {
        console.error("Error fetching quiz feedback:", err);
        return res.status(500).json({ error: "Failed to fetch quiz feedback" });
      }
      res.json(results);
    });
  }
); // tested

// View Student Quiz Details API
router.get(
  "/studentQuizDetails",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const student_id = req.user.userID;

    const detailsQuery = `
    SELECT sqd.id, sqd.student_name, e.Title as quiz_title, sqd.total_questions, sqd.total_marks, sqd.time
    FROM student_quiz_details sqd
    JOIN exams e ON sqd.exam_id = e.ExamID
    WHERE sqd.student_id = ?
  `;
    connection.query(detailsQuery, [student_id], (err, results) => {
      if (err) {
        console.error("Error fetching student quiz details:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch student quiz details" });
      }
      res.json(results);
    });
  }
); // tested

// 21. GET /api/student/profile - View student profile
router.get("/viewprofile", verifyToken, checkRole("Student"), (req, res) => {
  const userId = req.user.userID;

  connection.query(
    "SELECT Username, Role FROM Users WHERE UserID = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      } else if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(results[0]);
    }
  );
}); // tested

// 22. PUT /api/student/profile - Edit user profile
router.put("/editprofile", verifyToken, checkRole("Student"), (req, res) => {
  const userId = req.user.userID;
  const { username } = req.body;

  connection.query(
    "UPDATE Users SET Username = ? WHERE UserID = ?",
    [username, userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      } else if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "Profile updated successfully" });
    }
  );
}); //tested

// 23. GET /api/student/quizzes - View available quizzes
router.get("/quizzes", verifyToken, checkRole("Student"), (req, res) => {
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
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    }
  );
}); //TESTED

// 24. GET /api/student/quizzes/:id - View details of a specific quiz
router.get(
  "/quizzes_details/:id",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
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
          return res.status(500).json({ error: "Internal server error" });
        } else if (results.length === 0) {
          return res.status(404).json({ error: "Exam not found" });
        }
        res.json(results[0]);
      }
    );
  }
); // already there in faculty USE THAT API

// // 25. GET /api/student/quizzes/history - View past quiz attempts and scores
// router.get(
//   "/quizzes/history",
//   verifyToken,
//   checkRole("Student"),
//   (req, res) => {
//     const userId = req.user.userID;

//     const query = `
//     SELECT 
//       e.ExamID,
//       s.SubmissionID, 
//       e.Title, 
//       s.SubmissionDate, 
//       sqd.total_marks AS obtain_Marks, 
//       e.Number_of_Questions AS total_question, 
//       e.Exam_Total_Marks AS total_marks, 
//       (SELECT SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN 1 ELSE 0 END) 
//        FROM questionanswers a 
//        JOIN questions q ON a.QuestionID = q.QuestionID 
//        WHERE a.SubmissionID = s.SubmissionID) AS score 
//     FROM 
//       quizsubmissions s 
//     JOIN 
//       exams e ON s.ExamID = e.ExamID 
//     JOIN 
//       student_quiz_details sqd ON s.ExamID = sqd.exam_id AND s.UserID = sqd.student_id
//     WHERE 
//       s.UserID = ?
//     `;

//     connection.query(query, [userId], (error, results) => {
//       if (error) {
//         console.error("Error fetching quiz history:", error);
//         return res.status(500).json({ error: "Internal server error" });
//       }
//       res.json(results);
//     });
//   }
// );  //tested

// router.get(
//   "/quizzes/history",
//   verifyToken,
//   checkRole("Student"),
//   (req, res) => {
//     const userId = req.user.userID;

//     const query = `
//       SELECT 
//         e.ExamID AS quizID,
//         e.Subject AS subject,
//         e.Title AS title,
//         e.ExamDate AS date,
//         e.Number_of_Questions AS totalQuestions,
//         e.Exam_Total_Marks AS totalMarks,
//         (SELECT 
//           SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN q.Mark ELSE 0 END) 
//          FROM 
//           questionanswers a 
//          JOIN 
//           questions q ON a.QuestionID = q.QuestionID 
//          WHERE 
//           a.SubmissionID = s.SubmissionID
//         ) AS obtainMarks
//       FROM 
//         exams e
//       JOIN 
//         quizsubmissions s ON e.ExamID = s.ExamID
//       JOIN 
//         users u ON e.className = u.class AND e.sem = u.sem AND e.batch = u.batch
//       WHERE 
//         u.UserID = ? 
//         AND (e.ExamDate < CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime < CURTIME()))
//       ORDER BY 
//         e.ExamDate DESC, e.StartTime DESC
//     `;

//     connection.query(query, [userId], (err, results) => {
//       if (err) {
//         console.error("Error fetching recent exams:", err);
//         return res.status(500).json({ error: "Could not fetch recent exams" });
//       }

//       // Format the exam dates using moment.js
//       const formattedResults = results.map((exam) => ({
//         ...exam,
//         date: moment(exam.date).format("YYYY-MM-DD"),
//       }));

//       res.json(formattedResults);
//     });
//   }
// );

router.get(
  "/quizzes/history",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const userId = req.user.userID;

    const query = `
      SELECT 
        e.ExamID AS quizID,
        e.Subject AS subject,
        e.Title AS title,
        e.ExamDate AS date,
        e.Number_of_Questions AS totalQuestions,
        e.Exam_Total_Marks AS totalMarks,
        (SELECT 
          SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN q.Mark ELSE 0 END) 
         FROM 
          questionanswers a 
         JOIN 
          questions q ON a.QuestionID = q.QuestionID 
         WHERE 
          a.SubmissionID = s.SubmissionID
        ) AS obtainMarks,
        s.SubmissionDate AS submissionTime
      FROM 
        exams e
      JOIN 
        quizsubmissions s ON e.ExamID = s.ExamID
      JOIN 
        users u ON e.className = u.class AND e.sem = u.sem AND e.batch = u.batch
      WHERE 
        u.UserID = ? 
        AND s.status = 'Attempted'
        AND (e.ExamDate < CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime < CURTIME()))
      ORDER BY 
        s.SubmissionDate DESC, e.ExamDate DESC, e.StartTime DESC
    `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching recent exams:", err);
        return res.status(500).json({ error: "Could not fetch recent exams" });
      }

      // Format the exam dates using moment.js
      const formattedResults = results.map((exam) => ({
        ...exam,
        date: moment(exam.date).format("YYYY-MM-DD"),
        submissionTime: moment(exam.submissionTime).format("YYYY-MM-DD HH:mm:ss")
      }));

      res.json(formattedResults);
    });
  }
);




// // GET /api/student/upcomingExams - View upcoming exams for a particular student
// router.get("/upcomingExams", verifyToken, checkRole("Student"), (req, res) => {
//   const studentId = req.user.userID;
//   const studentClass = req.user.class; // Assume class is a property of req.user
//   const studentSemester = req.user.sem; // Assume semester is a property of req.user
//   const studentBatch = req.user.batch; // Assume batch is a property of req.user

//   const query = `
//     SELECT e.ExamID, e.Title, e.ExamDate, e.StartTime, e.EndTime, e.Number_of_Questions, e.Exam_Total_Marks, e.Subject, e.Description, e.Status
//     FROM Exams e
//     JOIN Users u ON e.className = u.class AND e.sem = u.sem
//     LEFT JOIN quizsubmissions qs ON e.ExamID = qs.ExamID AND qs.UserID = ?
//     WHERE u.UserID = ? 
//       AND (e.ExamDate > CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime >= CURTIME()))
//       AND (qs.Status IS NULL OR qs.Status != 'Attempted')
//     ORDER BY e.ExamDate ASC, e.StartTime ASC
//   `;

//   connection.query(query, [studentId, studentId], (err, results) => {
//     if (err) {
//       console.error("Error fetching upcoming exams:", err);
//       return res.status(500).json({ error: "Could not fetch upcoming exams" });
//     }

//     // Format the exam dates and times using moment.js
//     const formattedResults = results.map((exam) => ({
//       ...exam,
//       ExamDate: moment(exam.ExamDate).format("YYYY-MM-DD"),
//       StartTime: moment(exam.StartTime, "HH:mm:ss").format("HH:mm:ss"),
//       EndTime: moment(exam.EndTime, "HH:mm:ss").format("HH:mm:ss")
//     }));

//     res.json(formattedResults);
//   });
// });

// GET /api/student/upcomingExams - View upcoming exams for a particular student
router.get("/upcomingExams", verifyToken, checkRole("Student"), (req, res) => {
  const studentId = req.user.userID;
  const studentClass = req.user.class; // Assume class is a property of req.user
  const studentSemester = req.user.sem; // Assume semester is a property of req.user
  const studentBatch = req.user.batch; // Assume batch is a property of req.user

  const query = `
    SELECT e.ExamID, e.Title, e.ExamDate, e.StartTime, e.EndTime, e.Number_of_Questions, e.Exam_Total_Marks, e.Subject, e.Description, e.Status
    FROM Exams e
    JOIN Users u ON e.className = u.class AND e.sem = u.sem
    LEFT JOIN quizsubmissions qs ON e.ExamID = qs.ExamID AND qs.UserID = ?
    WHERE u.UserID = ? 
      AND (e.ExamDate > CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime >= CURTIME()))
      AND (qs.Status IS NULL OR qs.Status != 'Attempted')
    ORDER BY e.ExamDate ASC, e.StartTime ASC
  `;

  connection.query(query, [studentId, studentId], (err, results) => {
    if (err) {
      console.error("Error fetching upcoming exams:", err);
      return res.status(500).json({ error: "Could not fetch upcoming exams" });
    }

    // Format the exam dates and times using moment.js
    const formattedResults = results.map((exam) => ({
      ...exam,
      ExamDate: moment(exam.ExamDate).format("YYYY-MM-DD"),
      StartTime: moment(exam.StartTime, "HH:mm:ss").format("HH:mm:ss"),
      EndTime: moment(exam.EndTime, "HH:mm:ss").format("HH:mm:ss")
    }));

    res.json(formattedResults);
  });
});



// //. GET /api/student/recentExams - View recent exams
// router.get("/recentExams", verifyToken, checkRole("Student"), (req, res) => {
//   const query = `
//     SELECT e.ExamID, e.Title, e.ExamDate, e.StartTime, e.EndTime 
//     FROM Exams e
//     JOIN Users u ON e.className = u.class AND e.sem = u.sem AND e.batch = u.batch
//     WHERE u.UserID = ? AND (e.ExamDate < CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime < CURTIME()))
//     ORDER BY e.ExamDate DESC, e.StartTime DESC
//   `;

//   connection.query(query, [req.user.userID], (err, results) => {
//     if (err) {
//       console.error("Error fetching recent exams:", err);
//       return res.status(500).json({ error: "Could not fetch recent exams" });
//     }

//     // Format the exam dates and times using moment.js
//     const formattedResults = results.map((exam) => ({
//       ...exam,
//       ExamDate: moment(exam.ExamDate).format("YYYY-MM-DD"),
//       StartTime: moment(exam.StartTime, "HH:mm:ss").format("HH:mm:ss"),
//       EndTime: moment(exam.EndTime, "HH:mm:ss").format("HH:mm:ss"),
//     }));

//     res.json(formattedResults);
//   });
// }); //tested


// // GET /api/student/recentExams - View recent exams
// router.get("/recentExams", verifyToken, checkRole("Student"), (req, res) => {
//   const userId = req.user.userID;

//   const query = `
//     SELECT 
//       e.ExamID AS quizID,
//       e.Subject AS subject,
//       e.Title AS title,
//       e.ExamDate AS date,
//       e.Number_of_Questions AS totalQuestions,
//       e.Exam_Total_Marks AS totalMarks,
//       (SELECT 
//         SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN q.Mark ELSE 0 END) 
//        FROM 
//         questionanswers a 
//        JOIN 
//         questions q ON a.QuestionID = q.QuestionID 
//        WHERE 
//         a.SubmissionID = s.SubmissionID
//       ) AS obtainMarks
//     FROM 
//       exams e
//     JOIN 
//       quizsubmissions s ON e.ExamID = s.ExamID
//     JOIN 
//       users u ON e.className = u.class AND e.sem = u.sem AND e.batch = u.batch
//     WHERE 
//       u.UserID = ? 
//       AND (e.ExamDate < CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime < CURTIME()))
//     ORDER BY 
//       e.ExamDate DESC, e.StartTime DESC
//     LIMIT 5
//   `;

//   connection.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching recent exams:", err);
//       return res.status(500).json({ error: "Could not fetch recent exams" });
//     }

//     // Format the exam dates and times using moment.js
//     const formattedResults = results.map((exam) => ({
//       ...exam,
//       date: moment(exam.date).format("YYYY-MM-DD"),
//     }));

//     res.json(formattedResults);
//   });
// }); // tested

router.get("/recentExams", verifyToken, checkRole("Student"), (req, res) => {
  const userId = req.user.userID;

  const query = `
    SELECT 
      e.ExamID AS quizID,
      e.Subject AS subject,
      e.Title AS title,
      e.ExamDate AS date,
      e.Number_of_Questions AS totalQuestions,
      e.Exam_Total_Marks AS totalMarks,
      (SELECT 
        SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN q.Mark ELSE 0 END) 
       FROM 
        questionanswers a 
       JOIN 
        questions q ON a.QuestionID = q.QuestionID 
       WHERE 
        a.SubmissionID = s.SubmissionID
      ) AS obtainMarks
    FROM 
      exams e
    JOIN 
      quizsubmissions s ON e.ExamID = s.ExamID
    JOIN 
      users u ON e.className = u.class AND e.sem = u.sem AND e.batch = u.batch
    WHERE 
      u.UserID = ? 
      AND s.status = 'Attempted'
      AND (e.ExamDate < CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime < CURTIME()))
    ORDER BY 
      e.ExamDate DESC, e.StartTime DESC
    LIMIT 5
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching recent exams:", err);
      return res.status(500).json({ error: "Could not fetch recent exams" });
    }

    // Format the exam dates using moment.js
    const formattedResults = results.map((exam) => ({
      ...exam,
      date: moment(exam.date).format("YYYY-MM-DD"),
    }));

    res.json(formattedResults);
  });
});

//. GET /api/student/recentAttemptedQuizzes - View recent attempted quizzes
router.get(
  "/recentAttemptedQuizzes",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const userId = req.user.userID;
    const query = `select * from quizsubmissions where UserID = userId AND status='Attempted'
  `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching recent attempted quizzes:", err);
        return res
          .status(500)
          .json({ error: "Could not fetch recent attempted quizzes" });
      }
      res.json(results);
    });
  }
); //tested

//. GET /api/student/afterAttemptedQuizDetails - View after attempted quiz details
router.get('/quizDetails/:id', verifyToken, checkRole('Student'), (req, res) => {
  const quizId = req.params.id;
  const examQuery = "SELECT * FROM Exams WHERE ExamID = ?";
  const questionsQuery = "SELECT * FROM Questions WHERE ExamID = ?";
  const optionsQuery = "SELECT * FROM QuestionOptions WHERE QuestionID = ?";
  const feedbackQuery = "SELECT feedback FROM quiz_feedback WHERE quiz_id = ?";
  const marksQuery = "SELECT Mark FROM Questions WHERE QuestionID = ?";
  const totalMarksQuery = "SELECT total_marks FROM student_quiz_details WHERE student_id = ? AND exam_id = ?";

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
          feedback: '',
          totalMarks: 0
        });
      }

      // Fetch options and selected option for each question
      const fetchQuestionsPromises = questionsResults.map(question => {
        return new Promise((resolve, reject) => {
          connection.query(optionsQuery, [question.QuestionID], (err, optionsResults) => {
            if (err) {
              reject(err);
            } else {
              // Fetch selected option by student
              connection.query('SELECT AnswerText FROM questionanswers WHERE SubmissionID IN (SELECT SubmissionID FROM quizsubmissions WHERE ExamID = ? AND UserID = ?) AND QuestionID = ?', [quizId, req.user.userID, question.QuestionID], (err, selectedOptionResult) => {
                if (err) {
                  reject(err);
                } else {
                  const selectedOption = selectedOptionResult[0] ? selectedOptionResult[0].AnswerText : null;
                  // Fetch marks for the question
                  connection.query(marksQuery, [question.QuestionID], (err, marksResult) => {
                    if (err) {
                      reject(err);
                    } else {
                      const marks = marksResult[0] ? marksResult[0].Mark : 0;
                      const isCorrect = selectedOption === question.Correct_Option;
                      const obtainMarks = isCorrect ? marks : 0;
                      question.options = optionsResults;
                      question.selectedOption = selectedOption;
                      question.obtainMarks = obtainMarks;
                      resolve(question);
                    }
                  });
                }
              });
            }
          });
        });
      });

      // Fetch feedback
      connection.query(feedbackQuery, [quizId], (err, feedbackResults) => {
        if (err) {
          console.error('Error fetching feedback:', err);
          return res.status(500).json({ error: 'Could not fetch feedback' });
        }

        const feedbackTexts = feedbackResults.map(feedback => feedback.feedback);

        // Concatenate feedback texts into a single string
        const allFeedback = feedbackTexts.join('\n');

        // Fetch total marks
        connection.query(totalMarksQuery, [req.user.userID, quizId], (err, totalMarksResult) => {
          if (err) {
            console.error('Error fetching total marks:', err);
            return res.status(500).json({ error: 'Could not fetch total marks' });
          }

          const totalMarks = totalMarksResult[0] ? totalMarksResult[0].total_marks : 0;

          // Wait for all questions to be fetched
          Promise.all(fetchQuestionsPromises)
            .then(questionsWithDetails => {
              res.json({
                exam: examResults[0],
                questions: questionsWithDetails,
                feedback: allFeedback,
                totalMarks: totalMarks
              });
            })
            .catch(err => {
              console.error('Error fetching question details:', err);
              res.status(500).json({ error: 'Could not fetch question details' });
            });
        });
      });
    });
  });
});
//. GET /api/student/quizFeedback - View quiz feedback
router.post(
  "/systemFeedback",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const { feedback } = req.body;
    const student_id = req.user.userID;
    console.log(student_id);

    // Query to fetch student name based on student ID
    const studentNameQuery =
      "SELECT Username AS student_name FROM users WHERE UserID = ?";
      console.log(student_name);

    // Execute the query to fetch student name
    connection.query(studentNameQuery, [student_id], (nameErr, nameResult) => {
      if (nameErr) {
        console.error("Error fetching student name:", nameErr);
        return res.status(500).json({ error: "Failed to fetch student name" });
      }

      // Extract student name from the result
      const student_name = nameResult[0].student_name;

      // Insert feedback into the database
      const feedbackInsertQuery =
        "INSERT INTO feedback (student_id, studentname, feedback) VALUES (?, ?, ?)";
      connection.query(
        feedbackInsertQuery,
        [student_id, student_name, feedback],
        (err, result) => {
          if (err) {
            console.error("Error saving system feedback:", err);
            return res
              .status(500)
              .json({ error: "Failed to save system feedback" });
          }
          res
            .status(201)
            .json({ message: "System feedback saved successfully" });
        }
      );
    });
  }
); //  tested

//. GET /api/studentPerformanceGraph - View student performance graph
router.get(
  "/studentPerformanceGraph",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
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
        console.error("Error fetching student performance graph:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch student performance graph" });
      }
      res.json(results);
    });
  }
);

// Define the endpoint to get questions with their options and marks
router.get("/examQuestions/:examId", verifyToken, checkRole("Student"), (req, res) => {
  const examId = req.params.examId;

  const getQuestionsQuery = `
    SELECT 
      q.QuestionID, 
      q.QuestionText, 
      q.QuestionType, 
      q.Mark,
      qo.OptionID, 
      qo.OptionA,
      qo.OptionB,
      qo.OptionC,
      qo.OptionD,
      e.StartTime, 
      e.EndTime, 
      e.ExamDate, 
      e.Title
    FROM 
      questions q
    LEFT JOIN 
      questionoptions qo ON q.QuestionID = qo.QuestionID
    LEFT JOIN
      exams e ON q.ExamID = e.ExamID
    WHERE 
      q.ExamID = ?
  `;

  connection.query(getQuestionsQuery, [examId], (err, results) => {
    if (err) {
      console.error("Error fetching exam questions:", err);
      return res.status(500).json({ error: "Failed to fetch exam questions" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No questions found for this exam" });
    }

    // Get exam details from the first row (assuming all rows have the same exam details)
    const examDetails = {
      startTime: results[0].StartTime,
      endTime: results[0].EndTime,
      examDate: results[0].ExamDate,
      title: results[0].Title
    };

    // Organize questions with their options
    const questions = {};
    results.forEach(row => {
      if (!questions[row.QuestionID]) {
        questions[row.QuestionID] = {
          questionId: row.QuestionID,
          questionText: row.QuestionText,
          questionType: row.QuestionType,
          questionMark: row.Mark,
          options: []
        };
      }
      if (row.OptionID) {
        questions[row.QuestionID].options.push({
          optionId: row.OptionID,
          OptionA: row.OptionA,
          OptionB: row.OptionB,
          OptionC: row.OptionC,
          OptionD: row.OptionD
        });
      }
    });

    // Convert the questions object to an array
    const formattedResults = {
      examDetails: examDetails,
      questions: Object.values(questions)
    };
    
    res.json(formattedResults);
  });
});  //tested




// POST /api/faculty/feedback - Submit faculty feedback
router.post("/feedback", verifyToken, checkRole("Student"), (req, res) => {
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



router.get('/quizDetails/:id', verifyToken, checkRole('Student'), (req, res) => {
  const quizId = req.params.id;
  const examQuery = "SELECT * FROM Exams WHERE ExamID = ?";
  const questionsQuery = "SELECT * FROM Questions WHERE ExamID = ?";
  const optionsQuery = "SELECT * FROM QuestionOptions WHERE QuestionID = ?";
  const feedbackQuery = "SELECT COUNT(*) AS total_feedback FROM quiz_feedback WHERE quiz_id = ?";
  const attemptsQuery = "SELECT COUNT(DISTINCT UserID) AS total_completed FROM quizsubmissions WHERE ExamID = ? AND Status = 'Attempted'";
  const maxMarksQuery = "SELECT MAX(Exam_Total_Marks) AS max_marks FROM Exams WHERE ExamID = ?";
  const minMarksQuery = "SELECT MIN(Exam_Total_Marks) AS min_marks FROM Exams WHERE ExamID = ?";
  const avgMarksQuery = "SELECT AVG(Exam_Total_Marks) AS avg_marks FROM Exams WHERE ExamID = ?";

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
                  total_feedback: 0,
                  total_completed: 0,
                  max_marks: 0,
                  min_marks: 0,
                  avg_marks: 0
              });
          }

          // Fetch options and selected option for each question
          const fetchOptionsPromises = questionsResults.map(question => {
              return new Promise((resolve, reject) => {
                  connection.query(optionsQuery, [question.QuestionID], (err, optionsResults) => {
                      if (err) {
                          reject(err);
                      } else {
                          // Fetch selected option by student
                          connection.query('SELECT AnswerText FROM questionanswers WHERE SubmissionID IN (SELECT SubmissionID FROM quizsubmissions WHERE ExamID = ? AND UserID = ?) AND QuestionID = ?', [quizId, req.user.userID, question.QuestionID], (err, selectedOptionResult) => {
                              if (err) {
                                  reject(err);
                              } else {
                                  const selectedOption = selectedOptionResult[0] ? selectedOptionResult[0].AnswerText : null;
                                  question.options = optionsResults;
                                  question.selectedOption = selectedOption;
                                  resolve(question);
                              }
                          });
                      }
                  });
              });
          });

          // Fetch additional information
          Promise.all([
              queryPromise(feedbackQuery, [quizId]),
              queryPromise(attemptsQuery, [quizId]),
              queryPromise(maxMarksQuery, [quizId]),
              queryPromise(minMarksQuery, [quizId]),
              queryPromise(avgMarksQuery, [quizId])
          ])
          .then(([feedbackResults, attemptsResults, maxMarksResults, minMarksResults, avgMarksResults]) => {
              const total_feedback = feedbackResults[0].total_feedback;
              const total_completed = attemptsResults[0].total_completed;
              const max_marks = maxMarksResults[0].max_marks;
              const min_marks = minMarksResults[0].min_marks;
              const avg_marks = avgMarksResults[0].avg_marks;

              // Wait for all options to be fetched
              Promise.all(fetchOptionsPromises)
                  .then(questionsWithOptions => {
                      res.json({
                          exam: examResults[0],
                          questions: questionsWithOptions,
                          total_feedback: total_feedback,
                          total_completed: total_completed,
                          max_marks: max_marks,
                          min_marks: min_marks,
                          avg_marks: avg_marks
                      });
                  })
                  .catch(err => {
                      console.error('Error fetching question options:', err);
                      res.status(500).json({ error: 'Could not fetch question options' });
                  });
          })
          .catch(err => {
              console.error('Error fetching additional information:', err);
              res.status(500).json({ error: 'Could not fetch additional information' });
          });
      });
  });
});   //tested

// Helper function for executing SQL queries
function queryPromise(query, params) {
  return new Promise((resolve, reject) => {
      connection.query(query, params, (error, results) => {
          if (error) {
              reject(error);
          } else {
              resolve(results);
          }
      });
  });
}



// ========================================================== mail =====================================================================


// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});


// Endpoint to send email
router.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
  };

  try {
      await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
  }
});


module.exports = router;

