FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json and turbo.json
COPY package.json yarn.lock turbo.json ./

# Copy all package.json files for workspaces
COPY packages/db/package.json ./packages/db/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source files and configs
COPY packages/db ./packages/db
COPY apps/web ./apps/web
COPY tsconfig*.json ./ || true  # Make tsconfig copy optional

# Build using Turborepo
RUN yarn turbo build --filter=web...

FROM node:20-alpine

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/packages/db/dist ./packages/db/dist

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

EXPOSE 3000

CMD ["yarn", "workspace", "web", "start"]
