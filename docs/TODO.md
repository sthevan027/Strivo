# TODO — Strivo Admin

> Checklist para a gente ir marcando conforme implementar.

## 0) Pré-requisitos

- [ ] Confirmar versão do Node recomendada para o projeto (ideal: Node 20+)
- [ ] Garantir uso de **pnpm** (sem npm)

## 1) Setup do projeto (React)

- [ ] Criar projeto React + TS (Vite) na raiz
- [ ] Instalar e configurar Tailwind CSS
- [ ] Instalar e configurar React Router
- [ ] Definir tema/tokens (cores, radius, bordas, sombras)
- [ ] Padronizar fontes e estilos globais (dark mode padrão)

## 2) Estrutura e arquitetura

- [ ] Criar estrutura de pastas (`src/app`, `src/features`, `src/components`, `src/mocks`, `src/styles`, `src/lib`)
- [ ] Criar `AppLayout` (container + header + area de conteúdo)
- [ ] Criar navegação responsiva:
  - [ ] Mobile bottom-nav (5 abas)
  - [ ] Desktop sidebar (5 itens)
- [ ] Criar sistema de rotas com layout compartilhado

## 3) Componentes base (UI kit do projeto)

- [ ] `Card` (variações: padrão, “highlight”, “danger/info box”)
- [ ] `Badge` (contador)
- [ ] `Button` (primary/secondary/danger/ghost)
- [ ] `ListItem` (título, descrição, ícone, trailing CTA)
- [ ] `Divider`
- [ ] `EmptyState`
- [ ] `Skeleton` (opcional)

## 4) Dados mock (MVP)

- [ ] `mocks/moderation.ts` (conteúdos para revisão)
- [ ] `mocks/reports.ts` (denúncias: lista + detalhe)
- [ ] `mocks/actions.ts` (ações pendentes)
- [ ] `mocks/insights.ts` (KPI + série do gráfico)

## 5) Telas (MVP) — conforme referências

### Home

- [ ] Cards: Conteúdos p/ revisão, Denúncias recentes, Ações pendentes
- [ ] Lista “Conteúdos para revisão” com botão **Ver**
- [ ] Lista “Denúncias recentes” com “há X min”
- [ ] Lista “Ações pendentes” com botão **Ver**

### Denúncias (Lista)

- [ ] Lista por categoria com ícone e tempo
- [ ] CTA **Analisar** abrindo `/denuncias/:id`

### Denúncia (Detalhe)

- [ ] Preview do conteúdo + autor
- [ ] Box “Motivo da denúncia”
- [ ] Contador “Denúncias recebidas”
- [ ] Botões: **Remover**, **Manter**, **Avisar usuário**
- [ ] Feedback ao clicar (toast/estado + update do mock em memória)

### Ações

- [ ] Lista de pendências (recurso/verificação etc.)
- [ ] CTA de “Ver”

### Insights

- [ ] KPIs (posts removidos, denúncias totais, taxa revisão 24h)
- [ ] Gráfico “Atividade últimos 7 dias”

### Config

- [ ] Lista de entradas (moderadores, regras, registro, alertas, suporte, versão)
- [ ] Tela/diálogo simples para cada item (placeholder MVP)

## 6) Qualidade e polimento

- [ ] Estados: loading/empty/error (mesmo com mock)
- [ ] Acessibilidade básica (focus, aria-label nos botões)
- [ ] Responsividade e espaçamento conforme mobile-first
- [ ] Ícones consistentes

## 7) Próxima etapa (integração)

- [ ] Autenticação (admin/moderador)
- [ ] Permissões (RBAC)
- [ ] Integração com API do Strivo
- [ ] Paginação + filtros + busca
- [ ] Auditoria de ações com histórico e exportação


