-- Rollback Migration: Rename 'sewist' back to 'sewer'

-- 1. Rename tables
ALTER TABLE IF EXISTS public.sewist_achievements RENAME TO sewer_achievements;
ALTER TABLE IF EXISTS public.sewist_onboarding_surveys RENAME TO sewer_onboarding_surveys;
ALTER TABLE IF EXISTS public.sewist_settings RENAME TO sewer_settings;
ALTER TABLE IF EXISTS public.sewist_statistics RENAME TO sewer_statistics;
ALTER TABLE IF EXISTS public.sewist_verifications RENAME TO sewer_verifications;
ALTER TABLE IF EXISTS public.sewist_products RENAME TO seller_products;

-- 2. Rename columns
ALTER TABLE IF EXISTS public.service_requests RENAME COLUMN sewist_id TO sewer_id;
ALTER TABLE IF EXISTS public.chat_conversations RENAME COLUMN sewist_id TO seller_id;

-- 3. Rename Constraints & Indexes
ALTER TABLE IF EXISTS public.sewer_achievements RENAME CONSTRAINT sewist_achievements_pkey TO sewer_achievements_pkey;
ALTER TABLE IF EXISTS public.sewer_achievements RENAME CONSTRAINT sewist_achievements_user_id_fkey TO sewer_achievements_user_id_fkey;

ALTER TABLE IF EXISTS public.sewer_onboarding_surveys RENAME CONSTRAINT sewist_onboarding_surveys_pkey TO sewer_onboarding_surveys_pkey;
ALTER TABLE IF EXISTS public.sewer_onboarding_surveys RENAME CONSTRAINT sewist_onboarding_surveys_user_id_fkey TO sewer_onboarding_surveys_user_id_fkey;

ALTER TABLE IF EXISTS public.sewer_settings RENAME CONSTRAINT sewist_settings_pkey TO sewer_settings_pkey;
ALTER TABLE IF EXISTS public.sewer_settings RENAME CONSTRAINT sewist_settings_user_id_fkey TO sewer_settings_user_id_fkey;
ALTER TABLE IF EXISTS public.sewer_settings RENAME CONSTRAINT sewist_settings_user_id_key TO sewer_settings_user_id_key;

ALTER TABLE IF EXISTS public.sewer_statistics RENAME CONSTRAINT sewist_statistics_pkey TO sewer_statistics_pkey;
ALTER TABLE IF EXISTS public.sewer_statistics RENAME CONSTRAINT sewist_statistics_user_id_fkey TO sewer_statistics_user_id_fkey;

ALTER TABLE IF EXISTS public.sewer_verifications RENAME CONSTRAINT sewist_verifications_pkey TO sewer_verifications_pkey;
ALTER TABLE IF EXISTS public.sewer_verifications RENAME CONSTRAINT sewist_verifications_user_id_fkey TO sewer_verifications_user_id_fkey;

ALTER TABLE IF EXISTS public.service_requests RENAME CONSTRAINT service_requests_sewist_id_fkey TO service_requests_sewer_id_fkey;
ALTER TABLE IF EXISTS public.chat_conversations RENAME CONSTRAINT chat_conversations_sewist_id_fkey TO chat_conversations_seller_id_fkey;

-- 4. Revert user_type enum values (Note: Requires separate script to update 'sewist' to 'seller')
-- UPDATE public.users SET user_type = 'seller' WHERE user_type = 'sewist';
