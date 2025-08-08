#!/bin/bash

echo "========================================"
echo "   Fullstack Dictionary - Deploy"
echo "========================================"
echo ""
echo "Iniciando a aplicação completa..."
echo ""

cd infra

echo "Parando containers existentes..."
docker-compose down

echo ""
echo "Construindo e iniciando os serviços..."
docker-compose up --build -d

echo ""
echo "========================================"
echo "   Aplicação iniciada com sucesso!"
echo "========================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3030"
echo "PgAdmin (opcional): http://localhost:5050 (usuário: desafio@coodesh.com, senha: admin)"
echo ""
echo "Para parar a aplicação, execute:"
echo "  docker-compose down"
echo ""
echo "Para ver os logs, execute:"
echo "  docker-compose logs -f"
echo "========================================"