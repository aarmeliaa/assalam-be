# Gunakan image Node.js versi 18 Alpine
FROM node:18-alpine

# Wajib untuk Prisma Engine di Alpine Linux
RUN apk add --no-cache openssl

# Set folder kerja di dalam container
WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy folder prisma dan generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy seluruh sisa kodingan
COPY . .

# Buka port
EXPOSE 3000

# Perintah menjalankan server
CMD ["npm", "start"]