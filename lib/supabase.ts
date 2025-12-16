import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      memories: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          location: string | null
          url: string
          thumbnail: string | null
          type: string
          created_at: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          date: string
          location?: string | null
          url: string
          thumbnail?: string | null
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          location?: string | null
          url?: string
          thumbnail?: string | null
          type?: string
          created_at?: string
        }
      }
    }
  }
}
