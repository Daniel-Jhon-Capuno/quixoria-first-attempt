-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2026 at 04:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quixoria`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(512) NOT NULL,
  `author` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_url` varchar(512) DEFAULT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `genre` varchar(100) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `description`, `cover_url`, `price`, `genre`, `rating`, `created_at`) VALUES
(206, 'The Da Vinci Code', 'Dan Brown', 'A murder in the Louvre leads to a trail of clues hidden in the works of Leonardo da Vinci.', 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg', 1299, 'Fiction', 0.00, '2026-02-26 08:37:23'),
(207, 'Gone with the Wind', 'Margaret Mitchell', 'A headstrong Southern belle navigates love and survival during the Civil War.', 'https://covers.openlibrary.org/b/isbn/9781451635621-L.jpg', 1199, 'Classic', 0.00, '2026-02-26 08:37:23'),
(208, 'The Hitchhiker\'s Guide to the Galaxy', 'Douglas Adams', 'An ordinary man is whisked through space after Earth is demolished to make way for a hyperspace bypass.', 'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg', 999, 'Fiction', 0.00, '2026-02-26 08:37:23'),
(209, 'Dune', 'Frank Herbert', 'A young nobleman arrives on a desert planet and discovers his destiny among its native people.', 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg', 1499, 'Fantasy', 0.00, '2026-02-26 08:37:23'),
(210, 'The Hobbit', 'J.R.R. Tolkien', 'A homebody hobbit embarks on an unexpected journey with a wizard and dwarves to reclaim a mountain.', 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg', 1099, 'Fantasy', 0.00, '2026-02-26 08:37:23'),
(211, 'Rebecca', 'Daphne du Maurier', 'A young bride is haunted by the memory of her husband\'s beautiful and mysterious first wife.', 'https://covers.openlibrary.org/b/isbn/9780380730407-L.jpg', 999, 'Classic', 0.00, '2026-02-26 08:37:23'),
(212, 'The Secret History', 'Donna Tartt', 'A group of classics students at an elite Vermont college commit a terrible act and struggle with the aftermath.', 'https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg', 1299, 'Fiction', 0.00, '2026-02-26 08:37:23'),
(213, 'Educated', 'Tara Westover', 'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.', 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg', 1199, 'Fiction', 0.00, '2026-02-26 08:37:23'),
(214, 'The Midnight Library', 'Matt Haig', 'A library between life and death contains books of every life a woman could have lived.', 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg', 1199, 'Fiction', 0.00, '2026-02-26 08:37:23'),
(215, 'Where the Crawdads Sing', 'Delia Owens', 'A girl raised alone in the marsh of North Carolina becomes a suspect in a murder mystery.', 'https://covers.openlibrary.org/b/isbn/9780735224292-L.jpg', 1299, 'Fiction', 0.00, '2026-02-26 08:37:23'),
(216, 'Pride and Prejudice and Zombies', 'Seth Grahame-Smith', 'Jane Austen\'s classic reimagined with zombie-slaying heroines in Regency England.', 'https://covers.openlibrary.org/b/isbn/9781594743344-L.jpg', 1099, 'Romance', 0.00, '2026-02-26 08:37:23'),
(217, 'The Kiss Quotient', 'Helen Hoang', 'An autistic econometrist hires an escort to help her practice relationships and falls in love.', 'https://covers.openlibrary.org/b/isbn/9780451490803-L.jpg', 1099, 'Romance', 0.00, '2026-02-26 08:37:23'),
(220, 'Happy Place', 'Emily Henry', 'Two exes must pretend to still be together at their annual friend group vacation.', 'https://covers.openlibrary.org/b/isbn/9781984806796-L.jpg', 1199, 'Romance', 0.00, '2026-02-26 08:37:23'),
(221, 'The Fellowship of the Ring', 'J.R.R. Tolkien', 'A young hobbit inherits a dark ring and begins a perilous quest to destroy it.', 'https://covers.openlibrary.org/b/isbn/9780618346257-L.jpg', 1399, 'Fantasy', 0.00, '2026-02-26 08:37:23'),
(222, 'A Court of Thorns and Roses', 'Sarah J. Maas', 'A huntress is taken to a magical land after killing a wolf in the woods.', 'https://covers.openlibrary.org/b/isbn/9781619634466-L.jpg', 1299, 'Fantasy', 0.00, '2026-02-26 08:37:23'),
(223, 'The Blade Itself', 'Joe Abercrombie', 'A gripping dark fantasy following a torturer, a barbarian, and a crippled war hero.', 'https://covers.openlibrary.org/b/isbn/9781591025948-L.jpg', 1299, 'Fantasy', 0.00, '2026-02-26 08:37:23'),
(224, 'Stardust', 'Neil Gaiman', 'A young man crosses a wall into a magical kingdom to find a fallen star for the woman he loves.', 'https://covers.openlibrary.org/b/isbn/9780061689246-L.jpg', 1099, 'Fantasy', 0.00, '2026-02-26 08:37:23'),
(225, 'The Priory of the Orange Tree', 'Samantha Shannon', 'An epic tale of queens, dragonriders, and ancient magic across three kingdoms.', 'https://covers.openlibrary.org/b/isbn/9781635570298-L.jpg', 1599, 'Fantasy', 0.00, '2026-02-26 08:37:23'),
(226, 'Ender\'s Game', 'Orson Scott Card', 'A gifted child is trained in a battle school in space to fight an alien invasion.', 'https://covers.openlibrary.org/b/isbn/9780812550702-L.jpg', 1199, 'Dystopian', 0.00, '2026-02-26 08:37:23'),
(227, 'The Maze Runner', 'James Dashner', 'A boy wakes up in a mysterious clearing surrounded by an ever-changing maze.', 'https://covers.openlibrary.org/b/isbn/9780385737951-L.jpg', 1099, 'Dystopian', 0.00, '2026-02-26 08:37:23'),
(228, 'Divergent', 'Veronica Roth', 'In a divided future society, a girl discovers she does not fit into any single faction.', 'https://covers.openlibrary.org/b/isbn/9780062024039-L.jpg', 1099, 'Dystopian', 0.00, '2026-02-26 08:37:23'),
(229, 'The Power', 'Naomi Alderman', 'Women develop the power to release electrical jolts and the balance of the world shifts.', 'https://covers.openlibrary.org/b/isbn/9780316547611-L.jpg', 1199, 'Dystopian', 0.00, '2026-02-26 08:37:23'),
(230, 'Station Eleven', 'Emily St. John Mandel', 'A flu pandemic collapses civilization and a traveling Shakespeare troupe survives.', 'https://covers.openlibrary.org/b/isbn/9780385353304-L.jpg', 1199, 'Dystopian', 0.00, '2026-02-26 08:37:23'),
(231, 'The Count of Monte Cristo', 'Alexandre Dumas', 'A wrongfully imprisoned man escapes and plots an elaborate revenge on those who betrayed him.', 'https://covers.openlibrary.org/b/isbn/9780140449266-L.jpg', 1199, 'Classic', 0.00, '2026-02-26 08:37:23'),
(232, 'Sense and Sensibility', 'Jane Austen', 'Two sisters navigate love, heartbreak, and society in early 19th-century England.', 'https://covers.openlibrary.org/b/isbn/9780141439662-L.jpg', 899, 'Classic', 0.00, '2026-02-26 08:37:23'),
(233, 'Dracula', 'Bram Stoker', 'A Transylvanian vampire travels to England and spreads his curse until hunters pursue him.', 'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg', 949, 'Classic', 0.00, '2026-02-26 08:37:23'),
(234, 'Frankenstein', 'Mary Shelley', 'A scientist creates a living creature from dead body parts and must face the consequences.', 'https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg', 899, 'Classic', 0.00, '2026-02-26 08:37:23'),
(235, 'The Picture of Dorian Gray', 'Oscar Wilde', 'A handsome young man stays forever young while a portrait bears the marks of his sins.', 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg', 849, 'Classic', 0.00, '2026-02-26 08:37:23');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `library_items`
--

CREATE TABLE `library_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `reading_progress` int(11) DEFAULT 0,
  `is_finished` tinyint(1) DEFAULT 0,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `finished_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `library_items`
--

INSERT INTO `library_items` (`id`, `user_id`, `book_id`, `reading_progress`, `is_finished`, `added_at`, `finished_at`) VALUES
(48, 3, 210, 0, 0, '2026-03-04 12:37:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'completed',
  `receipt_number` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`, `receipt_number`, `created_at`) VALUES
(1, 3, 1798, 'completed', 'QXR-1771741597895-3', '2026-02-22 06:26:37'),
(2, 3, 2898, 'completed', 'QXR-1771741729017-3', '2026-02-22 06:28:49'),
(3, 3, 2798, 'completed', 'QXR-1771741753410-3', '2026-02-22 06:29:13'),
(4, 3, 2198, 'completed', 'QXR-1771742110650-3', '2026-02-22 06:35:10'),
(5, 3, 1598, 'completed', 'QXR-1771742388775-3', '2026-02-22 06:39:48'),
(6, 3, 1898, 'completed', 'QXR-1771742696076-3', '2026-02-22 06:44:56'),
(7, 3, 10490, 'completed', 'QXR-1771743052139-3', '2026-02-22 06:50:52'),
(8, 3, 1798, 'completed', 'QXR-1771744281449-3', '2026-02-22 07:11:21'),
(9, 3, 1648, 'completed', 'QXR-1771762220072-3', '2026-02-22 12:10:20'),
(10, 3, 1099, 'completed', 'QXR-1771771559082-3', '2026-02-22 14:45:59'),
(11, 3, 1998, 'completed', 'QXR-1771845262962-3', '2026-02-23 11:14:22'),
(12, 3, 1898, 'completed', 'QXR-1771846266981-3', '2026-02-23 11:31:06'),
(13, 3, 799, 'completed', 'QXR-1771939203803-3', '2026-02-24 13:20:03'),
(14, 3, 1998, 'completed', 'QXR-1771940151325-3', '2026-02-24 13:35:51'),
(15, 3, 999, 'completed', 'QXR-1771941185373-3', '2026-02-24 13:53:05'),
(16, 3, 799, 'completed', 'QXR-1772035509272-3', '2026-02-25 16:05:09'),
(17, 3, 1099, 'completed', 'QXR-1772095770283-3', '2026-02-26 08:49:30'),
(18, 3, 1099, 'completed', 'QXR-1772095876942-3', '2026-02-26 08:51:16'),
(19, 3, 1099, 'completed', 'QXR-1772096176359-3', '2026-02-26 08:56:16'),
(20, 3, 1099, 'completed', 'QXR-1772096368952-3', '2026-02-26 08:59:28'),
(21, 3, 1099, 'completed', 'QXR-1772345810927-3', '2026-03-01 06:16:50'),
(22, 3, 1499, 'completed', 'QXR-1772543260032-3', '2026-03-03 13:07:40'),
(23, 3, 1099, 'completed', 'QXR-1772544649148-3', '2026-03-03 13:30:49'),
(24, 3, 1099, 'completed', 'QXR-1772627853846-3', '2026-03-04 12:37:33');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `book_id`, `price`) VALUES
(37, 17, 210, 1099),
(38, 18, 210, 1099),
(39, 19, 210, 1099),
(40, 20, 210, 1099),
(41, 21, 217, 1099),
(42, 22, 209, 1499),
(43, 23, 210, 1099),
(44, 24, 210, 1099);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `book_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(11, 3, 208, 5, 'w', '2026-03-04 12:03:08', '2026-03-04 12:03:08');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`, `created_at`) VALUES
('HGyuxekidv3VMs7Cw0vU0uIBHoQVvFWc', 1772714256, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-03-04T13:06:32.056Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":3}}', '2026-03-03 13:06:32'),
('Rt94KZQWP5CFFbFfskWxBKjXxq1W0EeW', 1772723150, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-03-05T15:05:50.110Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":3}}', '2026-03-04 15:05:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `first_name`, `last_name`, `profile_image_url`, `created_at`, `updated_at`) VALUES
(1, 'dinosaur21', '$2a$12$.8TlZdRZpV/LWbOsGXMmEuvs9gnefVAanwuERRxeqPhBmEr7BWooS', 'YukiTakahashiV1@gmail.com', 'Yuki', 'Capuno', NULL, '2026-02-21 09:34:38', '2026-02-21 09:34:38'),
(2, 'YAMAZAKURA99', '$2a$12$a4fehxie4gQ7hw/MXXFdCu.Ctun0/C363Gx7fqk2Gb8kwSS0P5l7i', 'AWDAWDAD@AWDAWD.com', 'Yuki', 'Capuno', NULL, '2026-02-21 10:11:02', '2026-02-21 10:11:02'),
(3, 'dinosaur21581', '$2a$12$nKcBlfrLB.A172kC2h1DN.u/SLMzfE4f46tbwi8i/OqbO0QYhqTeG', 'YukiTakahashiV1@gmail.com', 'Yuki', 'Capuno', NULL, '2026-02-21 12:31:37', '2026-02-21 12:31:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_item` (`user_id`,`book_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `library_items`
--
ALTER TABLE `library_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=236;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `library_items`
--
ALTER TABLE `library_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `library_items`
--
ALTER TABLE `library_items`
  ADD CONSTRAINT `library_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `library_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
