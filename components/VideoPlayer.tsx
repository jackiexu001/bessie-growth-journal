'use client'

import { useState, useRef, useEffect } from 'react'
import { AlertCircle, Download } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  title: string
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleError = () => {
      if (video.error) {
        let errorMsg = '视频播放错误'
        switch (video.error.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorMsg = '视频加载被中止'
            break
          case 2: // MEDIA_ERR_NETWORK
            errorMsg = '网络错误，无法加载视频'
            break
          case 3: // MEDIA_ERR_DECODE
            errorMsg = '视频解码错误，可能是编码格式不支持'
            break
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorMsg = '视频格式不支持'
            break
        }
        setError(errorMsg)
        console.error('视频错误:', {
          code: video.error.code,
          message: video.error.message,
          src: video.src
        })
      }
    }

    const handleCanPlay = () => {
      setCanPlay(true)
      setError(null)
    }

    const handleLoadedMetadata = () => {
      console.log('视频元数据加载:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        duration: video.duration,
        readyState: video.readyState
      })
    }

    video.addEventListener('error', handleError)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('error', handleError)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [src])

  return (
    <div className="relative w-full aspect-video bg-black">
      <video
        ref={videoRef}
        src={src}
        controls
        className="w-full h-full"
        autoPlay
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        style={{ objectFit: 'contain' }}
      >
        您的浏览器不支持视频播放。
        <a href={src} download>点击下载视频</a>
      </video>
      
      {error && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-white">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <p className="text-lg font-semibold mb-2">{error}</p>
          <p className="text-sm text-gray-300 mb-4 text-center">
            这通常是因为视频编码格式不兼容。建议：
            <br />
            1. 使用 H.264 编码的 MP4 格式
            <br />
            2. 使用视频转换工具重新编码
          </p>
          <a
            href={src}
            download={title}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>下载视频</span>
          </a>
        </div>
      )}
    </div>
  )
}

