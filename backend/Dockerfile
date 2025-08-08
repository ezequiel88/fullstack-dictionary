# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN corepack enable pnpm && pnpm prisma:generate

# Build the application
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy built application
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/package.json ./package.json
COPY --from=builder --chown=backend:nodejs /app/prisma ./prisma
COPY --from=builder --chown=backend:nodejs /app/scripts ./scripts
COPY --from=builder --chown=backend:nodejs /app/openapi.yaml ./openapi.yaml

USER backend

EXPOSE 3030

ENV PORT=3030

# Create a startup script that handles database migration and seeding
COPY --chown=backend:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]