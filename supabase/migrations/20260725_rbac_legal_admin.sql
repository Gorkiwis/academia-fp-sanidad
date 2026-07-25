-- Migration: RBAC app_role ENUM and Legal Admin permissions
-- Created: 2026-07-25

-- 1. Definición del ENUM app_role
do $$ begin
  create type public.app_role as enum ('student', 'legal_admin', 'super_admin');
exception
  when duplicate_object then null;
end $$;

-- 2. Modificación de la tabla profiles para usar el tipo ENUM app_role
alter table public.profiles 
  alter column role drop default;

alter table public.profiles 
  alter column role type public.app_role 
  using (
    case 
      when role = 'legal_admin' then 'legal_admin'::public.app_role
      when role in ('super_admin', 'superadmin', 'admin') then 'super_admin'::public.app_role
      else 'student'::public.app_role
    end
  );

alter table public.profiles 
  alter column role set default 'student'::public.app_role;

-- 3. Funciones auxiliares de verificación de roles con Security Definer
create or replace function public.is_legal_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 
    from public.profiles 
    where id = user_id 
      and role = 'legal_admin'::public.app_role
  );
$$;

create or replace function public.is_super_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 
    from public.profiles 
    where id = user_id 
      and role = 'super_admin'::public.app_role
  );
$$;

-- 4. Creación de la tabla de documentos legales (legal_documents)
create table if not exists public.legal_documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  document_type text not null check (document_type in ('terms_of_service', 'privacy_policy', 'legal_notice', 'cookies_policy', 'disclaimer')),
  content text not null,
  version text default '1.0' not null,
  is_active boolean default true not null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Creación de la tabla de configuración del sistema legal (legal_settings)
create table if not exists public.legal_settings (
  id text primary key default 'default_legal_settings',
  company_name text default 'Academia FP Sanidad S.L.',
  cif_nif text default 'B-12345678',
  dpo_email text default 'legal@academiafpsanidad.es',
  address text default 'Calle Sanidad 12, 28001 Madrid, España',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertar configuración legal inicial si no existe
insert into public.legal_settings (id, company_name, dpo_email)
values ('default_legal_settings', 'Academia FP Sanidad S.L.', 'legal@academiafpsanidad.es')
on conflict (id) do nothing;

-- 6. Habilitar Row Level Security (RLS)
alter table public.legal_documents enable row level security;
alter table public.legal_settings enable row level security;

-- 7. Políticas de Seguridad (RLS) estrictas para legal_documents
-- Permiso de lectura: Público para documentos activos, legal_admin o super_admin para borradores
create policy "Lectura de documentos legales"
  on public.legal_documents for select
  using (is_active = true or public.is_legal_admin(auth.uid()) or public.is_super_admin(auth.uid()));

-- Permiso de inserción: Estrictamente restringido a legal_admin
create policy "Solo legal_admin puede insertar documentos legales"
  on public.legal_documents for insert
  with check (public.is_legal_admin(auth.uid()));

-- Permiso de actualización: Estrictamente restringido a legal_admin
create policy "Solo legal_admin puede actualizar documentos legales"
  on public.legal_documents for update
  using (public.is_legal_admin(auth.uid()))
  with check (public.is_legal_admin(auth.uid()));

-- Permiso de borrado: Estrictamente restringido a legal_admin
create policy "Solo legal_admin puede eliminar documentos legales"
  on public.legal_documents for delete
  using (public.is_legal_admin(auth.uid()));

-- 8. Políticas RLS estrictas para legal_settings
create policy "Lectura de configuracion legal"
  on public.legal_settings for select
  using (true);

create policy "Solo legal_admin puede insertar configuracion legal"
  on public.legal_settings for insert
  with check (public.is_legal_admin(auth.uid()));

create policy "Solo legal_admin puede actualizar configuracion legal"
  on public.legal_settings for update
  using (public.is_legal_admin(auth.uid()))
  with check (public.is_legal_admin(auth.uid()));
