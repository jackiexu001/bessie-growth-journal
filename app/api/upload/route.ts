import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { addMemory } from '@/lib/data'
import { createStorageProvider } from '@/lib/storage/factory'

// 在 Netlify 函数环境中没有浏览器的 File 类型，这里定义一个最小结构类型
type UploadedFile = {
  name?: string
  type?: string
  size?: number
  arrayBuffer: () => Promise<ArrayBuffer>
}

// 配置 API 路由以支持大文件上传
export const runtime = 'nodejs'
export const maxDuration = 60 // 60秒超时

// 在 Netlify 上，这些环境变量会自动设置
// 不需要手动设置

export async function POST(request: NextRequest) {
  try {
    console.log('开始处理上传请求...')
    console.log('环境信息:', {
      isNetlify: !!(process.env.NETLIFY || process.env.NETLIFY_DEV || process.env.AWS_LAMBDA_FUNCTION_NAME),
      storageType: process.env.STORAGE_TYPE,
      hasCloudinaryConfig: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
      nodeEnv: process.env.NODE_ENV,
    })
    const formData = await request.formData()
    const fileInput = formData.get('file')
    
    // 在无 File 全局的环境下，使用结构化检查
    const isValidFile =
      fileInput &&
      typeof (fileInput as any).arrayBuffer === 'function' &&
      (typeof (fileInput as any).size === 'number' || typeof (fileInput as any).size === 'undefined')
    
    if (!isValidFile) {
      console.error('文件对象无效:', fileInput)
      return NextResponse.json(
        { error: '没有上传文件或文件对象无效' },
        { status: 400 }
      )
    }
    
    const file = fileInput as UploadedFile
    
    console.log('文件信息:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: file.size ? (file.size / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'
    })

    // 验证文件类型 - 如果 type 为空，尝试从文件扩展名判断
    const fileName = file.name || ''
    const fileType = file.type || ''
    let isImage = fileType.startsWith('image/')
    let isVideo = fileType.startsWith('video/')
    
    // 如果 MIME 类型为空，从文件扩展名判断
    if (!fileType || fileType === '') {
      const ext = path.extname(fileName).toLowerCase()
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
      const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v']
      
      if (imageExts.includes(ext)) {
        isImage = true
        console.log('从扩展名判断为图片:', ext)
      } else if (videoExts.includes(ext)) {
        isVideo = true
        console.log('从扩展名判断为视频:', ext)
      }
    }
    
    if (!isImage && !isVideo) {
      const fileName = file.name || ''
      const fileExt = path.extname(fileName)
      console.error('不支持的文件类型:', {
        type: file.type || '未知',
        name: fileName,
        ext: fileExt
      })
      return NextResponse.json(
        { error: `不支持的文件类型。文件类型: ${file.type || '未知'}, 扩展名: ${fileExt}` },
        { status: 400 }
      )
    }

    // 验证文件大小（根据存储类型设置不同限制）
    let maxSize: number
    let maxSizeMB: number
    let errorMessage: string
    
    if (isImage) {
      // 图片：Cloudinary 免费计划限制 10MB
      maxSize = 10 * 1024 * 1024 // 10MB
      maxSizeMB = 10
      errorMessage = '图片文件大小超过 10MB 限制（Cloudinary 免费计划限制）'
    } else if (isVideo) {
      // 视频：Cloudinary 免费计划限制 100MB
      maxSize = 100 * 1024 * 1024 // 100MB
      maxSizeMB = 100
      errorMessage = '视频文件大小超过 100MB 限制（Cloudinary 免费计划限制）'
    } else {
      // 其他文件：10MB
      maxSize = 10 * 1024 * 1024 // 10MB
      maxSizeMB = 10
      errorMessage = '文件大小超过 10MB 限制'
    }
    
    if ((file.size ?? 0) > maxSize) {
      const fileSizeMB = ((file.size ?? 0) / 1024 / 1024).toFixed(2)
      return NextResponse.json(
        { 
          error: errorMessage,
          details: `文件大小：${fileSizeMB}MB，最大允许：${maxSizeMB}MB。如需上传更大文件，请考虑升级 Cloudinary 计划或使用其他云存储服务。`
        },
        { status: 400 }
      )
    }

    // 获取存储提供商
    const storage = createStorageProvider()

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    // 从文件名获取扩展名，如果没有则根据类型推断
    const originalName = file.name || 'file'
    const ext = path.extname(originalName) || (isImage ? '.jpg' : isVideo ? '.mp4' : '')
    const filename = `${timestamp}-${randomStr}${ext}`

    // 读取文件内容
    console.log('开始读取文件...')
    const bytes = await (file as any).arrayBuffer()
    console.log('文件读取完成，大小:', (bytes.byteLength / 1024 / 1024).toFixed(2), 'MB')
    const buffer = Buffer.from(bytes)

    // 上传文件到存储提供商
    console.log('开始上传文件到存储提供商...')
    const contentType = file.type || 'application/octet-stream'
    const url = await storage.uploadFile(buffer, filename, contentType)
    console.log('文件上传成功，URL:', url)

    // 处理缩略图
    let thumbnail: string | undefined = undefined
    if (isImage) {
      // 图片使用自身作为缩略图
      thumbnail = url
    } else if (isVideo) {
      // 检查是否有上传的缩略图
      const thumbnailFile = formData.get('thumbnail') as File | null
      if (thumbnailFile && thumbnailFile instanceof File) {
        // 上传缩略图
        const thumbnailExt = path.extname(thumbnailFile.name) || '.jpg'
        const thumbnailFilename = `${timestamp}-${randomStr}-thumb${thumbnailExt}`
        
        const thumbnailBytes = await thumbnailFile.arrayBuffer()
        const thumbnailBuffer = Buffer.from(thumbnailBytes)
        
        thumbnail = await storage.uploadThumbnail(thumbnailBuffer, thumbnailFilename)
        console.log('视频缩略图已上传:', thumbnail)
      } else {
        // 如果没有上传缩略图
        console.log('未提供视频缩略图')
        thumbnail = undefined
      }
    }

    // 保存到数据库
    console.log('保存到数据库...')
    
    // 确保日期格式为 YYYY-MM-DD
    let dateValue = (formData.get('date') as string) || ''
    if (!dateValue) {
      // 如果没有提供日期，使用今天的日期，格式为 YYYY-MM-DD
      const today = new Date()
      dateValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    } else {
      // 如果日期是 ISO 格式（包含时间），只取日期部分
      if (dateValue.includes('T')) {
        dateValue = dateValue.split('T')[0]
      }
      // 确保格式为 YYYY-MM-DD
      const dateMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/)
      if (!dateMatch) {
        // 如果格式不正确，尝试转换
        const date = new Date(dateValue)
        if (!isNaN(date.getTime())) {
          dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        } else {
          // 如果无法解析，使用今天的日期
          const today = new Date()
          dateValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        }
      }
    }
    
    const memory = await addMemory({
      title: (formData.get('title') as string) || file.name,
      description: (formData.get('description') as string) || undefined,
      date: dateValue,
      location: (formData.get('location') as string) || undefined,
      url,
      thumbnail,
      type: isImage ? 'image' : 'video',
    })
    console.log('上传完成，记忆ID:', memory.id)

    return NextResponse.json({
      success: true,
      memory,
    })
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // 在 Netlify 上，始终返回详细错误信息以便调试
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      storageType: process.env.STORAGE_TYPE,
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    })
    
    return NextResponse.json(
      { 
        error: '上传失败，请重试',
        details: errorMessage, // 始终返回详细错误信息
        storageType: process.env.STORAGE_TYPE,
        hasCloudinaryConfig: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
      },
      { status: 500 }
    )
  }
}

