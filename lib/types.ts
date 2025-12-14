export interface Memory {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  url: string
  thumbnail?: string
  type: 'image' | 'video'
  createdAt: string
}

