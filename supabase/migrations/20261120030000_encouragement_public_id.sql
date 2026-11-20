-- Browser-generated id so the notification email can link to a post that anonymous users can't read back.
alter table public.encouragement_posts
  add column if not exists public_id uuid not null default gen_random_uuid();
create unique index if not exists encouragement_posts_public_id_key on public.encouragement_posts (public_id);
