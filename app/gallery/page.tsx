import Gallery from '@/components/Gallery'
import { getMemories } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const memories = await getMemories()
  // 相册页面只显示照片
  const imageMemories = memories.filter(m => m.type === 'image')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4 gradient-text">
          成长相册
        </h1>
        <p className="text-gray-600 text-lg">
          每一个瞬间都值得珍藏
        </p>
      </div>
      <Gallery memories={imageMemories} />
    </div>
  )
}

