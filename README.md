# Strivo Admin — Painel Administrativo

Painel administrativo do **Strivo** para acompanhar métricas e moderar conteúdos/ações da rede social e das lives.

> Referências de UI: anexos enviados (tema escuro, cards, badges e botões de ação).
> A documentação do protótipo antigo (legado) está em `docs/LEGADO-prototipo-streaming.md`.

## 🎯 Objetivo

Centralizar, em um único painel:

- Revisão/moderação de conteúdo (posts, comentários, mídia)
- Gestão de denúncias e fila de revisão
- Acompanhamento de métricas (lives e rede social)
- Registro de ações e configurações do painel

## 🧩 Escopo (MVP deste repositório)

### Telas

- **Home**: resumo rápido do painel (cards e contadores)
- **Denúncias**: lista de denúncias recentes e categorias (com CTA “Analisar”)
- **Detalhe da denúncia**: visualização do conteúdo denunciado + motivo + ações (Remover / Manter / Avisar usuário)
- **Ações**: pendências (recursos, verificações, etc.)
- **Insights**: métricas e gráfico de atividade (últimos 7 dias)
- **Config**: configurações do painel (moderadores, regras, registro, alertas, suporte, versão)

### Navegação

- **Mobile**: bottom navigation (Home / Denúncias / Ações / Insights / Config)
- **Desktop**: sidebar (mesmas rotas)

### Dados (por enquanto)

- MVP usa **dados mock** (estáticos) para montar UI/fluxo.
- Integração com API/BD fica para a próxima etapa (definindo autenticação e permissões).

## 🛠️ Stack

- **React + TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**

## 🧭 Rotas

- `/` → Home
- `/denuncias` → Lista de denúncias
- `/denuncias/:id` → Detalhe da denúncia
- `/acoes` → Ações pendentes
- `/insights` → Insights/Métricas
- `/config` → Configurações

## 📁 Estrutura de pastas (proposta)

```
src/
  app/                # rotas e composição do app
  components/         # componentes reutilizáveis (cards, badges, botões, etc.)
  features/           # telas por domínio (denuncias, insights, config...)
  lib/                # helpers (formatadores, constantes, etc.)
  styles/             # tema / tokens
  mocks/              # dados mock do MVP
```

## ▶️ Como rodar

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

## ✅ Próximos passos (pós-MVP)

- Autenticação (admin/moderador) e autorização por permissões
- Integração com API (denúncias, ações, métricas, usuários)
- Upload/preview de mídia e histórico completo de moderação
- Filtros avançados e busca (status, categoria, usuário, período)
- Auditoria (registro de ações) com paginação e exportação


