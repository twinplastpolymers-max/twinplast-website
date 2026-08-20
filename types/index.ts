import { Database } from './database.types';

export * from './database.types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type Enquiry = Database['public']['Tables']['enquiries']['Row'];
export type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert'];
export type EnquiryUpdate = Database['public']['Tables']['enquiries']['Update'];

export type CompanySettings = Database['public']['Tables']['company_settings']['Row'];

export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type RoleType = Database['public']['Enums']['user_role'];
export interface CompanyInfo {
  name: string;
  location: string;
  established: number;
  email: string;
  phone: string;
  address: string;
  socials?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}
export interface HeroConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}
