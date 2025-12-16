/**
 * 存储提供商工厂
 * 根据环境变量选择使用哪个存储提供商
 */

import type { StorageProvider } from './index'
import { LocalStorage } from './local'
import { CloudinaryStorage } from './cloudinary'
import { R2Storage } from './r2'
import { COSStorage } from './cos'

export type StorageType = 'local' | 'cloudinary' | 'r2' | 'cos'

export function createStorageProvider(): StorageProvider {
  const storageType = (process.env.STORAGE_TYPE || 'local') as StorageType

  console.log(`使用存储类型: ${storageType}`)

  switch (storageType) {
    case 'cloudinary':
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Cloudinary 配置不完整，回退到本地存储')
        console.error('配置检查:', {
          STORAGE_TYPE: process.env.STORAGE_TYPE,
          CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '已设置' : '未设置',
          CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '已设置' : '未设置',
          CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '已设置' : '未设置',
        })
        return new LocalStorage()
      }
      console.log('Cloudinary 配置完整，使用 Cloudinary 存储')
      return new CloudinaryStorage()

    case 'r2':
      if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
        console.warn('Cloudflare R2 配置不完整，回退到本地存储')
        return new LocalStorage()
      }
      return new R2Storage()

    case 'cos':
      if (!process.env.COS_SECRET_ID || !process.env.COS_SECRET_KEY || !process.env.COS_BUCKET_NAME) {
        console.warn('腾讯云 COS 配置不完整，回退到本地存储')
        return new LocalStorage()
      }
      return new COSStorage()

    case 'local':
    default:
      return new LocalStorage()
  }
}

