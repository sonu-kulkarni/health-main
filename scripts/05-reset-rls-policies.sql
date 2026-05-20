-- This script RESETS all RLS policies by dropping and recreating them
-- Safe to run multiple times - it will drop existing policies first
-- Using correct table names: profiles, medical_history, qr_codes, documents

-- ============================================
-- DROP ALL EXISTING POLICIES (Safe to run multiple times)
-- ============================================

-- Profiles table policies
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles via QR" ON profiles;

-- Medical history table policies
DROP POLICY IF EXISTS "Users can insert their own medical history" ON medical_history;
DROP POLICY IF EXISTS "Users can update their own medical history" ON medical_history;
DROP POLICY IF EXISTS "Users can delete their own medical history" ON medical_history;
DROP POLICY IF EXISTS "Users can view their own medical history" ON medical_history;
DROP POLICY IF EXISTS "Public can view medical history via QR" ON medical_history;

-- Documents table policies
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Public can view documents via QR" ON documents;

-- QR codes table policies
DROP POLICY IF EXISTS "Users can insert their own QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Users can view their own QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Users can update their own QR codes" ON qr_codes;
DROP POLICY IF EXISTS "Users can delete their own QR codes" ON qr_codes;

-- Storage policies
DROP POLICY IF EXISTS "Public can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents from storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can read medical documents" ON storage.objects;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE NEW POLICIES
-- ============================================

-- PROFILES TABLE - Allow public read, authenticated write
CREATE POLICY "Public can view profiles via QR" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- MEDICAL HISTORY TABLE - Allow public read, authenticated write
CREATE POLICY "Public can view medical history via QR" ON medical_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own medical history" ON medical_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical history" ON medical_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical history" ON medical_history
  FOR DELETE USING (auth.uid() = user_id);

-- DOCUMENTS TABLE - Allow public read, authenticated write
CREATE POLICY "Public can view documents via QR" ON documents
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- QR CODES TABLE - Allow public read for token lookup, authenticated write
CREATE POLICY "Public can view QR codes" ON qr_codes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own QR codes" ON qr_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR codes" ON qr_codes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QR codes" ON qr_codes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- Allow public read access to all documents in the bucket
CREATE POLICY "Public can read medical documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'medical-documents');

-- Allow authenticated users to upload documents
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents from storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
