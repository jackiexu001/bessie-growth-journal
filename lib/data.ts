import { promises as fs } from 'fs'
import path from 'path'
import type { Memory } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const MEMORIES_FILE = path.join(DATA_DIR, 'memories.json')

// 检查是否在 Netlify 环境（只读文件系统）
// Netlify 会自动设置这些环境变量
const isNetlify = !!(
  process.env.NETLIFY === 'true' || 
  process.env.NETLIFY_DEV === 'true' ||
  process.env.NETLIFY || // Netlify 会自动设置这个变量
  process.env.AWS_LAMBDA_FUNCTION_NAME || // Netlify Functions 使用 Lambda
  process.env.VERCEL || // 也检查 Vercel（类似环境）
  process.env.NEXT_RUNTIME === 'nodejs' // Next.js 在 Netlify 上的运行时
)

// 内存存储（用于 Netlify 等只读文件系统环境）
let memoryStore: Memory[] = []

// 确保数据目录存在（仅在非 Netlify 环境）
async function ensureDataDir() {
  if (isNetlify) {
    return // Netlify 环境跳过
  }
  
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// 从文件读取回忆（仅在非 Netlify 环境）
async function readMemoriesFromFile(): Promise<Memory[]> {
  if (isNetlify) {
    return [] // Netlify 环境返回空数组
  }
  
  try {
    const fileContents = await fs.readFile(MEMORIES_FILE, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    // 文件不存在，返回空数组
    return []
  }
}

// 写入文件（仅在非 Netlify 环境）
async function writeMemoriesToFile(memories: Memory[]): Promise<void> {
  if (isNetlify) {
    // Netlify 环境：将数据存储到环境变量（如果可用）或内存
    // 注意：环境变量有大小限制，这只适合小量数据
    if (process.env.MEMORIES_DATA) {
      try {
        // 尝试更新环境变量（但这在运行时不可行）
        // 所以只使用内存存储
        memoryStore = memories
        console.log('数据已保存到内存（Netlify 环境不支持文件写入）')
      } catch (error) {
        console.error('保存数据到内存失败:', error)
      }
    } else {
      memoryStore = memories
      console.log('数据已保存到内存（Netlify 环境不支持文件写入）')
    }
    return
  }
  
  await fs.writeFile(MEMORIES_FILE, JSON.stringify(memories, null, 2), 'utf8')
}

// 读取所有回忆
export async function getMemories(): Promise<Memory[]> {
  if (isNetlify) {
    // Netlify 环境：从内存读取
    console.log(`从内存读取数据（Netlify 环境，共 ${memoryStore.length} 条记录）`)
    return memoryStore
  }
  
  // 本地环境：从文件读取
  await ensureDataDir()
  const memories = await readMemoriesFromFile()
  console.log(`从文件读取数据（本地环境，共 ${memories.length} 条记录）`)
  return memories
}

// 根据ID获取回忆
export async function getMemoryById(id: string): Promise<Memory | null> {
  const memories = await getMemories()
  return memories.find(m => m.id === id) || null
}

// 添加新回忆
export async function addMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
  const memories = await getMemories()
  const newMemory: Memory = {
    ...memory,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  }
  
  memories.push(newMemory)
  await writeMemoriesToFile(memories)
  
  return newMemory
}

// 删除回忆
export async function deleteMemory(id: string): Promise<boolean> {
  const memories = await getMemories()
  const filtered = memories.filter(m => m.id !== id)
  
  if (filtered.length === memories.length) {
    return false // 未找到
  }
  
  await writeMemoriesToFile(filtered)
  return true
}

