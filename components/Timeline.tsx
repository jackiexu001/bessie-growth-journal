'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { format, parseISO, getYear } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Trash2, X, Play, Image as ImageIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Memory } from '@/lib/types'

// 动态导入 VideoThumbnail，避免 SSR 问题
const VideoThumbnail = dynamic(() => import('./VideoThumbnail'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

// 动态导入 VideoPlayer
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false
})

interface TimelineProps {
  memories: Memory[]
}

interface GroupedMemories {
  year: string
  memories: Memory[]
}

export default function Timeline({ memories }: TimelineProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const yearScrollRef = useRef<HTMLDivElement>(null)
  const memoryScrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [canScrollYearLeft, setCanScrollYearLeft] = useState(false)
  const [canScrollYearRight, setCanScrollYearRight] = useState(true)
  const [canScrollMemoryLeft, setCanScrollMemoryLeft] = useState<{ [key: string]: boolean }>({})
  const [canScrollMemoryRight, setCanScrollMemoryRight] = useState<{ [key: string]: boolean }>({})

  // 按年份分组
  const groupedMemories = memories.reduce((acc, memory) => {
    const date = parseISO(memory.date)
    const year = getYear(date).toString()

    if (!acc[year]) {
      acc[year] = {
        year,
        memories: []
      }
    }

    acc[year].memories.push(memory)
    return acc
  }, {} as { [key: string]: GroupedMemories })

  // 按年份排序（从新到旧），并按日期排序每个年份的回忆
  const sortedYears = Object.keys(groupedMemories).sort((a, b) => parseInt(b) - parseInt(a))
  
  // 对每个年份的回忆按日期排序（从新到旧）
  sortedYears.forEach(year => {
    groupedMemories[year].memories.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })

  // 检查年份滚动位置
  const checkYearScroll = () => {
    if (yearScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = yearScrollRef.current
      setCanScrollYearLeft(scrollLeft > 0)
      setCanScrollYearRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // 检查回忆滚动位置
  const checkMemoryScroll = (year: string) => {
    const scrollRef = memoryScrollRefs.current[year]
    if (scrollRef) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef
      setCanScrollMemoryLeft(prev => ({ ...prev, [year]: scrollLeft > 0 }))
      setCanScrollMemoryRight(prev => ({ ...prev, [year]: scrollLeft < scrollWidth - clientWidth - 10 }))
    }
  }

  useEffect(() => {
    const container = yearScrollRef.current
    if (container) {
      container.addEventListener('scroll', checkYearScroll)
      checkYearScroll()
      return () => container.removeEventListener('scroll', checkYearScroll)
    }
  }, [])

  // 为每个展开的年份设置滚动监听
  useEffect(() => {
    expandedYears.forEach(year => {
      const scrollRef = memoryScrollRefs.current[year]
      if (scrollRef) {
        const checkScroll = () => checkMemoryScroll(year)
        scrollRef.addEventListener('scroll', checkScroll)
        checkScroll()
        return () => scrollRef.removeEventListener('scroll', checkScroll)
      }
    })
  }, [expandedYears])

  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev)
      if (newSet.has(year)) {
        // 如果点击的是已展开的年份，则折叠它
        newSet.delete(year)
      } else {
        // 如果点击的是未展开的年份，先清空所有，再添加当前年份（实现一次只能展开一个）
        newSet.clear()
        newSet.add(year)
        // 延迟检查滚动，等待 DOM 更新
        setTimeout(() => {
          checkMemoryScroll(year)
        }, 100)
      }
      return newSet
    })
  }

  const scrollYear = (direction: 'left' | 'right') => {
    if (yearScrollRef.current) {
      const scrollAmount = 300
      yearScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollMemory = (year: string, direction: 'left' | 'right') => {
    const scrollRef = memoryScrollRefs.current[year]
    if (scrollRef) {
      const scrollAmount = 400
      scrollRef.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const openModal = (memory: Memory) => {
    setSelectedMemory(memory)
  }

  const closeModal = () => {
    setSelectedMemory(null)
  }

  const handleDelete = async (e: React.MouseEvent, memory: Memory) => {
    e.preventDefault()
    e.stopPropagation()
    
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

      if (selectedMemory?.id === memory.id) {
        closeModal()
      }

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
        <p className="text-gray-500 text-lg mb-4">还没有记录任何回忆</p>
        <Link 
          href="/upload"
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          上传第一张照片
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* 年份横向滚动区域 */}
      <div className="relative mb-8">
        {/* 年份滚动按钮 */}
        {canScrollYearLeft && (
          <button
            onClick={() => scrollYear('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110"
            aria-label="向左滚动年份"
          >
            <ChevronLeft className="w-5 h-5 text-primary-600" />
          </button>
        )}
        
        {canScrollYearRight && (
          <button
            onClick={() => scrollYear('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110"
            aria-label="向右滚动年份"
          >
            <ChevronRight className="w-5 h-5 text-primary-600" />
          </button>
        )}

        {/* 年份横向滚动容器 */}
        <div
          ref={yearScrollRef}
          className="overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex space-x-4 px-2 min-w-max">
            {sortedYears.map((year, yearIndex) => {
              const yearData = groupedMemories[year]
              const isExpanded = expandedYears.has(year)

              return (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: yearIndex * 0.1 }}
                  className="flex-shrink-0"
                >
                  {/* 年份卡片 */}
                  <motion.div
                    className="glass-effect rounded-2xl p-6 cursor-pointer card-hover w-64"
                    onClick={() => toggleYear(year)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-serif font-bold gradient-text mb-2">
                          {year} 年
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {yearData.memories.length} 个回忆
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-6 h-6 text-primary-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 展开的年份回忆区域 */}
      <AnimatePresence>
        {sortedYears.map((year) => {
          const yearData = groupedMemories[year]
          const isExpanded = expandedYears.has(year)

          if (!isExpanded) return null

          return (
            <motion.div
              key={`memories-${year}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {/* 年份标题 */}
              <div className="mb-4 px-2">
                <h4 className="text-2xl font-serif font-bold text-gray-800">
                  {year} 年的回忆
                </h4>
              </div>

              {/* 回忆横向滚动区域 */}
              <div className="relative">
                {/* 回忆滚动按钮 */}
                {canScrollMemoryLeft[year] && (
                  <button
                    onClick={() => scrollMemory(year, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                    aria-label="向左滚动回忆"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary-600" />
                  </button>
                )}
                
                {canScrollMemoryRight[year] && (
                  <button
                    onClick={() => scrollMemory(year, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                    aria-label="向右滚动回忆"
                  >
                    <ChevronRight className="w-5 h-5 text-primary-600" />
                  </button>
                )}

                {/* 回忆横向滚动容器 */}
                <div
                  ref={(el) => {
                    memoryScrollRefs.current[year] = el
                    if (el) {
                      setTimeout(() => checkMemoryScroll(year), 100)
                    }
                  }}
                  className="overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <div className="flex space-x-4 px-2 min-w-max">
                    {yearData.memories.map((memory, memoryIndex) => {
                      const date = parseISO(memory.date)
                      
                      return (
                        <motion.div
                          key={memory.id}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: memoryIndex * 0.05 }}
                          className="flex-shrink-0 w-64"
                        >
                          <motion.div
                            className="glass-effect rounded-xl overflow-hidden cursor-pointer card-hover"
                            onClick={() => openModal(memory)}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* 缩略图 */}
                            <div className="relative aspect-square bg-gray-200">
                              {memory.thumbnail ? (
                                <Image
                                  src={memory.thumbnail}
                                  alt={memory.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  sizes="256px"
                                />
                              ) : memory.type === 'video' ? (
                                <VideoThumbnail
                                  videoUrl={memory.url}
                                  alt={memory.title}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                                  <ImageIcon className="w-12 h-12 text-white" />
                                </div>
                              )}
                              
                              {/* 视频播放图标 */}
                              {memory.type === 'video' && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                    <Play className="w-6 h-6 text-primary-600 ml-1" />
                                  </div>
                                </div>
                              )}

                              {/* 删除按钮 */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(e, memory)
                                }}
                                disabled={deletingId === memory.id}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-10"
                                title="删除"
                              >
                                {deletingId === memory.id ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            {/* 标题和日期 */}
                            <div className="p-4">
                              <h4 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2">
                                {memory.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                                <Calendar className="w-3 h-3" />
                                <span>{format(date, 'yyyy年MM月dd日', { locale: zhCN })}</span>
                              </div>
                              {memory.location && (
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  <span className="line-clamp-1">{memory.location}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

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
                  <VideoPlayer
                    src={selectedMemory.url}
                    title={selectedMemory.title}
                  />
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
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedMemory.date}</span>
                  </div>
                  {selectedMemory.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedMemory.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
