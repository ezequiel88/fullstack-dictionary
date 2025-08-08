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
WORD_COUNT=$(echo "SELECT COUNT(*) FROM \"Word\";" | npx prisma db execute --stdin | tail -n 1 | tr -d ' ')
if [ "$WORD_COUNT" = "0" ]; then
  echo "Importing words..."
  node scripts/importWords.js
else
  echo "Words already imported, skipping..."
fi

# Start the application
echo "Starting the application..."
exec node dist/main.js