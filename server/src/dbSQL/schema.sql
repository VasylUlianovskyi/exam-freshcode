-- Chat-users table
CREATE TABLE chat_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id INT UNIQUE REFERENCES "Users"(id) ON DELETE CASCADE, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    blacklist BOOLEAN DEFAULT FALSE,
    favorite_list BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations participants table
CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Function to automatically insert into chat_users when a user is added to Users
CREATE OR REPLACE FUNCTION add_to_chat_users()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO chat_users (first_name, last_name, email, user_id, created_at, updated_at)
  VALUES (NEW."firstName", NEW."lastName", NEW.email, NEW.id, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger to call the function after a new user is added
CREATE TRIGGER after_user_insert
AFTER INSERT ON "Users"
FOR EACH ROW
EXECUTE FUNCTION add_to_chat_users();
