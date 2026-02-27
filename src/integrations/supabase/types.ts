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
      districts: {
        Row: {
          id: number
          name: string
          state_id: number
        }
        Insert: {
          id?: number
          name: string
          state_id: number
        }
        Update: {
          id?: number
          name?: string
          state_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "districts_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      eligibility_checks: {
        Row: {
          age: number
          ai_response: string | null
          annual_income: number
          category: string
          created_at: string
          district: string
          gender: string
          has_disability: boolean | null
          id: string
          name: string
          occupation: string
          state: string
        }
        Insert: {
          age: number
          ai_response?: string | null
          annual_income: number
          category: string
          created_at?: string
          district: string
          gender: string
          has_disability?: boolean | null
          id?: string
          name: string
          occupation: string
          state: string
        }
        Update: {
          age?: number
          ai_response?: string | null
          annual_income?: number
          category?: string
          created_at?: string
          district?: string
          gender?: string
          has_disability?: boolean | null
          id?: string
          name?: string
          occupation?: string
          state?: string
        }
        Relationships: []
      }
      govt_jobs: {
        Row: {
          age_relaxation_obc: number | null
          age_relaxation_sc_st: number | null
          apply_link: string | null
          category_reservation: string[] | null
          created_at: string
          department: string
          description: string | null
          fee_general: number | null
          fee_obc: number | null
          fee_sc_st: number | null
          id: string
          is_active: boolean | null
          max_age: number
          min_age: number
          post_name: string
          qualification: string
          registration_end: string
          registration_start: string
          selection_process: string | null
          state: string | null
          total_vacancies: number
        }
        Insert: {
          age_relaxation_obc?: number | null
          age_relaxation_sc_st?: number | null
          apply_link?: string | null
          category_reservation?: string[] | null
          created_at?: string
          department: string
          description?: string | null
          fee_general?: number | null
          fee_obc?: number | null
          fee_sc_st?: number | null
          id?: string
          is_active?: boolean | null
          max_age?: number
          min_age?: number
          post_name: string
          qualification?: string
          registration_end?: string
          registration_start?: string
          selection_process?: string | null
          state?: string | null
          total_vacancies?: number
        }
        Update: {
          age_relaxation_obc?: number | null
          age_relaxation_sc_st?: number | null
          apply_link?: string | null
          category_reservation?: string[] | null
          created_at?: string
          department?: string
          description?: string | null
          fee_general?: number | null
          fee_obc?: number | null
          fee_sc_st?: number | null
          id?: string
          is_active?: boolean | null
          max_age?: number
          min_age?: number
          post_name?: string
          qualification?: string
          registration_end?: string
          registration_start?: string
          selection_process?: string | null
          state?: string | null
          total_vacancies?: number
        }
        Relationships: []
      }
      schemes: {
        Row: {
          apply_link: string | null
          category: string
          created_at: string
          deadline: string | null
          description_en: string | null
          description_hi: string | null
          eligibility_criteria: Json | null
          id: string
          is_active: boolean | null
          name_en: string
          name_hi: string
          required_documents: string[] | null
          target_group: string[] | null
          updated_at: string
        }
        Insert: {
          apply_link?: string | null
          category?: string
          created_at?: string
          deadline?: string | null
          description_en?: string | null
          description_hi?: string | null
          eligibility_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_hi: string
          required_documents?: string[] | null
          target_group?: string[] | null
          updated_at?: string
        }
        Update: {
          apply_link?: string | null
          category?: string
          created_at?: string
          deadline?: string | null
          description_en?: string | null
          description_hi?: string | null
          eligibility_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_hi?: string
          required_documents?: string[] | null
          target_group?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      states: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
