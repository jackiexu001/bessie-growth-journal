import { createCloudinaryStorage } from './storage/factory'
import type { Memory } from './types'

// 获取 Cloudinary 存储实例
function getCloudinaryStorage() {
  // 临时创建 Cloudinary 存储实例（不通过工厂，避免环境变量检查）
  const { CloudinaryStorage } = require('./storage/cloudinary')
  return new CloudinaryStorage()
}

// 从 Cloudinary 获取资源并转换为回忆格式
function convertCloudinaryResourceToMemory(resource: any): Memory | null {
  try {
    const context = resource.context || {}
    const custom = context.custom || {}

    // 跳过没有元数据的资源（可能是直接上传的文件）
    if (!custom.title && !resource.public_id) {
      return null
    }

    return {
      id: resource.public_id || resource.asset_id,
      title: custom.title || resource.public_id || '未命名',
      description: custom.description || null,
      date: custom.date || resource.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      location: custom.location || null,
      url: resource.secure_url,
      thumbnail: resource.secure_url, // 对于图片，缩略图就是原图
      type: resource.resource_type === 'video' ? 'video' : 'image',
      createdAt: resource.created_at || new Date().toISOString(),
    }
  } catch (error) {
    console.error('转换 Cloudinary 资源失败:', error, resource)
    return null
  }
}

// 读取所有回忆
export async function getMemories(): Promise<Memory[]> {
  try {
    const cloudinary = getCloudinaryStorage()
    const resources = await cloudinary.getResources()

    const memories = resources
      .map(convertCloudinaryResourceToMemory)
      .filter((memory): memory is Memory => memory !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    console.log(`从 Cloudinary 获取到 ${memories.length} 条回忆记录`)
    return memories
  } catch (error) {
    console.error('从 Cloudinary 获取回忆失败:', error)
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
  try {
    const cloudinary = getCloudinaryStorage()

    // 生成文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const filename = `${timestamp}-${randomStr}`

    // 准备元数据
    const metadata = {
      title: memory.title,
      description: memory.description,
      date: memory.date,
      location: memory.location,
      type: memory.type,
    }

    // 上传文件（这里假设 memory.url 是文件缓冲区或可访问的URL）
    // 实际上，我们需要从上传的 FormData 中获取文件
    // 这个函数现在主要是为了兼容性，实际的上传在 upload API 中处理

    console.log('准备添加回忆到 Cloudinary:', metadata)
    return {
      ...memory,
      id: filename,
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('添加回忆失败:', error)
    throw error
  }
}

// 删除回忆
export async function deleteMemory(id: string): Promise<boolean> {
  try {
    const cloudinary = getCloudinaryStorage()
    await cloudinary.deleteFile(id)
    console.log(`已从 Cloudinary 删除回忆（ID: ${id}）`)
    return true
  } catch (error) {
    console.error('删除回忆失败:', error)
    return false
  }
}