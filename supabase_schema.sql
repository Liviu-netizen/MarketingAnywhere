-- NowMarketing Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Agencies table (marketing firms)
create table if not exists agencies (
  id uuid primary key default uuid_generate_v4(),
  google_place_id text unique,
  name text not null,
  logo_url text,
  cover_image text,
  rating numeric(2,1) default 0,
  review_count integer default 0,
  location jsonb default '{}',
  description text,
  services jsonb default '[]',
  tags text[] default '{}',
  verified boolean default false,
  is_registered boolean default false,
  is_pro boolean default false,
  website text,
  phone text,
  pricing jsonb default '{}',
  stats jsonb default '{}',
  budget_level text,
  focus text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  location jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid references agencies on delete cascade,
  user_id uuid references auth.users on delete set null,
  user_name text not null,
  user_avatar text,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text,
  service_tag text,
  helpful_count integer default 0,
  created_at timestamptz default now()
);

-- Saved agencies (favorites)
create table if not exists saved_agencies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  agency_id uuid references agencies on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, agency_id)
);

-- Conversations (chat threads)
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  agency_id uuid references agencies on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, agency_id)
);

-- Messages
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations on delete cascade,
  sender_id uuid,
  sender_type text check (sender_type in ('user', 'agency')),
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Bookings
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  agency_id uuid references agencies on delete cascade,
  service text,
  scheduled_at timestamptz,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security Policies

-- Agencies: Anyone can read, only admins can write
alter table agencies enable row level security;
create policy "Agencies are viewable by everyone" on agencies for select using (true);

-- Profiles: Users can only read/write their own profile
alter table profiles enable row level security;
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Reviews: Anyone can read, authenticated users can create
alter table reviews enable row level security;
create policy "Reviews are viewable by everyone" on reviews for select using (true);
create policy "Authenticated users can create reviews" on reviews for insert with check (auth.role() = 'authenticated');

-- Saved agencies: Users can only see/manage their own
alter table saved_agencies enable row level security;
create policy "Users can view their saved agencies" on saved_agencies for select using (auth.uid() = user_id);
create policy "Users can save agencies" on saved_agencies for insert with check (auth.uid() = user_id);
create policy "Users can unsave agencies" on saved_agencies for delete using (auth.uid() = user_id);

-- Conversations: Users can only see their own
alter table conversations enable row level security;
create policy "Users can view their conversations" on conversations for select using (auth.uid() = user_id);
create policy "Users can create conversations" on conversations for insert with check (auth.uid() = user_id);

-- Messages: Users can see messages in their conversations
alter table messages enable row level security;
create policy "Users can view messages in their conversations" on messages for select 
  using (conversation_id in (select id from conversations where user_id = auth.uid()));
create policy "Users can send messages" on messages for insert 
  with check (conversation_id in (select id from conversations where user_id = auth.uid()));

-- Bookings: Users can only see/manage their own
alter table bookings enable row level security;
create policy "Users can view their bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update their bookings" on bookings for update using (auth.uid() = user_id);

-- Enable realtime for messages
alter publication supabase_realtime add table messages;

-- Create indexes for performance
create index if not exists idx_agencies_rating on agencies(rating desc);
create index if not exists idx_agencies_location on agencies using gin(location);
create index if not exists idx_reviews_agency on reviews(agency_id);
create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_bookings_user on bookings(user_id);
create index if not exists idx_bookings_scheduled on bookings(scheduled_at);

-- Insert some sample agencies
insert into agencies (name, rating, review_count, location, description, services, tags, verified, is_registered, is_pro, website, pricing, stats, budget_level, focus)
values 
(
  'Apex Digital Strategies',
  4.9,
  120,
  '{"city": "New York", "country": "USA", "address": "350 5th Ave, New York, NY 10118", "lat": 40.7484, "lng": -73.9857}',
  'Top-tier digital marketing agency specializing in growth for SaaS and Tech companies.',
  '[{"name": "SEO Optimization", "description": "Audit, Strategy & Link Building", "price_from": 1000}, {"name": "Content Marketing", "description": "Blogs & Social", "price_from": 2000}]',
  '{"SEO", "PPC", "Content", "SaaS"}',
  true,
  true,
  true,
  'https://apexdigital.example.com',
  '{"starting_monthly": 1200, "hourly_rate": 150}',
  '{"avg_roas": "300%", "years_experience": 10, "clients_served": 250}',
  '$$$',
  'Tech/SaaS'
),
(
  'Growth Gurus',
  4.7,
  89,
  '{"city": "New York", "country": "USA", "address": "200 Park Ave, New York, NY 10166", "lat": 40.7549, "lng": -73.9768}',
  'Data-driven growth marketing with expertise in social media strategy.',
  '[{"name": "Social Media Strategy", "description": "Platform campaigns", "price_from": 1500}, {"name": "Influencer Outreach", "description": "Partnership management", "price_from": 2000}]',
  '{"Social Media", "Influencer", "Growth"}',
  true,
  true,
  false,
  'https://growthgurus.example.com',
  '{"starting_monthly": 1500, "hourly_rate": 125}',
  '{"avg_roas": "280%", "years_experience": 7, "clients_served": 150}',
  '$$$',
  'E-commerce'
);
