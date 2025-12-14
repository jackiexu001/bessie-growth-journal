'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  successCount?: number
  errorCount?: number
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  successCount,
  errorCount,
}: SuccessModalProps) {
  console.log('SuccessModal render:', { isOpen, title, message, successCount, errorCount })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-800">{title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">{message}</p>
            {successCount !== undefined && errorCount !== undefined && (
              <div className="mt-4 space-y-2">
                {successCount > 0 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-semibold">成功: {successCount} 个文件</span>
                  </div>
                )}
                {errorCount > 0 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <X className="w-5 h-5" />
                    <span className="text-sm font-semibold">失败: {errorCount} 个文件</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            确定
          </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

