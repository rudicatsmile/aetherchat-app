-- Seed initial dummy data for AetherChat

-- In Supabase auth, dummy user ID (will be overridden on real signup)
-- This file provides ready-to-test seed records for local PostgreSQL

-- Ensure default folders for testing if dummy profile exists
insert into public.folders (id, user_id, name, color, icon)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Kerjaan Startup', 'violet', 'briefcase'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Skripsi Kuliah', 'blue', 'graduation-cap'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'Kesehatan & Diet', 'emerald', 'activity'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'Random Ide', 'amber', 'lightbulb')
on conflict do nothing;
