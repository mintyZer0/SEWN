-- Drop the existing constraint
ALTER TABLE IF EXISTS public.sewist_verifications 
  DROP CONSTRAINT IF EXISTS sewer_verifications_user_id_fkey;

-- Add the new constraint with ON DELETE CASCADE
ALTER TABLE public.sewist_verifications
  ADD CONSTRAINT sewer_verifications_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.users(id) 
  ON DELETE CASCADE;