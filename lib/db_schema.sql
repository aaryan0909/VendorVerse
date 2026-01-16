-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- VENDORS TABLE
create table public.vendors (
  id uuid references auth.users not null primary key,
  phone text not null,
  business_name text not null,
  owner_name text not null,
  business_type text default 'food',
  upi_id text,
  points_per_10_rupees int default 1,
  plan text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CUSTOMERS TABLE (Global list of customers by phone)
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  phone text unique not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- VENDOR_CUSTOMERS (Junction table tracking points per vendor)
create table public.vendor_customers (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references public.vendors(id) not null,
  customer_id uuid references public.customers(id) not null,
  points_balance int default 0,
  total_spent decimal default 0,
  visit_count int default 0,
  last_visit timestamp with time zone default timezone('utc'::text, now()),
  tier text default 'bronze',
  unique(vendor_id, customer_id)
);

-- REWARDS TABLE
create table public.rewards (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references public.vendors(id) not null,
  name text not null,
  description text,
  points_required int not null,
  is_active boolean default true,
  redemption_count int default 0,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRANSACTIONS TABLE
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references public.vendors(id) not null,
  customer_id uuid references public.customers(id) not null,
  amount decimal not null,
  points_earned int not null,
  type text check (type in ('EARN', 'REDEEM')),
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Simple for MVP)
alter table public.vendors enable row level security;
create policy "Vendors can view own data" on public.vendors for all using (auth.uid() = id);

alter table public.customers enable row level security;
create policy "Anyone can create customers" on public.customers for insert with check (true);
create policy "Anyone can read customers" on public.customers for select using (true);

alter table public.vendor_customers enable row level security;
create policy "Vendors manage their customers" on public.vendor_customers for all using (auth.uid() = vendor_id);

alter table public.rewards enable row level security;
create policy "Vendors manage rewards" on public.rewards for all using (auth.uid() = vendor_id);

alter table public.transactions enable row level security;
create policy "Vendors view transactions" on public.transactions for all using (auth.uid() = vendor_id);
