import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { ArrowLeft, Bell, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'

interface AlertaConfig {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

const alertas: AlertaConfig[] = [
  {
    id: '1',
    nome: 'Notificações de Denúncias',
    descricao: 'Receber notificações quando novas denúncias forem criadas',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Alertas de Conteúdo Urgente',
    descricao: 'Alertas para conteúdo que requer atenção imediata',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Resumo Diário',
    descricao: 'Receber um resumo diário das atividades de moderação',
    ativo: false,
  },
  {
    id: '4',
    nome: 'Alertas de Sistema',
    descricao: 'Notificações sobre atualizações e manutenções do sistema',
    ativo: true,
  },
]

export default function Alertas() {
  const navigate = useNavigate()
  const [configs, setConfigs] = useState(alertas)

  const toggleAlerta = (id: string) => {
    setConfigs((prev) =>
      prev.map((alerta) =>
        alerta.id === id ? { ...alerta, ativo: !alerta.ativo } : alerta
      )
    )
  }

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <Button variant="neutral" onClick={() => navigate('/config')} className="mb-2 text-sm py-2.5">
        <ArrowLeft size={16} className="mr-2" />
        Voltar
      </Button>

      <h1 className="text-xl font-bold mb-4">Configurar Alertas</h1>

      <Card>
        <div className="space-y-3">
          {configs.map((alerta) => (
            <div
              key={alerta.id}
              className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-dark-border active:bg-dark-hover transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                  <Bell size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{alerta.nome}</p>
                  <p className="text-xs text-gray-400 mt-1">{alerta.descricao}</p>
                </div>
              </div>
              <button
                onClick={() => toggleAlerta(alerta.id)}
                className="ml-3 text-primary active:opacity-80 transition-opacity"
              >
                {alerta.ativo ? (
                  <ToggleRight size={28} className="text-primary" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-600" />
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

