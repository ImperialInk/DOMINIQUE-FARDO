/*
  # Create contact_submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required) - Sender's first name
      - `lastname` (text) - Sender's last name
      - `email` (text, required) - Sender's email address
      - `phone` (text) - Sender's phone number
      - `message` (text, required) - The message content
      - `created_at` (timestamptz) - When the submission was received

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add insert policy for anonymous users (public form submissions)
    - Add select policy for authenticated users (admin access)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lastname text DEFAULT '',
  email text NOT NULL,
  phone text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);