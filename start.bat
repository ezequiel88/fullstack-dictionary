@echo off
echo ========================================
echo   Fullstack Dictionary - Deploy
echo ========================================
echo.
echo Iniciando a aplicacao completa...
echo.

cd docker

echo Parando containers existentes...
docker-compose down

echo.
echo Construindo e iniciando os servicos...
docker-compose up --build -d

echo.
echo ========================================
echo   Aplicacao iniciada com sucesso!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3030
echo Documentação API: http://localhost:3030/docs
echo PgAdmin (opcional): http://localhost:5050 (usuario: desafio@coodesh.com, senha: admin)
echo.
echo Para parar a aplicacao, execute:
echo   docker-compose down
echo.
echo Para ver os logs, execute:
echo   docker-compose logs -f
echo ========================================

pause