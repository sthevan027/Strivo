# Strivo — Plataforma de Streaming

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_54-000020?style=flat&logo=expo&logoColor=fff)](https://expo.dev/)
[![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=flat&logo=nestjs&logoColor=fff)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=fff)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=fff)](https://supabase.com/)

> Plataforma mobile de streaming com integração social, criação de conteúdo e ferramentas para criadores e espectadores.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React Native 0.81 + Expo 54 + Expo Router |
| **Estilização** | NativeWind 4 (Tailwind CSS) |
| **Backend** | NestJS 11 + TypeScript |
| **ORM** | Prisma 7 + PostgreSQL |
| **Storage** | Supabase Storage (upload de mídia) |
| **Auth** | JWT via `@nestjs/jwt` + bcryptjs |
| **Ícones** | lucide-react-native + @expo/vector-icons |

---

## Como rodar

### Backend

```bash
cd strivo-server
cp env.example .env        # preencha DATABASE_URL, JWT_SECRET, SUPABASE_*
pnpm install
pnpm start:dev             # http://localhost:3000
```

### Frontend

```bash
# na raiz do projeto
npm install
npx expo start             # abre no Expo Go (iOS/Android) ou emulador
```

> Configure `EXPO_PUBLIC_API_URL=http://localhost:3000` no `.env` da raiz.

---

## Estado do MVP

### ✅ Implementado

| Feature | Frontend | Backend |
|---------|----------|---------|
| **Autenticação** | `app/login.tsx`, `app/register.tsx` | `POST /auth/register`, `POST /auth/login` |
| **Perfil de usuário** | `app/screens/profile.tsx`, `app/screens/edit-profile.tsx` | `GET /users/me`, `PATCH /users/me` |
| **Feed de posts** | `app/(tabs)/home.tsx` | `GET /posts/feed`, `GET /posts/:id` |
| **Criação de post** | `app/screens/create-post.tsx` | `POST /posts/uploads`, `POST /posts` |
| **Categorias/Streams** | `app/screens/streams.tsx` (mock) | — |
| **Sistema de apoio** | `app/screens/suport-creator.tsx` (UI) | — |
| **Configurações** | `app/screens/configuration.tsx` | — |
| **Reels** | `app/screens/reels.tsx` | — |
| **Chat** | `app/screens/chat/` | — |

### ⚠️ Parcial

| Feature | Problema |
|---------|---------|
| **Busca** | `app/screens/searchScreen.tsx` usa Supabase diretamente — não migrada para o NestJS |
| **Home** | Feed ok, mas faltam seções "Top Streamers do Mês" e "Lives em Destaque" |
| **Categorias** | Dados estáticos (mock) — sem backend |

### ❌ Pendente

| Feature | Situação |
|---------|---------|
| **Ranking** | Nenhuma tela ou endpoint criados |
| **Doações (API)** | UI pronta, sem integração real de pagamento |
| **Lives em tempo real** | UI de player existe, sem streaming backend (WebRTC/RTMP) |

---

## Estrutura do Projeto

```
Strivo/
├── app/                          # Frontend (Expo Router)
│   ├── (tabs)/                   # Abas principais
│   │   ├── home.tsx              # Feed de posts (NestJS)
│   │   ├── screens/              # Telas nas abas
│   │   │   ├── searchScreen.tsx  # Busca (Supabase — pendente migração)
│   │   │   ├── streams.tsx       # Categorias e top streamers (mock)
│   │   │   ├── reels.tsx         # Reels
│   │   │   └── profile.tsx       # Perfil (NestJS)
│   ├── auth/callback.tsx         # Callback OAuth
│   ├── login.tsx                 # Login (NestJS)
│   ├── register.tsx              # Cadastro (NestJS)
│   └── screens/                  # Telas secundárias
│       ├── configuration.tsx     # Configurações
│       ├── edit-profile.tsx      # Editar perfil
│       ├── suport-creator.tsx    # Apoiar streamer (UI)
│       ├── live.tsx              # Player de live (UI)
│       ├── notifications.tsx     # Notificações
│       ├── chat/                 # Chat (DMs e grupos)
│       ├── configs/              # Sub-telas de configurações
│       └── profile/              # Métricas e outros perfis
│
├── src/
│   ├── components/               # Componentes reutilizáveis
│   ├── contexts/AuthContext.tsx  # Estado global de autenticação
│   ├── lib/api.ts                # Cliente HTTP (JWT automático)
│   └── services/follow.ts        # Follow/unfollow
│
├── assets/images/                # Imagens e ícones
│
└── strivo-server/                # Backend (NestJS)
    └── src/
        ├── auth/                 # JWT + bcrypt (register, login)
        ├── users/                # Perfil (GET/PATCH /users/me)
        ├── posts/                # Feed, criação e upload
        ├── supabase/             # Storage de mídia
        └── database/             # Prisma schema + migrations
```

---

## API — Endpoints Disponíveis

```
POST  /auth/register          Cadastro (name, email, password)
POST  /auth/login             Login → { access_token }

GET   /users/me        🔒    Dados do usuário logado
PATCH /users/me        🔒    Atualizar perfil

POST  /posts/uploads   🔒    Gerar URL de upload (Supabase Storage)
POST  /posts           🔒    Criar post com mídias vinculadas
GET   /posts/feed      🔒    Feed paginado (cursor-based)
GET   /posts/:id       🔒    Post individual

🔒 = requer Authorization: Bearer <token>
```

---

## Banco de Dados (Prisma Schema)

```
user        id, name, email, password, username, bio, phone, avatar
post        id, author_id, caption, created_at
media       id, owner_id, bucket, path, kind (photo|video), status
post_media  post_id, media_id, order
```

---

## Design

- **Tema**: escuro por padrão
- **Cor primária**: `#00FF40` / `#53FC18` (verde neon)
- **Fundo**: `#000000` / `#0F0F0F`
- **Card**: `#1A1A1A`
- **Borda**: `#2A2A2A`

---

## Roadmap — Próximas Entregas

- [ ] **Ranking**: tela + endpoint `GET /ranking` (top streamers por atividade)
- [ ] **Busca**: migrar `searchScreen.tsx` do Supabase para `GET /search?q=`
- [ ] **Home enriquecida**: seções "Top Streamers" e "Lives em Destaque"
- [ ] **Follows**: `POST /users/:id/follow`, `DELETE /users/:id/follow`
- [ ] **Doações (API)**: `POST /donations` com histórico
- [ ] **Lives em tempo real**: WebRTC / RTMP + chat via WebSocket
- [ ] **VOD/Clips**: gravação e reprodução de conteúdo ao vivo
- [ ] **Notificações push**: início de live, novas interações
- [ ] **Dashboard do streamer**: analytics de audiência
- [ ] **Assinaturas recorrentes**: subscribers

---

## Qualidade

- ESLint + Prettier (pre-commit via CI)
- Conventional Commits (`feat/`, `fix/`, `chore/`, `docs/`)
- CI: GitHub Actions (lint + typecheck + build)

---

## Licença

Projeto proprietário. Todos os direitos reservados.

**© 2025 Strivo. Desenvolvido por [Sthevan Santos](https://github.com/sthevan027).**
