export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      certifications: {
        Row: {
          id: string
          title: string
          credential_type: 'iso' | 'plexconcil' | 'other'
          certificate_number: string
          issuing_organization: string
          scope: string | null
          issue_date: string | null
          expiry_date: string | null
          image_url: string | null
          image_cloudinary_public_id: string | null
          display_order: number
          active: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          credential_type: 'iso' | 'plexconcil' | 'other'
          certificate_number: string
          issuing_organization: string
          scope?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          image_url?: string | null
          image_cloudinary_public_id?: string | null
          display_order?: number
          active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          credential_type?: 'iso' | 'plexconcil' | 'other'
          certificate_number?: string
          issuing_organization?: string
          scope?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          image_url?: string | null
          image_cloudinary_public_id?: string | null
          display_order?: number
          active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      homepage_media: {
        Row: {
          id: string
          slot: string
          image_cloudinary_public_id: string | null
          image_url: string | null
          alt_text: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          slot: string
          image_cloudinary_public_id?: string | null
          image_url?: string | null
          alt_text?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          slot?: string
          image_cloudinary_public_id?: string | null
          image_url?: string | null
          alt_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          id: string
          section_key: string
          content: Json
          updated_at: string
        }
        Insert: {
          id?: string
          section_key: string
          content: Json
          updated_at?: string
        }
        Update: {
          id?: string
          section_key?: string
          content?: Json
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          id: string
          title: string
          description: string
          icon_name: string | null
          image_url: string | null
          image_cloudinary_public_id: string | null
          display_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon_name?: string | null
          image_url?: string | null
          image_cloudinary_public_id?: string | null
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon_name?: string | null
          image_url?: string | null
          image_cloudinary_public_id?: string | null
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      manufacturing_steps: {
        Row: {
          id: string
          step_number: number
          title: string
          description: string
          icon_name: string | null
          display_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step_number: number
          title: string
          description: string
          icon_name?: string | null
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          step_number?: number
          title?: string
          description?: string
          icon_name?: string | null
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          id: string
          customer_name: string
          phone: string | null
          email: string
          company: string | null
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          phone?: string | null
          email: string
          company?: string | null
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          phone?: string | null
          email?: string
          company?: string | null
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          category: string
          image_cloudinary_public_id: string | null
          image_url: string | null
          featured: boolean
          display_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          category: string
          image_cloudinary_public_id?: string | null
          image_url?: string | null
          featured?: boolean
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          category?: string
          image_cloudinary_public_id?: string | null
          image_url?: string | null
          featured?: boolean
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          user_id: string
          role: 'admin'
          created_at: string
        }
        Insert: {
          user_id: string
          role?: 'admin'
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: 'admin'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedSchema: "auth"
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
