import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { metricas } from '../../mocks/data'
import { TrendingUp, AlertTriangle, Clock } from 'lucide-react'

export default function Insights() {
  return (
    <div className="pt-20 pb-6 px-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Insights e Métricas</h1>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <div className="flex flex-col items-center justify-center text-center">
            <TrendingUp className="text-red-500 mb-2" size={28} />
            <p className="text-2xl font-bold mb-1">{metricas.postsRemovidos}</p>
            <p className="text-[10px] text-gray-400 leading-tight">Posts Removidos</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="text-yellow-500 mb-2" size={28} />
            <p className="text-2xl font-bold mb-1">{metricas.denunciasTotais}</p>
            <p className="text-[10px] text-gray-400 leading-tight">Denúncias Totais</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex flex-col items-center justify-center text-center">
            <Clock className="text-primary mb-2" size={28} />
            <p className="text-2xl font-bold mb-1">{metricas.taxaRevisao24h}%</p>
            <p className="text-[10px] text-gray-400 leading-tight">Taxa de Revisão (24h)</p>
          </div>
        </Card>
      </div>

      {/* Gráfico de Atividade */}
      <Card>
        <h2 className="text-base font-bold mb-3">Atividade dos Últimos 7 Dias</h2>
        <div className="space-y-3">
          {metricas.atividade7dias.map((item, index) => {
            const maxValue = Math.max(...metricas.atividade7dias.map((d) => d.valor))
            const percentage = (item.valor / maxValue) * 100

            return (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{item.dia}</span>
                  <span className="text-gray-400">{item.valor}</span>
                </div>
                <div 
                  className="w-full rounded-full h-2.5 overflow-hidden"
                  style={{ backgroundColor: '#0f0f0f' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: '#53fc18'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

