'use client'

import UploadForm from '@/components/UploadForm'

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4 gradient-text">
          上传新回忆
        </h1>
        <p className="text-gray-600 text-lg">
          记录下这个美好的时刻
        </p>
      </div>
      <UploadForm />
    </div>
  )
}

