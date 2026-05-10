# Use Linux Debian with Node.js
FROM node:18-bullseye-slim

# Open working directory
WORKDIR /app

# Install OPENSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json
COPY package*.json ./

# Install all module
RUN npm install

# Copy all source code to container
COPY . .

# Build prisma client
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["node", "src/app.js"]