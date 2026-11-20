-- Multiple topics per post + anonymous flag.
alter table public.encouragement_posts
  add column if not exists topics text[] not null default '{}',
  add column if not exists is_anonymous boolean not null default false;

update public.encouragement_posts set topics = array[topic] where topics = '{}' and topic is not null;

alter table public.encouragement_posts drop column if exists topic;
