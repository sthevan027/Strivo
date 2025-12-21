import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { ArrowLeft, UserPlus, Shield, Trash2 } from 'lucide-react'

const moderadores = [
  { id: '1', nome: 'João Silva', email: 'joao@strivo.com', nivel: 'Admin', status: 'Ativo' },
  { id: '2', nome: 'Maria Santos', email: 'maria@strivo.com', nivel: 'Moderador', status: 'Ativo' },
  { id: '3', nome: 'Pedro Costa', email: 'pedro@strivo.com', nivel: 'Moderador', status: 'Inativo' },
]

export default function Moderadores() {
  const navigate = useNavigate()

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="neutral" onClick={() => navigate('/config')} className="text-sm py-2.5">
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </Button>
        <Button variant="primary" className="text-sm py-2.5">
          <UserPlus size={16} className="mr-2" />
          Adicionar
        </Button>
      </div>

      <h1 className="text-xl font-bold">Gerenciar Moderadores</h1>

      <Card>
        <div className="space-y-3">
          {moderadores.map((mod) => (
            <div
              key={mod.id}
              className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-dark-border active:bg-dark-hover transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                  <Shield size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap mb-1">
                    <p className="font-medium text-sm">{mod.nome}</p>
                    <Badge
                      count={mod.nivel}
                      variant={mod.nivel === 'Admin' ? 'primary' : 'default'}
                    />
                    <Badge
                      count={mod.status}
                      variant={mod.status === 'Ativo' ? 'primary' : 'default'}
                    />
                  </div>
                  <p className="text-xs text-gray-400 truncate">{mod.email}</p>
                </div>
              </div>
              <Button variant="danger" className="ml-3 text-sm py-2 px-3">
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

