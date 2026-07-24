-- 1. Tabla de configuración del sitio para precios y URLs de checkout (Stripe)
create table if not exists public.site_config (
  id text primary key default 'default_config',
  plan_1_price text default '19',
  plan_1_stripe_url text default '',
  plan_2_price text default '39',
  plan_2_stripe_url text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insertar fila inicial por defecto
insert into public.site_config (id, plan_1_price, plan_1_stripe_url, plan_2_price, plan_2_stripe_url)
values ('default_config', '19', 'https://buy.stripe.com/test_plan1', '39', 'https://buy.stripe.com/test_plan2')
on conflict (id) do nothing;


-- 2. Tabla de perfiles de usuario (profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nombre text not null,
  apellidos text not null,
  grado text not null,
  municipio text not null,
  centro_estudios text not null,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Habilitar seguridad por filas (RLS)
alter table public.profiles enable row level security;

-- 4. Políticas de acceso (RLS Policies)
create policy "Los usuarios pueden ver su propio perfil" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Administradores tienen acceso total" 
  on public.profiles for select 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. Tabla para los tickets de soporte de los alumnos
create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  grado text not null,
  asunto text not null,
  mensaje text not null,
  estado text default 'pendiente', -- 'pendiente' o 'resuelto'
  respuesta text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Habilitar RLS en la tabla de tickets
alter table public.tickets enable row level security;

-- 7. Políticas RLS para tickets
-- Permitir inserción de tickets a cualquier usuario (incluso anónimos o alumnos)
create policy "Permitir crear tickets" 
  on public.tickets for insert 
  with check (true);

-- Los alumnos pueden consultar sus propios tickets por email
create policy "Los usuarios pueden ver sus propios tickets por email" 
  on public.tickets for select 
  using (email = auth.jwt()->>'email' or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Solo administradores pueden actualizar tickets (para responder o cambiar estado)
create policy "Administradores pueden actualizar tickets" 
  on public.tickets for update 
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- 8. Tabla para la captura de leads (Tema Cero)
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  full_name text,
  email text not null,
  specialty text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Habilitar RLS en la tabla de leads
alter table public.leads enable row level security;

create policy "Permitir crear leads a todos" 
  on public.leads for insert 
  with check (true);

create policy "Permitir lectura de leads" 
  on public.leads for select 
  using (true);

-- 10. Columna de retardo en tabla de módulos
alter table if exists public.modules add column if not exists unlock_delay_days integer default 0;

-- 11. Tabla para registrar desbloqueos pagados de 3€
create table if not exists public.user_module_unlocks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  module_id text not null,
  stripe_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, module_id)
);

-- 12. Habilitar RLS en user_module_unlocks
alter table public.user_module_unlocks enable row level security;

create policy "Usuarios ven sus propios desbloqueos" on public.user_module_unlocks
  for select using (auth.uid() = user_id);

-- 13. Tabla de temas/módulos (topics)
create table if not exists public.topics (
  id uuid default gen_random_uuid() primary key,
  degree_id text not null, -- 'tsidmn', 'radioterapia', 'laboratorio', 'anatomia', 'documentacion'
  title text not null,
  description text,
  file_path text not null, -- Ruta dentro del bucket temarios-pdf
  unlock_delay_days integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en la tabla topics
alter table public.topics enable row level security;

-- Política de lectura para usuarios autenticados o en desarrollo
create policy "Lectura de temas para usuarios" on public.topics
  for select using (true);

-- Política de inserción (solo Admin)
create policy "Inserción de temas" on public.topics
  for insert with check (true);

-- 14. Tabla para solicitudes de colaboradores TSIDMN
create table if not exists public.colaboradores_solicitudes (
  id uuid default gen_random_uuid() primary key,
  nombre_completo text not null,
  email text not null,
  telefono text not null,
  perfil_profesional text not null,
  especialidad_principal text not null,
  disponibilidad_semanal text not null,
  aceptacion_modelo text,
  linkedin_cv text,
  experiencia_meritos text not null,
  acepta_privacidad boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en colaboradores_solicitudes
alter table public.colaboradores_solicitudes enable row level security;

-- Política de inserción pública para permitir solicitudes
create policy "Permitir crear solicitudes de colaboracion a todos"
  on public.colaboradores_solicitudes for insert
  with check (true);





