# Fullstack Dictionary

Uma aplicação completa de dicionário com backend em Node.js/Fastify e frontend em Next.js.

## 🚀 Deploy Rápido com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Instalação e Execução (Um Comando)

#### Windows
```bash
start.bat
```

#### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

#### Ou diretamente com Docker Compose
```bash
cd docker
docker-compose up --build -d
```

### Acessos

Após a execução, a aplicação estará disponível em:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3030
- **PgAdmin** (opcional): http://localhost:5050
  - Email: desafio@coodesh.com
  - Senha: admin1234

### Comandos Úteis

```bash
# Parar a aplicação
cd docker
docker-compose down

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Iniciar apenas com PgAdmin
docker-compose --profile admin up -d

# Reconstruir e reiniciar
docker-compose up --build -d
```

## 📁 Estrutura do Projeto

```
├── backend/          # API Node.js com Fastify
├── frontend/         # Aplicação Next.js
├── docker/           # Configurações Docker
├── docs/            # Documentação
├── start.bat        # Script de inicialização Windows
└── start.sh         # Script de inicialização Linux/Mac
```

## 🔧 Desenvolvimento

Para desenvolvimento local sem Docker, consulte os READMEs específicos:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🐳 Detalhes do Docker

### Serviços

- **postgres**: Banco de dados PostgreSQL
- **redis**: Cache Redis
- **backend**: API Node.js
- **frontend**: Aplicação Next.js
- **pgadmin**: Interface de administração do PostgreSQL (opcional)

### Volumes

- `pgdata`: Dados persistentes do PostgreSQL
- `redisdata`: Dados persistentes do Redis

### Rede

Todos os serviços estão na rede `dictionary` para comunicação interna.

## 🔒 Segurança

⚠️ **Importante**: As configurações atuais são para desenvolvimento. Para produção:

1. Altere as senhas padrão
2. Configure variáveis de ambiente seguras
3. Use HTTPS
4. Configure firewall adequadamente

## 📝 Funcionalidades

- ✅ Autenticação JWT
- ✅ Busca de palavras
- ✅ Histórico de palavras
- ✅ Favoritos
- ✅ Cache Redis
- ✅ API REST documentada
- ✅ Interface responsiva
- ✅ PWA (Progressive Web App)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.