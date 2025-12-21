import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { denuncias } from '../../mocks/data'
import { FileText, MessageSquare, Image } from 'lucide-react'

const tipoIcons = {
  post: FileText,
  comentario: MessageSquare,
  midia: Image,
}

export default function Denuncias() {
  return (
    <div className="pt-20 pb-6 px-4 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Denúncias</h1>
        <Badge count={denuncias.length} variant="danger" />
      </div>

      <div className="space-y-3">
        {denuncias.map((denuncia) => {
          const Icon = tipoIcons[denuncia.tipo]
          return (
            <Link key={denuncia.id} to={`/denuncias/${denuncia.id}`}>
              <Card className="active:bg-dark-hover transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-dark-bg rounded-lg border border-dark-border flex-shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm truncate">{denuncia.autor}</p>
                      <Badge count={denuncia.denunciasRecebidas} variant="danger" />
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{denuncia.categoria}</p>
                    <p className="text-xs text-gray-300 line-clamp-2 mb-2">{denuncia.conteudo}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{denuncia.tempo}</p>
                      <Button variant="primary" className="text-xs py-2 px-4">
                        Analisar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

