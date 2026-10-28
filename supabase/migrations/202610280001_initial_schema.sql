-- ShetkariMitra AI initial database schema
-- Run this file in Supabase SQL Editor for your project.
-- Row Level Security ensures each signed-in user can access only their own records.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_language text not null default 'mr'
    check (preferred_language in ('mr', 'hi', 'en')),
  village text,
  district text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crop_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  area_acres numeric(10,2) not null default 0 check (area_acres >= 0),
  budget_inr numeric(12,2) not null default 0 check (budget_inr >= 0),
  expected_yield_kg numeric(12,2) not null default 0 check (expected_yield_kg >= 0),
  expected_price_inr_per_kg numeric(12,2) not null default 0 check (expected_price_inr_per_kg >= 0),
  season text not null default '',
  crop_type text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  crop_cycle_id uuid not null references public.crop_cycles(id) on delete cascade,
  amount_inr numeric(12,2) not null check (amount_inr > 0),
  category text not null default 'Other',
  description text not null default '',
  expense_date date not null default current_date,
  source text not null default 'manual' check (source in ('manual', 'voice', 'import')),
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  crop_cycle_id uuid not null references public.crop_cycles(id) on delete cascade,
  quantity_kg numeric(12,2) not null check (quantity_kg > 0),
  price_inr_per_kg numeric(12,2) not null check (price_inr_per_kg >= 0),
  sale_date date not null default current_date,
  buyer_or_market text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.market_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  crop_name text not null,
  market_name text not null default '',
  quoted_price_inr_per_kg numeric(12,2) not null check (quoted_price_inr_per_kg >= 0),
  quote_date date not null default current_date,
  source_note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.crop_disease_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  crop_name text,
  village_or_district text,
  language text not null default 'mr' check (language in ('mr', 'hi', 'en')),
  image_mime_type text check (image_mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  analysis_text text not null,
  created_at timestamptz not null default now()
);

create index if not exists crop_cycles_user_id_idx on public.crop_cycles(user_id);
create index if not exists expenses_user_date_idx on public.expenses(user_id, expense_date desc);
create index if not exists expenses_crop_cycle_idx on public.expenses(crop_cycle_id);
create index if not exists sales_user_date_idx on public.sales(user_id, sale_date desc);
create index if not exists sales_crop_cycle_idx on public.sales(crop_cycle_id);
create index if not exists market_quotes_user_date_idx on public.market_quotes(user_id, quote_date desc);
create index if not exists disease_analyses_user_date_idx on public.crop_disease_analyses(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.crop_cycles enable row level security;
alter table public.expenses enable row level security;
alter table public.sales enable row level security;
alter table public.market_quotes enable row level security;
alter table public.crop_disease_analyses enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "Users manage their own crop cycles" on public.crop_cycles;
create policy "Users manage their own crop cycles" on public.crop_cycles
  for all to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users manage their own expenses" on public.expenses;
create policy "Users manage their own expenses" on public.expenses
  for all to authenticated using (
    user_id = (select auth.uid()) and exists (
      select 1 from public.crop_cycles c
      where c.id = crop_cycle_id and c.user_id = (select auth.uid())
    )
  ) with check (
    user_id = (select auth.uid()) and exists (
      select 1 from public.crop_cycles c
      where c.id = crop_cycle_id and c.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users manage their own sales" on public.sales;
create policy "Users manage their own sales" on public.sales
  for all to authenticated using (
    user_id = (select auth.uid()) and exists (
      select 1 from public.crop_cycles c
      where c.id = crop_cycle_id and c.user_id = (select auth.uid())
    )
  ) with check (
    user_id = (select auth.uid()) and exists (
      select 1 from public.crop_cycles c
      where c.id = crop_cycle_id and c.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users manage their own market quotes" on public.market_quotes;
create policy "Users manage their own market quotes" on public.market_quotes
  for all to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users manage their own disease analyses" on public.crop_disease_analyses;
create policy "Users manage their own disease analyses" on public.crop_disease_analyses
  for all to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists crop_cycles_set_updated_at on public.crop_cycles;
create trigger crop_cycles_set_updated_at before update on public.crop_cycles
for each row execute function public.set_updated_at();
