export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          locale: string;
          theme: "dark" | "light" | "system";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          locale?: string;
          theme?: "dark" | "light" | "system";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          locale?: string;
          theme?: "dark" | "light" | "system";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          user_id: string;
          default_provider: "groq" | "openai" | "openrouter";
          default_model: string;
          system_prompt: string | null;
          temperature: number;
          top_p: number;
          max_tokens: number;
          presence_penalty: number;
          frequency_penalty: number;
          use_byok: boolean;
          web_search_enabled: boolean;
          voice_locale: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          default_provider?: "groq" | "openai" | "openrouter";
          default_model?: string;
          system_prompt?: string | null;
          temperature?: number;
          top_p?: number;
          max_tokens?: number;
          presence_penalty?: number;
          frequency_penalty?: number;
          use_byok?: boolean;
          web_search_enabled?: boolean;
          voice_locale?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          default_provider?: "groq" | "openai" | "openrouter";
          default_model?: string;
          system_prompt?: string | null;
          temperature?: number;
          top_p?: number;
          max_tokens?: number;
          presence_penalty?: number;
          frequency_penalty?: number;
          use_byok?: boolean;
          web_search_enabled?: boolean;
          voice_locale?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_api_keys: {
        Row: {
          id: string;
          user_id: string;
          provider: "groq" | "openai" | "openrouter";
          encrypted_key: string;
          key_hint: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: "groq" | "openai" | "openrouter";
          encrypted_key: string;
          key_hint: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: "groq" | "openai" | "openrouter";
          encrypted_key?: string;
          key_hint?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          icon: string | null;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string | null;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          title: string;
          model: string;
          provider: "groq" | "openai" | "openrouter" | "image";
          is_pinned: boolean;
          is_favorite: boolean;
          shared_token: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          title?: string;
          model?: string;
          provider?: "groq" | "openai" | "openrouter" | "image";
          is_pinned?: boolean;
          is_favorite?: boolean;
          shared_token?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          folder_id?: string | null;
          title?: string;
          model?: string;
          provider?: "groq" | "openai" | "openrouter" | "image";
          is_pinned?: boolean;
          is_favorite?: boolean;
          shared_token?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: "user" | "assistant" | "system" | "tool";
          content: string;
          model: string | null;
          provider: string | null;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          total_tokens: number | null;
          finish_reason: string | null;
          duration_ms: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          role: "user" | "assistant" | "system" | "tool";
          content?: string;
          model?: string | null;
          provider?: string | null;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          total_tokens?: number | null;
          finish_reason?: string | null;
          duration_ms?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          user_id?: string;
          role?: "user" | "assistant" | "system" | "tool";
          content?: string;
          model?: string | null;
          provider?: string | null;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          total_tokens?: number | null;
          finish_reason?: string | null;
          duration_ms?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      attachments: {
        Row: {
          id: string;
          message_id: string | null;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          public_url: string | null;
          extracted_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id?: string | null;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          public_url?: string | null;
          extracted_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string | null;
          user_id?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          storage_path?: string;
          public_url?: string | null;
          extracted_text?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      generated_images: {
        Row: {
          id: string;
          user_id: string;
          message_id: string | null;
          prompt: string;
          provider: string;
          model: string;
          aspect_ratio: string | null;
          storage_path: string;
          public_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message_id?: string | null;
          prompt: string;
          provider: string;
          model: string;
          aspect_ratio?: string | null;
          storage_path: string;
          public_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message_id?: string | null;
          prompt?: string;
          provider?: string;
          model?: string;
          aspect_ratio?: string | null;
          storage_path?: string;
          public_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      web_search_results: {
        Row: {
          id: string;
          message_id: string;
          query: string;
          url: string;
          title: string;
          snippet: string | null;
          rank: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          query: string;
          url: string;
          title: string;
          snippet?: string | null;
          rank?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          query?: string;
          url?: string;
          title?: string;
          snippet?: string | null;
          rank?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          usage_date: string;
          message_count: number;
          image_gen_count: number;
          web_search_count: number;
          tokens_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          usage_date?: string;
          message_count?: number;
          image_gen_count?: number;
          web_search_count?: number;
          tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          usage_date?: string;
          message_count?: number;
          image_gen_count?: number;
          web_search_count?: number;
          tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          target_type: string | null;
          target_id: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
