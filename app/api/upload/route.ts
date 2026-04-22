import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { addMemory } from '@/lib/data'
import { createStorageProvider } from '@/lib/storage/factory'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large video uploads

const MAX_IMAGE_SIZE = 50 * 1024 * 1024   // 50MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024  // 500MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm', 'video/x-flv', 'video/x-ms-wmv', 'video/mp4']

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const fileInput = formData.get('file')

    const isValidFile =
      fileInput &&
      typeof (fileInput as any).arrayBuffer === 'function' &&
      (typeof (fileInput as any).size === 'number' || typeof (fileInput as any).size === 'undefined')

    if (!isValidFile) {
      return NextResponse.json({ error: '没有上传文件或文件对象无效' }, { status: 400 })
    }

    const file = fileInput as { name?: string; type?: string; size?: number; arrayBuffer: () => Promise<ArrayBuffer> }
    const fileName = file.name || ''
    const fileType = file.type || ''
    const ext = path.extname(fileName).toLowerCase()

    let isImage = ALLOWED_IMAGE_TYPES.includes(fileType)
    let isVideo = ALLOWED_VIDEO_TYPES.includes(fileType)

    // Fallback to extension check when browser doesn't send MIME type
    if (!isImage && !isVideo) {
      if (IMAGE_EXTENSIONS.includes(ext)) isImage = true
      else if (VIDEO_EXTENSIONS.includes(ext)) isVideo = true
    }

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: `不支持的文件类型。仅支持图片（JPG/PNG/GIF/WebP）和视频（MP4/MOV/AVI/MKV）` },
        { status: 400 }
      )
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    const maxSizeMB = maxSize / 1024 / 1024
    if ((file.size ?? 0) > maxSize) {
      const fileSizeMB = ((file.size ?? 0) / 1024 / 1024).toFixed(2)
      return NextResponse.json(
        { error: `文件过大（${fileSizeMB}MB），最大允许 ${maxSizeMB}MB` },
        { status: 400 }
      )
    }

    // Parse metadata BEFORE using dateValue
    const title = (formData.get('title') as string) || fileName || '未命名文件'
    const description = (formData.get('description') as string) || ''
    const location = (formData.get('location') as string) || ''
    let dateValue = (formData.get('date') as string) || ''

    if (!dateValue) {
      const today = new Date()
      dateValue = today.toISOString().split('T')[0]
    } else {
      if (dateValue.includes('T')) dateValue = dateValue.split('T')[0]
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        const parsed = new Date(dateValue)
        dateValue = isNaN(parsed.getTime())
          ? new Date().toISOString().split('T')[0]
          : parsed.toISOString().split('T')[0]
      }
    }

    const storage = createStorageProvider()

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const fileExt = ext || (isImage ? '.jpg' : '.mp4')
    const filename = `${timestamp}-${randomStr}${fileExt}`

    const bytes = await (file as any).arrayBuffer()
    const buffer = Buffer.from(bytes)

    const contentType = fileType || 'application/octet-stream'
    const url = await storage.uploadFile(buffer, filename, contentType)

    // Handle thumbnail
    let thumbnail: string | undefined
    if (isImage) {
      thumbnail = url
    } else {
      const thumbnailInput = formData.get('thumbnail')
      const isValidThumbnail =
        thumbnailInput &&
        typeof thumbnailInput === 'object' &&
        typeof (thumbnailInput as any).arrayBuffer === 'function' &&
        typeof (thumbnailInput as any).name === 'string'

      if (isValidThumbnail) {
        const thumbnailFile = thumbnailInput as { name?: string; arrayBuffer: () => Promise<ArrayBuffer> }
        const thumbExt = path.extname(thumbnailFile.name || 'thumb.jpg')
        const thumbFilename = `${timestamp}-${randomStr}-thumb${thumbExt}`
        const thumbBytes = await thumbnailFile.arrayBuffer()
        thumbnail = await storage.uploadThumbnail(Buffer.from(thumbBytes), thumbFilename)
      }
    }

    // Save metadata to JSON file
    const memory = await addMemory({
      title,
      description: description || undefined,
      date: dateValue,
      location: location || undefined,
      url,
      thumbnail,
      type: isImage ? 'image' : 'video',
    })

    return NextResponse.json({ success: true, url, thumbnail, filename, id: memory.id })
  } catch (error) {
    console.error('Upload error:', error)
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        error: '上传失败，请重试',
        ...(isDev && { details: error instanceof Error ? error.message : '未知错误' }),
      },
      { status: 500 }
    )
  }
}
