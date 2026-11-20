create table media_items (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('video', 'podcast')),
  title text not null,
  description text,
  url text not null,
  thumbnail_url text,
  category text,          -- e.g. 'Recently Added', 'Video Series for Groups'
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table media_items enable row level security;

create policy "Anyone can read media" on media_items
  for select using (true);

create policy "Admins manage media" on media_items
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin)
  ) with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin)
  );
