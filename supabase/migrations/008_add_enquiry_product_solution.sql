-- Migration: 008_add_enquiry_product_solution.sql
-- Non-destructive migration adding product and solution columns to public.enquiries
-- Safe for existing rows (nullable columns, preserves all prior enquiry records).

alter table public.enquiries
    add column if not exists product text,
    add column if not exists solution text;

comment on column public.enquiries.product is 'Selected product or product enquiry topic from the website contact form.';
comment on column public.enquiries.solution is 'Selected industry or application solution from the website contact form.';

