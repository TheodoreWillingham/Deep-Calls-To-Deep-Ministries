-- Messages sent through the Connect page. Visitors can add one; only admins can read or delete them.
-- NOTE: assumes public.profiles has an `id` column equal to auth.uid() and an `is_admin` boolean.
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Anyone (including logged-out visitors) can submit the form.
create policy "Anyone can submit a contact form"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (notified_at is null);

create policy "Admins can read contact submissions"
  on public.contact_submissions for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Admins can delete contact submissions"
  on public.contact_submissions for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
