/*
  # Fix client projects RLS policies

  1. Changes
    - Drop existing RLS policies on client_projects table
    - Create new, simplified RLS policies that don't require users table access
    - Add proper security checks using auth.uid()

  2. Security
    - Enable RLS on client_projects table
    - Add policies for:
      - Insert: Allow authenticated users to insert their own projects
      - Select: Allow authenticated users to view their own projects
      - Update: Allow authenticated users to update their own projects
      - Admin access: Allow matex.com users to manage all projects
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Admins can manage all projects" ON client_projects;
DROP POLICY IF EXISTS "Users can insert projects" ON client_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON client_projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON client_projects;

-- Create new policies that don't require users table access
CREATE POLICY "Enable admin access"
ON client_projects
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%@matex.com')
WITH CHECK (auth.jwt() ->> 'email' LIKE '%@matex.com');

CREATE POLICY "Enable insert for authenticated users"
ON client_projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for users"
ON client_projects
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users"
ON client_projects
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);