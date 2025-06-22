-- Migration for AI Diagnosis Assistant Tables
-- Create tables for storing diagnosis suggestions and feedback

-- Table for storing diagnosis suggestions
CREATE TABLE IF NOT EXISTS diagnosis_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    symptoms JSON NOT NULL,
    suggestions JSON NOT NULL,
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_patient_created (patient_id, created_at)
);

-- Table for storing patient feedback on diagnosis suggestions
CREATE TABLE IF NOT EXISTS diagnosis_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suggestion_id INT NOT NULL,
    patient_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (suggestion_id) REFERENCES diagnosis_suggestions(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_suggestion_rating (suggestion_id, rating)
); 