import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Hero from '@/components/Hero'
import Timeline from '@/components/Timeline'
import { getMemories } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const memories = await getMemories()

  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <div className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-serif font-bold mb-4 gradient-text">
            成长时光轴
          </h2>
          <p className="text-gray-600 text-lg">
            左右滑动查看不同年份的美好回忆
          </p>
        </div>
        <Timeline memories={memories} />
      </div>
    </div>
  )
}

