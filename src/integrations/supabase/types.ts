export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_items: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          legal_deadline: boolean | null
          meeting_id: string | null
          priority: string | null
          responsible: string | null
          status: string | null
          task: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          legal_deadline?: boolean | null
          meeting_id?: string | null
          priority?: string | null
          responsible?: string | null
          status?: string | null
          task: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          legal_deadline?: boolean | null
          meeting_id?: string | null
          priority?: string | null
          responsible?: string | null
          status?: string | null
          task?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_items: {
        Row: {
          confidential: boolean | null
          created_at: string
          decision: string | null
          discussion: string | null
          id: string
          meeting_id: string | null
          order_index: number
          responsible: string | null
          title: string
        }
        Insert: {
          confidential?: boolean | null
          created_at?: string
          decision?: string | null
          discussion?: string | null
          id?: string
          meeting_id?: string | null
          order_index: number
          responsible?: string | null
          title: string
        }
        Update: {
          confidential?: boolean | null
          created_at?: string
          decision?: string | null
          discussion?: string | null
          id?: string
          meeting_id?: string | null
          order_index?: number
          responsible?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      api_settings: {
        Row: {
          api_key: string
          created_at: string
          id: string
          service_name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          service_name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          content_type: string | null
          created_at: string
          file_path: string
          id: string
          meeting_id: string | null
          name: string
          size: number | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_path: string
          id?: string
          meeting_id?: string | null
          name: string
          size?: number | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_path?: string
          id?: string
          meeting_id?: string | null
          name?: string
          size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_references: {
        Row: {
          agenda_item_id: string | null
          created_at: string
          description: string | null
          id: string
          meeting_id: string | null
          reference: string
          type: string | null
        }
        Insert: {
          agenda_item_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          meeting_id?: string | null
          reference: string
          type?: string | null
        }
        Update: {
          agenda_item_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          meeting_id?: string | null
          reference?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_references_agenda_item_id_fkey"
            columns: ["agenda_item_id"]
            isOneToOne: false
            referencedRelation: "agenda_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_references_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_minutes: {
        Row: {
          approver: string | null
          author: string | null
          confidentiality_level: string | null
          created_at: string
          date: string
          end_time: string | null
          id: string
          last_modified: string
          location: string | null
          meeting_title: string
          meeting_type: string | null
          organizer: string | null
          start_time: string
          status: string | null
          summary: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          approver?: string | null
          author?: string | null
          confidentiality_level?: string | null
          created_at?: string
          date: string
          end_time?: string | null
          id?: string
          last_modified?: string
          location?: string | null
          meeting_title: string
          meeting_type?: string | null
          organizer?: string | null
          start_time: string
          status?: string | null
          summary?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          approver?: string | null
          author?: string | null
          confidentiality_level?: string | null
          created_at?: string
          date?: string
          end_time?: string | null
          id?: string
          last_modified?: string
          location?: string | null
          meeting_title?: string
          meeting_type?: string | null
          organizer?: string | null
          start_time?: string
          status?: string | null
          summary?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      meeting_participants: {
        Row: {
          created_at: string
          email: string | null
          id: string
          meeting_id: string | null
          name: string
          oab: string | null
          phone: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          meeting_id?: string | null
          name: string
          oab?: string | null
          phone?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          meeting_id?: string | null
          name?: string
          oab?: string | null
          phone?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_transcription_limit: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_count: number
          oldest_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
