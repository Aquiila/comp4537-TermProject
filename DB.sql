-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 11, 2021 at 03:50 AM
-- Server version: 10.3.28-MariaDB-log
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `isalabpr_termproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `Endpoint`
--

CREATE TABLE `Endpoint` (
  `Id` int(11) NOT NULL,
  `Url` varchar(200) NOT NULL,
  `Method` enum('GET','POST','PUT','DELETE') NOT NULL,
  `Requests` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Endpoint`
--

INSERT INTO `Endpoint` (`Id`, `Url`, `Method`, `Requests`) VALUES
(1, '/4537/termproject/API/V1/endpoint', 'GET', 65),
(2, '/4537/termproject/API/V1/user/create', 'POST', 6),
(3, '/4537/termproject/API/V1/user/login', 'POST', 43),
(4, '/4537/termproject/API/V1/list', 'POST', 13),
(5, '/4537/termproject/API/V1/list/{id}', 'GET', 72),
(6, '/4537/termproject/API/V1/list/{id}', 'PUT', 1),
(7, '/4537/termproject/API/V1/list/{id}', 'DELETE', 5),
(8, '/4537/termproject/API/V1/todo/{id}', 'POST', 2),
(9, '/4537/termproject/API/V1/todo/{id}', 'GET', 1),
(10, '/4537/termproject/API/V1/todo/{id}', 'PUT', 1),
(11, '/4537/termproject/API/V1/todo/{id}', 'DELETE', 2);

-- --------------------------------------------------------

--
-- Table structure for table `List`
--

CREATE TABLE `List` (
  `Id` int(11) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `UserId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `List`
--

INSERT INTO `List` (`Id`, `Title`, `UserId`) VALUES
(5, 'School', 1),
(6, 'Hobbies', 1),
(7, 'Work', 1),
(8, 'Family', 1),
(9, 'Charity', 1),
(10, 'Friends', 1),
(11, 'Vacation', 1),
(12, 'Pets', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Todo`
--

CREATE TABLE `Todo` (
  `Id` int(11) NOT NULL,
  `Title` varchar(400) NOT NULL,
  `ListId` int(11) NOT NULL,
  `Completed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `Id` int(11) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `Password` varchar(200) NOT NULL,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`Id`, `Name`, `Password`, `IsAdmin`) VALUES
(1, 'testuser', 'e38ad214943daad1d64c102faec29de4afe9da3d', 0),
(2, 'testuser2', '2aa60a8ff7fcd473d321e0146afd9e26df395147', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Endpoint`
--
ALTER TABLE `Endpoint`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `List`
--
ALTER TABLE `List`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `user_id` (`UserId`) USING BTREE;

--
-- Indexes for table `Todo`
--
ALTER TABLE `Todo`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `list_id` (`ListId`) USING BTREE;

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Endpoint`
--
ALTER TABLE `Endpoint`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `List`
--
ALTER TABLE `List`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Todo`
--
ALTER TABLE `Todo`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `List`
--
ALTER TABLE `List`
  ADD CONSTRAINT `list_user_fk` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Todo`
--
ALTER TABLE `Todo`
  ADD CONSTRAINT `todo_list_fk` FOREIGN KEY (`ListId`) REFERENCES `List` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
