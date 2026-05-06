-- Run this in your Supabase project: SQL Editor → New Query → paste & run

create table if not exists settings (
  id      text primary key default 'default',
  sender_name text not null default 'Alex',
  updated_at  timestamptz default now()
);

create table if not exists messages (
  id             text primary key,       -- "{email}__{touch_type}"
  contact_email  text not null,
  touch_type     text not null,          -- "linkedin" | "email1" | "email2"
  content        text not null,
  updated_at     timestamptz default now()
);

create table if not exists statuses (
  contact_email  text primary key,
  status         text not null default 'pending',
  updated_at     timestamptz default now()
);

create table if not exists contacts (
  id          serial primary key,
  name        text not null,
  title       text,
  role        text,
  hospital    text,
  state       text,
  alos_delta  float default 0,
  m2b         text,
  tier        text,
  email       text unique not null,
  linkedin    text default '',
  created_at  timestamptz default now()
);

-- Allow anonymous read/write (fine for an internal tool).
-- Add auth policies here when you're ready to restrict access.
alter table settings  enable row level security;
alter table messages  enable row level security;
alter table statuses  enable row level security;
alter table contacts  enable row level security;

create policy "allow all" on settings  for all using (true) with check (true);
create policy "allow all" on messages  for all using (true) with check (true);
create policy "allow all" on statuses  for all using (true) with check (true);
create policy "allow all" on contacts  for all using (true) with check (true);
