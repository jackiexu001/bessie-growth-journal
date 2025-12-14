/**
 * 本地文件存储（当前默认方式）
 */

import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import type { StorageProvider } from './index'

export class LocalStorage implements StorageProvider {
  private uploadsDir: string

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  }

  async uploadFile(file: Buffer, filename: string, contentType: string): Promise<string> {
    // 确保上传目录存在
    await mkdir(this.uploadsDir, { recursive: true })

    // 保存文件
    const filepath = path.join(this.uploadsDir, filename)
    await writeFile(filepath, file)

    // 返回公开访问 URL
    return `/uploads/${filename}`
  }

  async uploadThumbnail(thumbnail: Buffer, filename: string): Promise<string> {
    // 确保上传目录存在
    await mkdir(this.uploadsDir, { recursive: true })

    // 保存缩略图
    const filepath = path.join(this.uploadsDir, filename)
    await writeFile(filepath, thumbnail)

    // 返回公开访问 URL
    return `/uploads/${filename}`
  }

  async deleteFile(url: string): Promise<void> {
    // 从 URL 中提取文件名
    const filename = path.basename(url)
    const filepath = path.join(this.uploadsDir, filename)

    try {
      await unlink(filepath)
    } catch (error) {
      // 文件不存在时忽略错误
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }
}

