-- ============================================
-- SCRIPT DE RÉPARATION COMPLÈTE
-- ============================================
-- Exécute ce script dans Supabase SQL Editor

-- 1. Supprime toutes les policies existantes pour repartir à zéro
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow anon to read profiles for auth" ON profiles;
DROP POLICY IF EXISTS "Gerants and admins can view profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all for testing" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 2. Désactive temporairement RLS pour tout reconfigurer
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Réactive RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Crée UNE SEULE policy simple qui permet TOUT (pour debug)
-- ⚠️ Cette policy est temporaire, on la sécurisera après
CREATE POLICY "Allow all access to profiles"
  ON profiles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 5. Vérifie que les users existent dans auth.users
SELECT id, email FROM auth.users WHERE email IN ('admin@mg.com', 'gerant@mg.com', 'revendeur@mg.com');

-- 6. Supprime les anciennes entrées profiles (pour éviter les doublons)
DELETE FROM profiles WHERE email IN ('admin@mg.com', 'gerant@mg.com', 'revendeur@mg.com');

-- 7. Réinsère les profiles
INSERT INTO profiles (id, email, role, full_name)
SELECT id, 'admin@mg.com', 'admin', 'Administrateur Test'
FROM auth.users WHERE email = 'admin@mg.com';

INSERT INTO profiles (id, email, role, full_name)
SELECT id, 'gerant@mg.com', 'gerant', 'Gérant Test'
FROM auth.users WHERE email = 'gerant@mg.com';

INSERT INTO profiles (id, email, role, full_name)
SELECT id, 'revendeur@mg.com', 'revendeur', 'Revendeur Test'
FROM auth.users WHERE email = 'revendeur@mg.com';

-- 8. Vérifie le résultat
SELECT * FROM profiles;

-- ✅ Si tu vois 3 lignes avec admin, gerant, revendeur → C'est bon !
