FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json and turbo.json
COPY package.json yarn.lock turbo.json ./

# Copy all package.json files for workspaces
COPY packages/db/package.json ./packages/db/
COPY apps/agent/package.json ./apps/agent/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source files and configs
COPY packages/db ./packages/db
COPY apps/agent ./apps/agent
COPY apps/agent/tsconfig*.json ./

# Build using Turborepo
RUN yarn turbo build --filter=agent...

FROM node:20-alpine

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/apps/agent/package.json ./apps/agent/
COPY --from=builder /app/apps/agent/dist ./apps/agent/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

EXPOSE 8080

CMD ["yarn", "workspace", "agent", "start:prod"]
