import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div 
      className={`rounded-xl p-4 shadow-sm ${className}`}
      style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #2a2a2a'
      }}
    >
      {children}
    </div>
  )
}

