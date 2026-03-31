# TODO - Status do Backend Strivo

**Última atualização:** 04/12/2025

---

## ✅ O QUE FOI REALIZADO

### 🏗️ Estrutura do Projeto
- [ ] Projeto Node.js/TypeScript configurado
- [ ] Framework escolhido (Express.js ou Fastify)
- [ ] Estrutura de pastas criada
- [ ] TypeScript configurado
- [ ] Configuração de linting (ESLint)

---

## ❌ O QUE FALTA FAZER

### 🏗️ Setup Inicial

- [ ] Inicializar projeto Node.js/TypeScript
- [ ] Escolher e configurar framework (Express.js ou Fastify)
- [ ] Configurar estrutura de pastas (`src/controllers`, `src/services`, `src/repositories`, etc.)
- [ ] Configurar TypeScript
- [ ] Configurar ESLint + Prettier
- [ ] Configurar variáveis de ambiente (`.env`)
- [ ] Configurar scripts de build e dev
- [ ] Configurar Docker (opcional para desenvolvimento)

### 🗄️ Banco de Dados

#### PostgreSQL
- [ ] Instalar e configurar PostgreSQL
- [ ] Escolher e configurar ORM (Prisma ou TypeORM)
- [ ] Criar schema de banco de dados
- [ ] Criar migrations
- [ ] Configurar connection pooling
- [ ] Criar índices de performance
- [ ] Configurar seeds para dados iniciais

#### Redis
- [ ] Instalar e configurar Redis
- [ ] Configurar cliente Redis
- [ ] Implementar cache de sessões
- [ ] Implementar cache de dados frequentes
- [ ] Configurar Redis Cluster (produção)

#### Schema do Banco
- [ ] Tabela `users` (id, email, name, avatar, bio, created_at)
- [ ] Tabela `sessions` (id, user_id, refresh_token, expires_at)
- [ ] Tabela `profiles` (id, user_id, username, followers_count, following_count)
- [ ] Tabela `follows` (follower_id, following_id, created_at)
- [ ] Tabela `lives` (id, user_id, title, category, status, rtmp_url, hls_url, viewers_count, created_at)
- [ ] Tabela `live_reactions` (id, live_id, user_id, type, created_at)
- [ ] Tabela `live_messages` (id, live_id, user_id, text, created_at)
- [ ] Tabela `categories` (id, name, slug, icon, color)
- [ ] Tabela `clips` (id, live_id, title, url, likes_count, comments_count)
- [ ] Tabela `clip_likes` (id, clip_id, user_id, created_at)
- [ ] Tabela `comments` (id, clip_id, user_id, text, created_at)
- [ ] Tabela `donations` (id, from_user_id, to_user_id, amount, message, status, created_at)

### 🔐 Autenticação & Perfis

#### Autenticação
- [ ] Implementar login por e-mail (`POST /auth/login`)
- [ ] Implementar cadastro (`POST /auth/signup`)
- [ ] Implementar OAuth Google (`POST /auth/provider/google`)
- [ ] Implementar refresh token (`POST /auth/refresh`)
- [ ] Implementar logout (`POST /auth/logout`)
- [ ] Implementar endpoint de sessão atual (`GET /auth/me`)
- [ ] Sistema de JWT (access token 15min + refresh token 7 dias)
- [ ] Hash de senhas (bcrypt)
- [ ] Validação de dados (Joi/Zod)
- [ ] Middleware de autenticação
- [ ] Middleware de autorização

#### Perfis
- [ ] Endpoint de perfil (`GET /profiles/:username`)
- [ ] Endpoint de atualização de perfil (`PUT /profiles/:username`)
- [ ] Endpoint de seguir (`POST /profiles/:username/follow`)
- [ ] Endpoint de deixar de seguir (`DELETE /profiles/:username/follow`)
- [ ] Endpoint de seguidores (`GET /profiles/:username/followers`)
- [ ] Endpoint de seguindo (`GET /profiles/:username/following`)
- [ ] Upload de avatar (CDN)
- [ ] Upload de banner (CDN)
- [ ] Validação de username único
- [ ] Contadores de seguidores/seguindo

### 📺 Lives (Streaming)

#### APIs REST
- [ ] Listar lives (`GET /lives?status=live&category=...`)
- [ ] Obter live específica (`GET /lives/:id`)
- [ ] Criar live (`POST /lives`)
- [ ] Atualizar live (`PUT /lives/:id`)
- [ ] Encerrar live (`DELETE /lives/:id`)
- [ ] Criar reação (`POST /lives/:id/reactions`)
- [ ] Obter visualizações (`GET /lives/:id/viewers`)
- [ ] Obter mensagens do chat (`GET /lives/:id/chat`)

#### Categorias
- [ ] Listar categorias (`GET /categories`)
- [ ] Criar categoria (`POST /categories`)
- [ ] Atualizar categoria (`PUT /categories/:id`)
- [ ] Deletar categoria (`DELETE /categories/:id`)
- [ ] Categorias populares (`GET /categories/popular`)

#### WebSockets
- [ ] Configurar Socket.IO ou WebSocket nativo
- [ ] Autenticação via token no WebSocket
- [ ] Evento de conexão (`connect`)
- [ ] Evento de entrar na sala (`join_live_room`)
- [ ] Evento de enviar mensagem (`message:send`)
- [ ] Evento de nova mensagem (`message:new`)
- [ ] Evento de visualizações (`live:viewers`)
- [ ] Evento de reação (`live:reaction`)
- [ ] Rate limiting para mensagens
- [ ] Moderação básica de chat
- [ ] Broadcasting de eventos

#### Streaming
- [ ] Configurar servidor de streaming (WebRTC SFU - mediasoup ou Janus)
- [ ] Configurar RTMP ingest (nginx-rtmp ou SRS)
- [ ] Configurar HLS output
- [ ] Gerar URLs de RTMP para publicação
- [ ] Gerar URLs de HLS para playback
- [ ] Integração com CDN
- [ ] Contador de visualizações em tempo real

### 🧭 Exploração

- [ ] Endpoint de home/featured (`GET /home/featured`)
- [ ] Endpoint de busca (`GET /search?q=...&type=streamer|game|category`)
- [ ] Endpoint de top streamers (`GET /top-streamers?period=month`)
- [ ] Algoritmo de recomendação
- [ ] Cache de resultados (Redis)
- [ ] Paginação de resultados
- [ ] Filtros avançados

### 💬 Engajamento

- [ ] Curtir clipe (`POST /clips/:id/like`)
- [ ] Comentar em clipe (`POST /clips/:id/comment`)
- [ ] Listar comentários (`GET /clips/:id/comments`)
- [ ] Endpoint de ranking (`GET /ranking?period=month`)
- [ ] Endpoint de streamers do mês (`GET /streamers/monthly-highlight`)
- [ ] Algoritmo de popularidade
- [ ] Sistema de curtidas
- [ ] Sistema de comentários

### 💸 Monetização

- [ ] Criar doação (`POST /donations`)
- [ ] Histórico de doações enviadas (`GET /donations/history?userId=...`)
- [ ] Histórico de doações recebidas (`GET /donations/received?userId=...`)
- [ ] Processar pagamento (`POST /payments/process`)
- [ ] Integração com gateway de pagamento (Stripe, PagSeguro)
- [ ] Webhook de pagamento
- [ ] Validação de valores (R$5, R$10, R$25, R$50)
- [ ] Sistema de transações
- [ ] Histórico público de doações

### 🧩 Infraestrutura

#### Servidor
- [ ] Configurar servidor HTTP
- [ ] Configurar CORS
- [ ] Configurar rate limiting
- [ ] Configurar compression
- [ ] Configurar helmet (segurança)
- [ ] Health check endpoint (`/health`)
- [ ] Métricas endpoint (`/metrics` - Prometheus)

#### Logs & Monitoramento
- [ ] Sistema de logs estruturados (JSON)
- [ ] Integração com ELK Stack (opcional)
- [ ] Configurar Prometheus
- [ ] Configurar Grafana
- [ ] Alertas automáticos
- [ ] Monitoramento de performance

#### CDN & Storage
- [ ] Configurar CDN (CloudFlare ou AWS CloudFront)
- [ ] Upload de imagens para CDN
- [ ] Upload de vídeos para CDN
- [ ] Gerenciamento de assets

#### Jobs & Queue
- [ ] Configurar Bull/BullMQ
- [ ] Jobs assíncronos
- [ ] Processamento de mídia
- [ ] Notificações em background

### 🧪 Testes

#### Setup
- [ ] Configurar Jest
- [ ] Configurar Supertest
- [ ] Configurar ambiente de testes
- [ ] Configurar banco de testes

#### Testes Unitários
- [ ] Testes de services
- [ ] Testes de repositories
- [ ] Testes de utils
- [ ] Cobertura mínima de 70%

#### Testes de Integração
- [ ] Testes de APIs REST
- [ ] Testes de autenticação
- [ ] Testes de WebSockets
- [ ] Testes de banco de dados

#### Testes E2E
- [ ] Fluxo completo de autenticação
- [ ] Fluxo completo de live
- [ ] Fluxo completo de doação
- [ ] Testes com Postman/Newman

#### Testes de Carga
- [ ] Configurar Artillery
- [ ] Testes de carga nas APIs críticas
- [ ] Testes de stress
- [ ] Análise de performance

### 🧹 Qualidade & Padrões

- [ ] Prettier configurado e funcionando
- [ ] ESLint configurado
- [ ] Husky + lint-staged configurado
- [ ] Pre-commit hooks
- [ ] Conventional Commits
- [ ] Documentação de APIs (Swagger/OpenAPI)
- [ ] Documentação de código (JSDoc)

### 🚀 Deploy & Infraestrutura

#### Docker
- [ ] Dockerfile criado
- [ ] Docker Compose para desenvolvimento
- [ ] Multi-stage build

#### CI/CD
- [ ] Pipeline de CI (GitHub Actions ou GitLab CI)
- [ ] Testes automáticos no CI
- [ ] Build automático
- [ ] Deploy automático (staging/production)

#### Produção
- [ ] Configurar Kubernetes ou AWS ECS
- [ ] Configurar PostgreSQL RDS
- [ ] Configurar Redis ElastiCache
- [ ] Configurar CDN
- [ ] Configurar monitoramento em produção
- [ ] Configurar backups automáticos
- [ ] Configurar SSL/TLS

### 📱 Funcionalidades Futuras (pós-beta)

- [ ] Clips automáticos (processamento de highlights)
- [ ] VODs (gravação e armazenamento de lives)
- [ ] Sistema de assinaturas (subscribers)
- [ ] Notificações push (Firebase/APNs)
- [ ] Dashboard de analytics para streamers
- [ ] Moderação com IA
- [ ] Microserviços
- [ ] Load balancing
- [ ] Internacionalização
- [ ] API pública (SDK)

---

## 🎯 Prioridades (MVP/Beta)

### Alta Prioridade
1. **Setup básico** - Projeto configurado e rodando
2. **Banco de dados** - Schema criado e migrations
3. **Autenticação** - Login/cadastro funcionando
4. **APIs básicas** - Perfis e lives básicas

### Média Prioridade
5. WebSockets para chat
6. Sistema de streaming
7. Sistema de doações
8. Busca e exploração

### Baixa Prioridade
9. Clipes automáticos
10. VODs
11. Analytics avançado
12. Microserviços

---

## 📊 Progresso Geral

**Setup:** ~0% completo
- Nenhuma estrutura criada
- Projeto não inicializado

**Banco de Dados:** ~0% completo
- Schema não criado
- Migrations não implementadas

**APIs:** ~0% completo
- Nenhuma API implementada
- Rotas não definidas

**Autenticação:** ~0% completo
- Sistema de auth não implementado
- JWT não configurado

**Streaming:** ~0% completo
- Servidor de streaming não configurado
- WebSockets não implementados

**Testes:** ~0% completo
- Nenhum teste implementado
- Ambiente de testes não configurado

**Infraestrutura:** ~0% completo
- Docker não configurado
- CI/CD não configurado
- Deploy não configurado

---

## 📝 Notas

- O backend precisa ser desenvolvido do zero
- Priorizar mobile-first (APIs otimizadas para mobile)
- Focar em performance e escalabilidade
- Segurança é crítica (validação, sanitização, rate limiting)
- Documentação de APIs é essencial

---

**Próximos Passos Sugeridos:**
1. Inicializar projeto Node.js/TypeScript
2. Configurar estrutura de pastas
3. Configurar banco de dados (PostgreSQL + Prisma/TypeORM)
4. Implementar autenticação básica
5. Criar APIs essenciais (perfis, lives)
6. Configurar WebSockets
7. Implementar sistema de streaming básico
8. Adicionar testes básicos

