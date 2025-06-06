/*
  # Create applications storage bucket

  1. Storage
    - Create 'applications' bucket for storing job application files
    - Set up RLS policies for secure file access and upload

  2. Security
    - Enable authenticated users to upload files
    - Allow admin users to read all files
    - Allow users to read their own files
*/

-- Create the applications bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('applications', 'applications')
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'applications'
);

-- Policy to allow admin users to read all files
CREATE POLICY "Allow admin users to read all files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'applications'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@matex.com'
  )
);

-- Policy to allow users to read their own files
CREATE POLICY "Allow users to read their own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'applications'
  AND (
    -- Link the file to the job application through the path
    EXISTS (
      SELECT 1 FROM public.job_applications
      WHERE (
        job_applications.resume_url = storage.objects.name
        OR job_applications.cover_letter_url = storage.objects.name
      )
      AND job_applications.email = (auth.jwt() ->> 'email')
    )
  )
);