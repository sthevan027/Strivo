import { ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div 
      className="min-h-screen pb-20"
      style={{ 
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
        minHeight: '100vh'
      }}
    >
      <Navigation />
      <main className="max-w-full">
        {children}
      </main>
    </div>
  )
}

