-- Testimonies and praises for the Encouragement Corner.
-- NOTE: assumes public.profiles has `id` = auth.uid() and an `is_admin` boolean.
create table if not exists public.encouragement_posts (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('testimony', 'praise')),
  name text not null,
  body text not null,
  topic text not null,
  consent boolean not null default false,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.encouragement_posts enable row level security;

-- Public sees approved posts only; admins see everything (to moderate).
create policy "Read approved or admin"
  on public.encouragement_posts for select
  using (
    is_approved
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Anyone can submit, but only unapproved and with consent.
create policy "Anyone can submit"
  on public.encouragement_posts for insert
  with check (is_approved = false and consent = true);

create policy "Admins can update"
  on public.encouragement_posts for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Admins can delete"
  on public.encouragement_posts for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
