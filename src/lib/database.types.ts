export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string;
          name: string;
          code: string;        // "MY", "SG", etc.
          flag: string;        // emoji
          status: "Active" | "Onboarding" | "Coming Soon";
          partner_name: string | null;
          partner_email: string | null;
          partner_rep: string | null;
          schools_count: number;
          students_count: number;
          revenue: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["countries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["countries"]["Insert"]>;
      };
      schools: {
        Row: {
          id: string;
          name: string;
          code: string;        // "MY-KL-001"
          country_id: string;
          city: string;
          coordinator_name: string | null;
          coordinator_email: string | null;
          students_count: number;
          status: "Active" | "Pending" | "Onboarding" | "Inactive" | "Suspended";
          joined_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["schools"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
      };
      students_legacy: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string | null;
          school_id: string;
          country_id: string;
          grade: number;
          subjects: string[];   // ["Math", "Science"]
          r1_result: "Distinction" | "Pass" | "Fail" | "Pending" | null;
          r2_result: "Distinction" | "Pass" | "Fail" | "Pending" | null;
          gf_qualified: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["students_legacy"]["Row"], "id" | "created_at" | "updated_at" | "deleted_at"> & {
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["students_legacy"]["Insert"]>;
      };
      admin_profiles: {
        Row: {
          id: string;           // matches auth.users.id
          email: string;
          full_name: string;
          role: "super_admin" | "hq_staff" | "exam_manager" | "marketing" | "finance";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_profiles"]["Row"], "created_at" | "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_profiles"]["Insert"]>;
      };
      announcements: {
        Row: {
          id: string;
          subject: string;
          body: string;
          target: "All Partners" | "Active Partners Only" | "Selected Partners";
          status: "Sent" | "Draft";
          sent_at: string | null;
          opens: number;
          recipients: number;
          created_by: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["announcements"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
    };
    Views: {
      user_profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: string | null;
          tenant_id: string | null;
          created_at: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
