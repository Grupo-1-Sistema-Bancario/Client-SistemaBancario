FROM node:20-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and lock files
COPY package.json pnpm-lock.yaml* package-lock.json* pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install

# Copy application source code
COPY . .

# Expose port (Vite default is 5173)
EXPOSE 5173

# Run Vite in development mode listening on all hosts
CMD ["pnpm", "run", "dev", "--host"]
