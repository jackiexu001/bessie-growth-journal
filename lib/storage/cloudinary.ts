/**
 * Cloudinary 存储实现
 */

import { v2 as cloudinary } from 'cloudinary'
import type { StorageProvider } from './index'

export class CloudinaryStorage implements StorageProvider {
  constructor() {
    // 配置 Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(`Cloudinary 配置不完整: cloudName=${!!cloudName}, apiKey=${!!apiKey}, apiSecret=${!!apiSecret}`)
    }
    
    console.log('配置 Cloudinary:', {
      cloudName: cloudName.substring(0, 3) + '...', // 只显示前3个字符，保护隐私
      apiKey: apiKey.substring(0, 3) + '...',
      apiSecret: apiSecret ? '已设置' : '未设置',
    })
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
  }

  async uploadFile(file: Buffer, filename: string, contentType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('开始上传文件到 Cloudinary:', { filename, contentType, size: file.length })
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'bessie-growth',
          resource_type: 'auto', // 自动识别图片或视频
          public_id: filename.replace(/\.[^/.]+$/, ''), // 移除扩展名
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary 上传错误:', error)
            reject(new Error(`Cloudinary 上传失败: ${error.message || JSON.stringify(error)}`))
          } else {
            console.log('Cloudinary 上传成功:', result?.secure_url)
            resolve(result!.secure_url)
          }
        }
      )

      uploadStream.on('error', (err) => {
        console.error('Cloudinary 上传流错误:', err)
        reject(new Error(`Cloudinary 上传流错误: ${err.message || JSON.stringify(err)}`))
      })

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

