/**
 * Cloudinary 存储实现
 */

import { v2 as cloudinary } from 'cloudinary'
import type { StorageProvider } from './index'

export class CloudinaryStorage implements StorageProvider {
  constructor() {
    // 配置 Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    })
  }

  async uploadFile(file: Buffer, filename: string, contentType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'bessie-growth',
          resource_type: 'auto', // 自动识别图片或视频
          public_id: filename.replace(/\.[^/.]+$/, ''), // 移除扩展名
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result!.secure_url)
          }
        }
      )

      uploadStream.end(file)
    })
  }

  async uploadThumbnail(thumbnail: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'bessie-growth/thumbnails',
          resource_type: 'image',
          public_id: filename.replace(/\.[^/.]+$/, ''),
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result!.secure_url)
          }
        }
      )

      uploadStream.end(thumbnail)
    })
  }

  async deleteFile(url: string): Promise<void> {
    // 从 URL 中提取 public_id
    const publicId = this.extractPublicId(url)
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'auto',
      })
    }
  }

  private extractPublicId(url: string): string | null {
    // Cloudinary URL 格式: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
    return match ? match[1] : null
  }
}

