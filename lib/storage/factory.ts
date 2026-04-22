import type { StorageProvider } from './index'
import { LocalStorage } from './local'
import { COSStorage } from './cos'

export type StorageType = 'local' | 'cos'

export function createStorageProvider(): StorageProvider {
  const storageType = process.env.STORAGE_TYPE as StorageType | undefined

  if (!storageType) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('STORAGE_TYPE 环境变量未设置。生产环境必须设置为 cos')
    }
    console.warn('STORAGE_TYPE 未设置，开发环境使用本地存储')
    return new LocalStorage()
  }

  switch (storageType) {
    case 'cos':
      return new COSStorage()
    case 'local':
      if (process.env.NODE_ENV === 'production') {
        throw new Error('生产环境不允许使用本地存储，请设置 STORAGE_TYPE=cos')
      }
      return new LocalStorage()
    default:
      throw new Error(`不支持的存储类型: ${storageType}。请设置 STORAGE_TYPE=cos`)
  }
}
