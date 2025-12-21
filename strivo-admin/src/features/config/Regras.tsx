import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { ArrowLeft, FileText, Plus } from 'lucide-react'

const regras = [
  {
    id: '1',
    titulo: 'Conteúdo Violento',
    descricao: 'Não é permitido compartilhar conteúdo violento ou que promova violência.',
  },
  {
    id: '2',
    titulo: 'Discurso de Ódio',
    descricao: 'Qualquer forma de discurso de ódio será removida e o usuário poderá ser banido.',
  },
  {
    id: '3',
    titulo: 'Spam e Conteúdo Comercial',
    descricao: 'Spam e conteúdo comercial não autorizado são proibidos.',
  },
  {
    id: '4',
    titulo: 'Assédio e Bullying',
    descricao: 'Assédio, bullying ou perseguição de outros usuários não será tolerado.',
  },
  {
    id: '5',
    titulo: 'Informação Falsa',
    descricao: 'Compartilhar informações falsas ou enganosas é proibido.',
  },
]

export default function Regras() {
  const navigate = useNavigate()

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="neutral" onClick={() => navigate('/config')} className="text-sm py-2.5">
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </Button>
        <Button variant="primary" className="text-sm py-2.5">
          <Plus size={16} className="mr-2" />
          Adicionar
        </Button>
      </div>

      <h1 className="text-xl font-bold">Regras da Comunidade</h1>

      <Card>
        <div className="space-y-3">
          {regras.map((regra) => (
            <div
              key={regra.id}
              className="p-3 bg-dark-bg rounded-lg border border-dark-border active:bg-dark-hover transition-colors"
            >
              <div className="flex items-start space-x-3">
                <FileText size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{regra.titulo}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{regra.descricao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

