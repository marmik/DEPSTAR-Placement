-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 13, 2024 at 10:27 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_QuizApp`
--

-- --------------------------------------------------------

--
-- Table structure for table `ExamAssignments`
--

CREATE TABLE `ExamAssignments` (
  `AssignmentID` int(11) NOT NULL,
  `ExamID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `AssignedDate` date NOT NULL,
  `DueDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ExamAssignments`
--

INSERT INTO `ExamAssignments` (`AssignmentID`, `ExamID`, `UserID`, `AssignedDate`, `DueDate`) VALUES
(4, 4, NULL, '2024-05-15', '2024-05-20');

-- --------------------------------------------------------

--
-- Table structure for table `Exams`
--

CREATE TABLE `Exams` (
  `ExamID` int(11) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Description` text,
  `CreatorID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Exams`
--

INSERT INTO `Exams` (`ExamID`, `Title`, `Description`, `CreatorID`) VALUES
(3, 'Sample Quiz', 'This is a sample quiz', NULL),
(4, 'Sample Quiz', 'This is a sample quiz', NULL),
(7, 'Sample Quiz', 'This is a sample quiz for testing purposes.', NULL),
(8, 'Sample Quiz', 'This is a sample quiz for testing purposes.', NULL),
(9, 'Sample Quiz', 'This is a sample quiz for testing purposes.', NULL),
(10, 'Sample Quiz', 'This is a sample quiz for testing purposes.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `QuestionAnswers`
--

CREATE TABLE `QuestionAnswers` (
  `AnswerID` int(11) NOT NULL,
  `SubmissionID` int(11) DEFAULT NULL,
  `QuestionID` int(11) DEFAULT NULL,
  `AnswerText` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Questions`
--

CREATE TABLE `Questions` (
  `QuestionID` int(11) NOT NULL,
  `ExamID` int(11) DEFAULT NULL,
  `QuestionText` text NOT NULL,
  `QuestionType` enum('Multiple Choice','True/False','Short Answer') NOT NULL,
  `CorrectAnswer` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Questions`
--

INSERT INTO `Questions` (`QuestionID`, `ExamID`, `QuestionText`, `QuestionType`, `CorrectAnswer`) VALUES
(3, 7, 'What is 2 + 2?', 'Multiple Choice', '4'),
(4, 7, 'Who is the president of the United States?', 'Short Answer', 'Joe Biden'),
(5, 8, 'What is 2 + 2?', 'Multiple Choice', '4'),
(6, 8, 'Who is the president of the United States?', 'Short Answer', 'Joe Biden'),
(7, 9, 'What is 2 + 2?', 'Multiple Choice', '4'),
(8, 9, 'Who is the president of the United States?', 'Short Answer', 'Joe Biden'),
(9, 10, 'What is 2 + 2?', 'Multiple Choice', '4'),
(10, 10, 'Who is the president of the United States?', 'Short Answer', 'Joe Biden');

-- --------------------------------------------------------

--
-- Table structure for table `QuizSubmissions`
--

CREATE TABLE `QuizSubmissions` (
  `SubmissionID` int(11) NOT NULL,
  `ExamID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `SubmissionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `SystemLogs`
--

CREATE TABLE `SystemLogs` (
  `LogID` int(11) NOT NULL,
  `LogDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UserID` int(11) DEFAULT NULL,
  `ActionTaken` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `SystemSettings`
--

CREATE TABLE `SystemSettings` (
  `SettingID` int(11) NOT NULL,
  `SettingName` varchar(100) NOT NULL,
  `SettingValue` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Admin','Teacher','Student') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UserID`, `Username`, `Password`, `Role`) VALUES
(1, 'testuser', '$2b$10$vYdtjB8RjvJ5cwUoCNW6Feqj83ILNlfHiYtvmj36qsOhBggA4GhUe', 'Admin'),
(2, 'example_user', '$2b$10$OBYUd1WCpxUONW4vTCsJzu3v0YBvYrPG3rJCGF98UjTsPZ/5royB2', 'Student'),
(4, 'studenttesting', '$2b$10$m9yg.qL9DeSjD.HaCBguwuTECLFkgzr6lHOlxbWRxDa00qWkLwWeC', 'Student'),
(6, 'marmik', '$2b$10$VkDQW38rHHObSRpWKvJR9ODj4fo2Zgzdt3Z8TvGGEUt1qvsBRvNjW', 'Student'),
(9, 'unique_username_here', '$2b$10$0O.eD05Kv9Fle92FLuc6ouRe3ZY6r0mq8dyvWxVdKzRsyXIxqxYSq', 'Student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ExamAssignments`
--
ALTER TABLE `ExamAssignments`
  ADD PRIMARY KEY (`AssignmentID`),
  ADD KEY `ExamID` (`ExamID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Exams`
--
ALTER TABLE `Exams`
  ADD PRIMARY KEY (`ExamID`),
  ADD KEY `CreatorID` (`CreatorID`);

--
-- Indexes for table `QuestionAnswers`
--
ALTER TABLE `QuestionAnswers`
  ADD PRIMARY KEY (`AnswerID`),
  ADD KEY `SubmissionID` (`SubmissionID`),
  ADD KEY `QuestionID` (`QuestionID`);

--
-- Indexes for table `Questions`
--
ALTER TABLE `Questions`
  ADD PRIMARY KEY (`QuestionID`),
  ADD KEY `fk_exam` (`ExamID`);

--
-- Indexes for table `QuizSubmissions`
--
ALTER TABLE `QuizSubmissions`
  ADD PRIMARY KEY (`SubmissionID`),
  ADD KEY `ExamID` (`ExamID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `SystemLogs`
--
ALTER TABLE `SystemLogs`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `SystemSettings`
--
ALTER TABLE `SystemSettings`
  ADD PRIMARY KEY (`SettingID`),
  ADD UNIQUE KEY `SettingName` (`SettingName`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ExamAssignments`
--
ALTER TABLE `ExamAssignments`
  MODIFY `AssignmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Exams`
--
ALTER TABLE `Exams`
  MODIFY `ExamID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `QuestionAnswers`
--
ALTER TABLE `QuestionAnswers`
  MODIFY `AnswerID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Questions`
--
ALTER TABLE `Questions`
  MODIFY `QuestionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `QuizSubmissions`
--
ALTER TABLE `QuizSubmissions`
  MODIFY `SubmissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SystemLogs`
--
ALTER TABLE `SystemLogs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SystemSettings`
--
ALTER TABLE `SystemSettings`
  MODIFY `SettingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ExamAssignments`
--
ALTER TABLE `ExamAssignments`
  ADD CONSTRAINT `examassignments_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `Exams` (`ExamID`),
  ADD CONSTRAINT `examassignments_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `Exams`
--
ALTER TABLE `Exams`
  ADD CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`CreatorID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `QuestionAnswers`
--
ALTER TABLE `QuestionAnswers`
  ADD CONSTRAINT `questionanswers_ibfk_1` FOREIGN KEY (`SubmissionID`) REFERENCES `QuizSubmissions` (`SubmissionID`),
  ADD CONSTRAINT `questionanswers_ibfk_2` FOREIGN KEY (`QuestionID`) REFERENCES `Questions` (`QuestionID`);

--
-- Constraints for table `Questions`
--
ALTER TABLE `Questions`
  ADD CONSTRAINT `fk_exam` FOREIGN KEY (`ExamID`) REFERENCES `Exams` (`ExamID`) ON DELETE CASCADE,
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `Exams` (`ExamID`);

--
-- Constraints for table `QuizSubmissions`
--
ALTER TABLE `QuizSubmissions`
  ADD CONSTRAINT `quizsubmissions_ibfk_1` FOREIGN KEY (`ExamID`) REFERENCES `Exams` (`ExamID`),
  ADD CONSTRAINT `quizsubmissions_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `SystemLogs`
--
ALTER TABLE `SystemLogs`
  ADD CONSTRAINT `systemlogs_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
