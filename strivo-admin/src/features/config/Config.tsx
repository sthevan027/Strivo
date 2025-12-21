import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import {
  Users,
  FileText,
  History,
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
} from 'lucide-react'

const configItems = [
  { icon: Users, label: 'Gerenciar Moderadores', path: '/config/moderadores' },
  { icon: FileText, label: 'Regras da Comunidade', path: '/config/regras' },
  { icon: History, label: 'Registro de Ações', path: '/config/registro' },
  { icon: Bell, label: 'Configurar Alertas', path: '/config/alertas' },
  { icon: HelpCircle, label: 'Suporte Técnico', path: '/config/suporte' },
  { icon: Info, label: 'Versão', path: '/config/versao' },
]

export default function Config() {
  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Configurações</h1>

      <Card>
        <div className="space-y-2">
          {configItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border active:bg-dark-hover transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className="text-primary" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

