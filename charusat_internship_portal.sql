-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2024 at 04:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `charusat_internship_portol`
--

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `ClassID` int(11) NOT NULL,
  `ClassName` varchar(255) NOT NULL,
  `TeacherID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classexams`
--

CREATE TABLE `classexams` (
  `ClassID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classstudents`
--

CREATE TABLE `classstudents` (
  `ClassID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `examassignments`
--

CREATE TABLE `examassignments` (
  `AssignmentID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `AssignedDate` date NOT NULL,
  `DueDate` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `ExamID` int(11) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Subject` varchar(100) DEFAULT NULL,
  `Number_of_Questions` int(11) DEFAULT NULL,
  `Exam_Total_Marks` int(11) DEFAULT NULL,
  `Status` enum('Not Started','Started','Completed') NOT NULL DEFAULT 'Not Started',
  `ExamDate` date DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Feedback` text DEFAULT NULL,
  `CreatorID` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sem` enum('all','sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8') NOT NULL DEFAULT 'all',
  `className` varchar(255) DEFAULT NULL,
  `batch` enum('all','batchA','batchB','batchC','batchD') NOT NULL DEFAULT 'all'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Table structure for table `exam_logs`
--

CREATE TABLE `exam_logs` (
  `LogID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Status` enum('Attempted','Not Attempted') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `username`, `user_id`, `email`, `feedback`, `created_at`, `updated_at`) VALUES
(1, 'newUsername', 3, 'faculty@example.com', 'The course materials were very well organized and the pace was appropriate. However, I would appreciate more interactive sessions.', '2024-06-03 09:44:09', '2024-06-03 09:44:09'),
(2, 'faculty', 2, 'faculty@example.com', 'The course materials were very well organized and the pace was appropriate. However, I would appreciate more interactive sessions.', '2024-06-03 09:45:28', '2024-06-03 09:45:28');

-- --------------------------------------------------------

--
-- Table structure for table `questionanswers`
--

CREATE TABLE `questionanswers` (
  `AnswerID` int(11) NOT NULL,
  `SubmissionID` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `AnswerText` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Table structure for table `questionoptions`
--

CREATE TABLE `questionoptions` (
  `OptionID` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `OptionA` varchar(255) DEFAULT NULL,
  `OptionB` varchar(255) DEFAULT NULL,
  `OptionC` varchar(255) DEFAULT NULL,
  `OptionD` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `QuestionID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `QuestionText` text NOT NULL,
  `Mark` int(11) DEFAULT NULL,
  `QuestionType` enum('Multiple Choice','True/False','Short Answer') NOT NULL,
  `Correct_Option` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Table structure for table `quizsubmissions`
--

CREATE TABLE `quizsubmissions` (
  `SubmissionID` int(11) NOT NULL,
  `ExamID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `SubmissionDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Table structure for table `quiz_feedback`
--

CREATE TABLE `quiz_feedback` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `studentname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Table structure for table `student_quiz_details`
--

CREATE TABLE `student_quiz_details` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `total_questions` int(11) DEFAULT NULL,
  `total_marks` int(11) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Table structure for table `systemlogs`
--

CREATE TABLE `systemlogs` (
  `LogID` int(11) NOT NULL,
  `LogDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UserID` int(11) DEFAULT NULL,
  `ActionTaken` text DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `systemsettings`
--

CREATE TABLE `systemsettings` (
  `SettingID` int(11) NOT NULL,
  `SettingName` varchar(100) NOT NULL,
  `SettingValue` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Admin','Faculty','Student') NOT NULL,
  `sem` enum('all','sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8') NOT NULL DEFAULT 'all',
  `class` enum('all','ce1','ce2') NOT NULL DEFAULT 'all',
  `batch` enum('all','batchA','batchB','batchC','batchD') NOT NULL DEFAULT 'all',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`ClassID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Indexes for table `classexams`
--
ALTER TABLE `classexams`
  ADD PRIMARY KEY (`ClassID`,`ExamID`),
  ADD KEY `ExamID` (`ExamID`);

--
-- Indexes for table `classstudents`
--
ALTER TABLE `classstudents`
  ADD PRIMARY KEY (`ClassID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `examassignments`
--
ALTER TABLE `examassignments`
  ADD PRIMARY KEY (`AssignmentID`),
  ADD KEY `ExamID` (`ExamID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`ExamID`),
  ADD KEY `CreatorID` (`CreatorID`);

--
-- Indexes for table `exam_logs`
--
ALTER TABLE `exam_logs`
  ADD PRIMARY KEY (`LogID`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questionanswers`
--
ALTER TABLE `questionanswers`
  ADD PRIMARY KEY (`AnswerID`),
  ADD KEY `SubmissionID` (`SubmissionID`),
  ADD KEY `QuestionID` (`QuestionID`);

--
-- Indexes for table `questionoptions`
--
ALTER TABLE `questionoptions`
  ADD PRIMARY KEY (`OptionID`),
  ADD KEY `QuestionID` (`QuestionID`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`QuestionID`),
  ADD KEY `ExamID` (`ExamID`);

--
-- Indexes for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  ADD PRIMARY KEY (`SubmissionID`),
  ADD KEY `ExamID` (`ExamID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `quiz_feedback`
--
ALTER TABLE `quiz_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_quiz_details`
--
ALTER TABLE `student_quiz_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `systemlogs`
--
ALTER TABLE `systemlogs`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `systemsettings`
--
ALTER TABLE `systemsettings`
  ADD PRIMARY KEY (`SettingID`),
  ADD UNIQUE KEY `SettingName` (`SettingName`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `ClassID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examassignments`
--
ALTER TABLE `examassignments`
  MODIFY `AssignmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `ExamID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `exam_logs`
--
ALTER TABLE `exam_logs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `questionanswers`
--
ALTER TABLE `questionanswers`
  MODIFY `AnswerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `questionoptions`
--
ALTER TABLE `questionoptions`
  MODIFY `OptionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `QuestionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  MODIFY `SubmissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `quiz_feedback`
--
ALTER TABLE `quiz_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student_quiz_details`
--
ALTER TABLE `student_quiz_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `systemlogs`
--
ALTER TABLE `systemlogs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `systemsettings`
--
ALTER TABLE `systemsettings`
  MODIFY `SettingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `classexams`
--
ALTER TABLE `classexams`
  ADD CONSTRAINT `classexams_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `classes` (`ClassID`),
  ADD CONSTRAINT `classexams_ibfk_2` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`);

--
-- Constraints for table `classstudents`
--
ALTER TABLE `classstudents`
  ADD CONSTRAINT `classstudents_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `classes` (`ClassID`),
  ADD CONSTRAINT `classstudents_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `examassignments`
--
ALTER TABLE `examassignments`
  ADD CONSTRAINT `examassignments_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`),
  ADD CONSTRAINT `examassignments_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `fk_examassignments_exam` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_examassignments_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`CreatorID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `fk_exams_user` FOREIGN KEY (`CreatorID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `questionanswers`
--
ALTER TABLE `questionanswers`
  ADD CONSTRAINT `fk_questionanswers_question` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_questionanswers_submission` FOREIGN KEY (`SubmissionID`) REFERENCES `quizsubmissions` (`SubmissionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `questionanswers_ibfk_1` FOREIGN KEY (`SubmissionID`) REFERENCES `quizsubmissions` (`SubmissionID`),
  ADD CONSTRAINT `questionanswers_ibfk_2` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`);

--
-- Constraints for table `questionoptions`
--
ALTER TABLE `questionoptions`
  ADD CONSTRAINT `fk_questionoptions_question` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `questionoptions_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `questions` (`QuestionID`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_exam` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`) ON DELETE CASCADE,
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`);

--
-- Constraints for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  ADD CONSTRAINT `fk_quizsubmissions_exam` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_quizsubmissions_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `quizsubmissions_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `exams` (`ExamID`),
  ADD CONSTRAINT `quizsubmissions_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `quiz_feedback`
--
ALTER TABLE `quiz_feedback`
  ADD CONSTRAINT `quiz_feedback_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `exams` (`ExamID`),
  ADD CONSTRAINT `quiz_feedback_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `student_quiz_details`
--
ALTER TABLE `student_quiz_details`
  ADD CONSTRAINT `student_quiz_details_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `student_quiz_details_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`ExamID`);

--
-- Constraints for table `systemlogs`
--
ALTER TABLE `systemlogs`
  ADD CONSTRAINT `fk_systemlogs_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `systemlogs_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
