import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  AlertTriangle, 
  ClipboardList, 
  BarChart3, 
  Settings 
} from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/denuncias', icon: AlertTriangle, label: 'Denúncias' },
  { path: '/acoes', icon: ClipboardList, label: 'Ações' },
  { path: '/insights', icon: BarChart3, label: 'Insights' },
  { path: '/config', icon: Settings, label: 'Config' },
]

const getPageTitle = (path: string) => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/denuncias': 'Denúncias',
    '/acoes': 'Ações',
    '/insights': 'Insights',
    '/config': 'Configurações',
  }
  return titles[path] || 'Strivo Admin'
}

export default function Navigation() {
  const location = useLocation()
  const currentPath = location.pathname.split('/').slice(0, 2).join('/') || '/'
  const pageTitle = getPageTitle(currentPath)

  return (
    <>
      {/* Mobile Header */}
      <header 
        className="fixed top-0 left-0 right-0 border-b z-40 md:hidden"
        style={{ 
          backgroundColor: '#1a1a1a',
          borderColor: '#2a2a2a'
        }}
      >
        <div className="flex items-center justify-center h-14 px-4">
          <h1 className="text-lg font-bold" style={{ color: '#53fc18' }}>Strivo Admin</h1>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 border-t z-50 shadow-lg"
        style={{ 
          backgroundColor: '#1a1a1a',
          borderColor: '#2a2a2a'
        }}
      >
        <div className="flex justify-around items-center h-16 safe-area-bottom">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95"
                style={{
                  color: isActive ? '#53fc18' : '#9ca3af'
                }}
              >
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                  <Icon size={22} />
                  {isActive && (
                    <div 
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#53fc18' }}
                    />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}

