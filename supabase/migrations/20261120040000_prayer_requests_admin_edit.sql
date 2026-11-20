-- Lets admins edit and delete prayer requests from the Prayer page.
-- NOTE: assumes public.profiles has an `id` column equal to auth.uid() and an `is_admin` boolean.
create policy "Admins can update prayer requests"
  on public.prayer_requests for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Admins can delete prayer requests"
  on public.prayer_requests for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
