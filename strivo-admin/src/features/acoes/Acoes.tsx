import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { acoesPendentes } from '../../mocks/data'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

export default function Acoes() {
  return (
    <div className="pt-20 pb-6 px-4 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Ações Pendentes</h1>
        <Badge count={acoesPendentes.length} variant="warning" />
      </div>

      <div className="space-y-3">
        {acoesPendentes.map((acao) => (
          <Card key={acao.id} className="active:bg-dark-hover transition-colors">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-dark-bg rounded-lg border border-dark-border flex-shrink-0">
                <Clock size={20} className="text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-sm">{acao.tipo}</p>
                  <Badge
                    count={acao.status === 'Pendente' ? 1 : 0}
                    variant={acao.status === 'Pendente' ? 'warning' : 'primary'}
                  />
                </div>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{acao.descricao}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {acao.status === 'Pendente' ? (
                      <Clock size={12} className="text-yellow-500" />
                    ) : (
                      <CheckCircle size={12} className="text-primary" />
                    )}
                    <p className="text-xs text-gray-500">{acao.status}</p>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{acao.tempo}</span>
                  </div>
                  <Button variant="primary" className="text-xs py-2 px-4">
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

