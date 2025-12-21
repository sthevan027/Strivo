export interface ConteudoRevisao {
  id: string
  tipo: 'post' | 'comentario' | 'midia'
  autor: string
  conteudo: string
  motivo: string
  tempo: string
}

export interface Denuncia {
  id: string
  tipo: 'post' | 'comentario' | 'midia'
  categoria: string
  autor: string
  conteudo: string
  motivo: string
  tempo: string
  denunciasRecebidas: number
}

export interface AcaoPendente {
  id: string
  tipo: string
  descricao: string
  status: string
  tempo: string
}

export interface Metricas {
  postsRemovidos: number
  denunciasTotais: number
  taxaRevisao24h: number
  atividade7dias: Array<{ dia: string; valor: number }>
}

export const conteudosRevisao: ConteudoRevisao[] = [
  {
    id: '1',
    tipo: 'post',
    autor: '@usuario123',
    conteudo: 'Conteúdo suspeito para revisão...',
    motivo: 'Possível spam',
    tempo: 'há 5 min',
  },
  {
    id: '2',
    tipo: 'comentario',
    autor: '@streamer456',
    conteudo: 'Comentário ofensivo detectado...',
    motivo: 'Linguagem inadequada',
    tempo: 'há 12 min',
  },
]

export const denuncias: Denuncia[] = [
  {
    id: '1',
    tipo: 'post',
    categoria: 'Conteúdo violento',
    autor: '@usuario123',
    conteudo: 'Post com conteúdo violento reportado por múltiplos usuários...',
    motivo: 'Conteúdo violento',
    tempo: 'há 3 min',
    denunciasRecebidas: 5,
  },
  {
    id: '2',
    tipo: 'comentario',
    categoria: 'Discurso de ódio',
    autor: '@streamer789',
    conteudo: 'Comentário com discurso de ódio...',
    motivo: 'Discurso de ódio',
    tempo: 'há 15 min',
    denunciasRecebidas: 2,
  },
  {
    id: '3',
    tipo: 'midia',
    categoria: 'Spam comercial',
    autor: '@spammer001',
    conteudo: 'Mídia com spam comercial...',
    motivo: 'Spam comercial',
    tempo: 'há 1h',
    denunciasRecebidas: 8,
  },
  {
    id: '4',
    tipo: 'post',
    categoria: 'Informação falsa',
    autor: '@fakeuser',
    conteudo: 'Post com informação falsa...',
    motivo: 'Informação falsa',
    tempo: 'há 2h',
    denunciasRecebidas: 3,
  },
  {
    id: '5',
    tipo: 'comentario',
    categoria: 'Assédio online',
    autor: '@harasser',
    conteudo: 'Comentário com assédio...',
    motivo: 'Assédio online',
    tempo: 'há 3h',
    denunciasRecebidas: 4,
  },
]

export const acoesPendentes: AcaoPendente[] = [
  {
    id: '1',
    tipo: 'Recurso',
    descricao: 'Recurso de remoção de post aguardando revisão',
    status: 'Pendente',
    tempo: 'há 1h',
  },
  {
    id: '2',
    tipo: 'Verificação',
    descricao: 'Solicitação de verificação de conta',
    status: 'Em análise',
    tempo: 'há 4h',
  },
  {
    id: '3',
    tipo: 'Recurso',
    descricao: 'Recurso de banimento temporário',
    status: 'Pendente',
    tempo: 'há 6h',
  },
]

export const metricas: Metricas = {
  postsRemovidos: 127,
  denunciasTotais: 342,
  taxaRevisao24h: 89,
  atividade7dias: [
    { dia: 'Seg', valor: 45 },
    { dia: 'Ter', valor: 52 },
    { dia: 'Qua', valor: 38 },
    { dia: 'Qui', valor: 61 },
    { dia: 'Sex', valor: 48 },
    { dia: 'Sáb', valor: 35 },
    { dia: 'Dom', valor: 42 },
  ],
}

