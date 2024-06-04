const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const vverifyToken = require("./../middlewares/middleware.js");
const moment = require("moment");

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

// 18. POST /api/student/quizzes/:id/start - Start a quiz
router.post(
  "/quizzes/:examid/start",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const examId = req.params.examid;
    const userId = req.user.userID;

    // Check if the exam status is "started" in the exams table
    const checkQuery = "SELECT status FROM exams WHERE ExamID = ?";
    connection.query(checkQuery, [examId], (error, results) => {
      if (error) {
        console.error("Error checking exam status:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // If the exam status is "started", insert a new record into QuizSubmissions table
      if (results.length > 0 && results[0].status === "Started") {
        const insertQuery =
          "INSERT INTO QuizSubmissions (ExamID, UserID, status) VALUES (?, ?, ?)";
        const values = [examId, userId, "Attempting"];

        connection.query(insertQuery, values, (insertError, insertResults) => {
          if (insertError) {
            console.error("Error inserting into QuizSubmissions:", insertError);
            return res.status(500).json({ error: "Internal server error" });
          }

          // If insertion is successful, send a success response
          return res.status(200).json({ message: "Quiz started successfully" });
        });
      } else {
        // If the exam status is not "started", send an error response
        return res.status(400).json({ error: "Exam not started yet" });
      }
    });
  }
); // tested

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
          const endDateTime = moment(
            `${examDate} ${endTime}`,
            "YYYY-MM-DD HH:mm:ss"
          );
          const currentTime = moment();

          console.log("End Date:", examDate);
          console.log("End Time:", endTime);
          console.log(
            "End Date Time:",
            endDateTime.format("YYYY-MM-DD HH:mm:ss")
          );
          console.log(
            "Current Time:",
            currentTime.format("YYYY-MM-DD HH:mm:ss")
          );

          if (currentTime.isAfter(endDateTime)) {
            return res
              .status(400)
              .json({ error: "Quiz is over, try contacting the Faculty" });
          } else {
            // Check if the user has already submitted this exam
            connection.query(
              "SELECT SubmissionID FROM QuizSubmissions WHERE ExamID = ? AND UserID = ?",
              [examId, userId],
              (error, results) => {
                if (error) {
                  console.error(error);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                } else if (results.length > 0) {
                  // User has already submitted the quiz, update the status
                  const submissionId = results[0].SubmissionID;
                  connection.query(
                    "UPDATE QuizSubmissions SET Status = 'Attempted' WHERE SubmissionID = ?",
                    [submissionId],
                    (updateError) => {
                      if (updateError) {
                        console.error(updateError);
                        return res.status(500).json({ error: "Internal server error" });
                      }

                      // Log the attempt
                      logExamAttempt(examId, userId, "Attempted", (logError) => {
                        if (logError) {
                          return res.status(500).json({ error: logError.message });
                        }

                        insertAnswers(submissionId, answers, res);
                      });
                    }
                  );
                } else {
                  // Log the attempt
                  logExamAttempt(examId, userId, "Attempted", (logError) => {
                    if (logError) {
                      return res.status(500).json({ error: logError.message });
                    }

                    // Create a new submission record
                    connection.query(
                      "INSERT INTO QuizSubmissions (ExamID, UserID, Status) VALUES (?, ?, 'Attempted')",
                      [examId, userId],
                      (insertError, insertResults) => {
                        if (insertError) {
                          console.error(insertError);
                          return res.status(500).json({ error: "Internal server error" });
                        }

                        const submissionId = insertResults.insertId;
                        insertAnswers(submissionId, answers, res);
                      }
                    );
                  });
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
    answer.answer,
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
router.get(
  "/quizzes/:id/results",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const examId = req.params.id;
    const userId = req.user.userID;

    connection.query(
      `SELECT s.SubmissionID, s.SubmissionDate, q.QuestionID, q.QuestionText, q.Correct_Option, q.Mark, a.AnswerText 
     FROM quizsubmissions s 
     JOIN questionanswers a ON s.SubmissionID = a.SubmissionID 
     JOIN questions q ON a.QuestionID = q.QuestionID 
     WHERE s.ExamID = ? AND s.UserID = ? 
     ORDER BY s.SubmissionDate DESC`,
      [examId, userId],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "No submissions found for this exam" });
        }

        // Calculate total marks
        let totalQuestions = results.length;
        let totalMarks = 0;

        results.forEach((result) => {
          if (result.AnswerText === result.Correct_Option) {
            totalMarks += result.Mark; // Add the mark for the correct answer
          }
        });

        // Get student name (assuming student details are stored in the users table)
        connection.query(
          "SELECT Username FROM users WHERE UserID = ?",
          [userId],
          (studentError, studentResults) => {
            if (studentError) {
              console.error(studentError);
              return res.status(500).json({ error: "Internal server error" });
            }

            const studentName = studentResults[0]?.Username;

            // Update student_quiz_details table
            connection.query(
              `INSERT INTO student_quiz_details 
              (student_id, student_name, exam_id, total_questions, total_marks) 
              VALUES (?, ?, ?, ?, ?) 
              ON DUPLICATE KEY UPDATE 
                total_questions = VALUES(total_questions), 
                total_marks = VALUES(total_marks), 
                updated_at = CURRENT_TIMESTAMP`,
              [userId, studentName, examId, totalQuestions, totalMarks],
              (insertError, insertResults) => {
                if (insertError) {
                  console.error(insertError);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                res.json({
                  totalQuestions: totalQuestions,
                  totalMarks: totalMarks,
                  results: results,
                });
              }
            );
          }
        );
      }
    );
  }
); //tested

// Save Quiz Feedback API
router.post("/quizFeedback", verifyToken, checkRole("Student"), (req, res) => {
  const { quiz_id, feedback } = req.body;
  const student_id = req.user.userID;
  const student_name = req.user.username;

  const feedbackInsertQuery =
    "INSERT INTO quiz_feedback(quiz_id, student_id, studentname, feedback) VALUES (?, ?, ?, ?)";
  connection.query(
    feedbackInsertQuery,
    [quiz_id, student_id, student_name, feedback],
    (err, result) => {
      if (err) {
        console.error("Error saving quiz feedback:", err);
        return res.status(500).json({ error: "Failed to save quiz feedback" });
      }
      res.status(201).json({ message: "Quiz feedback saved successfully" });
    }
  );
}); //tested

// View Quiz Feedback API
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

// 25. GET /api/student/quizzes/history - View past quiz attempts and scores
router.get(
  "/quizzes/history",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const userId = req.user.userID;

    const query = `
    SELECT s.SubmissionID, e.Title, s.SubmissionDate, 
           sqd.total_marks AS total_possible_marks, 
           (SELECT SUM(CASE WHEN q.Correct_Option = a.AnswerText THEN 1 ELSE 0 END) 
            FROM questionanswers a 
            JOIN questions q ON a.QuestionID = q.QuestionID 
            WHERE a.SubmissionID = s.SubmissionID) AS score 
    FROM quizsubmissions s 
    JOIN exams e ON s.UserID = e.ExamID 
    JOIN student_quiz_details sqd ON s.ExamID = sqd.exam_id AND s.UserID = sqd.student_id
    WHERE s.UserID = ?
  `;

    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error fetching quiz history:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    });
  }
); //tested

// GET /api/student/upcomingExams - View upcoming exams for a particular student
router.get("/upcomingExams", verifyToken, checkRole("Student"), (req, res) => {
  const studentId = req.user.userID;
  const studentClass = req.user.classs; // Assume class is a property of req.user
  const studentSemester = req.user.sem; // Assume semester is a property of req.user
  const studentBatch = req.user.batch; // Assume batch is a property of req.user

  const query = `
    SELECT e.ExamID, e.Title, e.ExamDate, e.StartTime, e.EndTime, e.Number_of_Questions, e.Exam_Total_Marks, e.subject, e.description , e.Status
    FROM Exams e
    JOIN Users u ON e.className = u.class AND e.sem = u.sem
    WHERE u.UserID = ? AND (e.ExamDate > CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime >= CURTIME()))
    ORDER BY e.ExamDate ASC, e.StartTime ASC
  `;

  connection.query(query, [studentId], (err, results) => {
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
});  //tested



//. GET /api/student/recentExams - View recent exams
router.get("/recentExams", verifyToken, checkRole("Student"), (req, res) => {
  const query = `
    SELECT e.ExamID, e.Title, e.ExamDate, e.StartTime, e.EndTime 
    FROM Exams e
    JOIN Users u ON e.className = u.class AND e.sem = u.sem AND e.batch = u.batch
    WHERE u.UserID = ? AND (e.ExamDate < CURDATE() OR (e.ExamDate = CURDATE() AND e.EndTime < CURTIME()))
    ORDER BY e.ExamDate DESC, e.StartTime DESC
  `;

  connection.query(query, [req.user.userID], (err, results) => {
    if (err) {
      console.error("Error fetching recent exams:", err);
      return res.status(500).json({ error: "Could not fetch recent exams" });
    }

    // Format the exam dates and times using moment.js
    const formattedResults = results.map((exam) => ({
      ...exam,
      ExamDate: moment(exam.ExamDate).format("YYYY-MM-DD"),
      StartTime: moment(exam.StartTime, "HH:mm:ss").format("HH:mm:ss"),
      EndTime: moment(exam.EndTime, "HH:mm:ss").format("HH:mm:ss"),
    }));

    res.json(formattedResults);
  });
}); //tested

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
router.get(
  "/afterAttemptedQuizDetails/:ExamID",
  verifyToken,
  checkRole("Student"),
  (req, res) => {
    const userId = req.user.userID;
    const examID = req.params.ExamID;
    const query = `
    SELECT e.Title, s.SubmissionDate, q.QuestionText, q.Correct_Option AS CorrectAnswer, qa.AnswerText AS SelectedAnswer, q.Mark AS Marks
    FROM quizsubmissions s
    JOIN exams e ON s.ExamID = e.ExamID
    JOIN questionanswers qa ON s.SubmissionID = qa.SubmissionID
    JOIN questions q ON qa.QuestionID = q.QuestionID
    WHERE s.UserID = ? AND s.status = 'Attempted' AND s.ExamID = ?
    ORDER BY s.SubmissionDate DESC
  `;

    connection.query(query, [userId, examID], (err, results) => {
      if (err) {
        console.error("Error fetching after attempted quiz details:", err);
        return res
          .status(500)
          .json({ error: "Could not fetch after attempted quiz details" });
      }

      // Format the results
      const formattedResults = results.map((result) => ({
        Title: result.Title,
        SubmissionDate: result.SubmissionDate,
        QuestionText: result.QuestionText,
        CorrectAnswer: result.CorrectAnswer,
        SelectedAnswer: result.SelectedAnswer,
        Marks: result.Marks,
      }));

      res.json(formattedResults);
    });
  }
); //tested

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
        "INSERT INTO feedback (student_id, student_name, feedback) VALUES (?, ?, ?)";
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


module.exports = router;

