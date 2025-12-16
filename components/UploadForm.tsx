'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Image as ImageIcon, Video, Loader2, X, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import SuccessModal from './SuccessModal'

interface FileWithPreview {
  file: File
  preview: string | null
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export default function UploadForm() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false) // 防止重复显示弹窗
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '', successCount: 0, errorCount: 0 })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  })
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    const newFiles: FileWithPreview[] = []

    for (const file of selectedFiles) {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9)
      let preview: string | null = null

      // 创建预览
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        preview = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      } else if (file.type.startsWith('video/')) {
        try {
          preview = await generateVideoThumbnail(file)
        } catch (error) {
          console.error('生成视频缩略图失败:', error)
          preview = null
        }
      }

      newFiles.push({
        file,
        preview,
        id,
        status: 'pending',
      })
    }

    setFiles([...files, ...newFiles])
    
    // 重置 input，允许选择相同文件
    e.target.value = ''
  }

  // 生成视频缩略图的函数
  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      let objectUrl: string | null = null

      const cleanup = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl)
        }
      }

      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('生成缩略图超时'))
      }, 10000)

      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true

      video.onloadedmetadata = () => {
        clearTimeout(timeout)
        try {
          const maxWidth = 640
          const maxHeight = 360
          let width = video.videoWidth
          let height = video.videoHeight

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = width * ratio
            height = height * ratio
          }

          canvas.width = width
          canvas.height = height
          
          const seekTime = Math.min(1, (video.duration || 10) * 0.1)
          video.currentTime = seekTime
        } catch (error) {
          cleanup()
          reject(error)
        }
      }

      video.onseeked = () => {
        clearTimeout(timeout)
        try {
          if (!ctx) {
            throw new Error('无法获取 canvas 上下文')
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL('image/jpeg', 0.85)
          cleanup()
          resolve(thumbnail)
        } catch (error) {
          cleanup()
          reject(error)
        }
      }

      video.onerror = () => {
        clearTimeout(timeout)
        cleanup()
        reject(new Error('视频加载失败'))
      }

      objectUrl = URL.createObjectURL(file)
      video.src = objectUrl
    })
  }

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (files.length === 0) {
      return
    }

    // 重置弹窗显示标志
    setHasShownModal(false)
    setShowSuccessModal(false)
    
    setUploading(true)
    let successCount = 0
    let errorCount = 0
    
    // 统计已完成的文件
    const alreadyCompleted = files.filter(f => f.status === 'success' || f.status === 'error')
    successCount = alreadyCompleted.filter(f => f.status === 'success').length
    errorCount = alreadyCompleted.filter(f => f.status === 'error').length

    // 逐个上传文件
    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i]
      
      // 跳过已成功或已失败的文件
      if (fileItem.status === 'success' || fileItem.status === 'error') {
        continue
      }

      // 更新状态为上传中
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'uploading' } : f
      ))

      try {
        const uploadFormData = new FormData()
        uploadFormData.append('file', fileItem.file)
        
        // 使用文件索引或文件名作为标题前缀（如果用户没有输入标题）
        const titlePrefix = formData.title 
          ? `${formData.title}${files.length > 1 ? ` (${i + 1})` : ''}`
          : fileItem.file.name.replace(/\.[^/.]+$/, '')
        
        uploadFormData.append('title', titlePrefix)
        uploadFormData.append('description', formData.description)
        uploadFormData.append('date', formData.date)
        uploadFormData.append('location', formData.location)
        
        // 如果有预览图（视频缩略图），也上传
        if (fileItem.preview && fileItem.file.type.startsWith('video/')) {
          const response = await fetch(fileItem.preview)
          const blob = await response.blob()
          uploadFormData.append('thumbnail', blob, 'thumbnail.jpg')
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        const responseData = await response.json().catch(() => ({}))

        if (!response.ok) {
          // 显示详细的错误信息
          const errorMessage = responseData.error || responseData.details || `上传失败 (状态码: ${response.status})`
          const fullError = responseData.details 
            ? `${errorMessage}\n详细信息: ${responseData.details}`
            : errorMessage
          
          console.error('上传失败详情:', {
            status: response.status,
            error: responseData.error,
            details: responseData.details,
            storageType: responseData.storageType,
            hasCloudinaryConfig: responseData.hasCloudinaryConfig,
            fullResponse: responseData,
          })
          
          throw new Error(fullError)
        }

        // 更新状态为成功
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'success' } : f
        ))
        successCount++
      } catch (error) {
        console.error('Upload error:', error)
        const errorMessage = error instanceof Error ? error.message : '上传失败，请重试'
        
        // 更新状态为错误
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error', error: errorMessage } : f
        ))
        errorCount++
      }
    }

    // 检查是否所有文件都已处理（使用计数而不是状态检查，因为状态更新是异步的）
    const totalProcessed = successCount + errorCount
    const allDone = totalProcessed === files.length
    
    console.log('上传完成检查:', { totalProcessed, filesLength: files.length, allDone, successCount, errorCount })
    
    if (allDone && !hasShownModal) {
      setUploading(false)
      setHasShownModal(true) // 标记已显示弹窗，防止重复显示
      
      // 显示结果弹窗
      let messageTitle = ''
      let messageText = ''
      
      if (successCount > 0 && errorCount === 0) {
        messageTitle = '上传成功！'
        messageText = `成功上传 ${successCount} 个文件，所有文件已保存到您的成长记录中。`
      } else if (successCount > 0 && errorCount > 0) {
        messageTitle = '上传完成'
        messageText = `部分文件上传成功，请检查失败的文件并重试。`
      } else {
        messageTitle = '上传失败'
        messageText = `所有文件上传失败，请检查网络连接或文件格式后重试。`
      }
      
      console.log('准备显示弹窗:', { messageTitle, messageText, successCount, errorCount })
      
      // 先设置消息，再显示弹窗
      setSuccessMessage({
        title: messageTitle,
        message: messageText,
        successCount,
        errorCount
      })
      
      // 使用 setTimeout 确保状态更新后再显示弹窗
      setTimeout(() => {
        console.log('显示弹窗')
        setShowSuccessModal(true)
      }, 100)
      
      // 刷新页面数据（延迟执行，避免影响弹窗显示）
      setTimeout(() => {
        router.refresh()
      }, 500)
      
      // 如果全部成功，延迟重置表单（给用户时间看到弹窗）
      if (successCount > 0 && errorCount === 0) {
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            location: '',
          })
          setFiles([])
          // 重置弹窗标志，为下次上传做准备
          setHasShownModal(false)
        }, 2000)
      }
    } else {
      setUploading(false)
      if (!allDone) {
        console.log('上传未完成，等待更多文件处理')
      } else {
        console.log('弹窗已显示，跳过重复显示')
      }
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-effect rounded-2xl p-8 shadow-xl"
    >
      {/* 文件上传区域 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            选择照片或视频
          </label>
          {files.length > 0 && (
            <button
              type="button"
              onClick={() => setFiles([])}
              disabled={uploading}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="清空所有文件"
            >
              <Trash2 className="w-4 h-4" />
              <span>清空</span>
            </button>
          )}
        </div>
        <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            multiple
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <p className="text-gray-600 mb-1">
                点击或拖拽文件到此处上传
              </p>
              <p className="text-sm text-gray-400">
                支持批量选择，格式：JPG, PNG, GIF, MP4 等
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            已选择文件 ({files.length})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto p-2">
            <AnimatePresence>
              {files.map((fileItem) => (
                <motion.div
                  key={fileItem.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    {fileItem.preview ? (
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {/* 状态覆盖层 */}
                    {fileItem.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                    {fileItem.status === 'success' && (
                      <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {fileItem.status === 'error' && (
                      <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                    )}

                    {/* 删除按钮 */}
                    {fileItem.status !== 'uploading' && (
                      <button
                        type="button"
                        onClick={() => removeFile(fileItem.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* 文件名 */}
                  <p className="mt-1 text-xs text-gray-600 truncate" title={fileItem.file.name}>
                    {fileItem.file.name}
                  </p>
                  
                  {/* 文件大小 */}
                  <p className="text-xs text-gray-400">
                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {/* 错误信息 */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <div className="mt-1">
                      <p className="text-xs text-red-500 font-semibold">上传失败</p>
                      <p className="text-xs text-red-400 mt-0.5 break-words" title={fileItem.error}>
                        {fileItem.error}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 表单字段 */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            标题 {files.length > 1 && <span className="text-gray-400 text-xs">(批量上传时会自动添加序号)</span>}
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="给这些回忆起个名字..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="记录下这一刻的感受..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              日期 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                // HTML5 date input 的值始终是 YYYY-MM-DD 格式
                const dateValue = e.target.value
                setFormData({ ...formData, date: dateValue })
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              地点
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="在哪里拍的？"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="w-full py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>上传中... ({files.filter(f => f.status === 'success').length}/{files.length})</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>上传 {files.length > 0 ? `${files.length} 个` : ''}回忆</span>
            </>
          )}
        </button>
      </div>

      {/* 成功提示弹窗 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          // 延迟重置标志，确保弹窗完全关闭后再重置
          setTimeout(() => {
            setHasShownModal(false)
          }, 300)
        }}
        title={successMessage.title}
        message={successMessage.message}
        successCount={successMessage.successCount}
        errorCount={successMessage.errorCount}
      />
    </motion.form>
  )
}
