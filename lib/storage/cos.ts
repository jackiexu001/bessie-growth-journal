/**
 * 腾讯云 COS 存储实现
 */

import COS from 'cos-nodejs-sdk-v5'
import type { StorageProvider } from './index'

export class COSStorage implements StorageProvider {
  private client: COS
  private bucketName: string
  private region: string
  private publicUrl: string

  constructor() {
    this.bucketName = process.env.COS_BUCKET_NAME!
    this.region = process.env.COS_REGION || 'ap-guangzhou'
    this.publicUrl = process.env.COS_PUBLIC_URL || `https://${this.bucketName}.cos.${this.region}.myqcloud.com`

    this.client = new COS({
      SecretId: process.env.COS_SECRET_ID!,
      SecretKey: process.env.COS_SECRET_KEY!,
    })
  }

  async uploadFile(file: Buffer, filename: string, contentType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.putObject(
        {
          Bucket: this.bucketName,
          Region: this.region,
          Key: filename,
          Body: file,
          ContentType: contentType,
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(`${this.publicUrl}/${filename}`)
          }
        }
      )
    })
  }

  async uploadThumbnail(thumbnail: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.putObject(
        {
          Bucket: this.bucketName,
          Region: this.region,
          Key: filename,
          Body: thumbnail,
          ContentType: 'image/jpeg',
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(`${this.publicUrl}/${filename}`)
          }
        }
      )
    })
  }

  async deleteFile(url: string): Promise<void> {
    // 从 URL 中提取文件名
    const filename = url.split('/').pop() || ''

    return new Promise((resolve, reject) => {
      this.client.deleteObject(
        {
          Bucket: this.bucketName,
          Region: this.region,
          Key: filename,
        },
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }
}

