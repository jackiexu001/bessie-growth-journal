import { promises as fs } from 'fs'
import path from 'path'
import type { Memory } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const MEMORIES_FILE = path.join(DATA_DIR, 'memories.json')

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// 读取所有回忆
export async function getMemories(): Promise<Memory[]> {
  await ensureDataDir()
  
  try {
    const fileContents = await fs.readFile(MEMORIES_FILE, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    // 文件不存在，返回空数组
    return []
  }
}

// 根据ID获取回忆
export async function getMemoryById(id: string): Promise<Memory | null> {
  const memories = await getMemories()
  return memories.find(m => m.id === id) || null
}

// 添加新回忆
export async function addMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
  await ensureDataDir()
  
  const memories = await getMemories()
  const newMemory: Memory = {
    ...memory,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  }
  
  memories.push(newMemory)
  await fs.writeFile(MEMORIES_FILE, JSON.stringify(memories, null, 2), 'utf8')
  
  return newMemory
}

// 删除回忆
export async function deleteMemory(id: string): Promise<boolean> {
  await ensureDataDir()
  
  const memories = await getMemories()
  const filtered = memories.filter(m => m.id !== id)
  
  if (filtered.length === memories.length) {
    return false // 未找到
  }
  
  await fs.writeFile(MEMORIES_FILE, JSON.stringify(filtered, null, 2), 'utf8')
  return true
}

