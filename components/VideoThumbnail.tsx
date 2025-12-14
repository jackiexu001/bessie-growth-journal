'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface VideoThumbnailProps {
  videoUrl: string
  alt: string
  className?: string
}

export default function VideoThumbnail({ videoUrl, alt, className = '' }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // 确保在客户端运行
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      setLoading(false)
      return
    }

    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    let objectUrl: string | null = null

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
      if (videoRef.current) {
        videoRef.current = null
      }
    }

    const generateThumbnail = async () => {
      try {
        video.preload = 'metadata'
        video.muted = true
        video.playsInline = true
        video.crossOrigin = 'anonymous'

        const timeout = setTimeout(() => {
          cleanup()
          setLoading(false)
        }, 10000)

        video.onloadedmetadata = () => {
          clearTimeout(timeout)
          try {
            // 检查视频尺寸
            if (video.videoWidth === 0 || video.videoHeight === 0) {
              console.warn('视频尺寸为0，可能是编码格式不支持，使用默认尺寸生成缩略图')
              // 即使尺寸为0，也尝试生成一个占位图
              canvas.width = 640
              canvas.height = 360
              
              // 尝试跳转到视频的1秒位置
              const seekTime = Math.min(1, (video.duration || 10) * 0.1)
              video.currentTime = seekTime
              
              // 如果无法获取视频帧，稍后显示占位符
              setTimeout(() => {
                if (video.videoWidth === 0 || video.videoHeight === 0) {
                  setLoading(false)
                }
              }, 2000)
              return
            }

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

            // 跳转到视频的1秒位置或10%位置
            const seekTime = Math.min(1, (video.duration || 10) * 0.1)
            video.currentTime = seekTime
          } catch (error) {
            console.error('设置视频元数据失败:', error)
            setLoading(false)
          }
        }

        video.onseeked = () => {
          try {
            if (!ctx) {
              throw new Error('无法获取 canvas 上下文')
            }
            
            // 如果视频尺寸为0，绘制一个信息占位图
            if (video.videoWidth === 0 || video.videoHeight === 0) {
              // 绘制一个带视频信息的占位图
              ctx.fillStyle = '#f3f4f6'
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              
              ctx.fillStyle = '#9ca3af'
              ctx.font = 'bold 24px Arial'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillText('视频', canvas.width / 2, canvas.height / 2 - 20)
              
              ctx.fillStyle = '#6b7280'
              ctx.font = '16px Arial'
              ctx.fillText('编码格式不支持', canvas.width / 2, canvas.height / 2 + 20)
              
              const thumbnailData = canvas.toDataURL('image/jpeg', 0.85)
              setThumbnail(thumbnailData)
              setLoading(false)
              cleanup()
              return
            }
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const thumbnailData = canvas.toDataURL('image/jpeg', 0.85)
            setThumbnail(thumbnailData)
            setLoading(false)
            cleanup()
          } catch (error) {
            console.error('生成缩略图失败:', error)
            setLoading(false)
            cleanup()
          }
        }

        video.onerror = () => {
          console.error('视频加载失败，无法生成缩略图')
          setLoading(false)
          cleanup()
        }

        // 使用完整的URL（仅在客户端）
        let fullUrl = videoUrl
        if (typeof window !== 'undefined') {
          fullUrl = videoUrl.startsWith('http') ? videoUrl : `${window.location.origin}${videoUrl}`
        }
        video.src = fullUrl
        videoRef.current = video
      } catch (error) {
        console.error('生成缩略图时出错:', error)
        setLoading(false)
        cleanup()
      }
    }

    generateThumbnail()

    return () => {
      cleanup()
    }
  }, [videoUrl])

  if (loading) {
    return (
      <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (thumbnail) {
    return (
      <Image
        src={thumbnail}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    )
  }

  // 如果无法生成缩略图，显示占位符
  return (
    <div className={`w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center ${className}`}>
      <Play className="w-16 h-16 text-white" />
    </div>
  )
}

