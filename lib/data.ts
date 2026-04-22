import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { Memory } from './types'

const DATA_FILE = path.join(process.cwd(), 'data', 'memories.json')

async function readMemories(): Promise<Memory[]> {
  try {
    const content = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(content) as Memory[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

async function persistMemories(memories: Memory[]): Promise<void> {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(memories, null, 2), 'utf-8')
}

export async function getMemories(): Promise<Memory[]> {
  const memories = await readMemories()
  return memories.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  const memories = await readMemories()
  return memories.find((m) => m.id === id) ?? null
}

export async function addMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
  const memories = await readMemories()
  const newMemory: Memory = {
    ...memory,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  memories.push(newMemory)
  await persistMemories(memories)
  return newMemory
}

export async function deleteMemory(id: string): Promise<boolean> {
  const memories = await readMemories()
  const index = memories.findIndex((m) => m.id === id)
  if (index === -1) return false
  memories.splice(index, 1)
  await persistMemories(memories)
  return true
}
