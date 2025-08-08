# 📚 Fullstack Dictionary

> **Desafio Técnico Coodesh** - Aplicação completa de dicionário online desenvolvida como demonstração de competências em arquitetura fullstack moderna.

Este projeto representa uma solução completa para consulta de palavras em inglês, implementando as melhores práticas de desenvolvimento, arquitetura limpa e tecnologias modernas.

## 🎯 Sobre o Desafio

Desenvolvimento de uma aplicação fullstack que permite:
- **Consulta de palavras** em inglês com definições detalhadas
- **Sistema de autenticação** completo com JWT
- **Histórico de palavras** consultadas pelo usuário
- **Favoritos** para palavras importantes
- **PWA** com funcionalidades offline

## 🚀 Tecnologias Principais

- **Backend**: Node.js + TypeScript + Fastify + Clean Architecture
- **Frontend**: Next.js 15 + React 19 + TypeScript + PWA
- **Database**: PostgreSQL + Redis (cache)
- **DevOps**: Docker + Docker Compose
- **Testes**: Jest + Testing Library

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Execução](#-execução)
- [Acessos](#-acessos)
- [Comandos Úteis](#-comandos-úteis)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Desenvolvimento](#-desenvolvimento)
- [Docker](#-docker)
- [Segurança](#-segurança)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Contribuição](#-contribuição)

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20 ou superior)
- **Docker Compose** (versão 2 ou superior)
- **Git** para clonar o repositório

*Opcional para desenvolvimento local:*
- **Node.js** (versão 18 ou superior)
- **pnpm** (recomendado) ou **npm**

## ⚡ Instalação Rápida

### 1. Clone o Repositório
```bash
git clone https://github.com/ezequiel88/fullstack-dictionary.git
cd fullstack-dictionary
```

### 2. Execução com Um Comando

#### Windows
```bash
start.bat
```

#### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

#### Ou Diretamente com Docker Compose
```bash
cd docker
docker-compose up --build -d
```

## 🚀 Execução

### Desenvolvimento (Docker)
```bash
# Subir todos os serviços
cd docker
docker-compose up --build -d

# Subir com logs visíveis
docker-compose up --build

# Subir apenas serviços essenciais (sem PgAdmin)
docker-compose up postgres redis backend frontend -d
```

### Produção
```bash
# Build e execução otimizada
cd docker
docker-compose -f docker-compose.yml up --build -d
```

## 🌐 Acessos

Após a execução, a aplicação estará disponível em:

- **🎨 Frontend (PWA)**: http://localhost:3000
- **🔧 Backend API**: http://localhost:3030
- **📖 API Documentation**: http://localhost:3030/docs
- **🗄️ PgAdmin** (opcional): http://localhost:5050
  - Email: `desafio@coodesh.com`
  - Senha: `admin`

### Credenciais de Desenvolvimento

**Banco de Dados:**
- Host: `localhost:5432`
- Database: `dictionary`
- User: `dictionary`
- Password: `dictionary`

**Redis:**
- Host: `localhost:6379`

## 🛠️ Comandos Úteis

### Gerenciamento de Containers
```bash
# Parar todos os serviços
cd docker
docker-compose down

# Parar e remover volumes (reset completo)
docker-compose down -v

# Reconstruir e reiniciar
docker-compose up --build -d

# Reiniciar apenas um serviço
docker-compose restart backend
```

### Logs e Monitoramento
```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Ver logs das últimas 100 linhas
docker-compose logs --tail=100 backend
```

### Perfis e Configurações
```bash
# Iniciar com PgAdmin (perfil admin)
docker-compose --profile admin up -d

# Executar comandos dentro dos containers
docker-compose exec backend npm run test
docker-compose exec postgres psql -U dictionary -d dictionary
```

## 🏗️ Arquitetura

Arquitetura fullstack moderna com separação clara de responsabilidades:

```
Frontend (Next.js 15 + PWA) ←→ Backend (Fastify + Clean Architecture) ←→ Database (PostgreSQL + Redis)
```

**Detalhes técnicos completos**: Consulte os READMEs específicos de cada módulo para informações detalhadas sobre arquitetura, padrões e implementação.

## 🌟 Funcionalidades Implementadas

- ✅ **Autenticação JWT** - Registro, login e proteção de rotas
- ✅ **Consulta de palavras** - Integração com DictionaryAPI externa
- ✅ **Histórico de pesquisas** - Palavras consultadas pelo usuário
- ✅ **Sistema de favoritos** - Salvar palavras importantes
- ✅ **Cache inteligente** - Redis para otimização de performance
- ✅ **PWA completo** - Instalação nativa e funcionalidades offline
- ✅ **Interface responsiva** - Design moderno com tema escuro/claro
- ✅ **Testes abrangentes** - Unitários e integração

## 🔧 Desenvolvimento Local

Para desenvolvimento detalhado, consulte os READMEs específicos:
- **[📚 Backend README](./backend/README.md)** - Clean Architecture, testes, API
- **[🎨 Frontend README](./frontend/README.md)** - PWA, componentes, hooks

## 🐳 Docker

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **frontend** | 3000 | Next.js 15 + PWA |
| **backend** | 3030 | Fastify + Clean Architecture |
| **postgres** | 5432 | PostgreSQL 16.4 |
| **redis** | 6379 | Cache Redis 7.2 |
| **pgadmin** | 5050 | Admin PostgreSQL (opcional) |

## 🔒 Segurança

⚠️ **Configurações atuais são para desenvolvimento**. Para produção, altere:
- Senhas padrão (PostgreSQL, PgAdmin)
- JWT_SECRET
- Configurar HTTPS e CORS
- Implementar rate limiting

## 📁 Estrutura do Projeto

```
fullstack-dictionary/
├── 📁 backend/          # API Node.js + Clean Architecture
├── 📁 frontend/         # Next.js 15 + PWA
├── 📁 docker/           # Docker Compose + Volumes
├── 📁 docs/             # Requisitos do desafio
├── 📄 start.bat         # Script Windows
└── 📄 start.sh          # Script Linux/Mac
```

## 🛠️ Stack Tecnológico

**Backend**: Node.js + TypeScript + Fastify + Prisma + PostgreSQL + Redis + JWT  
**Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind + PWA  
**DevOps**: Docker + Docker Compose

---

> **This is a challenge by [Coodesh](https://coodesh.com/)**

---

<div align="center">

**Desenvolvido como demonstração de competências em arquitetura fullstack moderna**

</div>