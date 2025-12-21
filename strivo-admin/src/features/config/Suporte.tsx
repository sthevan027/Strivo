import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { ArrowLeft, HelpCircle, Mail, MessageCircle, Book } from 'lucide-react'

const suporteItems = [
  {
    icon: Mail,
    titulo: 'Email de Suporte',
    descricao: 'suporte@strivo.com',
    acao: 'Enviar Email',
  },
  {
    icon: MessageCircle,
    titulo: 'Chat em Tempo Real',
    descricao: 'Converse com nossa equipe',
    acao: 'Abrir Chat',
  },
  {
    icon: Book,
    titulo: 'Documentação',
    descricao: 'Acesse a documentação completa',
    acao: 'Ver Documentação',
  },
]

export default function Suporte() {
  const navigate = useNavigate()

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <Button variant="neutral" onClick={() => navigate('/config')} className="mb-2 text-sm py-2.5">
        <ArrowLeft size={16} className="mr-2" />
        Voltar
      </Button>

      <h1 className="text-xl font-bold mb-4">Suporte Técnico</h1>

      <Card>
        <div className="space-y-3">
          {suporteItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-dark-border active:bg-dark-hover transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.titulo}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.descricao}</p>
                  </div>
                </div>
                <Button variant="primary" className="ml-3 text-xs py-2 px-3">
                  {item.acao}
                </Button>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-start space-x-3">
          <HelpCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm mb-2">Perguntas Frequentes</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Em breve, adicionaremos uma seção de perguntas frequentes para ajudar
              você a resolver problemas comuns.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

