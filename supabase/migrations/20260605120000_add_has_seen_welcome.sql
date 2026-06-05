-- Add has_seen_welcome flag to track if the user has seen the initial welcome modal.
-- Set default to false so all existing and new users will see it on next login.
ALTER TABLE public.users
ADD COLUMN has_seen_welcome boolean NOT NULL DEFAULT false;
