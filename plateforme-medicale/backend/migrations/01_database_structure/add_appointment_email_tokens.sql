-- Migration: Add appointment email tokens table
-- This table stores secure tokens for email-based appointment confirmation and cancellation

-- Drop the existing table if it exists
DROP TABLE IF EXISTS appointment_email_tokens;

-- Create the appointment_email_tokens table with correct structure
CREATE TABLE IF NOT EXISTS appointment_email_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rendez_vous_id INT NOT NULL,
  token VARCHAR(128) NOT NULL,
  type ENUM('confirmation') DEFAULT 'confirmation',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_expiration DATETIME NOT NULL,
  utilise BOOLEAN DEFAULT FALSE,
  INDEX idx_rendez_vous_id (rendez_vous_id),
  INDEX idx_token (token),
  INDEX idx_expiration (date_expiration),
  UNIQUE KEY unique_token (token),
  FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous(id) ON DELETE CASCADE
);

-- Add comment to table
ALTER TABLE appointment_email_tokens COMMENT = 'Tokens for appointment email confirmations'; 