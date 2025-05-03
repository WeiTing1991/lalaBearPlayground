FROM node:22-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR  /app

COPY ../package.json ../package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci;\
  else echo "No Lockfile found." && exit 1; \
  fi


# Rebuild the soucrce code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f package-lock.json ]; then npm run build;\
  else echo "No Lockfile found." && exit 1; \
  fi

# Prodcution image copy all the file and run next

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 lalabargroup
RUN adduser --system --uid 1001 -G lalabargroup -D lalabar

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER lalabar

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]
