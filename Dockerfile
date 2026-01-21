# -----------------------------
# Build stage
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build


# -----------------------------
# Runtime stage
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only what is needed to run the app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Expose app port (optional, for documentation)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
