'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingIndicatorProps {
  message?: string
  progress?: number
  tip?: string
  size?: 'small' | 'medium' | 'large'
}

export default function LoadingIndicator({ 
  message = 'Cargando...', 
  progress,
  tip,
  size = 'medium' 
}: LoadingIndicatorProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* Spinner */}
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-slate`} />
      
      {/* Message */}
      <p className="text-ink-black dark:text-white font-medium text-center">
        {message}
      </p>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-shadow-grey rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-slate rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute -top-1 right-0 text-xs font-bold text-blue-slate">
              {progress}%
            </div>
          </div>
        </div>
      )}

      {/* Tip */}
      {tip && (
        <p className="text-sm text-shadow-grey dark:text-blue-slate text-center italic max-w-md">
          💡 {tip}
        </p>
      )}
    </div>
  )
}
