/*
  # Initial Schema Setup for AI Content Generator

  1. New Tables
    - `users_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `platform` (text)
      - `type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `saved_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content_id` (uuid, references users_content)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Create users_content table
CREATE TABLE IF NOT EXISTS users_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  platform text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_content table
CREATE TABLE IF NOT EXISTS saved_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content_id uuid REFERENCES users_content NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_content ENABLE ROW LEVEL SECURITY;

-- Create policies for users_content
CREATE POLICY "Users can create their own content"
  ON users_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own content"
  ON users_content
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own content"
  ON users_content
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content"
  ON users_content
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for saved_content
CREATE POLICY "Users can save content"
  ON saved_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their saved content"
  ON saved_content
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove saved content"
  ON saved_content
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);