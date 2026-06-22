# Strivo â€” Plataforma de Streaming

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_54-000020?style=flat&logo=expo&logoColor=fff)](https://expo.dev/)
[![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=flat&logo=nestjs&logoColor=fff)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=fff)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=fff)](https://supabase.com/)

> Plataforma mobile de streaming com integraÃ§Ã£o social, criaÃ§Ã£o de conteÃºdo e ferramentas para criadores e espectadores.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React Native 0.81 + Expo 54 + Expo Router |
| **EstilizaÃ§Ã£o** | NativeWind 4 (Tailwind CSS) |
| **Backend** | NestJS 11 + TypeScript |
| **ORM** | Prisma 7 + PostgreSQL |
| **Storage** | Supabase Storage (upload de mÃ­dia) |
| **Auth** | JWT via `@nestjs/jwt` + bcryptjs |
| **Ãcones** | lucide-react-native + @expo/vector-icons |

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
cd strivo-app
npm install
npx expo start             # abre no Expo Go (iOS/Android) ou emulador
```

> Configure `EXPO_PUBLIC_API_URL=http://localhost:3000` no `.env` dentro de `strivo-app/`.

---

## Estado do MVP

### âœ… Implementado

| Feature | Frontend | Backend |
|---------|----------|---------|
| **AutenticaÃ§Ã£o** | `app/login.tsx`, `app/register.tsx` | `POST /auth/register`, `POST /auth/login` |
| **Perfil de usuÃ¡rio** | `app/screens/profile.tsx`, `app/screens/edit-profile.tsx` | `GET /users/me`, `PATCH /users/me` |
| **Feed de posts** | `app/(tabs)/home.tsx` | `GET /posts/feed`, `GET /posts/:id` |
| **CriaÃ§Ã£o de post** | `app/screens/create-post.tsx` | `POST /posts/uploads`, `POST /posts` |
| **Categorias/Streams** | `app/screens/streams.tsx` (mock) | â€” |
| **Sistema de apoio** | `app/screens/suport-creator.tsx` (UI) | â€” |
| **ConfiguraÃ§Ãµes** | `app/screens/configuration.tsx` | â€” |
| **Reels** | `app/screens/reels.tsx` | â€” |
| **Chat** | `app/screens/chat/` | â€” |

### âš ï¸ Parcial

| Feature | Problema |
|---------|---------|
| **Busca** | `app/screens/searchScreen.tsx` usa Supabase diretamente â€” nÃ£o migrada para o NestJS |
| **Home** | Feed ok, mas faltam seÃ§Ãµes "Top Streamers do MÃªs" e "Lives em Destaque" |
| **Categorias** | Dados estÃ¡ticos (mock) â€” sem backend |

### âŒ Pendente

| Feature | SituaÃ§Ã£o |
|---------|---------|
| **Ranking** | Nenhuma tela ou endpoint criados |
| **DoaÃ§Ãµes (API)** | UI pronta, sem integraÃ§Ã£o real de pagamento |
| **Lives em tempo real** | UI de player existe, sem streaming backend (WebRTC/RTMP) |

---

## Estrutura do Projeto

```
Strivo/                               # Monorepo
â”œâ”€â”€ strivo-app/                       # Frontend (React Native / Expo)
â”‚   â”œâ”€â”€ app/                          # Rotas (Expo Router)
â”‚   â”‚   â”œâ”€â”€ (tabs)/                   # Abas principais
â”‚   â”‚   â”‚   â”œâ”€â”€ home.tsx              # Feed de posts (NestJS)
â”‚   â”‚   â”‚   â””â”€â”€ screens/              # Telas nas abas
â”‚   â”‚   â”‚       â”œâ”€â”€ searchScreen.tsx  # Busca (Supabase â€” pendente migraÃ§Ã£o)
â”‚   â”‚   â”‚       â”œâ”€â”€ streams.tsx       # Categorias e top streamers (mock)
â”‚   â”‚   â”‚       â”œâ”€â”€ reels.tsx         # Reels
â”‚   â”‚   â”‚       â””â”€â”€ profile.tsx       # Perfil (NestJS)
â”‚   â”‚   â”œâ”€â”€ auth/callback.tsx         # Callback OAuth
â”‚   â”‚   â”œâ”€â”€ login.tsx                 # guration.tsx     # ConfiguraÃ§Ãµes
â”‚       â”œâ”€â”€ edit-profile.tsx      # Editar perfil
â”‚       â”œâ”€â”€ suport-creator.tsx    # Apoiar streamer (UI)
â”‚       â”œâ”€â”€ live.tsx              # Player de live (UI)
â”‚       â”œâ”€â”€ notifications.tsx     # NotificaÃ§Ãµes
â”‚       â”œâ”€â”€ chat/                 # Chat (DMs e grupos)
â”‚       â”œâ”€â”€ configs/              # Sub-telas de configuraÃ§Ãµes
â”‚       â””â”€â”€ profile/              # MÃ©tricas e outros perfis
â”‚
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/               # Componentes reutilizÃ¡veis
â”‚   â”œâ”€â”€ contexts/AuthContext.tsx  # Estado global de autenticaÃ§Ã£o
â”‚   â”œâ”€â”€ lib/api.ts                # Cliente HTTP (JWT automÃ¡tico)
â”‚   â””â”€â”€ services/follow.ts        # Follow/unfollow
â”‚
â”œâ”€â”€ assets/images/                # Imagens e Ã­cones
â”‚
â””â”€â”€ strivo-server/                # Backend (NestJS)
    â””â”€â”€ src/
        â”œâ”€â”€ auth/                 # JWT + bcrypt (register, login)
        â”œâ”€â”€ users/                # Perfil (GET/PATCH /users/me)
        â”œâ”€â”€ posts/                # Feed, criaÃ§Ã£o e upload
        â”œâ”€â”€ supabase/             # Storage de mÃ­dia
        â””â”€â”€ database/             # Prisma schema + migrations
```

---

## API â€” Endpoints DisponÃ­veis

```
POST  /auth/register          Cadastro (name, email, password)
POST  /auth/login             Login â†’ { access_token }

GET   /users/me        ðŸ”’    Dados do usuÃ¡rio logado
PATCH /users/me        ðŸ”’    Atualizar perfil

POST  /posts/uploads   ðŸ”’    Gerar URL de upload (Supabase Storage)
POST  /posts           ðŸ”’    Criar post com mÃ­dias vinculadas
GET   /posts/feed      ðŸ”’    Feed paginado (cursor-based)
GET   /posts/:id       ðŸ”’    Post individual

ðŸ”’ = requer Authorization: Bearer <token>
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

- **Tema**: escuro por padrÃ£o
- **Cor primÃ¡ria**: `#00FF40` / `#53FC18` (verde neon)
- **Fundo**: `#000000` / `#0F0F0F`
- **Card**: `#1A1A1A`
- **Borda**: `#2A2A2A`

---

## Roadmap â€” PrÃ³ximas Entregas

- [ ] **Ranking**: tela + endpoint `GET /ranking` (top streamers por atividade)
- [ ] **Busca**: migrar `searchScreen.tsx` do Supabase para `GET /search?q=`
- [ ] **Home enriquecida**: seÃ§Ãµes "Top Streamers" e "Lives em Destaque"
- [ ] **Follows**: `POST /users/:id/follow`, `DELETE /users/:id/follow`
- [ ] **DoaÃ§Ãµes (API)**: `POST /donations` com histÃ³rico
- [ ] **Lives em tempo real**: WebRTC / RTMP + chat via WebSocket
- [ ] **VOD/Clips**: gravaÃ§Ã£o e reproduÃ§Ã£o de conteÃºdo ao vivo
- [ ] **NotificaÃ§Ãµes push**: inÃ­cio de live, novas interaÃ§Ãµes
- [ ] **Dashboard do streamer**: analytics de audiÃªncia
- [ ] **Assinaturas recorrentes**: subscribers

---

## Qualidade

- ESLint + Prettier (pre-commit via CI)
- Conventional Commits (`feat/`, `fix/`, `chore/`, `docs/`)
- CI: GitHub Actions (lint + typecheck + build)

---

## LicenÃ§a

Projeto proprietÃ¡rio. Todos os direitos reservados.

**Â© 2025 Strivo. Desenvolvido por [Sthevan Santos](https://github.com/sthevan027).**
­cio de live, novas interaÃ§Ãµes
- [ ] **Dashboard do streamer**: analytics de audiÃªncia
- [ ] **Assinaturas recorrentes**: subscribers

---

## Qualidade

- ESLint + Prettier (pre-commit via CI)
- Conventional Commits (`feat/`, `fix/`, `chore/`, `docs/`)
- CI: GitHub Actions (lint + typecheck + build)

---

## LicenÃ§a

Projeto proprietÃ¡rio. Todos os direitos reservados.

**Â© 2025 Strivo. Desenvolvido por [Sthevan Santos](https://github.com/sthevan027).**
