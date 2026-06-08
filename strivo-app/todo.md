# 📋 TODO - Frontend (app na raiz)

**Última atualização:** 08/06/2026  
**Status geral:** 🟡 Em desenvolvimento ativo

---

## 🔴 PRIORIDADE ALTA

### 🔐 Autenticação e Segurança
- [x] Tela de Login (`app/login.tsx`)
- [x] Tela de Cadastro (`app/register.tsx`)
- [x] Tela de Verificação de Email (`app/verify-email.tsx`)
- [x] Callback de OAuth/Supabase (`app/auth/callback.tsx`)
- [x] Contexto de autenticação (`src/contexts/AuthContext.tsx`)
- [x] Guard de rotas no layout principal (`app/_layout.tsx`)
- [x] Persistência de token com `expo-secure-store`
- [ ] Recuperação de senha / reset de senha
- [ ] Refresh token automático no mobilizador de API
- [ ] Logout com feedback de usuário
- [ ] Tratamento uniforme de erros de autenticação

### 🔌 Integração com backend
- [x] Cliente API base em `src/lib/api.ts`
- [x] Uso de `EXPO_PUBLIC_API_URL` para base URL
- [x] Envio de token JWT no header `Authorization`
- [ ] Criar serviço de autenticação dedicado (`src/services/auth.service.ts`)
- [ ] Criar serviços de usuário e conteúdo (`src/services/user.service.ts`, `src/services/post.service.ts`, etc.)
- [ ] Conectar telas principais à API existente
- [ ] Implementar fallback para token expirado e logout automático
- [ ] Verificar se o backend envia mensagens de erro consistentes

---

## 🟡 PRIORIDADE MÉDIA

### 🧭 Navegação e fluxo
- [x] Redirecionamento inicial entre login e app autenticado (`app/index.tsx`)
- [x] Layout de tabs com proteção de rota (`app/(tabs)/_layout.tsx`)
- [ ] Confirmar fluxo de navegação após logout
- [ ] Ajustar páginas de erro/não autorizado

### 📱 Conteúdo do app
- [ ] Feed principal com dados reais da API
- [ ] Tela de perfil com dados de usuário via API
- [ ] Cadastro/edição de perfil integrado ao backend
- [ ] Perfil de outros usuários em `app/screens/profile/other-user-profile.tsx`
- [ ] Busca com resultados da API (`app/screens/search.tsx`, `app/screens/searchScreen.tsx`)
- [ ] Feed de reels/klips conectado ao backend
- [ ] Streams e lives com dados reais de backend
- [ ] Chat com conversas e mensagens reais
- [ ] Notificações com backend
- [ ] Gerenciamento de configurações em `app/screens/configs/*`

### 💡 UI/UX e performance
- [ ] Loading states consistentes em todas as telas
- [ ] Skeleton ou indicador de carregamento para listas
- [ ] Tratamento de erros amigável para o usuário
- [ ] Aprimorar desempenho de listas e imagens
- [ ] Utilizar `expo-image` e cache de imagens quando possível
- [ ] Aplicar memoização em componentes pesados
- [ ] Animações e transições mais suaves

---

## 🟢 PRIORIDADE BAIXA

### 🧪 Testes e qualidade
- [ ] Configurar ambiente de teste com `jest`
- [ ] Instalar `@testing-library/react-native`
- [ ] Criar testes para `AuthContext` e telas de login/cadastro
- [ ] Cobrir flow de navegação auth-protected
- [ ] Testar componentes de entrada e formulário

### 📊 Analytics e monitoramento
- [ ] Definir estratégia de analytics
- [ ] Integrar ferramenta de logs/erros (Sentry, etc.)
- [ ] Adicionar eventos importantes para login, cadastro e navegação

### 🔧 Melhorias técnicas
- [ ] Remover dependências não utilizadas
- [ ] Revisar imports e organização de pastas
- [ ] Implementar acessibilidade básica (labels, contrastes, foco)
- [ ] Avaliar internacionalização para português/inglês
- [ ] Atualizar documentação no `README.md`

---

## 📦 Observações do projeto atual
- O app já possui autenticação com Supabase e token persistido.
- A API base já está implementada em `src/lib/api.ts` usando `fetch`.
- Há várias telas estáticas e de navegação que ainda precisam ser integradas ao backend.
- O fluxo de rota protegida já funciona pelo `RouteGuard` em `app/_layout.tsx`.
- O próximo passo mais importante é conectar as telas do app ao backend e tratar refresh/logout.
