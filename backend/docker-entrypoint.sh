#!/bin/sh

echo "Starting backend application..."

# Wait for database to be ready and push schema
echo "Waiting for database to be ready and pushing schema..."
until npx prisma db push --accept-data-loss; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Import words if the words table is empty
echo "Checking if words need to be imported..."
WORD_COUNT=$(node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.word.count().then(count => { console.log(count); prisma.\$disconnect(); }).catch(() => { console.log('0'); process.exit(0); });" 2>/dev/null || echo "0")
if [ "$WORD_COUNT" = "0" ]; then
  echo "Importing words..."
  node scripts/importWords.js
else
  echo "Words already imported, skipping..."
fi

# Start the application
echo "Starting the application..."
exec node dist/main.js