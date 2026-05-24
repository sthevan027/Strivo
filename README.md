# Strivo - Plataforma de Streaming

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=fff)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=fff)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=fff)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> Protótipo de plataforma de streaming com integração social e ferramentas para criadores e espectadores.

---

## 📱 Sobre o Projeto

O **Strivo** é um protótipo de plataforma de streaming que tem como objetivo se tornar referência no mercado de streaming, com forte integração social e ferramentas inovadoras para criadores e espectadores.

## 🚀 Como rodar

1. Clone o repositório:
```bash
git clone https://github.com/sthevan027/Strivo.git
cd Strivo
```

2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Navegue entre as páginas usando os links e botões

## 🎯 Funcionalidades Implementadas

### ✅ Versão Beta (MVP)

- **Página Inicial**: Top streamers do mês, lives em destaque e categorias principais
- **Perfil de Usuário**: Interface similar ao Instagram com estatísticas e abas
- **Categorias**: Principais categorias ao vivo e seção de interações
- **Sistema de Apoio**: Doações diretas aos streamers com valores fixos
- **Ranking**: Top 5 streamers mais populares e ranking geral
- **Configurações**: Interface de configurações inspirada no Meta
- **Busca**: Página de busca com categorias e streamers populares

### 🎨 Design

- **Tema Escuro**: Interface moderna com cores escuras
- **Cor Primária**: Verde vibrante (#53fc18) para elementos de destaque
- **Responsivo**: Adaptado para desktop e mobile
- **Animações**: Transições suaves e efeitos hover

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Estilos e animações |
| Tailwind CSS | Framework CSS |
| JavaScript | Interatividade |

## 📁 Estrutura do Projeto

```
Strivo/
├── index.html          # Página inicial
├── profile.html        # Perfil do usuário
├── categories.html     # Categorias e interações
├── support.html        # Sistema de apoio/doação
├── ranking.html        # Ranking de streamers
├── settings.html       # Configurações
├── search.html         # Página de busca
├── styles.css          # Estilos principais
├── profile.css         # Estilos do perfil
├── Acompanhamento-Semanal/
└── README.md
```

## 🎨 Paleta de Cores

- **Primária**: #53fc18 (Verde vibrante)
- **Primária Escura**: #45d614
- **Fundo Escuro**: #0f0f0f
- **Card Escuro**: #1a1a1a
- **Borda Escura**: #2a2a2a

## 🔮 Roadmap

- Lives em tempo real com chat interativo
- Sistema de assinaturas recorrentes
- Clips automáticos e VOD
- Feed social com posts e stories
- Dashboard para streamers

---

## 📺 2. Lives (MVP)

- Iniciar/encerrar live (UI do streamer) com exibição do status
- Player para espectadores (expo-av/react-native-video; WebRTC quando aplicável)
- Chat em tempo real (mensagens, moderação básica do cliente)
- Contadores: espectadores e reações (com throttle/debounce)
- Categorias de jogos/temas e lives em destaque/populares

Páginas/componentes:
- `app/live/[id]` (controles condicionais para streamer)
- `LivePlayer`, `LiveControls`, `ReactionBar`, `ViewerCount`, `ChatPanel`

—

## 🧭 3. Exploração (MVP)

- Home com lives em alta e destaques
- Busca por streamer/jogo/categoria com sugestões
- Destaque para top streamers do mês

Páginas/componentes:
- `app/(public)/` (Home)
- `app/(public)/search`
- `LiveCard`, `CategoryPill`, `TopStreamersCarousel`

—

## 💬 4. Engajamento (MVP)

- Curtir e comentar em clipes/postagens relacionadas
- Ranking de streamers e destaque de “streamers do mês”

Páginas/componentes:
- `app/(public)/ranking`
- `ClipCard`, `LikeButton`, `CommentList`, `MonthlyHighlight`

—

## 💸 5. Monetização (MVP)

- Apoio direto (doações) com valores fixos: R$5, R$10, R$25, R$50
- Histórico de apoios no perfil do usuário/streamer

Páginas/componentes:
- `DonateModal`, `DonateButton`, `SupportHistory`

—

## 🧩 6. Infraestrutura (MVP)

- **Streaming**: WebRTC, RTMP para publicação móvel
- **CDN**: otimização de entrega de conteúdo
- **Banco de dados**: sincronização offline/online
- **Logs e métricas**: desempenho, erros, analytics
- **OTA updates**: atualizações over-the-air
- **Push notifications**: para engajamento

—

## 🔗 Integração (Contratos Mock do Front)

Rotas/serviços que o frontend espera consumir (sujeitos a ajuste durante implementação do backend):

```ts
// Auth
POST /auth/login { email, password }
POST /auth/signup { name, email, password }
POST /auth/provider/{google|...} { token }
GET  /auth/session -> { user, tokens }
POST /auth/logout

// Perfil & social
GET  /profiles/:username
POST /profiles/:username/follow
DELETE /profiles/:username/follow
GET  /profiles/:username/followers
GET  /profiles/:username/following

// Lives
GET  /lives?status=live|scheduled&category=...
GET  /lives/:id -> { playbackUrl, title, category, streamer }
POST /lives/:id/reactions { type }
GET  /lives/:id/viewers

// Exploração
GET  /search?q=...
GET  /top-streamers?period=month

// Engajamento
POST /clips/:id/like
POST /clips/:id/comment { text }
GET  /ranking?period=month

// Monetização
POST /donations { toStreamerId, amount, message? }
GET  /donations/history?userId=...
```

Sockets (eventos cliente):

```ts
connect -> join_live_room { liveId }
on message:new -> { id, user, text, sentAt }
emit message:send -> { text }
on live:viewers -> { count }
on live:reaction -> { type, total }
```

—

## 🧑‍🎨 UI/UX

- Design system com tokens: cores, tipografia, espaçamentos e raios
- Tema escuro padrão; modo claro como futura melhoria
- Padrões de navegação consistentes, feedbacks em tempo real (toasts)
- Estados de carregamento e vazios claros (skeletons)

Paleta base sugerida:
- Primária (destaques): `#53FC18`
- Fundo escuro: `#0F0F0F`
- Cartão: `#1A1A1A`
- Borda: `#2A2A2A`

—

## 🧪 Testes

### Frontend Mobile
- **Unitários**: componentes e hooks críticos (Jest + @testing-library/react-native)
- **Integração**: páginas/fluxos (Testing Library)
- **E2E**: login, live, chat, doação (Detox/Maestro)

### Backend
- **Unitários**: services e repositories (Jest)
- **Integração**: APIs completas (Supertest)
- **E2E**: fluxos críticos (Postman/Newman)
- **Load**: performance com Artillery

Scripts:
```bash
pnpm test
pnpm test:watch
pnpm test:e2e
pnpm test:load
```

—

## 🧹 Qualidade & Padrões

- ESLint + Prettier com checagem em pre-commit (Husky + lint-staged)
- Mensagens de commit (Conventional Commits)
- Nomes de branch: `feat/`, `fix/`, `chore/`, `docs/`
- PRs com checklist: testes passam, cobertura mínima, UX revisada

—

## 🔮 Funcionalidades Futuras (pós-beta)

- Clips automáticos (highlights)
- Lives gravadas (VOD)
- Assinaturas recorrentes (subscribers)
- Integração social (compartilhar live/clipes)
- Notificações push (início de live)
- Selos/achievements de engajamento
- Loja de créditos/moedas virtuais
- Modo escuro/claro customizável
- Ferramentas de moderação (banir, mutar no chat)
- Dashboard do streamer (analytics de audiência)

—

## 👤 Papéis (Contexto)

- **Chefe do projeto**: liderança estratégica, roadmap e monetização
- **Engenheiro de software**: estrutura técnica, documentação, revisão de PRs, qualidade e escalabilidade do sistema completo

—

## 📄 Licença e Avisos

Este projeto está sob licença proprietária. Todos os direitos reservados.

**© 2024 Strivo. Todos os direitos reservados.**

É proibida a reprodução, distribuição, modificação ou uso comercial sem autorização expressa por escrito. Marcas, design e assets são propriedade da Strivo.

**Desenvolvido por [Sthevan Santos](https://github.com/sthevan027).**
