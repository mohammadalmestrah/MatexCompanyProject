/*
  # Create Applications and Projects Schema

  1. New Tables
    - `job_applications`
      - Stores job and internship applications
      - Links to applicant information and position details
    - `client_projects`
      - Stores client project requirements and details
      - Tracks project status and payment information

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin access
*/

-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  position text NOT NULL,
  application_type text NOT NULL,
  resume_url text NOT NULL,
  cover_letter_url text NOT NULL,
  additional_info text,
  status text DEFAULT 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);

-- Create client projects table
CREATE TABLE IF NOT EXISTS client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  project_type text NOT NULL,
  project_description text NOT NULL,
  budget_range text NOT NULL,
  timeline text NOT NULL,
  payment_method text,
  payment_status text DEFAULT 'pending',
  project_status text DEFAULT 'new',
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

-- Policies for job_applications
CREATE POLICY "Users can view their own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

CREATE POLICY "Users can insert applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON job_applications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%@matex.com'
    )
  );

-- Policies for client_projects
CREATE POLICY "Users can view their own projects"
  ON client_projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert projects"
  ON client_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own projects"
  ON client_projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all projects"
  ON client_projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%@matex.com'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_client_projects_updated_at
  BEFORE UPDATE ON client_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();