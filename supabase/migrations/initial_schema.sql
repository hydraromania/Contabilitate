/*
      # Initial Schema Setup

      1. New Tables
        - `profiles`
          - `id` (uuid, primary key, references auth.users)
          - `email` (text, unique)
          - `first_name` (text)
          - `last_name` (text)
          - `phone` (text)
          - `role` (text, check constraint for admin, contabil_sef, contabil, jurist)
          - `avatar_url` (text)
          - `created_at` (timestamp)
        - `clients`
          - `id` (uuid, primary key)
          - `first_name` (text)
          - `last_name` (text)
          - `email` (text)
          - `company_name` (text)
          - `cui` (text)
          - `address` (text)
          - `city` (text)
          - `county` (text)
          - `phone` (text)
          - `role` (text)
          - `created_by` (uuid, references profiles)
          - `assigned_to` (uuid, references profiles)
          - `created_at` (timestamp)

      2. Security
        - Enable RLS on both tables
        - Add policies for authenticated users
    */

    -- Create profiles table
    CREATE TABLE IF NOT EXISTS profiles (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      email text UNIQUE NOT NULL,
      first_name text DEFAULT '',
      last_name text DEFAULT '',
      phone text DEFAULT '',
      role text NOT NULL CHECK (role IN ('admin', 'contabil_sef', 'contabil', 'jurist')),
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
      address text NOT NULL,
      city text NOT NULL,
      county text NOT NULL,
      phone text NOT NULL,
      role text DEFAULT 'client',
      created_by uuid REFERENCES profiles(id),
      assigned_to uuid REFERENCES profiles(id),
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

    -- Profiles Policies
    CREATE POLICY "Users can view their own profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "Admins can view all profiles"
      ON profiles FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- Clients Policies
    CREATE POLICY "Staff can view assigned clients"
      ON clients FOR SELECT
      TO authenticated
      USING (
        auth.uid() = assigned_to OR 
        auth.uid() = created_by OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'contabil_sef'))
      );

    CREATE POLICY "Staff can insert clients"
      ON clients FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Staff can update assigned clients"
      ON clients FOR UPDATE
      TO authenticated
      USING (
        auth.uid() = assigned_to OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'contabil_sef'))
      );