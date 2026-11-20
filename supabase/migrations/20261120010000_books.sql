-- Books shown on the Books page. Anyone can read; only admins can add, edit or delete.
create table books (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  cover_url text,
  buy_url text,
  created_at timestamptz default now()
);

alter table books enable row level security;

create policy "Anyone can read books" on books
  for select using (true);

create policy "Admins manage books" on books
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin)
  ) with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin)
  );

-- Public bucket for cover images that the author uploads herself.
insert into storage.buckets (id, name, public)
values ('book-covers', 'book-covers', true)
on conflict (id) do nothing;

create policy "Anyone can view book covers" on storage.objects
  for select using (bucket_id = 'book-covers');

create policy "Admins upload book covers" on storage.objects
  for insert with check (
    bucket_id = 'book-covers'
    and exists (select 1 from profiles where id = auth.uid() and is_admin)
  );

create policy "Admins update book covers" on storage.objects
  for update using (
    bucket_id = 'book-covers'
    and exists (select 1 from profiles where id = auth.uid() and is_admin)
  );

create policy "Admins delete book covers" on storage.objects
  for delete using (
    bucket_id = 'book-covers'
    and exists (select 1 from profiles where id = auth.uid() and is_admin)
  );
