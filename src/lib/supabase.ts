import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In development, avoid crashing the whole app if env vars are missing.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Auth features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({} as any);

export type JobApplication = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  application_type: string;
  resume_url: string;
  cover_letter_url: string;
  additional_info?: string;
  status: string;
  reviewed_at?: string;
  reviewed_by?: string;
};

export type ClientProject = {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  project_type: string;
  project_description: string;
  budget_range: string;
  timeline: string;
  payment_method?: string;
  payment_status: string;
  project_status: string;
  user_id: string;
};