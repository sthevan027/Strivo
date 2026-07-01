# Strivo — Plataforma de Streaming

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

[![React Native](https://img.shields.io/badge/React_Native_0.81-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_54-000020?style=flat&logo=expo&logoColor=fff)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=fff)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000?style=flat&logo=vercel&logoColor=fff)](https://vercel.com/)

> Plataforma mobile-first de streaming com integração social, criação de conteúdo e ferramentas para criadores e espectadores.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **App** | React Native 0.81 + Expo 54 + Expo Router |
| **Web** | Expo Web (`expo export -p web`) → Vercel |
| **Estilização** | NativeWind 4 (Tailwind CSS) |
| **Backend** | Supabase (Auth + Postgres + Storage) |
| **Auth** | Supabase Auth (email/senha, sessão persistente) |
| **Banco** | Supabase Postgres com RLS e RPCs SQL |
| **Storage** | Supabase Storage (fotos e vídeos via signed URL) |
| **Ícones** | lucide-react-native + @expo/vector-icons |

---

## Como rodar

### Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com) com o projeto configurado

### Configurar banco de dados

Execute o script SQL no [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):

```
supabase/setup.sql
```

Cria tabelas, trigger de signup, políticas RLS e RPCs (`get_feed`, `get_ranking`, `search_users`).

Crie também o bucket `posts` em **Storage → New bucket** (Public: off).

### Variáveis de ambiente

Crie `strivo-app/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<chave-anon>
```

### Rodar o app

```bash
cd strivo-app
npm install
npx expo start          # QR Code para Expo Go ou emulador
```

### Build web (Vercel)

```bash
npx expo export -p web  # gera dist/
```

O arquivo `vercel.json` já está configurado — basta conectar o repositório na Vercel e definir as env vars.

---

## Estado do MVP

### ✅ Implementado

| Feature | Arquivo |
|---------|---------|
| Autenticação (login / registro) | `app/login.tsx`, `app/register.tsx` |
| Perfil de usuário | `app/screens/profile.tsx` |
| Editar perfil | `app/screens/edit-profile.tsx` |
| Feed de posts | `app/(tabs)/home.tsx` |
| Criar post (foto/vídeo) | `app/screens/create-post.tsx` |
| Ranking de streamers | `app/screens/ranking.tsx` |
| Busca de usuários | `app/screens/searchScreen.tsx` |
| Follow / Unfollow | `src/services/follow.ts` |
| Configurações | `app/screens/configuration.tsx` |
| Reels | `app/screens/reels.tsx` |
| Chat | `app/screens/chat/` |

### ❌ Pendente

| Feature | Situação |
|---------|---------|
| Doações | UI pronta (`suport-creator.tsx`), sem integração de pagamento |
| Lives em tempo real | UI de player existe, sem streaming (WebRTC/RTMP) |
| Notificações push | Estrutura criada, sem envio real |

---

## Estrutura do Projeto

```
Strivo/
├── strivo-app/                   # App Expo (mobile + web)
│   ├── app/
│   │   ├── (tabs)/               # Abas principais
│   │   │   └── home.tsx          # Feed de posts
│   │   ├── screens/              # Telas secundárias
│   │   │   ├── profile.tsx
│   │   │   ├── edit-profile.tsx
│   │   │   ├── create-post.tsx
│   │   │   ├── ranking.tsx
│   │   │   ├── searchScreen.tsx
│   │   │   ├── reels.tsx
│   │   │   ├── live.tsx
│   │   │   ├── chat/
│   │   │   └── ...
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   # Estado global de autenticação
│   │   ├── lib/
│   │   │   ├── supabase.ts       # Cliente Supabase
│   │   │   └── storage.ts        # Abstração SecureStore/localStorage
│   │   ├── services/
│   │   │   └── follow.ts         # Follow/unfollow
│   │   └── utils/
│   │       └── profileStorage.ts # Leitura/escrita do perfil
│   └── vercel.json               # Deploy web na Vercel
├── supabase/
│   └── setup.sql                 # Script completo do banco
└── .github/workflows/
    ├── ci.yml                    # Lint
    └── security.yml              # Audit de dependências
```

---

## Banco de Dados (Supabase Postgres)

```
user_profile   id (uuid), name, username, bio, avatar, phone
posts          id, author_id, caption, created_at
media          id, owner_id, bucket, path, kind (photo|video), status
post_media     post_id, media_id, order
follows        follower_id, following_id
```

RLS ativo em todas as tabelas. RPCs disponíveis:

| Função | Descrição |
|--------|-----------|
| `get_feed(limit, cursor_at, cursor_id)` | Feed paginado por cursor |
| `get_ranking(limit)` | Top streamers por posts e seguidores |
| `search_users(q, current_user_id)` | Busca por nome ou username |

---

## Design

- **Tema**: escuro por padrão
- **Cor primária**: `#00FF40` / `#39FF14` (verde neon)
- **Fundo**: `#000000` / `#0F0F0F`
- **Card**: `#1A1A1A` / `zinc-900`
- **Borda**: `#2A2A2A` / `zinc-800`

---

## Roadmap

- [ ] **Doações**: integração com gateway de pagamento
- [ ] **Lives em tempo real**: WebRTC / RTMP + chat via WebSocket
- [ ] **VOD / Clips**: gravação e reprodução de conteúdo ao vivo
- [ ] **Notificações push**: início de live, novas interações
- [ ] **Dashboard do streamer**: analytics de audiência
- [ ] **Assinaturas**: subscribers recorrentes

---

## Qualidade

- ESLint (CI em todo PR)
- `npm audit --omit=dev` (CI em todo PR)
- Conventional Commits (`feat/`, `fix/`, `chore/`, `docs/`)

---

## Licença

Projeto proprietário. Todos os direitos reservados.

**© 2025 Strivo. Desenvolvido por [Sthevan Santos](https://github.com/sthevan027).**
