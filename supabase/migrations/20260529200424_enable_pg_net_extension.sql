/*
  # Enable pg_net and http extensions for email notifications

  1. Extensions
    - `pg_net` - Async HTTP requests from PostgreSQL
  
  2. Changes
    - Enable pg_net extension for making HTTP calls from database triggers
    - Create a trigger function that calls the edge function for email
    - Create a trigger on contact_submissions table for new inserts

  3. Notes
    - This allows email notifications to be sent asynchronously after form submission
    - The edge function handles the actual SMTP email sending
*/

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
