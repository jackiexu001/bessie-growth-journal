'use client'

import { Baby, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        className="inline-block mb-6"
      >
        <Baby className="w-20 h-20 text-primary-400 mx-auto" />
      </motion.div>
      
      <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 gradient-text">
        Bessie 的成长日记
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
        记录每一个珍贵的瞬间，见证成长的每一步
      </p>
      
      <div className="flex items-center justify-center space-x-2 text-primary-400">
        <Sparkles className="w-5 h-5" />
        <span className="text-sm text-gray-500">每一天都是新的开始</span>
        <Sparkles className="w-5 h-5" />
      </div>
    </motion.div>
  )
}

