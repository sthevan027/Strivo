# 📋 TODO - Backend (strivo-server)

**Última atualização:** 13/12/2025  
**Status geral:** 🟡 Em desenvolvimento ativo

---

## 🔴 PRIORIDADE ALTA

### 🔐 Autenticação e Autorização

- [ ] Implementar módulo de autenticação
  - [ ] Criar `AuthModule` (`src/auth/auth.module.ts`)
  - [ ] Criar `AuthService` (`src/auth/auth.service.ts`)
  - [ ] Criar `AuthController` (`src/auth/auth.controller.ts`)
  - [ ] Implementar estratégia JWT (`src/auth/strategies/jwt.strategy.ts`)
  - [ ] Implementar estratégia Local (`src/auth/strategies/local.strategy.ts`)

- [ ] Endpoints de autenticação
  - [ ] `POST /auth/register` - Registro de usuário
  - [ ] `POST /auth/login` - Login
  - [ ] `POST /auth/refresh` - Refresh token
  - [ ] `POST /auth/logout` - Logout
  - [ ] `POST /auth/forgot-password` - Recuperação de senha
  - [ ] `POST /auth/reset-password` - Redefinição de senha
  - [ ] `POST /auth/verify-email` - Verificação de email

- [ ] Guards e decorators
  - [ ] Criar `JwtAuthGuard` (`src/auth/guards/jwt-auth.guard.ts`)
  - [ ] Criar `RolesGuard` (`src/auth/guards/roles.guard.ts`)
  - [ ] Criar decorator `@Roles()` (`src/auth/decorators/roles.decorator.ts`)
  - [ ] Criar decorator `@CurrentUser()` (`src/auth/decorators/current-user.decorator.ts`)
  - [ ] Criar decorator `@Public()` (`src/auth/decorators/public.decorator.ts`)

- [ ] DTOs de autenticação
  - [ ] `RegisterDto` (`src/auth/dto/register.dto.ts`)
  - [ ] `LoginDto` (`src/auth/dto/login.dto.ts`)
  - [ ] `RefreshTokenDto` (`src/auth/dto/refresh-token.dto.ts`)
  - [ ] `ForgotPasswordDto` (`src/auth/dto/forgot-password.dto.ts`)
  - [ ] `ResetPasswordDto` (`src/auth/dto/reset-password.dto.ts`)

- [ ] Segurança
  - [ ] Hash de senhas com bcrypt
  - [ ] Validação de tokens JWT
  - [ ] Expiração de tokens
  - [ ] Rate limiting para endpoints de autenticação
  - [ ] Proteção contra brute force

---

### 🗄️ Banco de Dados

- [ ] Configurar Prisma
  - [ ] Instalar `@prisma/client`
  - [ ] Gerar Prisma Client
  - [ ] Criar módulo Prisma (`src/database/prisma/prisma.service.ts`)
  - [ ] Criar módulo Database (`src/database/database.module.ts`)

- [ ] Schemas do Prisma
  - [ ] Modelo `User` (já existe, revisar e completar)
  - [ ] Modelo `Post` - Posts do feed
  - [ ] Modelo `Klip` - Vídeos curtos
  - [ ] Modelo `Live` - Transmissões ao vivo
  - [ ] Modelo `Comment` - Comentários em posts/klips
  - [ ] Modelo `Like` - Curtidas
  - [ ] Modelo `Follow` - Seguir usuários
  - [ ] Modelo `Notification` - Notificações
  - [ ] Modelo `Message` - Mensagens de chat
  - [ ] Modelo `Conversation` - Conversas
  - [ ] Modelo `Story` - Stories
  - [ ] Modelo `Category` - Categorias de lives
  - [ ] Relacionamentos entre modelos

- [ ] Migrations
  - [ ] Criar migration inicial
  - [ ] Configurar migrations no Prisma
  - [ ] Documentar processo de migrations

- [ ] Seeds
  - [ ] Criar arquivo de seed (`prisma/seed.ts`)
  - [ ] Dados iniciais para desenvolvimento
  - [ ] Usuários de teste

---

### 👤 Módulo de Usuários

- [ ] Criar módulo de usuários
  - [ ] Criar `UsersModule` (`src/users/users.module.ts`)
  - [ ] Criar `UsersService` (`src/users/users.service.ts`)
  - [ ] Criar `UsersController` (`src/users/users.controller.ts`)

- [ ] Endpoints de usuários
  - [ ] `GET /users/me` - Obter perfil do usuário logado
  - [ ] `GET /users/:id` - Obter perfil de outro usuário
  - [ ] `PUT /users/me` - Atualizar perfil
  - [ ] `PATCH /users/me/avatar` - Atualizar avatar
  - [ ] `GET /users/:id/posts` - Posts do usuário
  - [ ] `GET /users/:id/klips` - Klips do usuário
  - [ ] `GET /users/:id/followers` - Seguidores
  - [ ] `GET /users/:id/following` - Seguindo
  - [ ] `POST /users/:id/follow` - Seguir usuário
  - [ ] `DELETE /users/:id/follow` - Deixar de seguir
  - [ ] `GET /users/search` - Buscar usuários

- [ ] DTOs de usuários
  - [ ] `CreateUserDto`
  - [ ] `UpdateUserDto`
  - [ ] `UserResponseDto`
  - [ ] `UpdateAvatarDto`

- [ ] Validações
  - [ ] Validação de email único
  - [ ] Validação de username único
  - [ ] Validação de dados de perfil

---

### 📝 Módulo de Posts

- [ ] Criar módulo de posts
  - [ ] Criar `PostsModule` (`src/posts/posts.module.ts`)
  - [ ] Criar `PostsService` (`src/posts/posts.service.ts`)
  - [ ] Criar `PostsController` (`src/posts/posts.controller.ts`)

- [ ] Endpoints de posts
  - [ ] `GET /posts` - Listar posts (feed)
  - [ ] `GET /posts/:id` - Obter post específico
  - [ ] `POST /posts` - Criar post
  - [ ] `PUT /posts/:id` - Atualizar post
  - [ ] `DELETE /posts/:id` - Deletar post
  - [ ] `POST /posts/:id/like` - Curtir post
  - [ ] `DELETE /posts/:id/like` - Descurtir post
  - [ ] `POST /posts/:id/share` - Compartilhar post
  - [ ] `GET /posts/:id/comments` - Comentários do post

- [ ] DTOs de posts
  - [ ] `CreatePostDto`
  - [ ] `UpdatePostDto`
  - [ ] `PostResponseDto`
  - [ ] `PostQueryDto` (filtros e paginação)

- [ ] Upload de mídia
  - [ ] Configurar upload de imagens
  - [ ] Validação de tipos de arquivo
  - [ ] Validação de tamanho
  - [ ] Armazenamento (local ou cloud)

---

### 🎬 Módulo de Klips

- [ ] Criar módulo de klips
  - [ ] Criar `KlipsModule` (`src/klips/klips.module.ts`)
  - [ ] Criar `KlipsService` (`src/klips/klips.service.ts`)
  - [ ] Criar `KlipsController` (`src/klips/klips.controller.ts`)

- [ ] Endpoints de klips
  - [ ] `GET /klips` - Listar klips
  - [ ] `GET /klips/:id` - Obter klip específico
  - [ ] `POST /klips` - Criar klip
  - [ ] `PUT /klips/:id` - Atualizar klip
  - [ ] `DELETE /klips/:id` - Deletar klip
  - [ ] `POST /klips/:id/like` - Curtir klip
  - [ ] `POST /klips/:id/view` - Registrar visualização
  - [ ] `GET /klips/:id/comments` - Comentários do klip

- [ ] DTOs de klips
  - [ ] `CreateKlipDto`
  - [ ] `UpdateKlipDto`
  - [ ] `KlipResponseDto`

- [ ] Upload de vídeo
  - [ ] Configurar upload de vídeos
  - [ ] Validação de duração (15s - 90s)
  - [ ] Validação de formato
  - [ ] Processamento de vídeo (thumbnail, compressão)

---

### 🎥 Módulo de Lives

- [ ] Criar módulo de lives
  - [ ] Criar `LivesModule` (`src/lives/lives.module.ts`)
  - [ ] Criar `LivesService` (`src/lives/lives.service.ts`)
  - [ ] Criar `LivesController` (`src/lives/lives.controller.ts`)

- [ ] Endpoints de lives
  - [ ] `GET /lives` - Listar lives ativas
  - [ ] `GET /lives/:id` - Obter live específica
  - [ ] `POST /lives` - Iniciar live
  - [ ] `PATCH /lives/:id` - Atualizar live (título, categoria)
  - [ ] `DELETE /lives/:id` - Finalizar live
  - [ ] `GET /lives/categories` - Listar categorias
  - [ ] `GET /lives/:id/viewers` - Contador de viewers
  - [ ] `POST /lives/:id/join` - Entrar na live
  - [ ] `POST /lives/:id/leave` - Sair da live

- [ ] DTOs de lives
  - [ ] `CreateLiveDto`
  - [ ] `UpdateLiveDto`
  - [ ] `LiveResponseDto`
  - [ ] `StartLiveDto`

- [ ] Integração com streaming
  - [ ] Configurar serviço de streaming (ex: RTMP, WebRTC)
  - [ ] Gerenciar URLs de streaming
  - [ ] Status de live (ativa, finalizada, erro)

---

### 💬 Módulo de Chat e Mensagens

- [ ] Criar módulo de chat
  - [ ] Criar `ChatModule` (`src/chat/chat.module.ts`)
  - [ ] Criar `ChatService` (`src/chat/chat.service.ts`)
  - [ ] Criar `ChatController` (`src/chat/chat.controller.ts`)

- [ ] Endpoints de chat
  - [ ] `GET /chat/conversations` - Listar conversas
  - [ ] `GET /chat/conversations/:id` - Obter conversa
  - [ ] `POST /chat/conversations` - Criar conversa
  - [ ] `GET /chat/conversations/:id/messages` - Mensagens da conversa
  - [ ] `POST /chat/messages` - Enviar mensagem
  - [ ] `PUT /chat/messages/:id` - Atualizar mensagem
  - [ ] `DELETE /chat/messages/:id` - Deletar mensagem
  - [ ] `POST /chat/messages/:id/read` - Marcar como lida

- [ ] WebSocket para chat em tempo real
  - [ ] Instalar `@nestjs/websockets` e `socket.io`
  - [ ] Criar `ChatGateway` (`src/chat/chat.gateway.ts`)
  - [ ] Eventos: `message`, `typing`, `read`, `online`, `offline`
  - [ ] Rooms para conversas
  - [ ] Autenticação via WebSocket

- [ ] DTOs de chat
  - [ ] `CreateConversationDto`
  - [ ] `SendMessageDto`
  - [ ] `MessageResponseDto`
  - [ ] `ConversationResponseDto`

---

### 🔔 Módulo de Notificações

- [ ] Criar módulo de notificações
  - [ ] Criar `NotificationsModule` (`src/notifications/notifications.module.ts`)
  - [ ] Criar `NotificationsService` (`src/notifications/notifications.service.ts`)
  - [ ] Criar `NotificationsController` (`src/notifications/notifications.controller.ts`)

- [ ] Endpoints de notificações
  - [ ] `GET /notifications` - Listar notificações
  - [ ] `GET /notifications/unread` - Contador de não lidas
  - [ ] `PATCH /notifications/:id/read` - Marcar como lida
  - [ ] `PATCH /notifications/read-all` - Marcar todas como lidas
  - [ ] `DELETE /notifications/:id` - Deletar notificação

- [ ] Tipos de notificações
  - [ ] Seguir
  - [ ] Curtida em post/klip
  - [ ] Comentário
  - [ ] Menção
  - [ ] Nova live de usuário seguido

- [ ] Push notifications
  - [ ] Integrar com serviço de push (ex: Firebase)
  - [ ] Enviar notificações em background
  - [ ] Gerenciar tokens de dispositivos

---

### 💬 Módulo de Comentários

- [ ] Criar módulo de comentários
  - [ ] Criar `CommentsModule` (`src/comments/comments.module.ts`)
  - [ ] Criar `CommentsService` (`src/comments/comments.service.ts`)
  - [ ] Criar `CommentsController` (`src/comments/comments.controller.ts`)

- [ ] Endpoints de comentários
  - [ ] `GET /comments/:postId` - Comentários de um post/klip
  - [ ] `POST /comments` - Criar comentário
  - [ ] `PUT /comments/:id` - Atualizar comentário
  - [ ] `DELETE /comments/:id` - Deletar comentário
  - [ ] `POST /comments/:id/like` - Curtir comentário
  - [ ] `POST /comments/:id/dislike` - Descurtir comentário
  - [ ] `POST /comments/:id/reply` - Responder comentário

- [ ] DTOs de comentários
  - [ ] `CreateCommentDto`
  - [ ] `UpdateCommentDto`
  - [ ] `CommentResponseDto`

---

## 🟡 PRIORIDADE MÉDIA

### 🔍 Busca e Filtros

- [ ] Módulo de busca
  - [ ] Criar `SearchModule` (`src/search/search.module.ts`)
  - [ ] Criar `SearchService` (`src/search/search.service.ts`)
  - [ ] Criar `SearchController` (`src/search/search.controller.ts`)

- [ ] Endpoints de busca
  - [ ] `GET /search/users` - Buscar usuários
  - [ ] `GET /search/posts` - Buscar posts
  - [ ] `GET /search/klips` - Buscar klips
  - [ ] `GET /search/hashtags` - Buscar hashtags
  - [ ] `GET /search` - Busca geral

- [ ] Funcionalidades
  - [ ] Busca por texto
  - [ ] Filtros avançados
  - [ ] Ordenação (relevância, data, popularidade)
  - [ ] Paginação

---

### 📊 Analytics e Métricas

- [ ] Módulo de analytics
  - [ ] Criar `AnalyticsModule` (`src/analytics/analytics.module.ts`)
  - [ ] Criar `AnalyticsService` (`src/analytics/analytics.service.ts`)

- [ ] Endpoints de métricas
  - [ ] `GET /analytics/posts/:id` - Métricas de um post
  - [ ] `GET /analytics/klips/:id` - Métricas de um klip
  - [ ] `GET /analytics/lives/:id` - Métricas de uma live
  - [ ] `GET /analytics/user` - Métricas do usuário

- [ ] Métricas a rastrear
  - [ ] Visualizações
  - [ ] Curtidas
  - [ ] Comentários
  - [ ] Compartilhamentos
  - [ ] Taxa de engajamento
  - [ ] Crescimento de seguidores

---

### 📸 Stories

- [ ] Módulo de stories
  - [ ] Criar `StoriesModule` (`src/stories/stories.module.ts`)
  - [ ] Criar `StoriesService` (`src/stories/stories.service.ts`)
  - [ ] Criar `StoriesController` (`src/stories/stories.controller.ts`)

- [ ] Endpoints de stories
  - [ ] `GET /stories` - Stories de usuários seguidos
  - [ ] `GET /stories/:userId` - Stories de um usuário
  - [ ] `POST /stories` - Criar story
  - [ ] `DELETE /stories/:id` - Deletar story
  - [ ] `POST /stories/:id/view` - Registrar visualização
  - [ ] `POST /stories/:id/react` - Reagir ao story

---

### 🔒 Segurança e Validação

- [ ] Validação de dados
  - [ ] Instalar `class-validator` e `class-transformer`
  - [ ] Validar todos os DTOs
  - [ ] Mensagens de erro personalizadas

- [ ] Rate limiting
  - [ ] Instalar `@nestjs/throttler`
  - [ ] Configurar rate limiting global
  - [ ] Rate limiting específico por endpoint

- [ ] CORS
  - [ ] Configurar CORS adequadamente
  - [ ] Whitelist de origens permitidas

- [ ] Helmet
  - [ ] Instalar `helmet`
  - [ ] Configurar headers de segurança

- [ ] Sanitização
  - [ ] Sanitizar inputs de usuário
  - [ ] Proteção contra XSS
  - [ ] Proteção contra SQL injection (Prisma já protege)

---

### 📝 Documentação da API

- [ ] Swagger/OpenAPI
  - [ ] Instalar `@nestjs/swagger`
  - [ ] Configurar Swagger no `main.ts`
  - [ ] Adicionar decorators `@ApiTags`, `@ApiOperation`, etc.
  - [ ] Documentar todos os endpoints
  - [ ] Documentar DTOs e schemas
  - [ ] Adicionar exemplos de requisições/respostas

- [ ] README
  - [ ] Atualizar README.md com instruções completas
  - [ ] Documentar variáveis de ambiente
  - [ ] Documentar estrutura do projeto
  - [ ] Adicionar exemplos de uso da API

---

## 🟢 PRIORIDADE BAIXA

### 🧪 Testes

- [ ] Testes unitários
  - [ ] Testes de serviços principais
  - [ ] Testes de guards
  - [ ] Testes de decorators
  - [ ] Cobertura mínima de 70%

- [ ] Testes de integração
  - [ ] Testes de endpoints principais
  - [ ] Testes de fluxos completos
  - [ ] Testes de autenticação
  - [ ] Testes de WebSocket

- [ ] Testes E2E
  - [ ] Configurar ambiente de testes E2E
  - [ ] Testes de fluxos críticos
  - [ ] Testes de performance

---

### 🚀 Performance e Otimização

- [ ] Cache
  - [ ] Instalar `@nestjs/cache-manager`
  - [ ] Implementar cache em endpoints pesados
  - [ ] Cache de queries frequentes

- [ ] Paginação
  - [ ] Implementar paginação em todos os endpoints de listagem
  - [ ] Cursor-based pagination para grandes volumes

- [ ] Indexação
  - [ ] Adicionar índices no Prisma schema
  - [ ] Otimizar queries lentas

- [ ] Compressão
  - [ ] Instalar `compression`
  - [ ] Habilitar compressão de respostas

---

### 📊 Logging e Monitoramento

- [ ] Logging
  - [ ] Configurar logger estruturado (ex: Winston, Pino)
  - [ ] Logs de requests/responses
  - [ ] Logs de erros
  - [ ] Níveis de log (debug, info, warn, error)

- [ ] Monitoramento
  - [ ] Integrar com serviço de monitoramento (ex: Sentry)
  - [ ] Health checks (`GET /health`)
  - [ ] Métricas de performance

---

### 🔧 Melhorias Técnicas

- [ ] Configuração
  - [ ] ConfigModule do NestJS
  - [ ] Validação de variáveis de ambiente
  - [ ] Configurações por ambiente (dev, prod, test)

- [ ] Tratamento de erros
  - [ ] Exception filters globais
  - [ ] Respostas de erro padronizadas
  - [ ] Logging de erros

- [ ] Interceptors
  - [ ] Logging interceptor
  - [ ] Transform interceptor
  - [ ] Timeout interceptor

- [ ] Pipes
  - [ ] Validation pipe global
  - [ ] Parse pipes para tipos

---

### 🐳 Docker e Deploy

- [ ] Docker
  - [ ] Dockerfile otimizado
  - [ ] Docker Compose para desenvolvimento
  - [ ] Docker Compose para produção
  - [ ] Multi-stage build

- [ ] CI/CD
  - [ ] Configurar pipeline CI/CD
  - [ ] Testes automáticos
  - [ ] Deploy automático

- [ ] Deploy
  - [ ] Configurar ambiente de produção
  - [ ] Variáveis de ambiente de produção
  - [ ] Backup de banco de dados
  - [ ] Monitoramento em produção

---

## ✅ CONCLUÍDO

### Semana 07/12 - 13/12/2025
- [x] Estrutura base do projeto NestJS *(13/12/2025)*
- [x] Configuração do TypeScript *(13/12/2025)*
- [x] Configuração do ESLint e Prettier *(13/12/2025)*
- [x] Configuração do Docker Compose *(13/12/2025)*
- [x] Arquivo `env.example` criado *(13/12/2025)*
- [x] Estrutura de pastas organizada *(13/12/2025)*
- [x] Configuração do Prisma *(13/12/2025)*
  - Schema básico com modelo User
  - Configuração de PostgreSQL
- [x] README.md atualizado *(13/12/2025)*
- [x] Estrutura de testes criada *(13/12/2025)*
  - Jest configurado
  - Testes E2E configurados

---

## 📦 DEPENDÊNCIAS PENDENTES

### Essenciais
- [ ] `@nestjs/jwt` - JWT para autenticação
- [ ] `@nestjs/passport` - Passport para estratégias de auth
- [ ] `passport` e `passport-jwt` - Estratégias de autenticação
- [ ] `passport-local` - Estratégia local
- [ ] `bcrypt` - Hash de senhas
- [ ] `@prisma/client` - Cliente Prisma (gerar após schema)
- [ ] `class-validator` - Validação de DTOs
- [ ] `class-transformer` - Transformação de objetos

### Importantes
- [ ] `@nestjs/websockets` - WebSockets
- [ ] `socket.io` - Socket.IO para chat em tempo real
- [ ] `@nestjs/throttler` - Rate limiting
- [ ] `@nestjs/swagger` - Documentação Swagger
- [ ] `helmet` - Segurança de headers
- [ ] `compression` - Compressão de respostas
- [ ] `@nestjs/cache-manager` - Cache
- [ ] `@nestjs/config` - Configuração

### Opcionais
- [ ] `winston` ou `pino` - Logging estruturado
- [ ] `@sentry/node` - Monitoramento de erros
- [ ] `multer` - Upload de arquivos (se não usar outro)
- [ ] `sharp` - Processamento de imagens

---

## 📝 NOTAS

### Próximas Sprints Sugeridas

**Sprint 1 (Alta Prioridade):**
- Autenticação completa (JWT, guards, decorators)
- Configuração completa do Prisma (schemas, migrations)
- Módulo de usuários básico

**Sprint 2 (Alta Prioridade):**
- Módulos de Posts e Klips
- Upload de mídia
- Módulo de comentários

**Sprint 3 (Média Prioridade):**
- Módulo de Lives
- WebSocket para chat
- Módulo de notificações

**Sprint 4 (Média/Baixa Prioridade):**
- Busca e filtros
- Analytics
- Documentação Swagger
- Testes

---

### Estrutura de Módulos Sugerida

```
src/
├── auth/           # Autenticação e autorização
├── users/          # Usuários
├── posts/          # Posts do feed
├── klips/          # Vídeos curtos
├── lives/          # Lives/streaming
├── comments/       # Comentários
├── chat/           # Chat e mensagens
├── notifications/  # Notificações
├── stories/        # Stories
├── search/         # Busca
├── analytics/      # Analytics e métricas
├── database/       # Prisma e configuração de DB
├── common/         # Guards, decorators, filters, interceptors
└── config/         # Configurações
```

---

**Mantido por:** Equipe de Desenvolvimento Strivo  
**Atualizar:** Semanalmente ou conforme progresso

