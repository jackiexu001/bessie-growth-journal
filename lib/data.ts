import { supabase } from './supabase'
import type { Memory } from './types'

// 读取所有回忆
export async function getMemories(): Promise<Memory[]> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取回忆失败:', error)
      return []
    }

    console.log(`从 Supabase 读取数据（共 ${data?.length || 0} 条记录）`)
    return data || []
  } catch (error) {
    console.error('数据库连接失败:', error)
    return []
  }
}

// 根据ID获取回忆
export async function getMemoryById(id: string): Promise<Memory | null> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('获取回忆失败:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('数据库连接失败:', error)
    return null
  }
}

// 添加新回忆
export async function addMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .insert([memory])
      .select()
      .single()

    if (error) {
      console.error('添加回忆失败:', error)
      throw error
    }

    console.log(`数据已保存到 Supabase（ID: ${data.id}）`)
    return data
  } catch (error) {
    console.error('数据库连接失败:', error)
    throw error
  }
}

// 删除回忆
export async function deleteMemory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除回忆失败:', error)
      return false
    }

    console.log(`数据已从 Supabase 删除（ID: ${id}）`)
    return true
  } catch (error) {
    console.error('数据库连接失败:', error)
    return false
  }
}