import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { denuncias } from '../../mocks/data'
import { FileText, MessageSquare, Image, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

const tipoIcons = {
  post: FileText,
  comentario: MessageSquare,
  midia: Image,
}

export default function DenunciaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [actionTaken, setActionTaken] = useState(false)

  const denuncia = denuncias.find((d) => d.id === id)

  if (!denuncia) {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <p className="text-center text-gray-400">Denúncia não encontrada</p>
          <Button variant="primary" onClick={() => navigate('/denuncias')} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    )
  }

  const Icon = tipoIcons[denuncia.tipo]

  const handleAction = (action: string) => {
    setActionTaken(true)
    setTimeout(() => {
      navigate('/denuncias')
    }, 1500)
  }

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <Button variant="neutral" onClick={() => navigate('/denuncias')} className="mb-2">
        ← Voltar
      </Button>

      <Card>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-dark-bg rounded-lg border border-dark-border flex-shrink-0">
              <Icon size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <p className="text-lg font-bold">{denuncia.autor}</p>
                <Badge count={denuncia.denunciasRecebidas} variant="danger" />
              </div>
              <p className="text-xs text-gray-400 mt-1">{denuncia.categoria}</p>
              <p className="text-xs text-gray-500 mt-1">{denuncia.tempo}</p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
            <p className="text-sm text-gray-300 leading-relaxed">{denuncia.conteudo}</p>
          </div>

          {/* Motivo da Denúncia */}
          <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle size={18} className="text-yellow-500" />
              <h3 className="font-bold text-yellow-500 text-sm">Motivo da Denúncia</h3>
            </div>
            <p className="text-sm text-gray-300">{denuncia.motivo}</p>
          </div>

          {/* Ações */}
          {!actionTaken ? (
            <div className="flex flex-col gap-2 pt-3 border-t border-dark-border">
              <Button
                variant="danger"
                onClick={() => handleAction('remover')}
                className="w-full"
              >
                Remover
              </Button>
              <Button
                variant="neutral"
                onClick={() => handleAction('manter')}
                className="w-full"
              >
                Manter
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAction('avisar')}
                className="w-full"
              >
                Avisar Usuário
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-primary/20 border border-primary/30 rounded-lg text-center">
              <p className="text-primary font-medium">Ação executada com sucesso!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

