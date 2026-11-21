-- Adds an optional message to Connect form submissions.
alter table public.contact_submissions
  add column if not exists message text check (message is null or char_length(message) <= 2000);
