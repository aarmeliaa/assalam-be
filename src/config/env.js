require('dotenv').config();

/**
 * Environment Configuration
 * Centralized configuration untuk semua environment variables
 */

const config = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    // Database
    database: {
        url: process.env.DATABASE_URL,
        directUrl: process.env.DIRECT_URL
    },

    // Supabase
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY
    },

    // Google OAuth
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
    },

    // Resend email
    resend: {
        apiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL
    },

    // CORS
    cors: {
        origin: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(',').map(url => url.trim()),
        credentials: true
    }
};

/**
 * Validate required environment variables
 */
const validateConfig = () => {
    const requiredVars = [
        'DATABASE_URL',
        'DIRECT_URL',
        'SUPABASE_URL',
        'SUPABASE_KEY',
        'GOOGLE_CLIENT_ID',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'RESEND_API_KEY',
        'RESEND_FROM_EMAIL'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}. ` +
            `Please check your .env file against .env.example`
        );
    }

    // Validate JWT secrets length
    if (process.env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    if (process.env.JWT_REFRESH_SECRET.length < 32) {
        throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
    }

    console.log('✅ Environment configuration validated successfully');
};

module.exports = {
    config,
    validateConfig
};
