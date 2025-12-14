/**
 * Cloudflare R2 存储实现
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { StorageProvider } from './index'

export class R2Storage implements StorageProvider {
  private client: S3Client
  private bucketName: string
  private publicUrl: string

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME!
    // R2 的公开访问 URL 需要通过自定义域名或 R2 的公开端点
    // 如果设置了 R2_PUBLIC_URL，使用它；否则使用默认格式（需要配置公开访问）
    this.publicUrl = process.env.R2_PUBLIC_URL || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${this.bucketName}`

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }

  async uploadFile(file: Buffer, filename: string, contentType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file,
        ContentType: contentType,
      })
    )

    return `${this.publicUrl}/${filename}`
  }

  async uploadThumbnail(thumbnail: Buffer, filename: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: thumbnail,
        ContentType: 'image/jpeg',
      })
    )

    return `${this.publicUrl}/${filename}`
  }

  async deleteFile(url: string): Promise<void> {
    // 从 URL 中提取文件名
    const filename = url.split('/').pop() || ''
    
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      })
    )
  }
}

