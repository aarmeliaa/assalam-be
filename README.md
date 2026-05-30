# 🕌 Assalam Backend

REST API backend untuk aplikasi Assalam - Platform informasi masjid dengan fitur berita, jadwal kegiatan, jam operasional, dan integrasi peta lokasi.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma v6.19.2
- **Authentication**: Google OAuth + JWT
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 📋 Requirements

- Node.js v16 atau lebih tinggi
- npm atau yarn
- PostgreSQL database (atau gunakan Supabase)
- Google OAuth credentials

## 🔧 Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd assalam-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` berdasarkan template `.env.example`:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan nilai-nilai berikut:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"

# Supabase
SUPABASE_URL="https://[PROJECT-ID].supabase.co"
SUPABASE_KEY="your-supabase-api-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# JWT (generate string minimal 32 characters)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-characters-long"
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS (comma-separated URLs)
CORS_ORIGIN="http://localhost:3000,http://localhost:5173,https://assalam-fe.vercel.app"
```

### 4. Setup Database
Pastikan database sudah ter-create di Supabase, kemudian jalankan migrations:

```bash
npx prisma migrate dev
```

Atau untuk sync schema saja:
```bash
npx prisma db push
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Jalankan Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 📦 Scripts

```bash
# Development
npm run dev          # Jalankan dengan nodemon (auto-reload)

# Production
npm start            # Jalankan production server

# Testing
npm test             # Jalankan test suite

# Database
npx prisma studio   # Buka Prisma Studio (database GUI)
npx prisma migrate  # Manage migrations
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/google` - Login dengan Google OAuth
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout dan clear refresh token
- `DELETE /api/auth/account` - Hapus account (permanent)

### News (Berita)
- `GET /api/news` - Daftar semua berita
- `GET /api/news/:id` - Detail berita
- `POST /api/news` - Buat berita (ADMIN only)
- `PUT /api/news/:id` - Edit berita (ADMIN only)
- `DELETE /api/news/:id` - Hapus berita (ADMIN only)

### Activities (Kegiatan)
- `GET /api/activities` - Daftar semua kegiatan
- `GET /api/activities/:id` - Detail kegiatan
- `POST /api/activities` - Buat kegiatan (ADMIN only)
- `PUT /api/activities/:id` - Edit kegiatan (ADMIN only)
- `DELETE /api/activities/:id` - Hapus kegiatan (ADMIN only)
- `POST /api/activities/:activityId/join` - Ikuti kegiatan (USER/ADMIN)

### Operational Hours (Jam Operasional)
- `GET /api/operational-hours` - Daftar jam operasional
- `GET /api/operational-hours/:id` - Detail jam operasional
- `POST /api/operational-hours` - Buat jam operasional (ADMIN only)
- `PUT /api/operational-hours/:id` - Edit jam operasional (ADMIN only)
- `DELETE /api/operational-hours/:id` - Hapus jam operasional (ADMIN only)

### Locations (Lokasi Masjid)
- `GET /api/locations` - Daftar lokasi masjid
- `GET /api/locations/:id` - Detail lokasi masjid

### Home (Homepage)
- `GET /api/home` - Get homepage data (latest news + upcoming activities)

## 🔐 Security Features

- ✅ **Google OAuth Integration** - Secure authentication via Google
- ✅ **JWT Token Management** - Access token (15m) + Refresh token (7d)
- ✅ **Role-based Access Control** - USER vs ADMIN roles
- ✅ **Token Blacklisting** - Refresh token stored in database untuk logout
- ✅ **HttpOnly Cookies** - Refresh token tidak accessible via JavaScript
- ✅ **CORS Protection** - Environment-based whitelist
- ✅ **Input Validation** - express-validator untuk sanitasi data
- ✅ **Error Handling** - Global error handler untuk consistent error responses

## 📊 Database Schema

### Models
- **User** - User account dengan Google ID
- **RefreshToken** - Token blacklist untuk logout & multi-device sessions
- **News** - Artikel berita dengan author tracking
- **Activity** - Kegiatan/event dengan participants
- **ActivityParticipant** - Many-to-many relation antara User dan Activity
- **OperationalHour** - Jam operasional masjid per hari
- **MosqueLocation** - Koordinat lokasi masjid untuk Leaflet map

## 🛠️ Middleware

### Authentication
- `verifyToken` - Verify JWT access token
- `checkRole` - Verify user role (USER/ADMIN)
- `optionalAuth` - Optional authentication (tidak error jika token invalid)

### Validation
- `validateGoogleAuth` - Validasi Google OAuth
- `validateCreateNews` - Validasi input berita
- `validateCreateActivity` - Validasi input kegiatan
- `validateCreateOperationalHour` - Validasi jam operasional

### Error Handling
- Global error handler untuk PrismaErrors, JWTErrors, MultipartErrors
- Detailed error responses dengan proper HTTP status codes

## 📝 Environment Configuration

Semua config environment di-centralize di `src/config/env.js` untuk:
- ✅ Validation saat startup
- ✅ Type-safe configuration access
- ✅ Easy secrets management
- ✅ Environment-specific behavior

## 🚀 Deployment

### Vercel
Project sudah di-setup untuk deployment ke Vercel:

```bash
npm run build  # Build production
vercel deploy   # Deploy
```

Environment variables harus di-set di Vercel dashboard.

### Heroku (Alternative)
```bash
# Create app
heroku create assalam-backend

# Set environment variables
heroku config:set DATABASE_URL="..."
heroku config:set JWT_SECRET="..."
# ... set semua variables

# Deploy
git push heroku main
```

## 🐛 Troubleshooting

### Error: "Missing required environment variables"
- Pastikan semua variables di `.env` sudah di-set
- Copy dari `.env.example` jika belum ada template

### Error: "Token tidak valid"
- Cek JWT_SECRET dan JWT_REFRESH_SECRET sudah minimal 32 karakter
- Pastikan token belum expired

### Database connection error
- Cek DATABASE_URL dan DIRECT_URL sudah benar
- Pastikan Supabase project aktif dan database running

### CORS Error
- Update CORS_ORIGIN di `.env` dengan frontend URL Anda
- Format: `url1,url2,url3` (comma-separated tanpa spasi)

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'feat: add amazing feature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open Pull Request

## 📄 License

ISC

## 👨‍💻 Authors

- Azzahra Armelia Aina

---

**Made with 💚 for Islamic Community**
