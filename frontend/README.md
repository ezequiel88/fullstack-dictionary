# 🎨 Dictionary Frontend

Uma interface moderna e responsiva para o dicionário online que vai fazer você se apaixonar por **Next.js**, **React**, **TypeScript** e **Tailwind CSS**! 💙

*Porque quem disse que uma UI bonita não pode ter código limpo e bem estruturado?* 😉

## 🚀 Características Principais

- ✅ **Next.js 15** com App Router e React Server Components
- ✅ **TypeScript** para type safety e melhor experiência de desenvolvimento
- ✅ **Tailwind CSS** para estilização moderna e responsiva
- ✅ **Shadcn/ui** para componentes elegantes e acessíveis
- ✅ **Framer Motion** para animações fluidas
- ✅ **React Hook Form** com validação Zod
- ✅ **Axios** para comunicação com a API
- ✅ **Next Themes** para suporte a tema escuro/claro
- ✅ **Lucide React** para ícones consistentes
- ✅ **PWA Completo** com service worker, cache offline e instalação
- ✅ **Service Worker** com estratégias de cache inteligentes
- ✅ **Offline Support** com fallbacks e sincronização
- ✅ **Push Notifications** preparado para notificações
- ✅ **ESLint** para qualidade de código
- ✅ **Responsive Design** para todos os dispositivos

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Build e Deploy](#-build-e-deploy)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [PWA (Progressive Web App)](#-pwa-progressive-web-app)
- [Componentes](#-componentes)
- [Estilização](#-estilização)
- [Performance](#-performance)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Contribuição](#-contribuição)

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **pnpm** (recomendado)
- **Backend da API** rodando (veja o README do backend)

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/ezequiel88/fullstack-dictionary.git
cd fullstack-dictionary/frontend
```

2. **Instale as dependências:**
```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install
```

## ⚙️ Configuração

1. **Crie o arquivo de ambiente:**
```bash
cp .env.example .env.local
```

2. **Configure as variáveis de ambiente:**
```env
# API Configuration
API_URL="http://localhost:3030"

# App Configuration
APP_NAME="Dictionary App"
APP_DESCRIPTION="Seu dicionário online favorito"

# Environment
NODE_ENV="development"
```

3. **Configuração do Backend:**
Certifique-se de que o backend esteja rodando em `http://localhost:3030` ou ajuste a variável `API_URL` conforme necessário.

## 🚀 Execução

### Desenvolvimento
```bash
# Modo desenvolvimento com Turbopack (mais rápido)
pnpm dev

# Ou usando npm
npm run dev
```

### Build e Produção
```bash
# Build da aplicação
pnpm build

# Executar versão de produção
pnpm start
```

A aplicação estará disponível em: `http://localhost:3000`

## 🏗️ Arquitetura

O projeto segue as melhores práticas do **Next.js 15** com **App Router**, organizando o código de forma modular e escalável:

### Estrutura da Arquitetura

```
┌─────────────────────────────────────┐
│              Views                  │  ← Páginas e layouts
├─────────────────────────────────────┤
│            Components               │  ← Componentes reutilizáveis
├─────────────────────────────────────┤
│              Hooks                  │  ← Custom hooks
├─────────────────────────────────────┤
│            Actions                  │  ← Server actions
├─────────────────────────────────────┤
│              Types                  │  ← Definições TypeScript
└─────────────────────────────────────┘
```

#### 🎯 App Router (`src/app/`)
- **Layouts**: Estruturas de página reutilizáveis
- **Pages**: Páginas da aplicação
- **Loading**: Estados de carregamento
- **Error**: Tratamento de erros

#### 🧩 Components (`src/components/`)
- **UI Components**: Componentes base do Shadcn/ui
- **Feature Components**: Componentes específicos de funcionalidades
- **Layout Components**: Componentes de estrutura

#### 🎣 Hooks (`src/hooks/`)
- **Custom Hooks**: Lógica reutilizável
- **API Hooks**: Comunicação com backend
- **State Management**: Gerenciamento de estado

#### ⚡ Actions (`src/actions/`)
- **Server Actions**: Ações do lado servidor
- **API Calls**: Comunicação com API externa

## 🌟 Funcionalidades

### Autenticação
- **Login/Cadastro** com validação em tempo real
- **Persistência de sessão** com localStorage
- **Proteção de rotas** automática
- **Logout** seguro

### Dicionário
- **Busca de palavras** com autocomplete
- **Definições detalhadas** com pronúncia
- **Histórico de pesquisas** personalizado
- **Sistema de favoritos** intuitivo

### Interface
- **Tema escuro/claro** com persistência
- **Design responsivo** para todos os dispositivos
- **Animações suaves** com Framer Motion
- **Feedback visual** com toasts e loading states

### Performance
- **Server Side Rendering** para SEO otimizado
- **Static Generation** para páginas estáticas
- **Image Optimization** automática
- **Code Splitting** inteligente

## 📱 PWA (Progressive Web App)

### 🚀 Funcionalidades PWA Implementadas

#### Service Worker (`public/sw.js`)
- **Cache First Strategy** para assets estáticos (CSS, JS, imagens)
- **Network First Strategy** para API calls e navegação
- **Offline Fallback** com página personalizada (`offline.html`)
- **Background Sync** para sincronização quando voltar online
- **Push Notifications** preparado para notificações futuras
- **Cache Management** automático com limpeza de versões antigas

#### Manifest (`public/manifest.json`)
- **Instalação nativa** em dispositivos móveis e desktop
- **Ícones otimizados** (192x192, 512x512, Apple Touch Icon)
- **Splash Screen** personalizada para iOS
- **Shortcuts** para ações rápidas (Buscar, Favoritos, Histórico)
- **Screenshots** para app stores
- **Tema personalizado** com cores da aplicação

#### Componentes PWA
- **PwaInstallBanner** - Banner de instalação inteligente
- **PwaNotifications** - Notificações de status (offline, atualizações)
- **PwaProvider** - Inicialização e gerenciamento do PWA

#### Hooks Customizados
- **usePwaPrompt** - Gerencia prompt de instalação
- **useServiceWorker** - Registra e monitora service worker

### 🔧 Como Testar o PWA

#### 1. **Instalação**
```bash
# Acesse a aplicação
http://localhost:3000

# No Chrome/Edge:
# - Clique no ícone de instalação na barra de endereços
# - Ou use o banner de instalação que aparece automaticamente

# No mobile:
# - Menu > "Adicionar à tela inicial"
```

#### 2. **Teste Offline**
```bash
# 1. Abra DevTools (F12)
# 2. Vá para Network tab
# 3. Marque "Offline"
# 4. Recarregue a página
# ✅ Deve mostrar a página offline personalizada
```

#### 3. **Verificação no DevTools**
```bash
# Application tab > Service Workers
# ✅ Deve mostrar SW registrado e ativo

# Application tab > Cache Storage
# ✅ Deve mostrar caches criados:
#   - static-cache-v1 (CSS, JS, imagens)
#   - api-cache-v1 (respostas da API)

# Application tab > Manifest
# ✅ Deve carregar manifest.json sem erros
```

#### 4. **Página de Teste**
```bash
# Acesse a página de diagnóstico
http://localhost:3000/test-sw.html

# Funcionalidades disponíveis:
# - Testar acesso ao service worker
# - Registrar/desregistrar SW
# - Verificar caches
# - Limpar caches
# - Status de conexão
```

### 📊 PWA Score (Lighthouse)

A aplicação atende aos critérios PWA:
- ✅ **Installable** - Manifest válido e service worker
- ✅ **Offline Capable** - Funciona sem conexão
- ✅ **Fast Loading** - Cache estratégico
- ✅ **Secure** - HTTPS ready
- ✅ **Responsive** - Design adaptativo
- ✅ **Engaging** - Push notifications ready

### 🔄 Estratégias de Cache

#### Cache First (Assets Estáticos)
```javascript
// CSS, JS, imagens, fontes
// 1. Busca no cache primeiro
// 2. Se não encontrar, busca na rede
// 3. Armazena no cache para próximas vezes
```

#### Network First (API e Navegação)
```javascript
// API calls, páginas HTML
// 1. Tenta buscar na rede primeiro
// 2. Se falhar, busca no cache
// 3. Atualiza cache com resposta da rede
```

#### Stale While Revalidate (Recursos Dinâmicos)
```javascript
// Imagens de perfil, conteúdo dinâmico
// 1. Retorna do cache imediatamente
// 2. Busca atualização na rede em background
// 3. Atualiza cache para próxima vez
```

### 🔔 Push Notifications (Preparado)

O service worker já está preparado para push notifications:

```javascript
// Estrutura implementada:
// - Registration de push subscription
// - Handling de push events
// - Notification display
// - Click handling

// Para ativar:
// 1. Configure servidor de push (Firebase, OneSignal, etc.)
// 2. Implemente backend para envio
// 3. Ative permissões no frontend
```

### 📱 Instalação Cross-Platform

#### Desktop (Chrome/Edge)
- Ícone de instalação na barra de endereços
- Banner automático após critérios PWA
- Funciona como app nativo

#### Mobile (iOS/Android)
- "Adicionar à tela inicial" no menu do navegador
- Splash screen personalizada
- Modo standalone (sem barra do navegador)

#### Detecção de Instalação
```javascript
// Hook usePwaPrompt detecta:
// - Suporte a PWA
// - Evento beforeinstallprompt
// - Status de instalação
// - Modo standalone
```

### 🛠️ Arquivos PWA

```
public/
├── 📄 sw.js                    # Service Worker principal
├── 📄 manifest.json            # Manifest PWA
├── 📄 offline.html             # Página offline
├── 📄 test-sw.html             # Página de teste
├── 🖼️ icon-192.png             # Ícone PWA 192x192
├── 🖼️ icon-512.png             # Ícone PWA 512x512
└── 🖼️ apple-touch-icon.png     # Ícone Apple

src/components/
├── 📄 pwa-banner.tsx           # Banner de instalação
├── 📄 pwa-notifications.tsx    # Notificações PWA
└── 📄 pwa-provider.tsx         # Provider PWA

src/hooks/
├── 📄 usePwaPrompt.ts          # Hook de instalação
└── 📄 useServiceWorker.ts      # Hook do service worker
```

### 🚀 Próximas Melhorias PWA

- [ ] **Background Sync** - Sincronização em background
- [ ] **Push Notifications** - Notificações push reais
- [ ] **Periodic Sync** - Sincronização periódica
- [ ] **Share Target** - Receber compartilhamentos
- [ ] **File Handling** - Manipular arquivos
- [ ] **Shortcuts** - Atalhos dinâmicos
- [ ] **Badging** - Badge no ícone do app

## 🧩 Componentes

### Componentes Base (Shadcn/ui)
- **Button**: Botões com variantes e estados
- **Input**: Campos de entrada com validação
- **Dialog**: Modais e popups
- **Toast**: Notificações temporárias
- **Avatar**: Avatares de usuário
- **Tabs**: Navegação por abas
- **Tooltip**: Dicas contextuais

### Componentes Customizados
- **WordCard**: Exibição de palavras
- **SearchBar**: Barra de pesquisa avançada
- **UserProfile**: Perfil do usuário
- **HistoryList**: Lista de histórico
- **FavoritesList**: Lista de favoritos
- **ThemeToggle**: Alternador de tema

### Layout Components
- **Header**: Cabeçalho com navegação
- **Sidebar**: Barra lateral (mobile)
- **Footer**: Rodapé informativo
- **Container**: Wrapper responsivo

## 🎨 Estilização

### Tailwind CSS
- **Design System** consistente
- **Responsive Design** mobile-first
- **Dark Mode** nativo
- **Custom Components** com CVA

### Tema e Cores
```css
/* Cores principais */
--primary: 222.2 84% 4.9%
--primary-foreground: 210 40% 98%
--secondary: 210 40% 96%
--accent: 210 40% 94%
--muted: 210 40% 96%
--border: 214.3 31.8% 91.4%
```

### Animações
- **Framer Motion** para transições
- **CSS Animations** para micro-interações
- **Loading States** animados
- **Hover Effects** sutis

## ⚡ Performance

### Otimizações Next.js
- **App Router** para melhor performance
- **Server Components** por padrão
- **Streaming** para carregamento progressivo
- **Suspense** para loading states

### Otimizações de Bundle
- **Tree Shaking** automático
- **Code Splitting** por rota
- **Dynamic Imports** para componentes pesados
- **Image Optimization** com next/image

### Cache e Estado
- **React Query** para cache de API (planejado)
- **Local Storage** para persistência
- **Session Storage** para dados temporários
- **Context API** para estado global

## 📜 Scripts Disponíveis

### Desenvolvimento
```bash
pnpm dev              # Desenvolvimento com Turbopack
pnpm build            # Build para produção
pnpm start            # Executar versão de produção
```

### Qualidade de Código
```bash
pnpm lint             # Verificar código com ESLint
pnpm lint:fix         # Corrigir problemas automaticamente
```

### Utilitários
```bash
pnpm type-check       # Verificação de tipos TypeScript
pnpm clean            # Limpar cache e builds
```

## 📁 Estrutura do Projeto

```
frontend/
├── 📁 public/                     # Arquivos estáticos
│   ├── 🖼️ favicon.ico            # Favicon
│   ├── 🖼️ logo.png               # Logo da aplicação
│   ├── 🖼️ icon-192.png           # Ícone PWA 192x192
│   ├── 🖼️ icon-512.png           # Ícone PWA 512x512
│   ├── 🖼️ apple-touch-icon.png   # Ícone Apple
│   ├── 📄 manifest.json          # Manifest PWA
│   ├── 📄 sw.js                  # Service Worker
│   ├── 📄 offline.html           # Página offline
│   └── 📄 test-sw.html           # Página de teste PWA
├── 📁 src/
│   ├── 📁 app/                   # App Router (Next.js 15)
│   │   ├── 📁 (auth)/           # Grupo de rotas de autenticação
│   │   │   ├── 📄 login/        # Página de login
│   │   │   └── 📄 register/     # Página de cadastro
│   │   ├── 📁 dashboard/        # Dashboard do usuário
│   │   │   ├── 📄 page.tsx      # Página principal
│   │   │   ├── 📄 history/      # Histórico de pesquisas
│   │   │   └── 📄 favorites/    # Palavras favoritas
│   │   ├── 📁 word/             # Páginas de palavras
│   │   │   └── 📄 [word]/       # Página dinâmica de palavra
│   │   ├── 📄 layout.tsx        # Layout raiz
│   │   ├── 📄 page.tsx          # Página inicial
│   │   ├── 📄 loading.tsx       # Loading global
│   │   ├── 📄 error.tsx         # Error boundary
│   │   ├── 📄 not-found.tsx     # Página 404
│   │   └── 📄 globals.css       # Estilos globais
│   ├── 📁 components/           # Componentes React
│   │   ├── 📁 ui/              # Componentes base (Shadcn/ui)
│   │   │   ├── 📄 button.tsx    # Componente Button
│   │   │   ├── 📄 input.tsx     # Componente Input
│   │   │   ├── 📄 dialog.tsx    # Componente Dialog
│   │   │   ├── 📄 toast.tsx     # Componente Toast
│   │   │   └── 📄 ...           # Outros componentes UI
│   │   ├── 📁 layout/          # Componentes de layout
│   │   │   ├── 📄 header.tsx    # Cabeçalho
│   │   │   ├── 📄 sidebar.tsx   # Barra lateral
│   │   │   └── 📄 footer.tsx    # Rodapé
│   │   ├── 📁 features/        # Componentes de funcionalidades
│   │   │   ├── 📄 word-card.tsx # Card de palavra
│   │   │   ├── 📄 search-bar.tsx # Barra de pesquisa
│   │   │   ├── 📄 user-profile.tsx # Perfil do usuário
│   │   │   ├── 📄 pwa-banner.tsx # Banner de instalação PWA
│   │   │   ├── 📄 pwa-notifications.tsx # Notificações PWA
│   │   │   ├── 📄 pwa-provider.tsx # Provider PWA
│   │   │   └── 📄 ...           # Outros componentes
│   │   └── 📁 common/          # Componentes comuns
│   │       ├── 📄 loading.tsx   # Loading spinner
│   │       ├── 📄 error.tsx     # Error display
│   │       └── 📄 theme-toggle.tsx # Alternador de tema
│   ├── 📁 hooks/               # Custom hooks
│   │   ├── 📄 use-auth.ts      # Hook de autenticação
│   │   ├── 📄 use-api.ts       # Hook para API calls
│   │   ├── 📄 use-local-storage.ts # Hook para localStorage
│   │   ├── 📄 use-debounce.ts  # Hook de debounce
│   │   ├── 📄 usePwaPrompt.ts  # Hook de instalação PWA
│   │   └── 📄 useServiceWorker.ts # Hook do service worker
│   ├── 📁 actions/             # Server actions
│   │   ├── 📄 auth.ts          # Ações de autenticação
│   │   ├── 📄 words.ts         # Ações de palavras
│   │   └── 📄 user.ts          # Ações de usuário
│   ├── 📁 context/             # React Context
│   │   ├── 📄 auth-context.tsx # Contexto de autenticação
│   │   └── 📄 theme-context.tsx # Contexto de tema
│   ├── 📁 lib/                 # Utilitários e configurações
│   │   ├── 📄 utils.ts         # Funções utilitárias
│   │   ├── 📄 api.ts           # Configuração da API
│   │   ├── 📄 auth.ts          # Utilitários de autenticação
│   │   └── 📄 validations.ts   # Schemas de validação
│   ├── 📁 types/               # Definições TypeScript
│   │   ├── 📄 auth.ts          # Tipos de autenticação
│   │   ├── 📄 api.ts           # Tipos da API
│   │   └── 📄 global.ts        # Tipos globais
│   ├── 📁 views/               # Views/páginas complexas
│   │   ├── 📄 home-view.tsx    # View da página inicial
│   │   ├── 📄 dashboard-view.tsx # View do dashboard
│   │   └── 📄 word-view.tsx    # View de palavra
│   └── 📄 middleware.ts        # Middleware do Next.js
├── 📄 components.json          # Configuração Shadcn/ui
├── 📄 next.config.ts           # Configuração Next.js
├── 📄 package.json             # Dependências e scripts
├── 📄 tsconfig.json            # Configuração TypeScript
├── 📄 tailwind.config.js       # Configuração Tailwind
├── 📄 postcss.config.mjs       # Configuração PostCSS
├── 📄 eslint.config.mjs        # Configuração ESLint
└── 📄 README.md                # Este arquivo
```

## 🛠️ Tecnologias

### Core
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca de interface
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem principal

### Estilização
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes elegantes
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones consistentes

### Animações & UX
- **[Framer Motion](https://www.framer.com/motion/)** - Animações fluidas
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Suporte a temas
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Formulários & Validação
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integração Zod

### HTTP & Estado
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[Class Variance Authority](https://cva.style/docs)** - Variantes de componentes
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes CSS

### Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge)** - Merge de classes Tailwind

## 🚀 Próximos Passos

### Melhorias Planejadas
- [ ] **React Query** - Cache e sincronização de dados
- [ ] **Storybook** - Documentação de componentes
- [ ] **Testing Library** - Testes de componentes
- [ ] **Playwright** - Testes end-to-end
- [ ] **Internacionalização** - Suporte a múltiplos idiomas
- [ ] **Analytics** - Tracking de uso
- [ ] **Error Boundary** - Tratamento avançado de erros

### Otimizações
- [ ] **Bundle Analyzer** - Análise de bundle
- [ ] **Performance Monitoring** - Métricas de performance
- [ ] **SEO Optimization** - Otimização para motores de busca
- [ ] **Accessibility** - Melhorias de acessibilidade

### Funcionalidades
- [ ] **Busca Avançada** - Filtros e ordenação
- [ ] **Compartilhamento** - Share de palavras
- [ ] **Exportação** - Export de favoritos/histórico
- [ ] **Gamificação** - Sistema de pontos e conquistas

## 🤝 Contribuição

### Como Contribuir (e se divertir no processo! 🎉)

1. **Fork** o projeto (sim, é seu agora! 🍴)
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request (e aguarde os elogios! 🌟)

### Padrões de Código

- Siga as configurações do **ESLint**
- Use **TypeScript** para type safety
- Mantenha **componentes pequenos** e reutilizáveis
- Use **Conventional Commits** para mensagens
- Documente **novos componentes**

### Executando Localmente

```bash
# Clone o fork
git clone https://github.com/ezequiel88/fullstack-dictionary.git

# Instale dependências
cd fullstack-dictionary/frontend
pnpm install

# Configure ambiente
cp .env.example .env.local

# Inicie desenvolvimento
pnpm dev
```

### Adicionando Componentes

```bash
# Adicionar componente Shadcn/ui
npx shadcn@latest add button

# Ou usando pnpm
pnpm dlx shadcn@latest add dialog
```

## 📄 Licença & Aprendizado

Este projeto está sob a licença **ISC** - isso significa que você pode usar, modificar, distribuir e aprender com este código livremente! 🎓

**💡 Sinta-se à vontade para:**
- 📖 Estudar a arquitetura e implementações
- 🔧 Usar como base para seus próprios projetos
- 🚀 Experimentar com novas funcionalidades
- 📚 Aprender sobre Next.js, React e boas práticas
- 🤝 Compartilhar conhecimento com outros desenvolvedores

> **"O conhecimento cresce quando compartilhado"** - Este projeto foi criado não apenas como uma solução técnica, mas como uma oportunidade de aprendizado para toda a comunidade dev! 🌟

## 👨‍💻 Autor

**Ezequiel Tavares**
- GitHub: [@ezequiel88](https://github.com/ezequiel88)

---

## 📞 Suporte

Ficou com alguma dúvida? Não se preocupe, todos nós já passamos por isso! 🤗

1. **Verifique** a [documentação do Next.js](https://nextjs.org/docs) (ela é sua amiga! 📖)
2. **Consulte** os [issues existentes](https://github.com/ezequiel88/fullstack-dictionary/issues) (talvez alguém já teve a mesma dúvida)
3. **Abra** um novo issue se necessário (sem vergonha, estamos aqui para ajudar! 💪)

---

> This is a challenge by [Coodesh](https://coodesh.com/)

---

<div align="center">

**[⬆ Voltar ao topo](#-dictionary-frontend)**

Made with ❤️, ☕ e muito NextJS para o Fullstack Challenge

*"Um bom frontend é como uma boa conversa - deve ser envolvente, claro e deixar você querendo mais!"* 😄

</div>
