-- This script fixes RLS policies for public access using the CORRECT table names
-- Run this in the Supabase SQL Editor

-- Using correct table names: profiles, medical_history, qr_codes (not user_profiles, medical_records, qr_access_logs)

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles via QR" ON profiles;

DROP POLICY IF EXISTS "Users can insert their own medical history" ON medical_history;
DROP POLICY IF EXISTS "Users can update their own medical history" ON medical_history;
DROP POLICY IF EXISTS "Users can delete their own medical history" ON medical_history;
DROP POLICY IF EXISTS "Public can view medical history via QR" ON medical_history;

DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
DROP POLICY IF EXISTS "Public can view documents via QR" ON documents;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- USER PROFILES TABLE POLICIES
-- Allow public read access for QR code sharing
CREATE POLICY "Public can view profiles via QR" ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- MEDICAL HISTORY TABLE POLICIES
-- Allow public read access for QR code sharing
CREATE POLICY "Public can view medical history via QR" ON medical_history
  FOR SELECT USING (true);

-- Allow users to insert their own medical history
CREATE POLICY "Users can insert their own medical history" ON medical_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own medical history
CREATE POLICY "Users can update their own medical history" ON medical_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own medical history
CREATE POLICY "Users can delete their own medical history" ON medical_history
  FOR DELETE USING (auth.uid() = user_id);

-- DOCUMENTS TABLE POLICIES
-- Allow public read access for QR code sharing
CREATE POLICY "Public can view documents via QR" ON documents
  FOR SELECT USING (true);

-- Allow users to insert their own documents
CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- QR CODES TABLE POLICIES
-- Allow users to insert their own QR codes
DROP POLICY IF EXISTS "Users can insert their own QR codes" ON qr_codes;
CREATE POLICY "Users can insert their own QR codes" ON qr_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own QR codes
DROP POLICY IF EXISTS "Users can view their own QR codes" ON qr_codes;
CREATE POLICY "Users can view their own QR codes" ON qr_codes
  FOR SELECT USING (auth.uid() = user_id);

-- STORAGE BUCKET POLICIES
-- Allow public read access to medical documents
DROP POLICY IF EXISTS "Public can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can read medical documents" ON storage.objects;

CREATE POLICY "Public can read medical documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'medical-documents');

-- Allow authenticated users to upload documents
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

-- Allow users to delete their own documents
DROP POLICY IF EXISTS "Users can delete their own documents from storage" ON storage.objects;
CREATE POLICY "Users can delete their own documents from storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
