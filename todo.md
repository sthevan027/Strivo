# 📋 TODO - Frontend (strivo-app)

**Última atualização:** 13/12/2025  
**Status geral:** 🟡 Em desenvolvimento ativo

---

## 🔴 PRIORIDADE ALTA

### 🔐 Autenticação e Segurança
- [ ] Criar telas de autenticação
  - [ ] Tela de Login (`app/screens/auth/login.tsx`)
  - [ ] Tela de Cadastro (`app/screens/auth/register.tsx`)
  - [ ] Tela de Recuperação de Senha (`app/screens/auth/forgot-password.tsx`)
  - [ ] Tela de Verificação de Email (`app/screens/auth/verify-email.tsx`)

- [ ] Implementar sistema de autenticação
  - [ ] Instalar `expo-secure-store` para armazenar tokens
  - [ ] Criar Context de Autenticação (`src/contexts/AuthContext.tsx`)
  - [ ] Implementar guards de rotas protegidas
  - [ ] Criar hook `useAuth()` para gerenciar estado de autenticação
  - [ ] Implementar refresh token automático

- [ ] Integrar com backend
  - [ ] Criar serviço de autenticação (`src/services/auth.service.ts`)
  - [ ] Conectar telas de login/cadastro com API
  - [ ] Implementar logout
  - [ ] Tratar erros de autenticação

---

### 🔌 Integração com Backend

- [ ] Configurar cliente API
  - [ ] Instalar `axios` ou configurar `fetch` com interceptors
  - [ ] Criar arquivo `.env` com variáveis de ambiente
  - [ ] Configurar base URL da API
  - [ ] Implementar interceptors para:
    - [ ] Adicionar token JWT automaticamente
    - [ ] Tratar erros HTTP (401, 403, 500, etc.)
    - [ ] Refresh token automático
    - [ ] Logout automático em caso de token inválido

- [ ] Configurar TanStack Query
  - [ ] Instalar `@tanstack/react-query`
  - [ ] Configurar `QueryClient` no `_layout.tsx`
  - [ ] Criar hooks de queries customizados
  - [ ] Configurar cache e refetch strategies

- [ ] Criar serviços de API
  - [ ] `src/services/api.service.ts` - Cliente base
  - [ ] `src/services/user.service.ts` - CRUD de usuários
  - [ ] `src/services/post.service.ts` - CRUD de posts
  - [ ] `src/services/klip.service.ts` - CRUD de klips
  - [ ] `src/services/live.service.ts` - Gerenciamento de lives
  - [ ] `src/services/chat.service.ts` - Mensagens e chat
  - [ ] `src/services/notification.service.ts` - Notificações

- [ ] Integrar telas existentes com API
  - [ ] Feed Principal - Buscar posts da API
  - [ ] Perfil - Buscar dados do usuário da API
  - [ ] Editar Perfil - Salvar alterações na API
  - [ ] Reels/Klips - Buscar klips da API
  - [ ] Streams - Buscar lives ativas da API
  - [ ] Chat - Buscar conversas e mensagens da API
  - [ ] Notificações - Buscar notificações da API
  - [ ] Busca - Integrar busca com API

---

## 🟡 PRIORIDADE MÉDIA

### 🎥 Funcionalidades de Lives

- [ ] Implementar player de vídeo para lives
  - [ ] Integrar com serviço de streaming
  - [ ] Controles de play/pause
  - [ ] Controle de qualidade
  - [ ] Indicador de buffer

- [ ] Sistema de chat em tempo real
  - [ ] Instalar `socket.io-client`
  - [ ] Conectar com WebSocket do backend
  - [ ] Implementar envio/recebimento de mensagens em tempo real
  - [ ] Sistema de moderação de chat
  - [ ] Badges e emojis no chat

- [ ] Funcionalidades de live
  - [ ] Iniciar live (integração com backend)
  - [ ] Finalizar live
  - [ ] Compartilhar live
  - [ ] Salvar live como klip
  - [ ] Estatísticas em tempo real (viewers, likes, etc.)

---

### 📱 Melhorias de UI/UX

- [ ] Sistema de loading states
  - [ ] Componente de loading global
  - [ ] Skeleton screens para carregamento
  - [ ] Loading states em todas as telas

- [ ] Tratamento de erros
  - [ ] Componente de erro global
  - [ ] Mensagens de erro amigáveis
  - [ ] Retry automático em falhas de rede
  - [ ] Estados offline/online

- [ ] Melhorias de performance
  - [ ] Implementar lazy loading de imagens
  - [ ] Otimizar FlatList com `getItemLayout`
  - [ ] Implementar paginação infinita
  - [ ] Cache de imagens com `expo-image`
  - [ ] Memoização de componentes pesados

- [ ] Animações e transições
  - [ ] Transições suaves entre telas
  - [ ] Animações de loading
  - [ ] Feedback háptico em ações importantes
  - [ ] Animações de scroll

---

### 🎨 Componentes e Funcionalidades

- [ ] Melhorar sistema de stories
  - [ ] Upload de stories
  - [ ] Visualização de stories de outros usuários
  - [ ] Animações de progresso
  - [ ] Interações (curtir, responder)

- [ ] Sistema de comentários completo
  - [ ] Respostas aninhadas
  - [ ] Edição de comentários
  - [ ] Exclusão de comentários
  - [ ] Menções de usuários (@username)
  - [ ] Hashtags (#hashtag)

- [ ] Sistema de compartilhamento
  - [ ] Compartilhar posts/klips
  - [ ] Compartilhar perfil
  - [ ] Compartilhar live
  - [ ] Integração com redes sociais nativas

- [ ] Sistema de notificações push
  - [ ] Configurar `expo-notifications`
  - [ ] Solicitar permissões
  - [ ] Receber notificações em background
  - [ ] Badge de notificações não lidas
  - [ ] Categorias de notificações

---

## 🟢 PRIORIDADE BAIXA

### 🧪 Testes

- [ ] Configurar ambiente de testes
  - [ ] Instalar `jest` e `@testing-library/react-native`
  - [ ] Configurar `jest.config.js`
  - [ ] Criar mocks de dependências

- [ ] Testes unitários
  - [ ] Testes de componentes principais
  - [ ] Testes de hooks customizados
  - [ ] Testes de utilitários

- [ ] Testes de integração
  - [ ] Testes de fluxos principais
  - [ ] Testes de navegação
  - [ ] Testes de integração com API (mock)

---

### 📊 Analytics e Monitoramento

- [ ] Configurar analytics
  - [ ] Instalar biblioteca de analytics (ex: `@react-native-firebase/analytics`)
  - [ ] Rastrear eventos importantes
  - [ ] Rastrear telas visitadas
  - [ ] Rastrear ações do usuário

- [ ] Monitoramento de erros
  - [ ] Integrar Sentry ou similar
  - [ ] Capturar erros não tratados
  - [ ] Logs de debug em desenvolvimento

---

### 🔧 Melhorias Técnicas

- [ ] Otimizações
  - [ ] Code splitting
  - [ ] Bundle size optimization
  - [ ] Remover dependências não utilizadas
  - [ ] Otimizar imports

- [ ] Acessibilidade
  - [ ] Adicionar labels acessíveis
  - [ ] Suporte a screen readers
  - [ ] Contraste de cores adequado
  - [ ] Tamanhos de fonte responsivos

- [ ] Internacionalização (i18n)
  - [ ] Instalar biblioteca de i18n
  - [ ] Criar arquivos de tradução
  - [ ] Implementar troca de idioma

- [ ] Documentação
  - [ ] Documentar componentes principais
  - [ ] Documentar hooks customizados
  - [ ] Documentar serviços de API
  - [ ] Atualizar README.md

---

### 📦 Dependências Pendentes

- [ ] Estado global
  - [ ] Instalar `@tanstack/react-query` (já mencionado acima)
  - [ ] Considerar `zustand` para estado local simples

- [ ] Autenticação
  - [ ] Instalar `expo-secure-store`
  - [ ] Considerar `expo-auth-session` para OAuth

- [ ] API e WebSocket
  - [ ] Instalar `axios` ou usar `fetch` nativo
  - [ ] Instalar `socket.io-client`

- [ ] Notificações
  - [ ] Instalar `expo-notifications`

- [ ] Testes
  - [ ] Instalar `jest`
  - [ ] Instalar `@testing-library/react-native`
  - [ ] Instalar `@testing-library/jest-native`

- [ ] Analytics
  - [ ] Instalar biblioteca de analytics (opcional)

---

## ✅ CONCLUÍDO

### Semana 30/11 - 06/12/2025
- [x] Estrutura base do projeto React Native/Expo *(06/12/2025)*
- [x] Configuração do Expo Router *(06/12/2025)*
- [x] Configuração do NativeWind (Tailwind CSS) *(06/12/2025)*
- [x] Telas principais implementadas (Feed, Perfil, Streams, Reels, Chat) *(06/12/2025)*
- [x] Dependências principais instaladas *(06/12/2025)*

### Semana 07/12 - 13/12/2025
- [x] Tela de Edição de Perfil com upload de foto *(13/12/2025)*
  - Upload de imagem com crop e zoom
  - Edição de dados pessoais
  - Links sociais (YouTube, Twitch, Instagram, Twitter)
  - Sistema de notificações de sucesso/erro
- [x] Tela de Métricas *(13/12/2025)*
  - Dashboard de métricas de conteúdo
  - Visualização de estatísticas detalhadas
- [x] Tela de Notificações *(13/12/2025)*
  - Sistema de notificações de hoje e da semana
  - Diferentes tipos de notificações
- [x] Tela de Busca *(13/12/2025)*
  - Busca de contas e hashtags
  - Filtro em tempo real
- [x] Tela de Chat ao Vivo *(13/12/2025)*
  - Interface de chat ao vivo
  - Sistema de mensagens
- [x] Componentes: Criar Live, Criar Klip *(13/12/2025)*
  - Modal de início de live
  - Modal de criação de klip
- [x] Sistema de persistência local (AsyncStorage) *(13/12/2025)*
  - Profile Storage implementado
  - Salvamento e carregamento de dados de perfil
- [x] Melhorias em telas existentes *(13/12/2025)*
  - Feed: Integração com perfil salvo
  - Perfil: Integração com dados salvos, modais de visualização
  - Reels: Sistema de mute/unmute, comentários aprimorados
- [x] Sistema de mute/unmute em vídeos *(13/12/2025)*
  - Toggle de áudio com feedback visual
- [x] Sistema de comentários aprimorado *(13/12/2025)*
  - Comentários com imagens
  - Sistema de likes/dislikes
  - Indicador de "curtido pelo criador"

---

## 📝 NOTAS

### Próximas Sprints Sugeridas

**Sprint 1 (Alta Prioridade):**
- Autenticação completa
- Configuração de cliente API
- Integração básica com backend

**Sprint 2 (Média Prioridade):**
- Integração de todas as telas com API
- Sistema de lives completo
- Melhorias de UX

**Sprint 3 (Baixa Prioridade):**
- Testes
- Analytics
- Otimizações finais

---

**Mantido por:** Equipe de Desenvolvimento Strivo  
**Atualizar:** Semanalmente ou conforme progresso

