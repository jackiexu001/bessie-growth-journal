import Videos from '@/components/Videos'
import { getMemories } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function VideosPage() {
  const memories = await getMemories()
  const videoMemories = memories.filter(m => m.type === 'video')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4 gradient-text">
          成长视频
        </h1>
        <p className="text-gray-600 text-lg">
          记录每一个珍贵的视频瞬间
        </p>
      </div>
      <Videos memories={videoMemories} />
    </div>
  )
}

