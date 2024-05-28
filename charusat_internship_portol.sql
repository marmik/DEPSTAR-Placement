-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2024 at 06:32 PM
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
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`ExamID`, `Title`, `Description`, `Subject`, `Number_of_Questions`, `Exam_Total_Marks`, `Status`, `ExamDate`, `StartTime`, `EndTime`, `Feedback`, `CreatorID`, `created_at`, `updated_at`, `sem`, `className`, `batch`) VALUES
(1, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-27 16:18:56', '2024-05-27 16:18:56', '', 'Class name', ''),
(2, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-27 16:19:30', '2024-05-27 16:19:30', '', 'Class name', ''),
(3, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-27 16:24:16', '2024-05-27 16:24:16', '', 'Class name', ''),
(4, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-27 16:24:44', '2024-05-27 16:24:44', '', 'Class name', ''),
(5, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-27 16:26:10', '2024-05-27 16:26:10', '', 'Class name', ''),
(6, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-27 16:27:38', '2024-05-27 16:27:38', '', 'Class name', ''),
(7, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-28 03:57:06', '2024-05-28 03:57:06', '', 'Class name', ''),
(8, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-28 04:00:08', '2024-05-28 04:00:08', '', 'Class name', ''),
(9, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-28 04:01:04', '2024-05-28 04:01:04', '', 'Class name', ''),
(10, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-28 04:06:44', '2024-05-28 04:06:44', '', 'Class name', ''),
(11, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-28 04:08:08', '2024-05-28 04:08:08', '', 'Class name', ''),
(12, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '0000-00-00', '00:00:00', '00:00:00', NULL, 2, '2024-05-28 04:10:11', '2024-05-28 04:10:11', '', 'Class name', ''),
(13, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:14:12', '2024-05-28 04:14:12', '', 'Class name', 'batchA'),
(14, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:36:44', '2024-05-28 04:36:44', '', 'Class name', 'batchA'),
(15, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:38:43', '2024-05-28 04:38:43', '', 'Class name', 'batchA'),
(16, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:43:08', '2024-05-28 04:43:08', '', 'Class name', 'batchA'),
(17, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:44:32', '2024-05-28 04:44:32', '', 'Class name', 'batchA'),
(18, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:45:04', '2024-05-28 04:45:04', '', 'Class name', 'batchA'),
(19, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:47:18', '2024-05-28 04:47:18', '', 'Class name', 'batchA'),
(20, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '10:00:00', '11:00:00', NULL, 2, '2024-05-28 04:47:56', '2024-05-28 04:47:56', '', 'Class name', 'batchA'),
(21, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, '', '2024-05-30', '11:32:59', '11:33:10', NULL, 2, '2024-05-28 06:02:09', '2024-05-28 06:02:09', '', 'Class name', 'batchA'),
(22, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, 'Started', '2024-05-28', '11:36:30', '11:37:10', NULL, 2, '2024-05-28 06:06:17', '2024-05-28 06:06:30', '', 'Class name', 'batchA'),
(23, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, 'Completed', '2024-05-28', '11:43:30', '11:44:00', NULL, 2, '2024-05-28 06:13:02', '2024-05-28 06:14:00', '', 'Class name', 'batchA'),
(24, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, 'Started', '2024-05-28', '12:15:00', '12:20:00', NULL, 2, '2024-05-28 06:44:17', '2024-05-28 06:45:00', '', 'Class name', 'batchA'),
(25, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, 'Completed', '2024-05-28', '17:28:00', '17:34:00', NULL, 2, '2024-05-28 11:57:44', '2024-05-28 12:04:00', '', 'Class name', 'batchA'),
(26, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, 'Completed', '2024-05-28', '18:07:00', '18:10:00', NULL, 2, '2024-05-28 12:36:04', '2024-05-28 12:40:00', '', 'Class name', 'batchA'),
(27, 'Your Quiz Title', 'Description of your quiz', 'Subject of the quiz', 5, 50, 'Completed', '2024-05-28', '21:51:00', '21:55:00', NULL, 2, '2024-05-28 16:20:22', '2024-05-28 16:25:00', '', 'Class name', 'batchA');

-- --------------------------------------------------------

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
-- Dumping data for table `exam_logs`
--

INSERT INTO `exam_logs` (`LogID`, `ExamID`, `UserID`, `Status`, `created_at`, `updated_at`) VALUES
(1, 26, 3, 'Attempted', '2024-05-28 12:38:04', '2024-05-28 12:38:04'),
(2, 26, 3, 'Not Attempted', '2024-05-28 12:42:07', '2024-05-28 12:42:07'),
(3, 26, 3, 'Not Attempted', '2024-05-28 12:43:31', '2024-05-28 12:43:31'),
(4, 26, 3, 'Not Attempted', '2024-05-28 12:43:50', '2024-05-28 12:43:50'),
(5, 26, 3, 'Not Attempted', '2024-05-28 12:43:55', '2024-05-28 12:43:55'),
(6, 27, 3, 'Attempted', '2024-05-28 16:22:13', '2024-05-28 16:22:13'),
(7, 27, 3, 'Not Attempted', '2024-05-28 16:23:55', '2024-05-28 16:23:55');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
-- Dumping data for table `questionanswers`
--

INSERT INTO `questionanswers` (`AnswerID`, `SubmissionID`, `QuestionID`, `AnswerText`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Answer to question 1', '2024-05-25 09:34:56', '2024-05-25 09:34:56'),
(2, 1, 2, 'Answer to question 2', '2024-05-25 09:34:56', '2024-05-25 09:34:56'),
(3, 1, 3, 'Answer to question 3', '2024-05-25 09:34:56', '2024-05-25 09:34:56'),
(4, 5, 1, 'Paris', '2024-05-28 10:57:40', '2024-05-28 10:57:40'),
(5, 5, 2, '42', '2024-05-28 10:57:40', '2024-05-28 10:57:40'),
(6, 5, 3, 'Blue', '2024-05-28 10:57:40', '2024-05-28 10:57:40'),
(7, 5, 1, 'Paris', '2024-05-28 11:06:14', '2024-05-28 11:06:14'),
(8, 5, 2, '42', '2024-05-28 11:06:14', '2024-05-28 11:06:14'),
(9, 5, 3, 'Blue', '2024-05-28 11:06:14', '2024-05-28 11:06:14'),
(10, 5, 1, 'Paris', '2024-05-28 11:07:38', '2024-05-28 11:07:38'),
(11, 5, 2, '42', '2024-05-28 11:07:38', '2024-05-28 11:07:38'),
(12, 5, 3, 'Blue', '2024-05-28 11:07:38', '2024-05-28 11:07:38'),
(13, 5, 1, 'Paris', '2024-05-28 11:16:07', '2024-05-28 11:16:07'),
(14, 5, 2, '42', '2024-05-28 11:16:07', '2024-05-28 11:16:07'),
(15, 5, 3, 'Blue', '2024-05-28 11:16:07', '2024-05-28 11:16:07'),
(16, 5, 1, 'Paris', '2024-05-28 11:23:13', '2024-05-28 11:23:13'),
(17, 5, 2, '42', '2024-05-28 11:23:13', '2024-05-28 11:23:13'),
(18, 5, 3, 'Blue', '2024-05-28 11:23:13', '2024-05-28 11:23:13'),
(19, 5, 1, 'Paris', '2024-05-28 11:24:40', '2024-05-28 11:24:40'),
(20, 5, 2, '42', '2024-05-28 11:24:40', '2024-05-28 11:24:40'),
(21, 5, 3, 'Blue', '2024-05-28 11:24:40', '2024-05-28 11:24:40'),
(22, 5, 1, 'Paris', '2024-05-28 11:29:18', '2024-05-28 11:29:18'),
(23, 5, 2, '42', '2024-05-28 11:29:18', '2024-05-28 11:29:18'),
(24, 5, 3, 'Blue', '2024-05-28 11:29:18', '2024-05-28 11:29:18'),
(25, 5, 1, 'Paris', '2024-05-28 11:29:45', '2024-05-28 11:29:45'),
(26, 5, 2, '42', '2024-05-28 11:29:45', '2024-05-28 11:29:45'),
(27, 5, 3, 'Blue', '2024-05-28 11:29:45', '2024-05-28 11:29:45'),
(28, 5, 1, 'Paris', '2024-05-28 11:30:08', '2024-05-28 11:30:08'),
(29, 5, 2, '42', '2024-05-28 11:30:08', '2024-05-28 11:30:08'),
(30, 5, 3, 'Blue', '2024-05-28 11:30:08', '2024-05-28 11:30:08'),
(31, 5, 1, 'Paris', '2024-05-28 11:31:08', '2024-05-28 11:31:08'),
(32, 5, 2, '42', '2024-05-28 11:31:08', '2024-05-28 11:31:08'),
(33, 5, 3, 'Blue', '2024-05-28 11:31:08', '2024-05-28 11:31:08'),
(34, 5, 1, 'Paris', '2024-05-28 11:36:20', '2024-05-28 11:36:20'),
(35, 5, 2, '42', '2024-05-28 11:36:20', '2024-05-28 11:36:20'),
(36, 5, 3, 'Blue', '2024-05-28 11:36:20', '2024-05-28 11:36:20'),
(37, 5, 1, 'Paris', '2024-05-28 11:37:18', '2024-05-28 11:37:18'),
(38, 5, 2, '42', '2024-05-28 11:37:18', '2024-05-28 11:37:18'),
(39, 5, 3, 'Blue', '2024-05-28 11:37:18', '2024-05-28 11:37:18'),
(40, 5, 1, 'Paris', '2024-05-28 11:37:45', '2024-05-28 11:37:45'),
(41, 5, 2, '42', '2024-05-28 11:37:45', '2024-05-28 11:37:45'),
(42, 5, 3, 'Blue', '2024-05-28 11:37:45', '2024-05-28 11:37:45'),
(43, 5, 1, 'Paris', '2024-05-28 11:46:15', '2024-05-28 11:46:15'),
(44, 5, 2, '42', '2024-05-28 11:46:15', '2024-05-28 11:46:15'),
(45, 5, 3, 'Blue', '2024-05-28 11:46:15', '2024-05-28 11:46:15'),
(46, 5, 1, 'Paris', '2024-05-28 11:47:05', '2024-05-28 11:47:05'),
(47, 5, 2, '42', '2024-05-28 11:47:05', '2024-05-28 11:47:05'),
(48, 5, 3, 'Blue', '2024-05-28 11:47:05', '2024-05-28 11:47:05'),
(49, 6, 1, 'Paris', '2024-05-28 11:59:30', '2024-05-28 11:59:30'),
(50, 6, 2, '42', '2024-05-28 11:59:30', '2024-05-28 11:59:30'),
(51, 6, 3, 'Blue', '2024-05-28 11:59:30', '2024-05-28 11:59:30'),
(52, 7, 1, 'Paris', '2024-05-28 12:38:04', '2024-05-28 12:38:04'),
(53, 7, 2, '42', '2024-05-28 12:38:04', '2024-05-28 12:38:04'),
(54, 7, 3, 'Blue', '2024-05-28 12:38:04', '2024-05-28 12:38:04'),
(55, 8, 1, 'Paris', '2024-05-28 16:22:13', '2024-05-28 16:22:13'),
(56, 8, 2, '42', '2024-05-28 16:22:13', '2024-05-28 16:22:13'),
(57, 8, 3, 'Blue', '2024-05-28 16:22:13', '2024-05-28 16:22:13');

-- --------------------------------------------------------

--
-- Table structure for table `questionoptions`
--

CREATE TABLE `questionoptions` (
  `OptionID` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `OptionText` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `questionoptions`
--

INSERT INTO `questionoptions` (`OptionID`, `QuestionID`, `OptionText`, `created_at`, `updated_at`) VALUES
(1, 35, 'Option A', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(2, 35, 'Option B', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(3, 35, 'Option C', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(4, 35, 'Option D', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(5, 36, 'Option A', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(6, 36, 'Option B', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(7, 36, 'Option C', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(8, 36, 'Option D', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(9, 37, 'Option A', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(10, 37, 'Option B', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(11, 37, 'Option C', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(12, 37, 'Option D', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(13, 38, 'Option A', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(14, 38, 'Option B', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(15, 38, 'Option C', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(16, 38, 'Option D', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(17, 39, 'London', '2024-05-28 05:09:12', '2024-05-28 05:09:12'),
(18, 39, 'Berlin', '2024-05-28 05:09:12', '2024-05-28 05:09:12'),
(19, 39, 'Madrid', '2024-05-28 05:09:12', '2024-05-28 05:09:12'),
(20, 39, 'Paris', '2024-05-28 05:09:12', '2024-05-28 05:09:12'),
(21, 40, 'Option A', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(22, 40, 'Option B', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(23, 40, 'Option C', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(24, 40, 'Option D', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(25, 41, 'Option A', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(26, 41, 'Option B', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(27, 41, 'Option C', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(28, 41, 'Option D', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(29, 42, 'Option A', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(30, 42, 'Option B', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(31, 42, 'Option C', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(32, 42, 'Option D', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(33, 43, 'Option A', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(34, 43, 'Option B', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(35, 43, 'Option C', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(36, 43, 'Option D', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(37, 44, 'Option A', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(38, 44, 'Option B', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(39, 44, 'Option C', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(40, 44, 'Option D', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(41, 45, 'Option A', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(42, 45, 'Option B', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(43, 45, 'Option C', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(44, 45, 'Option D', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(45, 46, 'Option A', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(46, 46, 'Option B', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(47, 46, 'Option C', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(48, 46, 'Option D', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(49, 47, 'Option A', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(50, 47, 'Option B', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(51, 47, 'Option C', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(52, 47, 'Option D', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(53, 48, 'Option A', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(54, 48, 'Option B', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(55, 48, 'Option C', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(56, 48, 'Option D', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(57, 49, 'Option A', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(58, 49, 'Option B', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(59, 49, 'Option C', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(60, 49, 'Option D', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(61, 50, 'Option A', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(62, 50, 'Option B', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(63, 50, 'Option C', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(64, 50, 'Option D', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(65, 51, 'Option A', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(66, 51, 'Option B', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(67, 51, 'Option C', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(68, 51, 'Option D', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(69, 52, 'Option A', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(70, 52, 'Option B', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(71, 52, 'Option C', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(72, 52, 'Option D', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(73, 53, 'Option A', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(74, 53, 'Option B', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(75, 53, 'Option C', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(76, 53, 'Option D', '2024-05-28 16:20:23', '2024-05-28 16:20:23');

-- --------------------------------------------------------

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
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`QuestionID`, `ExamID`, `QuestionText`, `Mark`, `QuestionType`, `Correct_Option`, `created_at`, `updated_at`) VALUES
(1, 2, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-27 16:19:30', '2024-05-27 16:19:30'),
(2, 2, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-27 16:19:30', '2024-05-27 16:19:30'),
(3, 3, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-27 16:24:16', '2024-05-27 16:24:16'),
(4, 3, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-27 16:24:16', '2024-05-27 16:24:16'),
(5, 4, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-27 16:24:44', '2024-05-27 16:24:44'),
(6, 4, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-27 16:24:44', '2024-05-27 16:24:44'),
(7, 5, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-27 16:26:10', '2024-05-27 16:26:10'),
(8, 5, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-27 16:26:10', '2024-05-27 16:26:10'),
(9, 6, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-27 16:27:38', '2024-05-27 16:27:38'),
(10, 6, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-27 16:27:38', '2024-05-27 16:27:38'),
(11, 7, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-28 03:57:06', '2024-05-28 03:57:06'),
(12, 7, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-28 03:57:06', '2024-05-28 03:57:06'),
(13, 8, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-28 04:00:08', '2024-05-28 04:00:08'),
(14, 8, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-28 04:00:08', '2024-05-28 04:00:08'),
(15, 9, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-28 04:01:04', '2024-05-28 04:01:04'),
(16, 9, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-28 04:01:04', '2024-05-28 04:01:04'),
(17, 10, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-28 04:06:44', '2024-05-28 04:06:44'),
(18, 10, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-28 04:06:44', '2024-05-28 04:06:44'),
(19, 11, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-28 04:08:08', '2024-05-28 04:08:08'),
(20, 11, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-28 04:08:08', '2024-05-28 04:08:08'),
(21, 12, 'Question 1', 10, '', 'Correct option for Question 1', '2024-05-28 04:10:11', '2024-05-28 04:10:11'),
(22, 12, 'Question 2', 10, '', 'Correct option for Question 2', '2024-05-28 04:10:11', '2024-05-28 04:10:11'),
(23, 13, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:14:12', '2024-05-28 04:14:12'),
(24, 13, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:14:12', '2024-05-28 04:14:12'),
(25, 14, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:36:44', '2024-05-28 04:36:44'),
(26, 14, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:36:44', '2024-05-28 04:36:44'),
(27, 15, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:38:43', '2024-05-28 04:38:43'),
(28, 15, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:38:43', '2024-05-28 04:38:43'),
(29, 16, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:43:08', '2024-05-28 04:43:08'),
(30, 16, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:43:08', '2024-05-28 04:43:08'),
(31, 17, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:44:32', '2024-05-28 04:44:32'),
(32, 17, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:44:32', '2024-05-28 04:44:32'),
(33, 18, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:45:04', '2024-05-28 04:45:04'),
(34, 18, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:45:04', '2024-05-28 04:45:04'),
(35, 19, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(36, 19, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:47:18', '2024-05-28 04:47:18'),
(37, 20, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(38, 20, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 04:47:56', '2024-05-28 04:47:56'),
(39, 1, 'What is the capital of France?', 5, 'Multiple Choice', 'Paris', '2024-05-28 05:09:12', '2024-05-28 05:09:12'),
(40, 21, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(41, 21, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 06:02:09', '2024-05-28 06:02:09'),
(42, 22, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(43, 22, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 06:06:17', '2024-05-28 06:06:17'),
(44, 23, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(45, 23, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 06:13:02', '2024-05-28 06:13:02'),
(46, 24, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(47, 24, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 06:44:18', '2024-05-28 06:44:18'),
(48, 25, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(49, 25, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 11:57:44', '2024-05-28 11:57:44'),
(50, 26, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(51, 26, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 12:36:04', '2024-05-28 12:36:04'),
(52, 27, 'Question 1', 10, 'Multiple Choice', 'Correct option for Question 1', '2024-05-28 16:20:23', '2024-05-28 16:20:23'),
(53, 27, 'Question 2', 10, 'Multiple Choice', 'Correct option for Question 2', '2024-05-28 16:20:23', '2024-05-28 16:20:23');

-- --------------------------------------------------------

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
-- Dumping data for table `quizsubmissions`
--

INSERT INTO `quizsubmissions` (`SubmissionID`, `ExamID`, `UserID`, `SubmissionDate`, `created_at`, `updated_at`, `status`) VALUES
(1, 3, 3, '2024-05-25 09:23:21', '2024-05-25 09:23:21', '2024-05-25 09:23:21', NULL),
(2, 3, 3, '2024-05-28 05:34:08', '2024-05-28 05:34:08', '2024-05-28 05:34:08', 'started'),
(3, 3, 3, '2024-05-28 05:34:59', '2024-05-28 05:34:59', '2024-05-28 05:34:59', 'started'),
(4, 3, 3, '2024-05-28 05:37:05', '2024-05-28 05:37:05', '2024-05-28 05:37:05', 'started'),
(5, 24, 3, '2024-05-28 10:57:40', '2024-05-28 10:57:40', '2024-05-28 10:57:40', 'Attempted'),
(6, 25, 3, '2024-05-28 11:59:30', '2024-05-28 11:59:30', '2024-05-28 11:59:30', 'Attempted'),
(7, 26, 3, '2024-05-28 12:38:04', '2024-05-28 12:38:04', '2024-05-28 12:38:04', 'Attempted'),
(8, 27, 3, '2024-05-28 16:22:13', '2024-05-28 16:22:13', '2024-05-28 16:22:13', 'Attempted');

-- --------------------------------------------------------

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
-- Dumping data for table `quiz_feedback`
--

INSERT INTO `quiz_feedback` (`id`, `quiz_id`, `student_id`, `feedback`, `created_at`, `updated_at`, `studentname`) VALUES
(1, 3, 3, 'The quiz was well-structured and challenging. I particularly liked the variety of question types.', '2024-05-25 09:46:57', '2024-05-25 09:46:57', NULL);

-- --------------------------------------------------------

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

-- --------------------------------------------------------

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
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `Role`, `sem`, `class`, `batch`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', 'Admin', 'all', 'all', 'all', '2024-05-22 06:08:02', '2024-05-22 06:08:02'),
(2, 'faculty', 'faculty', 'Faculty', 'all', 'all', 'all', '2024-05-22 07:24:19', '2024-05-22 07:24:19'),
(3, 'newUsername', 'student', 'Student', 'all', 'all', 'all', '2024-05-22 07:24:35', '2024-05-25 14:22:51');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

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
  MODIFY `ExamID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `exam_logs`
--
ALTER TABLE `exam_logs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questionanswers`
--
ALTER TABLE `questionanswers`
  MODIFY `AnswerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `questionoptions`
--
ALTER TABLE `questionoptions`
  MODIFY `OptionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `QuestionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `quizsubmissions`
--
ALTER TABLE `quizsubmissions`
  MODIFY `SubmissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `quiz_feedback`
--
ALTER TABLE `quiz_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_quiz_details`
--
ALTER TABLE `student_quiz_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`UserID`);

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
