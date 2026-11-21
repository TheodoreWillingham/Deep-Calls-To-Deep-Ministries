-- Makes the "Pray For" button on the Prayer page save permanently.
-- Visitors cannot update prayer_requests directly, so the button calls this function instead.
-- It runs with elevated rights, but can only ever set has_been_prayed_for to true,
-- and only on requests that are already public.
alter table public.prayer_requests
  add column if not exists has_been_prayed_for boolean not null default false;

create or replace function public.mark_prayer_prayed_for(request_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.prayer_requests
  set has_been_prayed_for = true
  where id::text = request_id::text
    and is_approved = true
    and show_on_website = true;
$$;

grant execute on function public.mark_prayer_prayed_for(uuid) to anon, authenticated;
