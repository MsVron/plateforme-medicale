-- Migration: Add missing columns to types_analyses
-- Date: 2024
-- Description: Add unite column to types_analyses table

-- Add unite column for measurement units
ALTER TABLE types_analyses ADD COLUMN IF NOT EXISTS unite VARCHAR(20) DEFAULT NULL; 