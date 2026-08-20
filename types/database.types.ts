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
