-- Migration: 005_simplify_certifications.sql
-- Simplifies the certifications table so admin only needs to upload an image.

-- 1. Remove NOT NULL constraints on detailed metadata fields
alter table public.certifications
    alter column credential_type drop not null,
    alter column certificate_number drop not null,
    alter column issuing_organization drop not null;

-- 2. Drop credential_type check constraint if it exists
alter table public.certifications
    drop constraint if exists chk_credential_type;

-- 3. Make title optional with a default value
alter table public.certifications
    alter column title set default 'Certificate',
    alter column title drop not null;

-- 4. Delete legacy mock seed certifications without images
delete from public.certifications where image_url is null;

