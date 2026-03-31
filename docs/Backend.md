# Strivo Backend — Documentação

Este documento detalha a arquitetura, APIs, infraestrutura e práticas do backend do Strivo. Esta é a referência principal para desenvolvimento dos serviços backend (Node.js/TypeScript).

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
- Infraestrutura
- Integração (APIs & WebSockets)
- Banco de Dados
- Testes
- Qualidade & PRs
- Roadmap (pós-beta)

## Visão Geral
O backend entrega APIs REST e WebSockets para suportar todas as funcionalidades do frontend mobile, com foco em performance, escalabilidade e segurança.

## Stack
- Runtime: Node.js + TypeScript
- Framework: Express.js ou Fastify
- Banco de dados: PostgreSQL + Redis (cache/sessões)
- ORM: Prisma ou TypeORM
- Autenticação: JWT + refresh tokens
- Realtime: Socket.IO ou WebSocket nativo
- Streaming: WebRTC SFU, RTMP ingest, HLS output
- CDN: CloudFlare ou AWS CloudFront
- Deploy: Docker + Kubernetes ou AWS ECS
- Monitoramento: Prometheus + Grafana
- Logs: ELK Stack (Elasticsearch, Logstash, Kibana)

## Execução Local
```bash
pnpm install
```

Crie `.env`:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/strivo
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
API_PORT=4000
SOCKET_PORT=4001
CDN_URL=http://localhost:8080
```

Executar:
```bash
pnpm dev
```

Build:
```bash
pnpm build
pnpm start
```

## Estrutura de Pastas (sugerida)
```
src/
  controllers/         # Handlers de rotas
  services/           # Lógica de negócio
  repositories/       # Acesso a dados
  middleware/         # Auth, validation, logging
  routes/            # Definição de rotas
  models/            # Schemas/Types
  utils/             # Helpers
  config/            # Configurações
  tests/             # Testes unitários/integração
```

## 🔐 1. Autenticação & Perfis (MVP)

### Funcionalidades
- **Login/cadastro**: e-mail, Google OAuth, redes sociais
- **JWT tokens**: access token (15min) + refresh token (7 dias)
- **Perfis**: CRUD completo com validação
- **Sistema de seguidores**: follow/unfollow com contadores
- **Upload de imagens**: avatar e banner com CDN

### APIs
```
POST /auth/login { email, password }
POST /auth/signup { name, email, password }
POST /auth/provider/google { token }
POST /auth/refresh { refreshToken }
POST /auth/logout
GET  /auth/me

GET  /profiles/:username
PUT  /profiles/:username
POST /profiles/:username/follow
DELETE /profiles/:username/follow
GET  /profiles/:username/followers
GET  /profiles/:username/following
```

## 📺 2. Lives (MVP)

### Funcionalidades
- **Iniciar/encerrar live**: criação de stream, geração de RTMP/HLS URLs
- **WebRTC SFU**: media server para baixa latência
- **Chat em tempo real**: mensagens, moderação, emojis
- **Contadores**: espectadores ativos, reações em tempo real
- **Categorias**: CRUD de categorias de jogos/temas
- **Listagem**: lives ativas, populares, por categoria

### APIs
```
GET  /lives?status=live&category=...
GET  /lives/:id
POST /lives (criar live)
PUT  /lives/:id (atualizar live)
DELETE /lives/:id (encerrar live)
POST /lives/:id/reactions { type }
GET  /lives/:id/viewers
GET  /lives/:id/chat

GET  /categories
POST /categories
```

### WebSockets
```
connect -> join_live_room { liveId }
emit message:send -> { text, liveId }
on message:new -> { id, user, text, sentAt }
on live:viewers -> { count }
on live:reaction -> { type, total }
```

## 🧭 3. Exploração (MVP)

### Funcionalidades
- **Home**: lives em alta, destaques, categorias populares
- **Busca**: streamers, jogos, categorias com filtros
- **Top streamers**: ranking mensal com estatísticas
- **Categorias**: listagem e filtros

### APIs
```
GET  /home/featured
GET  /search?q=...&type=streamer|game|category
GET  /top-streamers?period=month
GET  /categories/popular
```

## 💬 4. Engajamento (MVP)

### Funcionalidades
- **Curtir/comentar**: clipes e postagens
- **Ranking**: algoritmo de popularidade
- **Destaque mensal**: streamers do mês
- **Interações**: sistema de curtidas, comentários

### APIs
```
POST /clips/:id/like
POST /clips/:id/comment { text }
GET  /clips/:id/comments
GET  /ranking?period=month
GET  /streamers/monthly-highlight
```

## 💸 5. Monetização (MVP)

### Funcionalidades
- **Apoio direto**: doações com valores fixos
- **Pagamentos**: integração com gateway (Stripe, PagSeguro)
- **Histórico**: doações enviadas/recebidas
- **Transparência**: histórico público

### APIs
```
POST /donations { toStreamerId, amount, message }
GET  /donations/history?userId=...
GET  /donations/received?userId=...
POST /payments/process { donationId, paymentMethod }
```

## 🧩 6. Infraestrutura (MVP)

### Funcionalidades
- **Streaming**: WebRTC SFU + RTMP ingest + HLS output
- **CDN**: distribuição global de vídeos
- **Banco escalável**: PostgreSQL com replicação
- **Cache**: Redis para sessões e dados frequentes
- **Logs**: centralizados com ELK Stack
- **Métricas**: Prometheus + Grafana
- **Monitoramento**: health checks, alertas

### Componentes/Serviços
- **Media Server**: WebRTC SFU (mediasoup ou Janus)
- **RTMP Ingest**: nginx-rtmp ou SRS
- **HLS Output**: segmentação automática
- **CDN**: CloudFlare ou AWS CloudFront
- **Database**: PostgreSQL com connection pooling
- **Cache**: Redis Cluster
- **Queue**: Bull/BullMQ para jobs assíncronos

## 🔗 Integração (APIs & WebSockets)

### REST APIs
Todas as rotas documentadas acima com:
- Autenticação JWT obrigatória (exceto rotas públicas)
- Rate limiting por IP/usuário
- Validação de entrada com Joi/Zod
- Respostas padronizadas (success/error)
- Paginação para listas
- Filtros e ordenação

### WebSockets
- Autenticação via token
- Rooms por live para chat
- Broadcasting de eventos
- Rate limiting para mensagens
- Moderação automática

## 🗄️ Banco de Dados

### Schema Principal
```sql
-- Users & Auth
users (id, email, name, avatar, bio, created_at)
sessions (id, user_id, refresh_token, expires_at)

-- Profiles & Social
profiles (id, user_id, username, followers_count, following_count)
follows (follower_id, following_id, created_at)

-- Lives & Streaming
lives (id, user_id, title, category, status, rtmp_url, hls_url, viewers_count, created_at)
live_reactions (id, live_id, user_id, type, created_at)
live_messages (id, live_id, user_id, text, created_at)

-- Categories
categories (id, name, slug, icon, color)

-- Engajamento
clips (id, live_id, title, url, likes_count, comments_count)
clip_likes (id, clip_id, user_id, created_at)
comments (id, clip_id, user_id, text, created_at)

-- Monetização
donations (id, from_user_id, to_user_id, amount, message, status, created_at)
```

### Índices de Performance
- `users.email` (único)
- `profiles.username` (único)
- `lives.status, created_at` (busca por lives ativas)
- `live_messages.live_id, created_at` (chat)
- `donations.to_user_id, created_at` (histórico)

## 🧪 Testes

### Estratégia
- **Unitários**: services e repositories (Jest)
- **Integração**: APIs completas (Supertest)
- **E2E**: fluxos críticos (Postman/Newman)
- **Load**: performance com Artillery

### Scripts
```bash
pnpm test
pnpm test:watch
pnpm test:integration
pnpm test:e2e
pnpm test:load
```

## 🧹 Qualidade & PRs

### Padrões
- ESLint + Prettier
- Conventional Commits
- Branches: `feat/`, `fix/`, `chore/`, `docs/`
- PRs com checklist: testes, documentação, performance

### Monitoramento
- Health checks: `/health`
- Métricas: `/metrics` (Prometheus)
- Logs estruturados (JSON)
- Alertas automáticos

## 🔮 Funcionalidades Futuras (pós-beta)

### Próximas funcionalidades
- **Clips automáticos**: processamento de highlights
- **VODs**: gravação e armazenamento de lives
- **Assinaturas**: sistema de subscribers
- **Notificações push**: Firebase/APNs
- **Analytics**: dashboard para streamers
- **Moderação**: IA para detecção de conteúdo
- **Escalabilidade**: microserviços, load balancing
- **Internacionalização**: múltiplos idiomas
- **API pública**: SDK para terceiros

## 🚀 Deploy & Infraestrutura

### Produção
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes ou AWS ECS
- **Banco**: PostgreSQL RDS + Redis ElastiCache
- **CDN**: CloudFlare ou AWS CloudFront
- **Monitoramento**: Prometheus + Grafana + ELK
- **CI/CD**: GitHub Actions ou GitLab CI

### Ambientes
- **Development**: local com Docker
- **Staging**: réplica da produção
- **Production**: alta disponibilidade

## 📊 Métricas & Observabilidade

### KPIs
- **Performance**: latência, throughput, error rate
- **Business**: DAU, MAU, lives ativas, doações
- **Technical**: CPU, memória, disco, rede

### Alertas
- **Críticos**: downtime, erros 5xx
- **Warning**: latência alta, uso de recursos
- **Info**: deploys, mudanças de configuração
