import { Database } from './database.types';

export * from './database.types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type Enquiry = Database['public']['Tables']['enquiries']['Row'];
export type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert'];
export type EnquiryUpdate = Database['public']['Tables']['enquiries']['Update'];

export type CompanySettings = Database['public']['Tables']['company_settings']['Row'];
export type HomepageMedia = Database['public']['Tables']['homepage_media']['Row'];
export type HomepageSection = Database['public']['Tables']['homepage_sections']['Row'];

export type Certification = Database['public']['Tables']['certifications']['Row'];
export type CertificationInsert = Database['public']['Tables']['certifications']['Insert'];
export type CertificationUpdate = Database['public']['Tables']['certifications']['Update'];

export type Industry = Database['public']['Tables']['industries']['Row'];
export type IndustryInsert = Database['public']['Tables']['industries']['Insert'];
export type IndustryUpdate = Database['public']['Tables']['industries']['Update'];

export type ManufacturingStep = Database['public']['Tables']['manufacturing_steps']['Row'];
export type ManufacturingStepInsert = Database['public']['Tables']['manufacturing_steps']['Insert'];
export type ManufacturingStepUpdate = Database['public']['Tables']['manufacturing_steps']['Update'];

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
