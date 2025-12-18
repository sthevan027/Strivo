# Strivo Admin — Escopo do Projeto

## Visão geral

O **Strivo Admin** é um painel administrativo para monitorar **métricas** (lives + rede social) e executar **moderação** (denúncias, ações e configurações) do ecossistema Strivo.

O objetivo é oferecer uma experiência **rápida**, **segura** e **orientada a fluxo** (fila de revisão), com UI **dark** semelhante às telas de referência enviadas.

## Público-alvo

- **Administradores**: visão completa, configurações e auditoria.
- **Moderadores**: revisão de denúncias, ações pendentes e comunicação.

## Objetivos (o que vamos construir)

- **Painel com navegação unificada**:
  - Mobile: bottom navigation (5 abas)
  - Desktop: sidebar com as mesmas rotas
- **Fila de revisão de conteúdo** (posts/comentários/mídia) com ações rápidas.
- **Denúncias recentes** por categoria e prioridade/tempo.
- **Ações pendentes** (ex.: recurso, verificação de conta, etc.).
- **Insights e métricas** (cards + gráfico de atividade e KPIs).
- **Configurações administrativas** (moderadores, regras, registro de ações, alertas, suporte e versão).

## Não-objetivos (neste momento)

- Sistema de autenticação e RBAC completo (vai entrar numa etapa posterior).
- Integração real com API/DB (MVP começa com mocks).
- Ferramentas avançadas de exportação/relatórios (pós-MVP).
- Chat em tempo real / websockets (pós-MVP).

## Escopo do MVP (primeira entrega)

### 1) Navegação e Layout

- Layout dark consistente (cards, bordas, sombras sutis, estados hover/active).
- Responsividade:
  - Mobile-first
  - Breakpoint para desktop com sidebar

### 2) Telas (MVP)

#### Home (Dashboard)

- Cards/resumos:
  - Conteúdos para revisão (contador)
  - Denúncias recentes (contador)
  - Ações pendentes (contador)
- Listas rápidas (preview):
  - Conteúdos para revisão (item + motivo + botão “Ver”)
  - Denúncias recentes (item + tempo)
  - Ações pendentes (item + status/tempo)

#### Denúncias (Lista)

- Lista por categoria (ex.: “Conteúdo violento”, “Discurso de ódio”, “Spam comercial”, “Informação falsa”, “Assédio online”)
- Item com:
  - ícone/tipo (post, comentário, mídia)
  - “há X min/horas”
  - CTA “Analisar”

#### Denúncia (Detalhe)

- Conteúdo denunciado (preview de mídia/texto) + autor (ex.: `@usuario123`)
- Box “Motivo da denúncia”
- Contador “Denúncias recebidas”
- Ações:
  - **Remover**
  - **Manter**
  - **Avisar usuário**

#### Ações (Pendências)

- Lista de itens pendentes (ex.: recurso aguardando revisão, verificação de conta)
- CTA “Ver” / “Analisar”

#### Insights

- KPIs:
  - Posts removidos
  - Denúncias totais
  - Taxa de revisão em 24h
- Gráfico “Atividade dos últimos 7 dias”

#### Config

Lista de entradas (com navegação para telas/diálogos simples):
- Gerenciar moderadores
- Regras da comunidade
- Registro de ações
- Configurar alertas
- Suporte técnico
- Versão

### 3) Dados e Comportamento (MVP)

- Dados mock (JSON/TS) para:
  - Conteúdos em revisão
  - Denúncias (lista + detalhe)
  - Ações pendentes
  - Métricas/insights
- Interações:
  - Navegação entre abas
  - Abrir detalhe da denúncia
  - Executar ação (Remover/Manter/Avisar) com feedback (toast/estado)

## Estrutura de rotas (MVP)

- `/` — Home
- `/denuncias` — Lista
- `/denuncias/:id` — Detalhe
- `/acoes` — Pendências
- `/insights` — Métricas
- `/config` — Configurações

## Padrões de UI/UX (baseado nas referências)

- Tema escuro com cards arredondados e borda sutil.
- Botões:
  - Primário (azul) para “Ver/Analisar”
  - Ação destrutiva (vermelho) para “Remover”
  - Neutro (cinza) para “Manter”
- Badges numéricos para contadores.
- Tipografia clara: títulos fortes, descrições secundárias mais suaves.

## Critérios de aceitação do MVP

- Todas as telas do MVP existem e estão **linkadas** por rotas.
- Navegação funciona em **mobile** e **desktop**.
- UI consistente com as referências (cards, botões, badges).
- Fluxo de denúncia: lista → detalhe → ação com feedback.

## Pós-MVP (v1)

- Autenticação (admin/moderador) + permissões.
- Integração com API do Strivo:
  - denúncias, conteúdos, usuários, métricas, auditoria
- Filtros/pesquisa (status, categoria, período, usuário).
- Auditoria detalhada e exportação.


