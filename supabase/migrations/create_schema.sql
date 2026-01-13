/*
  # Schema Initială pentru Sistemul de Contabilitate

  1. New Tables
    - `profiles` (Utilizatori Backend)
      - `id` (uuid, primary key)
      - `email` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `role` (enum: admin, contabil_sef, contabil, jurist)
      - `avatar_url` (text)
    - `clients` (Firme Clienți)
      - `id` (uuid, primary key)
      - `name` (text) - Prenume reprezentant
      - `surname` (text) - Nume reprezentant
      - `email` (text)
      - `company_name` (text)
      - `cui` (text)
      - `address` (text)
      - `city` (text)
      - `county` (text)
      - `phone` (text)
      - `created_by` (uuid, references profiles)
      - `assigned_to` (uuid, references profiles)
      - `role` (text) - administrator, angajat

  2. Security
    - RLS activat pe toate tabelele
    - Politici pentru acces bazat pe roluri
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'contabil_sef', 'contabil', 'jurist');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  role user_role DEFAULT 'contabil',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  company_name text NOT NULL,
  cui text NOT NULL,
  address text,
  city text,
  county text,
  phone text,
  role text DEFAULT 'administrator',
  created_by uuid REFERENCES profiles(id),
  assigned_to uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Admins can do everything on profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policies for clients
CREATE POLICY "Admins see all clients"
  ON clients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Contabil Sef sees own or assigned clients"
  ON clients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'contabil_sef'
    ) AND (created_by = auth.uid() OR assigned_to = auth.uid())
  );

CREATE POLICY "Contabil sees only assigned clients"
  ON clients FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());