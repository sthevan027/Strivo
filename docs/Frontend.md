# Strivo Frontend — Documentação

Este documento detalha a visão, arquitetura, contratos e práticas do frontend do Strivo. Esta é a referência principal para desenvolvimento do app mobile (React Native/Expo).

## Sumário
- Visão Geral
- Stack
- Execução Local
- Estrutura de Pastas
- Autenticação & Perfis
- Lives
- Exploração
- Engajamento
- Monetização
- Infraestrutura de Frontend
- Integração (REST & Sockets)
- UI/UX
- Testes
- Qualidade & PRs
- Roadmap (pós-beta)
- Mobile-first (lançamento inicial)

## Visão Geral
O frontend entrega experiências de autenticação, lives, exploração, engajamento e monetização, com foco em performance, acessibilidade e DX.

## Stack
- React Native + Expo (TypeScript)
- Expo Router (navegação baseada em arquivos) + React Navigation
- Estilos: NativeWind (Tailwind para RN) ou StyleSheet/Tamagui
- Estado: TanStack Query (server) + Zustand (UI)
- Realtime: socket.io-client ou WebSocket nativo
- Player: `expo-av` (HLS) ou `react-native-video`; publicação via `react-native-webrtc` (quando aplicável)
- Formulários/validação: React Hook Form + Zod
- Armazenamento seguro: `expo-secure-store`
- Push/OTA: `expo-notifications` e `expo-updates`
- Qualidade: ESLint, Prettier, Husky, lint-staged; Jest + @testing-library/react-native; E2E com Detox/Maestro

## Execução Local
```bash
pnpm install
```

Crie `.env` (Expo lê `EXPO_PUBLIC_*` no app):
```bash
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_SOCKET_URL=http://localhost:4000
EXPO_PUBLIC_CDN_URL=http://localhost:8080
```

Executar (Expo):
```bash
pnpm expo start
```

Rodar em dispositivos/emuladores:
```bash
pnpm expo run:android
pnpm expo run:ios
```

## Estrutura de Pastas (sugerida)
```
app/                 # Rotas (Expo Router)
assets/              # Ícones, fontes, imagens
src/
  components/
  features/
  hooks/
  lib/               # api client, socket, analytics, updates
  stores/
  styles/
  types/
  utils/
```

## 🔐 1. Autenticação & Perfis (MVP)

### Funcionalidades
- **Login/cadastro**: e-mail, Google e redes sociais via `expo-auth-session`
- **Perfis básicos**: nome, foto, bio, contadores (seguidores/seguindo)
- **Sistema de seguidores**: seguir/deixar de seguir, listagens de seguidores/seguindo
- **Sessão segura**: tokens (access/refresh) no `expo-secure-store`
- **Proteção de rotas**: guards com Expo Router e revalidação automática

### Componentes/Rotas
- `app/(auth)/login`, `app/(auth)/signup`
- `app/profile/[username]`
- `ProfileHeader`, `FollowButton`, `Avatar`, `BioEditor`, `FollowersList`

## 📺 2. Lives (MVP)

### Funcionalidades
- **Iniciar/encerrar live**: streaming básico com publicação via `react-native-webrtc` ou RTMP móvel
- **Chat em tempo real**: mensagens, moderação básica, emojis
- **Contador de visualizações**: espectadores ativos em tempo real
- **Reações**: curtidas, emojis, interações durante a live
- **Categorias**: GTA, LoL, Just Chatting, etc. com filtros
- **Listagem**: lives em destaque e populares na home

### Componentes/Rotas
- `app/live/[id]` (público para espectador, controles para streamer)
- `LivePlayer`, `LiveControls`, `ChatPanel`, `ViewerCount`, `ReactionBar`
- `CategoryFilter`, `LiveCard`, `LiveList`

## 🧭 3. Exploração (MVP)

### Funcionalidades
- **Página inicial**: lives em alta com carrossel de destaques
- **Busca**: por streamer, jogo, categoria com sugestões em tempo real
- **Top streamers**: destaque para streamers do mês com ranking
- **Categorias**: navegação por jogos/temas populares

### Componentes/Rotas
- `app/` (Home), `app/search`
- `LiveCard`, `CategoryPill`, `TopStreamersCarousel`, `SearchBar`
- `FeaturedLives`, `CategoryGrid`

## 💬 4. Engajamento (MVP)

### Funcionalidades
- **Curtir e comentar**: em clipes e postagens relacionadas
- **Ranking de streamers**: lista geral com posições e estatísticas
- **Destaque mensal**: "streamers do mês" com badges especiais
- **Interações**: sistema de curtidas, comentários e compartilhamentos

### Componentes/Rotas
- `app/ranking`, `app/clips/[id]`
- `ClipCard`, `LikeButton`, `CommentList`, `MonthlyHighlight`
- `RankingList`, `StreamerCard`, `EngagementStats`

## 💸 5. Monetização (MVP)

### Funcionalidades
- **Apoio direto**: doações com valores fixos (R$5, R$10, R$25, R$50)
- **Histórico de apoios**: no perfil do usuário/streamer
- **Pagamentos**: integração com gateway de pagamento (PIX, cartão)
- **Transparência**: histórico público de doações recebidas

### Componentes/Rotas
- `app/donate/[streamerId]`, `app/support/history`
- `DonateModal`, `DonateButton`, `SupportHistory`
- `PaymentForm`, `DonationCard`, `SupportStats`

## 🧩 6. Infraestrutura (MVP)

### Funcionalidades
- **Streaming estável**: WebRTC, RTMP para publicação móvel
- **CDN para vídeos**: otimização de entrega de conteúdo
- **Banco de dados escalável**: sincronização offline/online
- **Logs e métricas**: desempenho, erros, analytics de uso
- **OTA updates**: atualizações over-the-air via `expo-updates`
- **Push notifications**: `expo-notifications` para engajamento

### Componentes/Tecnologias
- `ErrorBoundary`, `AnalyticsProvider`, `OfflineSync`
- CDN integration, WebRTC/RTMP clients
- Performance monitoring, crash reporting

## 🔗 Integração (APIs & WebSockets)

### REST APIs
```
POST /auth/login { email, password }
POST /auth/signup { name, email, password }
POST /auth/provider/{google|...} { token }
GET  /auth/session -> { user, tokens }
POST /auth/logout

GET  /profiles/:username
POST /profiles/:username/follow
DELETE /profiles/:username/follow
GET  /profiles/:username/followers
GET  /profiles/:username/following

GET  /lives?status=live&category=...
GET  /lives/:id -> { playbackUrl, title, category, streamer }
POST /lives/:id/reactions { type }
GET  /lives/:id/viewers

GET  /search?q=...
GET  /top-streamers?period=month

POST /clips/:id/like
POST /clips/:id/comment { text }
GET  /ranking?period=month

POST /donations { toStreamerId, amount, message? }
GET  /donations/history?userId=...
```

### WebSockets
```
connect -> join_live_room { liveId }
emit message:send -> { text, liveId }
on message:new -> { id, user, text, sentAt }
on live:viewers -> { count }
on live:reaction -> { type, total }
```

## UI/UX
- Tokens de design; tema escuro; toasts; skeletons; guideline de acessibilidade (WCAG 2.1 AA)

## Testes
- Unit, integração e E2E (cenários críticos: login, live, chat, doação)

## Qualidade & PRs
- ESLint/Prettier; Conventional Commits; branches `feat/`, `fix/`, `docs/`; PRs com checklist

## 🔮 Funcionalidades Futuras (pós-beta)

### Próximas funcionalidades
- **Clips automáticos**: highlights gerados automaticamente
- **Lives gravadas (VODs)**: assistir lives após o término
- **Assinaturas recorrentes**: subscribers com benefícios exclusivos
- **Integração social**: compartilhar lives/clipes nas redes sociais
- **Notificações push**: quando streamer favorito inicia live
- **Selos/achievements**: gamificação para engajamento
- **Loja de créditos**: moedas virtuais para doações
- **Modo escuro/claro**: customização de tema
- **Ferramentas de moderação**: banir, mutar no chat
- **Dashboard para streamers**: estatísticas de audiência detalhadas

## Mobile-first (lançamento inicial)
O frontend é priorizado para dispositivos móveis no lançamento. Diretrizes:

- Layout: grid responsivo com breakpoints otimizados para 360–414 px; navegação inferior (tab bar) nas principais telas.
- Performance: lazy-loading agressivo, imagens responsivas, prefetch de rotas em idle, reduzir JS por rota.
- Player: preferir HLS nativo quando suportado; fallback HLS.js. Controle de autoplay respeitando políticas mobile; persistência de orientação tela cheia.
- Chat: virtualização de mensagens, compressão de payloads, debounce de digitação, limites de frequência de envio.
- PWA: manifest, service worker para cache de shell e telas públicas; ícones e splash screens; Add to Home Screen.
- Rede: detecção de 3G/4G/Wi‑Fi; downgrade de bitrate/cdn conforme `NetworkInformation` quando disponível.
- Acessibilidade: alvos de toque ≥ 44px, foco visível, suporte a leitores de tela.
- Testes: suíte E2E em viewport mobile (Playwright) para fluxos core (login, assistir live, chat, doação).


