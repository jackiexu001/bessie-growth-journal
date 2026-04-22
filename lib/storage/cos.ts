import COS from 'cos-nodejs-sdk-v5'
import type { StorageProvider } from './index'

export class COSStorage implements StorageProvider {
  private client: COS
  private bucketName: string
  private region: string
  private publicUrl: string

  constructor() {
    const secretId = process.env.COS_SECRET_ID
    const secretKey = process.env.COS_SECRET_KEY
    const bucket = process.env.COS_BUCKET_NAME
    const region = process.env.COS_REGION

    if (!secretId || !secretKey) {
      throw new Error('COS_SECRET_ID 和 COS_SECRET_KEY 必须设置')
    }
    if (!bucket) {
      throw new Error('COS_BUCKET_NAME 必须设置（格式：BucketName-APPID，例如 bessie-1234567890）')
    }
    if (!region) {
      throw new Error('COS_REGION 必须设置（例如 ap-guangzhou、ap-beijing）')
    }

    this.bucketName = bucket
    this.region = region
    this.publicUrl = process.env.COS_PUBLIC_URL || `https://${bucket}.cos.${region}.myqcloud.com`

    this.client = new COS({ SecretId: secretId, SecretKey: secretKey })
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
        (err) => {
          if (err) reject(new Error(`COS 上传失败: ${err.message}`))
          else resolve(`${this.publicUrl}/${filename}`)
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
        (err) => {
          if (err) reject(new Error(`COS 缩略图上传失败: ${err.message}`))
          else resolve(`${this.publicUrl}/${filename}`)
        }
      )
    })
  }

  async deleteFile(url: string): Promise<void> {
    // Extract the key from the full COS URL, stripping the base URL prefix
    let key: string
    if (url.startsWith('http')) {
      const urlPath = new URL(url).pathname
      key = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath
    } else {
      key = url
    }

    // Prevent path traversal
    if (key.includes('..') || key.startsWith('/')) {
      throw new Error(`非法文件路径: ${key}`)
    }

    return new Promise((resolve, reject) => {
      this.client.deleteObject(
        {
          Bucket: this.bucketName,
          Region: this.region,
          Key: key,
        },
        (err) => {
          if (err) reject(new Error(`COS 删除失败: ${err.message}`))
          else resolve()
        }
      )
    })
  }
}
