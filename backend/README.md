# 📚 Dictionary Backend API

Uma API REST robusta e escalável para um dicionário online que vai fazer você se apaixonar por **TypeScript**, **Fastify**, **Prisma** e os princípios da **Clean Architecture**! 💙

*Porque quem disse que código bem estruturado não pode ser divertido de desenvolver?* 😉

## 🚀 Características Principais

- ✅ **Clean Architecture** com separação clara de responsabilidades
- ✅ **TypeScript** para type safety e melhor experiência de desenvolvimento
- ✅ **Fastify** como framework web de alta performance
- ✅ **Prisma ORM** para gerenciamento de banco de dados
- ✅ **JWT Authentication** para autenticação segura
- ✅ **Redis Cache** para otimização de performance
- ✅ **Validação robusta** com Zod schemas
- ✅ **Testes abrangentes** (unitários e integração)
- ✅ **Documentação OpenAPI/Swagger** completa
- ✅ **ESLint** para qualidade de código
- ✅ **Dependency Injection** para melhor testabilidade

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Testes](#-testes)
- [Arquitetura](#-arquitetura)
- [API Endpoints](#-api-endpoints)
- [Banco de Dados](#-banco-de-dados)
- [Segurança](#-segurança)
- [Performance](#-performance)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Contribuição](#-contribuição)

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **pnpm** (recomendado)
- **PostgreSQL** (versão 12 ou superior)
- **Redis** (opcional, para cache)
- **Docker** (opcional, para execução com containers)

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/ezequiel88/fullstack-dictionary.git
cd fullstack-dictionary/backend
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
cp .env.example .env
```

2. **Configure as variáveis de ambiente:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dictionary_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3030
NODE_ENV="development"

# Redis (opcional)
REDIS_URL="redis://localhost:6379"

# External API
DICTIONARY_API_URL="https://api.dictionaryapi.dev/api/v2/entries/en"
```

3. **Configure o banco de dados:**
```bash
# Gerar o cliente Prisma
pnpm prisma:generate

# Executar migrações
pnpm prisma:migrate

# (Opcional) Popular com dados iniciais
node scripts/importWords.js
```

4. **Para testes, crie o arquivo `.env.test`:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dictionary_test_db"
JWT_SECRET="test-jwt-secret"
NODE_ENV="test"
```

## 🚀 Execução

### Desenvolvimento
```bash
# Modo desenvolvimento com hot reload
pnpm dev

# Ou
npm run dev
```

### Produção
```bash
# Build da aplicação
pnpm build

# Executar versão de produção
pnpm start
```

### Docker (Opcional)
```bash
# Subir todos os serviços (backend, database, redis)
docker-compose up -d

# Apenas o backend
docker-compose up backend
```

A API estará disponível em: `http://localhost:3030`

## 🧪 Testes

O projeto possui uma suíte completa de testes unitários e de integração:

```bash
# Executar todos os testes
pnpm test

# Testes em modo watch
pnpm test:watch

# Testes com relatório de cobertura
pnpm test:coverage

# Apenas testes unitários
pnpm test:unit

# Apenas testes de integração
pnpm test:integration

# Testes silenciosos
pnpm test:silent

# Limpar cache e executar testes
pnpm test:clean
```

### Cobertura de Testes
- **Controllers**: Testados com mocks e validação de responses
- **Services**: Lógica de negócio testada isoladamente
- **Repositories**: Testados com banco de dados em memória
- **Middlewares**: Validação, autenticação e tratamento de erros
- **Integração**: Fluxos completos da API

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, organizando o código em camadas bem definidas:

### Camadas da Arquitetura

```
┌─────────────────────────────────────┐
│           Infrastructure            │  ← Controllers, Routes, Database
├─────────────────────────────────────┤
│            Application              │  ← Use Cases, Services
├─────────────────────────────────────┤
│              Domain                 │  ← Entities, Interfaces
└─────────────────────────────────────┘
```

#### 🎯 Domain Layer (`src/domain/`)
- **Interfaces dos Repositórios**: Contratos para acesso a dados
- **Interfaces dos Serviços**: Contratos para serviços externos
- **Entidades de Negócio**: Regras e lógicas centrais

#### 🔄 Application Layer (`src/application/`)
- **User Service**: Lógica de negócio para usuários
- **Dictionary Service**: Lógica de negócio para dicionário
- **Use Cases**: Casos de uso da aplicação

#### 🛠️ Infrastructure Layer (`src/infrastructure/`)
- **HTTP**: Controllers, rotas e middlewares
- **Database**: Configuração e repositórios
- **Services**: Implementações de serviços externos
- **Container**: Dependency Injection
- **Validation**: Schemas de validação

### Dependency Injection
- **Container de Dependências**: Gerenciamento centralizado
- **Inversão de Controle**: Melhor testabilidade
- **Singleton Pattern**: Otimização de recursos

## 🌐 API Endpoints

### Autenticação
- `POST /auth/signup` - Cadastro de usuário
- `POST /auth/signin` - Login de usuário

### Usuário
- `GET /user/me` - Perfil do usuário autenticado
- `GET /user/me/history` - Histórico de palavras pesquisadas
- `GET /user/me/favorites` - Palavras favoritas

### Palavras
- `GET /entries/en` - Lista todas as palavras (paginada)
- `GET /entries/en/{word}` - Detalhes de uma palavra específica

### Favoritos
- `POST /user/me/{wordId}/favorite` - Adicionar palavra aos favoritos
- `DELETE /user/me/{wordId}/unfavorite` - Remover palavra dos favoritos

### Documentação
- `GET /docs` - Documentação Swagger/OpenAPI
- `GET /docs/json` - Schema OpenAPI em JSON

Para documentação completa da API, acesse: `http://localhost:3030/docs`

## 🗄️ Banco de Dados

### Schema do Banco

```sql
-- Usuários
User {
  id: String (CUID)
  name: String
  email: String (unique)
  password: String (hashed)
  createdAt: DateTime
}

-- Palavras
Word {
  id: String (CUID)
  value: String (unique)
}

-- Favoritos
Favorite {
  id: String (CUID)
  userId: String (FK)
  wordId: String (FK)
  -- Unique constraint: [userId, wordId]
}

-- Histórico
History {
  id: String (CUID)
  userId: String (FK)
  wordId: String (FK)
  -- Unique constraint: [userId, wordId]
}
```

### Migrações
```bash
# Criar nova migração
pnpm prisma migrate dev --name migration_name

# Aplicar migrações em produção
pnpm prisma migrate deploy

# Reset do banco (desenvolvimento)
pnpm prisma migrate reset
```

## 🔒 Segurança

### Autenticação JWT
- **Tokens seguros** com expiração configurável
- **Verificação de usuário ativo** em cada request
- **Headers de autorização** obrigatórios para rotas protegidas

### Validação de Entrada
- **Zod Schemas** para validação robusta
- **Sanitização de dados** automática
- **Mensagens de erro** detalhadas e seguras

### Schemas de Validação
- `signUpSchema`: Validação de cadastro
- `signInSchema`: Validação de login
- `wordQuerySchema`: Validação de busca
- `paginationQuerySchema`: Validação de paginação

### Middleware de Segurança
- **Rate Limiting** (planejado)
- **CORS** configurado
- **Helmet** para headers de segurança
- **Validação de entrada** em todas as rotas

## ⚡ Performance

### Cache com Redis
- **Cache de definições** de palavras externas
- **TTL configurável** para otimização
- **Interface abstrata** para fácil substituição

### Paginação Otimizada
- **Cursor-based pagination** para melhor performance
- **Limit e offset** configuráveis
- **Metadados de paginação** incluídos

### Otimizações
- **Conexão de banco** otimizada com Prisma
- **Queries eficientes** com índices apropriados
- **Compressão de responses** habilitada

## 📜 Scripts Disponíveis

### Desenvolvimento
```bash
pnpm dev              # Desenvolvimento com hot reload
pnpm build            # Build para produção
pnpm start            # Executar versão de produção
```

### Testes
```bash
pnpm test             # Todos os testes
pnpm test:watch       # Testes em modo watch
pnpm test:coverage    # Relatório de cobertura
pnpm test:unit        # Apenas testes unitários
pnpm test:integration # Apenas testes de integração
```

### Banco de Dados
```bash
pnpm prisma:generate  # Gerar cliente Prisma
pnpm prisma:migrate   # Executar migrações
pnpm prisma:migrate:test # Migrações para teste
```

### Qualidade de Código
```bash
pnpm lint             # Verificar código
pnpm lint:fix         # Corrigir problemas automaticamente
```

## 📁 Estrutura do Projeto

```
backend/
├── 📁 src/
│   ├── 📁 domain/                 # Camada de domínio
│   │   ├── 📁 repositories/       # Interfaces dos repositórios
│   │   └── 📁 services/          # Interfaces dos serviços
│   ├── 📁 application/           # Camada de aplicação
│   │   ├── 📄 user.service.ts    # Lógica de negócio de usuários
│   │   └── 📄 dictionary.service.ts # Lógica de negócio do dicionário
│   ├── 📁 infrastructure/        # Camada de infraestrutura
│   │   ├── 📁 container/         # Dependency injection
│   │   ├── 📁 database/          # Configuração do banco
│   │   ├── 📁 http/             # Controllers, rotas, middlewares
│   │   ├── 📁 repositories/      # Implementações dos repositórios
│   │   ├── 📁 services/         # Implementações dos serviços
│   │   ├── 📁 types/            # Tipos TypeScript
│   │   ├── 📁 utils/            # Utilitários
│   │   └── 📁 validation/       # Schemas de validação
│   ├── 📄 main.ts               # Ponto de entrada da aplicação
│   └── 📄 server.ts             # Configuração do servidor
├── 📁 tests/                    # Testes
│   ├── 📁 unit/                 # Testes unitários
│   ├── 📁 integration/          # Testes de integração
│   ├── 📄 setup.ts              # Configuração de testes
│   └── 📄 jest.setup.js         # Setup do Jest
├── 📁 prisma/                   # Configuração do Prisma
│   ├── 📁 migrations/           # Migrações do banco
│   └── 📄 schema.prisma         # Schema do banco
├── 📁 scripts/                  # Scripts utilitários
│   ├── 📄 english.txt           # Lista de palavras em inglês
│   └── 📄 importWords.js        # Script para importar palavras
├── 📄 package.json              # Dependências e scripts
├── 📄 tsconfig.json             # Configuração TypeScript
├── 📄 jest.config.js            # Configuração Jest
├── 📄 .eslintrc.json            # Configuração ESLint
├── 📄 openapi.yaml              # Documentação da API
└── 📄 README.md                 # Este arquivo
```

## 🛠️ Tecnologias

### Core
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem principal
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Fastify](https://www.fastify.io/)** - Framework web de alta performance

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados principal
- **[Prisma](https://www.prisma.io/)** - ORM e query builder
- **[Redis](https://redis.io/)** - Cache em memória

### Autenticação & Segurança
- **[JWT](https://jwt.io/)** - JSON Web Tokens
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Hash de senhas
- **[Zod](https://zod.dev/)** - Validação de schemas

### Testes
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[Supertest](https://github.com/visionmedia/supertest)** - Testes de API
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** - Jest com TypeScript

### Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linting de código
- **[tsx](https://github.com/esbuild-kit/tsx)** - Execução TypeScript
- **[dotenv](https://github.com/motdotla/dotenv)** - Variáveis de ambiente

### Documentação
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação da API
- **[@fastify/swagger](https://github.com/fastify/fastify-swagger)** - Plugin Swagger para Fastify

## 🚀 Próximos Passos

### Melhorias Planejadas
- [ ] **Rate Limiting** - Proteção contra abuso da API
- [ ] **Logs Estruturados** - Sistema de logging avançado
- [ ] **Health Checks** - Monitoramento de saúde da aplicação
- [ ] **Métricas de Performance** - Coleta de métricas detalhadas
- [ ] **CI/CD Pipeline** - Automação de deploy
- [ ] **Backup Automático** - Backup regular do banco de dados
- [ ] **Monitoramento** - Alertas e dashboards
- [ ] **Feature Flags** - Controle de funcionalidades

### Otimizações
- [ ] **Database Indexing** - Otimização de queries
- [ ] **Connection Pooling** - Gerenciamento de conexões
- [ ] **Response Compression** - Compressão de respostas
- [ ] **CDN Integration** - Cache distribuído

## 🤝 Contribuição

### Como Contribuir (e se divertir no processo! 🎉)

1. **Fork** o projeto (sim, é seu agora! 🍴)
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request (e aguarde os elogios! 🌟)

### Padrões de Código

- Siga as configurações do **ESLint**
- Mantenha **cobertura de testes** acima de 80%
- Use **Conventional Commits** para mensagens
- Documente **novas funcionalidades**

### Executando Localmente

```bash
# Clone o fork
git clone https://github.com/ezequiel88/fullstack-dictionary.git

# Instale dependências
cd fullstack-dictionary/backend
pnpm install

# Configure ambiente
cp .env.example .env

# Execute testes
pnpm test

# Inicie desenvolvimento
pnpm dev
```

## 📄 Licença & Aprendizado

Este projeto está sob a licença **ISC** - isso significa que você pode usar, modificar, distribuir e aprender com este código livremente! 🎓

**💡 Sinta-se à vontade para:**
- 📖 Estudar a arquitetura e implementações
- 🔧 Usar como base para seus próprios projetos
- 🚀 Experimentar com novas funcionalidades
- 📚 Aprender sobre Clean Architecture, TypeScript e boas práticas
- 🤝 Compartilhar conhecimento com outros desenvolvedores

> **"O conhecimento cresce quando compartilhado"** - Este projeto foi criado não apenas como uma solução técnica, mas como uma oportunidade de aprendizado para toda a comunidade dev! 🌟

## 👨‍💻 Autor

**Ezequiel Tavares**
- GitHub: [@ezequiel88](https://github.com/ezequiel88)

---

## 📞 Suporte

Ficou com alguma dúvida? Não se preocupe, todos nós já passamos por isso! 🤗

1. **Verifique** a [documentação da API](http://localhost:3030/docs) (ela é sua amiga! 📖)
2. **Consulte** os [issues existentes](https://github.com/ezequiel88/fullstack-dictionary/issues) (talvez alguém já teve a mesma dúvida)
3. **Abra** um novo issue se necessário (sem vergonha, estamos aqui para ajudar! 💪)

---

> This is a challenge by [Coodesh](https://coodesh.com/)

---

<div align="center">

**[⬆ Voltar ao topo](#-dictionary-backend-api)**

Made with ❤️, ☕ e muito TypeScript para o Fullstack Challenge

*"Código limpo é como uma boa piada - se você precisa explicar, provavelmente não está bom o suficiente!"* 😄

</div>