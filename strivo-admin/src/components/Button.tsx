import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'danger' | 'neutral'
  className?: string
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 active:bg-blue-700 text-white',
    danger: 'bg-red-600 active:bg-red-700 text-white',
    neutral: 'bg-gray-600 active:bg-gray-700 text-white',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[44px] flex items-center justify-center ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

