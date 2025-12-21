import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { ArrowLeft, History, Trash2, CheckCircle, XCircle } from 'lucide-react'

const registros = [
  {
    id: '1',
    acao: 'Post Removido',
    usuario: '@usuario123',
    moderador: 'João Silva',
    data: '2024-12-20 14:30',
    status: 'Concluído',
  },
  {
    id: '2',
    acao: 'Usuário Avisado',
    usuario: '@streamer456',
    moderador: 'Maria Santos',
    data: '2024-12-20 13:15',
    status: 'Concluído',
  },
  {
    id: '3',
    acao: 'Denúncia Analisada',
    usuario: '@spammer001',
    moderador: 'Pedro Costa',
    data: '2024-12-20 12:00',
    status: 'Concluído',
  },
]

export default function Registro() {
  const navigate = useNavigate()

  const getStatusIcon = (status: string) => {
    if (status === 'Concluído') {
      return <CheckCircle size={16} className="text-primary" />
    }
    return <XCircle size={16} className="text-red-500" />
  }

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <Button variant="neutral" onClick={() => navigate('/config')} className="mb-2 text-sm py-2.5">
        <ArrowLeft size={16} className="mr-2" />
        Voltar
      </Button>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Registro de Ações</h1>
        <Button variant="primary" className="text-sm py-2.5">Exportar</Button>
      </div>

      <Card>
        <div className="space-y-3">
          {registros.map((registro) => (
            <div
              key={registro.id}
              className="p-3 bg-dark-bg rounded-lg border border-dark-border active:bg-dark-hover transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                  <History size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap mb-1">
                    <p className="font-medium text-sm">{registro.acao}</p>
                    {getStatusIcon(registro.status)}
                    <Badge count={registro.status} variant="primary" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    Usuário: {registro.usuario}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    Moderador: {registro.moderador}
                  </p>
                  <p className="text-xs text-gray-500">{registro.data}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

