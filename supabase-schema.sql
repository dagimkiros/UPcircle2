-- UpCircle Database Schema
-- Paste this entire file into Supabase SQL Editor and click "Run"

-- 1. PROFILES (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  trust_score integer default 70,
  identity_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. CIRCLES
create table public.circles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  emoji text default '◎',
  description text,
  contribution_amount integer not null,
  frequency text not null default 'Monthly', -- 'Weekly', 'Bi-weekly', 'Monthly'
  total_members integer not null,
  current_round integer default 1,
  status text default 'forming', -- 'forming', 'active', 'completed'
  created_by uuid references public.profiles(id),
  next_payout_date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. CIRCLE MEMBERS
create table public.circle_members (
  id uuid default gen_random_uuid() primary key,
  circle_id uuid references public.circles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  position integer not null,
  role text default 'member', -- 'admin', 'member'
  payment_status text default 'current', -- 'current', 'late', 'defaulted'
  payout_received boolean default false,
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  unique(circle_id, user_id),
  unique(circle_id, position)
);

-- 4. CONTRIBUTIONS (payment records)
create table public.contributions (
  id uuid default gen_random_uuid() primary key,
  circle_id uuid references public.circles(id) on delete cascade,
  user_id uuid references public.profiles(id),
  amount integer not null,
  recorded_by uuid references public.profiles(id),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. PAYOUTS
create table public.payouts (
  id uuid default gen_random_uuid() primary key,
  circle_id uuid references public.circles(id) on delete cascade,
  user_id uuid references public.profiles(id),
  amount integer not null,
  round_number integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) - users can only see their own data
alter table public.profiles enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.contributions enable row level security;
alter table public.payouts enable row level security;

-- Profiles: users can read/write their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Circles: members can view circles they belong to; anyone can view to join
create policy "Anyone can view circles" on public.circles for select using (true);
create policy "Authenticated users can create circles" on public.circles for insert with check (auth.uid() = created_by);
create policy "Admins can update their circles" on public.circles for update using (
  auth.uid() = created_by
);

-- Circle members: members can see all members of their circles
create policy "Members can view circle members" on public.circle_members for select using (
  auth.uid() in (
    select user_id from public.circle_members cm2 where cm2.circle_id = circle_members.circle_id
  )
);
create policy "Users can join circles" on public.circle_members for insert with check (auth.uid() = user_id);
create policy "Admins can update members" on public.circle_members for update using (
  auth.uid() in (
    select user_id from public.circle_members where circle_id = circle_members.circle_id and role = 'admin'
  )
);

-- Contributions: circle members can view; admins can insert
create policy "Circle members can view contributions" on public.contributions for select using (
  auth.uid() in (
    select user_id from public.circle_members where circle_id = contributions.circle_id
  )
);
create policy "Admins can record contributions" on public.contributions for insert with check (
  auth.uid() in (
    select user_id from public.circle_members where circle_id = contributions.circle_id and role = 'admin'
  ) or auth.uid() = user_id
);

-- Payouts: circle members can view
create policy "Circle members can view payouts" on public.payouts for select using (
  auth.uid() in (
    select user_id from public.circle_members where circle_id = payouts.circle_id
  )
);
create policy "Admins can record payouts" on public.payouts for insert with check (
  auth.uid() in (
    select user_id from public.circle_members where circle_id = payouts.circle_id and role = 'admin'
  )
);

-- Also allow profiles to be read by circle members (for displaying names)
create policy "Circle members can view each others profiles" on public.profiles for select using (
  auth.uid() in (
    select cm1.user_id from public.circle_members cm1
    where cm1.circle_id in (
      select cm2.circle_id from public.circle_members cm2 where cm2.user_id = profiles.id
    )
  )
  or auth.uid() = id
);
