-- Creating the database
CREATE DATABASE IF NOT EXISTS dreams;
USE dreams;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    profile_image VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'suspended', 'deleted') DEFAULT 'active'
);

-- Books Table
CREATE TABLE IF NOT EXISTS Books (
    id VARCHAR(100) PRIMARY KEY, -- No UUID, fetched from API
    title VARCHAR(255),
    author VARCHAR(255),
    publisher VARCHAR(100),
    published_date DATE,
    page_count INT,
    description TEXT,
    cover_image VARCHAR(255),
    isbn VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- UserBooks Table
CREATE TABLE IF NOT EXISTS UserBooks (
    user_book_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    book_id VARCHAR(100),
    status ENUM('read', 'reading', 'to_read'),
    start_date DATE,
    finish_date DATE,
    reading_time INT, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    review_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    book_id VARCHAR(100),
    rating TINYINT(1),
    content TEXT,
    visibility ENUM('public', 'private') DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

-- CreativeWorks Table
CREATE TABLE IF NOT EXISTS CreativeWorks (
    work_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    book_id VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    image_path VARCHAR(255),
    visibility ENUM('public', 'private') DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

-- Follows Table
CREATE TABLE IF NOT EXISTS Follows (
    follow_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    follower_id CHAR(36),
    following_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES Users(user_id),
    FOREIGN KEY (following_id) REFERENCES Users(user_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS Notifications (
    notification_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    type ENUM('review', 'creative_work', 'follow', 'system'),
    content TEXT,
    related_id CHAR(36), -- Stores UUIDs from other tables
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);