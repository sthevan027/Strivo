# Strivo Admin — Painel Administrativo

Painel administrativo do **Strivo** para acompanhar métricas e moderar conteúdos/ações da rede social e das lives.

## 🎯 Objetivo

Centralizar, em um único painel:

- Revisão/moderação de conteúdo (posts, comentários, mídia)
- Gestão de denúncias e fila de revisão
- Acompanhamento de métricas (lives e rede social)
- Registro de ações e configurações do painel

## 🛠️ Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **React Router** (navegação)
- **Lucide React** (ícones)

## 🧭 Rotas

- `/` → Home (Dashboard)
- `/denuncias` → Lista de denúncias
- `/denuncias/:id` → Detalhe da denúncia
- `/acoes` → Ações pendentes
- `/insights` → Insights/Métricas
- `/config` → Configurações

## 📁 Estrutura de Pastas

```
strivo-admin/
├── src/
│   ├── app/                # rotas e composição do app
│   ├── components/         # componentes reutilizáveis (Card, Badge, Button, Navigation)
│   ├── features/          # telas por domínio (home, denuncias, acoes, insights, config)
│   ├── mocks/              # dados mock do MVP
│   ├── App.tsx             # componente principal com rotas
│   ├── main.tsx            # ponto de entrada
│   └── index.css           # estilos globais
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## ▶️ Como Rodar

Instalar dependências:

```bash
pnpm install
```

Rodar em desenvolvimento:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Preview do build:

```bash
pnpm preview
```

## 🎨 Paleta de Cores

- **Primária**: `#53fc18` (Verde vibrante do Strivo)
- **Fundo Escuro**: `#0f0f0f`
- **Card Escuro**: `#1a1a1a`
- **Borda Escura**: `#2a2a2a`

## 📱 Responsividade

- **Mobile**: Bottom navigation (5 abas)
- **Desktop**: Sidebar lateral com as mesmas rotas

## ✅ Funcionalidades Implementadas (MVP)

- ✅ Dashboard com cards de resumo e listas rápidas
- ✅ Lista de denúncias por categoria
- ✅ Detalhe da denúncia com ações (Remover/Manter/Avisar)
- ✅ Lista de ações pendentes
- ✅ Insights com métricas e gráfico de atividade
- ✅ Tela de configurações
- ✅ Navegação responsiva (mobile e desktop)
- ✅ Dados mock para todas as telas

## 🚀 Próximos Passos (Pós-MVP)

- Autenticação (admin/moderador) e autorização por permissões
- Integração com API (denúncias, ações, métricas, usuários)
- Upload/preview de mídia e histórico completo de moderação
- Filtros avançados e busca (status, categoria, usuário, período)
- Auditoria (registro de ações) com paginação e exportação

