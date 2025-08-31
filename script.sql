

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    profile_image VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active'
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- UserBooks Table
CREATE TABLE IF NOT EXISTS UserBooks (
    user_book_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    book_id VARCHAR(100),
    status TEXT,
    start_date DATE,
    finish_date DATE,
    reading_time INT, -- in minutes
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    book_id VARCHAR(100),
    rating SMALLINT,
    content TEXT,
    visibility TEXT DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

-- CreativeWorks Table
CREATE TABLE IF NOT EXISTS CreativeWorks (
    work_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    book_id VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    image_path VARCHAR(255),
    visibility TEXT DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

-- Follows Table
CREATE TABLE IF NOT EXISTS Follows (
    follow_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID,
    following_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES Users(user_id),
    FOREIGN KEY (following_id) REFERENCES Users(user_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS Notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    type TEXT,
    content TEXT,
    related_id UUID, -- Stores UUIDs from other tables
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);