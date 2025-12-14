import { NextRequest, NextResponse } from 'next/server'
import { deleteMemory, getMemoryById } from '@/lib/data'
import { createStorageProvider } from '@/lib/storage/factory'

export const runtime = 'nodejs'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '缺少回忆ID' },
        { status: 400 }
      )
    }

    // 获取回忆信息
    const memory = await getMemoryById(id)
    if (!memory) {
      return NextResponse.json(
        { error: '回忆不存在' },
        { status: 404 }
      )
    }

    // 获取存储提供商
    const storage = createStorageProvider()

    // 删除文件
    try {
      await storage.deleteFile(memory.url)
      console.log('文件已删除:', memory.url)
    } catch (fileError) {
      console.warn('删除文件失败（文件可能不存在）:', fileError)
      // 继续执行，即使文件删除失败也删除数据记录
    }

    // 如果存在缩略图且与主文件不同，也删除缩略图
    if (memory.thumbnail && memory.thumbnail !== memory.url) {
      try {
        await storage.deleteFile(memory.thumbnail)
        console.log('缩略图已删除:', memory.thumbnail)
      } catch (thumbnailError) {
        console.warn('删除缩略图失败:', thumbnailError)
      }
    }

    // 删除数据记录
    const deleted = await deleteMemory(id)
    if (!deleted) {
      return NextResponse.json(
        { error: '删除失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('Delete error:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return NextResponse.json(
      {
        error: '删除失败，请重试',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}

