'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Images, Upload, Heart, Video } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '首页', icon: Home },
    { href: '/gallery', label: '相册', icon: Images },
    { href: '/videos', label: '视频', icon: Video },
    { href: '/upload', label: '上传', icon: Upload },
  ]

  return (
    <nav className="sticky top-0 z-50 glass-effect shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <Heart className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-serif font-bold gradient-text">
              Bessie 的成长日记
            </span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

