-- =========================================================
-- AETHERCHAT DATABASE SCHEMA (Supabase PostgreSQL)
-- =========================================================

-- Ekstensi
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================================================
-- 1. PROFILES (extends auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  locale text not null default 'id-ID',
  theme text not null default 'dark' check (theme in ('dark','light','system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2. USER SETTINGS
-- =========================================================
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  default_provider text not null default 'groq' check (default_provider in ('groq','openai','openrouter')),
  default_model text not null default 'llama-3.3-70b-versatile',
  system_prompt text default '',
  temperature numeric(3,2) not null default 0.70 check (temperature >= 0 and temperature <= 2),
  top_p numeric(3,2) not null default 1.00 check (top_p > 0 and top_p <= 1),
  max_tokens integer not null default 2048 check (max_tokens between 256 and 8192),
  presence_penalty numeric(3,2) not null default 0,
  frequency_penalty numeric(3,2) not null default 0,
  use_byok boolean not null default false,
  web_search_enabled boolean not null default false,
  voice_locale text not null default 'id-ID',
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 3. USER API KEYS (BYOK — Encrypted)
-- =========================================================
create table if not exists public.user_api_keys (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('groq','openai','openrouter')),
  encrypted_key text not null,   -- AES-256-GCM ciphertext
  key_hint text not null,        -- contoh: "sk-...Xk2Q"
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

-- =========================================================
-- 4. FOLDERS (Kategori percakapan)
-- =========================================================
create table if not exists public.folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  color text default 'violet',
  icon text default 'folder',
  parent_id uuid references public.folders(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 5. CONVERSATIONS
-- =========================================================
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  title text not null default 'Percakapan Baru',
  model text not null default 'llama-3.3-70b-versatile',
  provider text not null default 'groq' check (provider in ('groq','openai','openrouter','image')),
  is_pinned boolean not null default false,
  is_favorite boolean not null default false,
  shared_token text unique,       -- untuk share link publik
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz          -- soft delete 30 hari
);
create index if not exists idx_conversations_user_updated on public.conversations(user_id, updated_at desc) where deleted_at is null;
create index if not exists idx_conversations_folder on public.conversations(folder_id);

-- =========================================================
-- 6. MESSAGES
-- =========================================================
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null default '',
  model text,
  provider text,
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  total_tokens integer default 0,
  finish_reason text,
  duration_ms integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_conv_created on public.messages(conversation_id, created_at asc);
create index if not exists idx_messages_search on public.messages using gin (to_tsvector('simple', content));

-- =========================================================
-- 7. ATTACHMENTS (File & gambar yang diupload ke chat)
-- =========================================================
create table if not exists public.attachments (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_type text not null,        -- mime type
  file_size integer not null,     -- bytes
  storage_path text not null,     -- path di Supabase Storage
  public_url text,
  extracted_text text,            -- hasil OCR/PDF parse
  created_at timestamptz not null default now()
);

-- =========================================================
-- 8. GENERATED IMAGES
-- =========================================================
create table if not exists public.generated_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  prompt text not null,
  provider text not null,
  model text not null,
  aspect_ratio text default '1:1',
  storage_path text not null,
  public_url text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 9. WEB SEARCH RESULTS (Sitasi & Sumber)
-- =========================================================
create table if not exists public.web_search_results (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid not null references public.messages(id) on delete cascade,
  query text not null,
  url text not null,
  title text not null,
  snippet text,
  rank integer default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 10. USAGE LOGS (Kuota harian)
-- =========================================================
create table if not exists public.usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null default current_date,
  message_count integer not null default 0,
  image_gen_count integer not null default 0,
  web_search_count integer not null default 0,
  tokens_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, usage_date)
);

-- =========================================================
-- 11. ADMIN LOGS (Audit Trail)
-- =========================================================
create table if not exists public.admin_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =========================================================
-- TRIGGERS: auto create profile & settings saat signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update updated_at otomatis
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_conversations_updated on public.conversations;
create trigger trg_conversations_updated before update on public.conversations
  for each row execute procedure public.touch_updated_at();

drop trigger if exists trg_settings_updated on public.user_settings;
create trigger trg_settings_updated before update on public.user_settings
  for each row execute procedure public.touch_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) — SEMUA TABEL
-- =========================================================
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_api_keys enable row level security;
alter table public.folders enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.attachments enable row level security;
alter table public.generated_images enable row level security;
alter table public.web_search_results enable row level security;
alter table public.usage_logs enable row level security;
alter table public.admin_logs enable row level security;

-- Profiles: user hanya bisa lihat/update dirinya sendiri
create policy "profiles_self_read" on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id);

-- User settings: self only
create policy "settings_self_all" on public.user_settings for all using (auth.uid() = user_id);

-- API keys: self only
create policy "api_keys_self_all" on public.user_api_keys for all using (auth.uid() = user_id);

-- Folders: self only
create policy "folders_self_all" on public.folders for all using (auth.uid() = user_id);

-- Conversations: self only
create policy "conv_self_all" on public.conversations for all using (auth.uid() = user_id);

-- Messages: hanya pemilik conversation
create policy "messages_self_all" on public.messages for all
  using (auth.uid() = user_id);

-- Attachments: self only
create policy "attachments_self_all" on public.attachments for all using (auth.uid() = user_id);

-- Generated images: self only
create policy "genimg_self_all" on public.generated_images for all using (auth.uid() = user_id);

-- Web search results: hanya untuk message milik user
create policy "websearch_self_read" on public.web_search_results for select
  using (exists (select 1 from public.messages m where m.id = message_id and m.user_id = auth.uid()));

-- Usage logs: self read, server write
create policy "usage_self_read" on public.usage_logs for select using (auth.uid() = user_id);

-- Admin logs: hanya admin
create policy "admin_logs_admin_only" on public.admin_logs for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =========================================================
-- STORAGE BUCKETS
-- =========================================================
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', false),
       ('generated-images', 'generated-images', false)
on conflict do nothing;

create policy "attachments_own_read" on storage.objects for select
  using (bucket_id = 'chat-attachments' and (auth.uid())::text = (storage.foldername(name))[1]);

create policy "attachments_own_write" on storage.objects for insert
  with check (bucket_id = 'chat-attachments' and (auth.uid())::text = (storage.foldername(name))[1]);

create policy "genimg_own_read" on storage.objects for select
  using (bucket_id = 'generated-images' and (auth.uid())::text = (storage.foldername(name))[1]);

create policy "genimg_own_write" on storage.objects for insert
  with check (bucket_id = 'generated-images' and (auth.uid())::text = (storage.foldername(name))[1]);
