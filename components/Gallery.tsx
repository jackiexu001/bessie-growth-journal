'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Trash2, Upload } from 'lucide-react'
import type { Memory } from '@/lib/types'

interface GalleryProps {
  memories: Memory[]
}

export default function Gallery({ memories }: GalleryProps) {
  const router = useRouter()
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openModal = (memory: Memory) => {
    setSelectedMemory(memory)
  }

  const closeModal = () => {
    setSelectedMemory(null)
  }

  const handleDelete = async (e: React.MouseEvent, memory: Memory) => {
    e.stopPropagation() // 阻止触发图片点击事件
    
    if (!confirm(`确定要删除"${memory.title}"吗？此操作无法撤销。`)) {
      return
    }

    setDeletingId(memory.id)

    try {
      const response = await fetch(`/api/delete?id=${memory.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '删除失败')
      }

      // 如果删除的是当前选中的记忆，关闭模态框
      if (selectedMemory?.id === memory.id) {
        closeModal()
      }

      // 刷新页面数据
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert(error instanceof Error ? error.message : '删除失败，请重试')
    } finally {
      setDeletingId(null)
    }
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">相册还是空的</p>
        <a
          href="/upload"
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          上传第一张照片
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer card-hover group"
            onClick={() => openModal(memory)}
          >
            <Image
              src={memory.url}
              alt={memory.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* 删除按钮 */}
            <button
              onClick={(e) => handleDelete(e, memory)}
              disabled={deletingId === memory.id}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-10"
              title="删除"
            >
              {deletingId === memory.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-sm font-semibold truncate">
                {memory.title}
              </p>
            </div>
          </motion.div>
        ))}
        
        {/* 继续上传按钮 - 作为网格的最后一个项目 */}
        {memories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: memories.length * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square rounded-lg overflow-hidden"
          >
            <Link
              href="/upload"
              className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-400 hover:from-primary-200 hover:to-primary-300 transition-all cursor-pointer group"
            >
              <Upload className="w-12 h-12 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-primary-700 font-semibold text-sm">继续上传照片</span>
            </Link>
          </motion.div>
        )}
      </div>

      {/* 详情模态框 */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedMemory.type === 'image' ? (
                <div className="relative w-full h-[70vh] bg-gray-100">
                  <Image
                    src={selectedMemory.url}
                    alt={selectedMemory.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    unoptimized
                    onError={(e) => {
                      console.error('图片加载错误:', selectedMemory.url)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              ) : (
                <div className="relative w-full bg-black" style={{ height: '56.25vw', maxHeight: '80vh', minHeight: '400px' }}>
                  <video
                    src={selectedMemory.url}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget
                      const info = {
                        videoWidth: video.videoWidth,
                        videoHeight: video.videoHeight,
                        duration: video.duration,
                        readyState: video.readyState,
                        videoTracks: (video as any).videoTracks?.length || 0,
                        audioTracks: (video as any).audioTracks?.length || 0
                      }
                      console.log('视频元数据加载成功:', info)
                      
                      if (video.videoWidth === 0 || video.videoHeight === 0) {
                        console.error('⚠️ 警告：视频尺寸为0，可能是编码格式不支持')
                        alert('视频无法显示画面：\n\n可能原因：\n1. 视频编码格式不支持（如 HEVC/H.265）\n2. 视频文件只有音频没有画面\n3. 视频文件损坏\n\n建议：\n使用 HandBrake 或 FFmpeg 将视频转换为 H.264 编码的 MP4 格式')
                      }
                    }}
                    onCanPlay={(e) => {
                      const video = e.currentTarget
                      console.log('视频可以播放:', {
                        videoWidth: video.videoWidth,
                        videoHeight: video.videoHeight,
                        readyState: video.readyState
                      })
                      if (video.videoWidth === 0 || video.videoHeight === 0) {
                        console.error('⚠️ 视频尺寸仍为0，无法显示画面')
                      }
                    }}
                    onError={(e) => {
                      console.error('视频播放错误:', e)
                      const video = e.currentTarget
                      if (video.error) {
                        console.error('视频错误详情:', {
                          code: video.error.code,
                          message: video.error.message,
                          src: video.src,
                          networkState: video.networkState,
                          readyState: video.readyState
                        })
                        let errorMsg = '视频播放错误'
                        switch (video.error.code) {
                          case 1:
                            errorMsg = '视频加载被中止'
                            break
                          case 2:
                            errorMsg = '网络错误，无法加载视频'
                            break
                          case 3:
                            errorMsg = '视频解码错误，可能是编码格式不支持（如 HEVC/H.265）'
                            break
                          case 4:
                            errorMsg = '视频格式不支持'
                            break
                        }
                        alert(`视频播放失败: ${errorMsg}\n\n建议：\n1. 使用 H.264 编码的 MP4 格式\n2. 使用 HandBrake 或 FFmpeg 转换视频\n3. 检查视频文件是否完整`)
                      }
                    }}
                  >
                    您的浏览器不支持视频播放。
                    <a href={selectedMemory.url} download>点击下载视频</a>
                  </video>
                </div>
              )}

              <div className="p-6 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-serif font-bold">
                    {selectedMemory.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(e, selectedMemory)
                    }}
                    disabled={deletingId === selectedMemory.id}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {deletingId === selectedMemory.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>删除中...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>删除</span>
                      </>
                    )}
                  </button>
                </div>
                {selectedMemory.description && (
                  <p className="text-gray-600 mb-4">{selectedMemory.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  {selectedMemory.date}
                  {selectedMemory.location && ` · ${selectedMemory.location}`}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

