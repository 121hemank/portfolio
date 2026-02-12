export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          image_url: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          id: string
          image_url: string | null
          issue_date: string | null
          issuer: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          budget: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          name: string
          project_details: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          name: string
          project_details?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          name?: string
          project_details?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          end_date: string | null
          field: string | null
          id: string
          institution: string
          sort_order: number | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution: string
          sort_order?: number | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution?: string
          sort_order?: number | null
          start_date?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          achievements: string[] | null
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          position: string
          sort_order: number | null
          start_date: string | null
        }
        Insert: {
          achievements?: string[] | null
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position: string
          sort_order?: number | null
          start_date?: string | null
        }
        Update: {
          achievements?: string[] | null
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position?: string
          sort_order?: number | null
          start_date?: string | null
        }
        Relationships: []
      }
      portfolio_config: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profile: {
        Row: {
          about_me: string | null
          bio: string | null
          created_at: string
          cv_url: string | null
          github_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          name: string
          profile_image_url: string | null
          projects_completed: number | null
          response_time: string | null
          technologies_mastered: number | null
          title: string
          twitter_url: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          about_me?: string | null
          bio?: string | null
          created_at?: string
          cv_url?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string
          profile_image_url?: string | null
          projects_completed?: number | null
          response_time?: string | null
          technologies_mastered?: number | null
          title?: string
          twitter_url?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          about_me?: string | null
          bio?: string | null
          created_at?: string
          cv_url?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string
          profile_image_url?: string | null
          projects_completed?: number | null
          response_time?: string | null
          technologies_mastered?: number | null
          title?: string
          twitter_url?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          github_url: string | null
          id: string
          image_url: string | null
          live_url: string | null
          sort_order: number | null
          tech_stack: string[] | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          sort_order?: number | null
          tech_stack?: string[] | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          sort_order?: number | null
          tech_stack?: string[] | null
          title?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          id: string
          level: number
          name: string
          sort_order: number | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          level?: number
          name: string
          sort_order?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          level?: number
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
