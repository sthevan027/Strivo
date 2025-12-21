import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { conteudosRevisao, denuncias, acoesPendentes } from '../../mocks/data'
import { AlertTriangle, ClipboardList, FileText } from 'lucide-react'

export default function Home() {
  const totalRevisao = conteudosRevisao.length
  const totalDenuncias = denuncias.length
  const totalAcoes = acoesPendentes.length

  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <div className="flex flex-col items-center justify-center text-center">
            <FileText className="text-primary mb-2" size={28} />
            <p className="text-2xl font-bold mb-1">{totalRevisao}</p>
            <p className="text-[10px] text-gray-400 leading-tight">Conteúdos para Revisão</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="text-red-500 mb-2" size={28} />
            <p className="text-2xl font-bold mb-1">{totalDenuncias}</p>
            <p className="text-[10px] text-gray-400 leading-tight">Denúncias Recentes</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex flex-col items-center justify-center text-center">
            <ClipboardList className="text-yellow-500 mb-2" size={28} />
            <p className="text-2xl font-bold mb-1">{totalAcoes}</p>
            <p className="text-[10px] text-gray-400 leading-tight">Ações Pendentes</p>
          </div>
        </Card>
      </div>

      {/* Listas Rápidas */}
      <div className="grid grid-cols-1 gap-4">
        {/* Conteúdos para Revisão */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Conteúdos para Revisão</h2>
            <Badge count={totalRevisao} variant="primary" />
          </div>
          <div className="space-y-2">
            {conteudosRevisao.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border active:opacity-80 transition-opacity"
                style={{
                  backgroundColor: '#0f0f0f',
                  borderColor: '#2a2a2a'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.autor}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.conteudo}</p>
                    <p className="text-xs mt-1" style={{ color: '#53fc18' }}>{item.motivo}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{item.tempo}</span>
                </div>
                <Link to="/denuncias">
                  <Button variant="primary" className="w-full text-sm py-2.5">
                    Ver
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Denúncias Recentes */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Denúncias Recentes</h2>
            <Badge count={totalDenuncias} variant="danger" />
          </div>
          <div className="space-y-2">
            {denuncias.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border active:opacity-80 transition-opacity"
                style={{
                  backgroundColor: '#0f0f0f',
                  borderColor: '#2a2a2a'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.autor}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.categoria}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{item.tempo}</span>
                </div>
                <Link to={`/denuncias/${item.id}`}>
                  <Button variant="primary" className="w-full text-sm py-2.5">
                    Analisar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Ações Pendentes */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Ações Pendentes</h2>
            <Badge count={totalAcoes} variant="warning" />
          </div>
          <div className="space-y-2">
            {acoesPendentes.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border active:opacity-80 transition-opacity"
                style={{
                  backgroundColor: '#0f0f0f',
                  borderColor: '#2a2a2a'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.tipo}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.descricao}</p>
                    <p className="text-xs mt-1" style={{ color: '#53fc18' }}>{item.status}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{item.tempo}</span>
                </div>
                <Link to="/acoes">
                  <Button variant="primary" className="w-full text-sm py-2.5">
                    Ver
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

