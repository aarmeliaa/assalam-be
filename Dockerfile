# 1. Ganti image Node.js menjadi versi 20
FROM node:20-alpine

# 2. Wajib untuk Prisma Engine di Alpine Linux
RUN apk add --no-cache openssl

# 3. Set folder kerja di dalam container
WORKDIR /app

# 4. Copy package.json
COPY package*.json ./

# 5. Copy folder prisma sebelum npm install
COPY prisma ./prisma/

# 6. Install dependency
RUN npm install

# 7. Generate Prisma Client
RUN npx prisma generate

# 8. Copy seluruh sisa kodingan
COPY . .

# 9. Buka port
EXPOSE 3000

# 10. Perintah menjalankan server
CMD ["npm", "start"]