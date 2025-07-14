# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Stage 2: Runtime
FROM node:18-alpine AS runtime

# Create app directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app .

# Expose API port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

