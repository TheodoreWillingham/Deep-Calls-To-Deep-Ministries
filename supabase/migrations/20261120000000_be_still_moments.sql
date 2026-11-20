-- Admin-editable "Be Still" moments shown on the Prayer page.
-- NOTE: assumes public.profiles has an `id` column equal to auth.uid() and an `is_admin` boolean.
create table if not exists public.be_still_moments (
  id bigint generated always as identity primary key,
  title text,
  pray text not null default '',
  rest text not null default '',
  action text not null default '',
  yield_text text not null default '',
  created_at timestamptz not null default now()
);

alter table public.be_still_moments enable row level security;

create policy "Anyone can read be still moments"
  on public.be_still_moments for select
  using (true);

create policy "Admins can insert be still moments"
  on public.be_still_moments for insert
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Admins can update be still moments"
  on public.be_still_moments for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Admins can delete be still moments"
  on public.be_still_moments for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Starter moment
insert into public.be_still_moments (title, pray, rest, action, yield_text) values (
  'Truth',
  '“God, where do I get my truth from?”',
  'Take a few deep breaths and clear your mind, sitting in a position of listening and waiting for God to speak to you. What did God bring to your mind?',
  '“God, what do I need to do in my life to live by Your truth? God open my heart and mind up to the ways that truth has been distorted in my life”',
  '“God I give myself to You and proclaim that I want to live by Your truth so teach me Your ways.”'
);
