-- ==============================================================================
-- DocuFlow Database Schema & Storage Setup
-- Production-Ready Open-Source Flipbook Platform
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. FLIPBOOKS TABLE
create table if not exists public.flipbooks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  slug text unique not null,
  description text,
  original_file_name text not null,
  pdf_url text,
  page_count integer default 0,
  access_type text check (access_type in ('public', 'lead_gate', 'password')) default 'public',
  password_hash text,
  lead_gate_config jsonb default '{"requireName": true, "requireEmail": true, "requireCompany": false}'::jsonb,
  status text check (status in ('pending', 'processing', 'ready', 'failed')) default 'pending',
  error_message text,
  settings jsonb default '{"enableSound": true, "enableDownload": true, "enableShare": true, "hardCovers": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PAGES TABLE
create table if not exists public.pages (
  id uuid primary key default uuid_generate_v4(),
  flipbook_id uuid references public.flipbooks(id) on delete cascade not null,
  page_number integer not null,
  image_url text not null,
  width integer default 800,
  height integer default 1100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (flipbook_id, page_number)
);

-- 3. HOTSPOTS TABLE (Interactive overlays)
create table if not exists public.hotspots (
  id uuid primary key default uuid_generate_v4(),
  flipbook_id uuid references public.flipbooks(id) on delete cascade not null,
  page_number integer not null,
  x_pct numeric(5,2) not null, -- Percentage coordinates
  y_pct numeric(5,2) not null,
  width_pct numeric(5,2) not null,
  height_pct numeric(5,2) not null,
  type text check (type in ('link', 'page_jump', 'video', 'product')) default 'link',
  title text,
  payload text not null, -- URL, Target Page number, video embed, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. LEADS TABLE
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  flipbook_id uuid references public.flipbooks(id) on delete cascade not null,
  name text,
  email text not null,
  company text,
  phone text,
  session_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ANALYTICS EVENTS TABLE
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  flipbook_id uuid references public.flipbooks(id) on delete cascade not null,
  session_id text not null,
  event_type text check (event_type in ('view', 'page_turn', 'dwell_time', 'download', 'share', 'lead_submit', 'hotspot_click')) not null,
  page_number integer,
  dwell_seconds integer default 0,
  referrer text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for lightning fast queries
create index if not exists idx_flipbooks_slug on public.flipbooks(slug);
create index if not exists idx_flipbooks_user_id on public.flipbooks(user_id);
create index if not exists idx_pages_flipbook_id on public.pages(flipbook_id);
create index if not exists idx_leads_flipbook_id on public.leads(flipbook_id);
create index if not exists idx_analytics_flipbook_id on public.analytics_events(flipbook_id);
create index if not exists idx_analytics_event_type on public.analytics_events(event_type);

-- Updated_at Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger trigger_flipbooks_updated_at
  before update on public.flipbooks
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.flipbooks enable row level security;
alter table public.pages enable row level security;
alter table public.hotspots enable row level security;
alter table public.leads enable row level security;
alter table public.analytics_events enable row level security;

-- Flipbooks Policies
-- Anyone can view ready flipbooks
create policy "Public can view ready flipbooks"
  on public.flipbooks for select
  using (status = 'ready' or auth.uid() = user_id);

-- Authors can perform all actions on their own flipbooks
create policy "Users can manage own flipbooks"
  on public.flipbooks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Pages Policies
create policy "Public can view pages of ready flipbooks"
  on public.pages for select
  using (
    exists (
      select 1 from public.flipbooks
      where public.flipbooks.id = public.pages.flipbook_id
      and (public.flipbooks.status = 'ready' or public.flipbooks.user_id = auth.uid())
    )
  );

create policy "Users can manage pages of own flipbooks"
  on public.pages for all
  using (
    exists (
      select 1 from public.flipbooks
      where public.flipbooks.id = public.pages.flipbook_id
      and public.flipbooks.user_id = auth.uid()
    )
  );

-- Hotspots Policies
create policy "Public can view hotspots of ready flipbooks"
  on public.hotspots for select
  using (
    exists (
      select 1 from public.flipbooks
      where public.flipbooks.id = public.hotspots.flipbook_id
      and (public.flipbooks.status = 'ready' or public.flipbooks.user_id = auth.uid())
    )
  );

create policy "Users can manage hotspots of own flipbooks"
  on public.hotspots for all
  using (
    exists (
      select 1 from public.flipbooks
      where public.flipbooks.id = public.hotspots.flipbook_id
      and public.flipbooks.user_id = auth.uid()
    )
  );

-- Leads Policies
create policy "Public can submit leads"
  on public.leads for insert
  with check (true);

create policy "Flipbook owners can view leads"
  on public.leads for select
  using (
    exists (
      select 1 from public.flipbooks
      where public.flipbooks.id = public.leads.flipbook_id
      and public.flipbooks.user_id = auth.uid()
    )
  );

-- Analytics Policies
create policy "Public can insert analytics events"
  on public.analytics_events for insert
  with check (true);

create policy "Flipbook owners can view analytics"
  on public.analytics_events for select
  using (
    exists (
      select 1 from public.flipbooks
      where public.flipbooks.id = public.analytics_events.flipbook_id
      and public.flipbooks.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION
-- ==============================================================================

-- Storage bucket for flipbook assets
insert into storage.buckets (id, name, public)
values ('flipbooks', 'flipbooks', true)
on conflict (id) do nothing;

create policy "Public can view flipbook media"
  on storage.objects for select
  using (bucket_id = 'flipbooks');

create policy "Authenticated users can upload flipbook media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'flipbooks');

create policy "Owners can delete their flipbook media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'flipbooks' and (storage.foldername(name))[1] = auth.uid()::text);
