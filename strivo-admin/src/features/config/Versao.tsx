import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { ArrowLeft, Info, CheckCircle } from 'lucide-react'

export default function Versao() {
  const navigate = useNavigate()

  const versao = '1.0.0'
  const build = '2024.12.20'
  const status = 'Estável'

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <Button variant="neutral" onClick={() => navigate('/config')} className="mb-2 text-sm py-2.5">
        <ArrowLeft size={16} className="mr-2" />
        Voltar
      </Button>

      <h1 className="text-xl font-bold mb-4">Versão</h1>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Info size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">Strivo Admin</p>
              <p className="text-xs text-gray-400">Painel Administrativo</p>
            </div>
          </div>

          <div className="pt-3 border-t border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Versão</span>
              <span className="font-medium text-sm">{versao}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Build</span>
              <span className="font-medium text-sm">{build}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Status</span>
              <div className="flex items-center space-x-2">
                <CheckCircle size={14} className="text-primary" />
                <span className="font-medium text-sm text-primary">{status}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-sm mb-3">Changelog</h3>
        <div className="space-y-2">
          <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
            <p className="font-medium text-xs">v1.0.0 - 20/12/2024</p>
            <ul className="text-xs text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li>Lançamento inicial do painel administrativo</li>
              <li>Implementação de todas as telas do MVP</li>
              <li>Sistema de navegação responsivo</li>
              <li>Gerenciamento de denúncias e ações</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

