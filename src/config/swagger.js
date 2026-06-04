const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Assalam Backend API',
      version: '1.0.0',
      description: 'REST API untuk aplikasi Assalam - Platform informasi masjid dengan fitur berita, jadwal kegiatan, jam operasional, dan integrasi peta lokasi.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login berhasil!' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                user: { '$ref': '#/components/schemas/User' },
              },
            },
          },
        },
        News: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            summary: { type: 'string', nullable: true },
            content: { type: 'string' },
            imageUrl: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED'] },
            authorId: { type: 'integer' },
            author: {
              type: 'object',
              properties: {
                name: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Activity: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OperationalHour: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            day: { type: 'string', example: 'Monday' },
            open: { type: 'string', example: '08:00' },
            close: { type: 'string', example: '20:00' },
            isClosed: { type: 'boolean', default: false },
          },
        },
        MosqueLocation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            address: { type: 'string' },
            latitude: { type: 'number', format: 'float' },
            longitude: { type: 'number', format: 'float' },
            imageUrl: { type: 'string', nullable: true },
            isMain: { type: 'boolean' },
          },
        },
        HomepageData: {
          type: 'object',
          properties: {
            news: {
              type: 'array',
              items: { '$ref': '#/components/schemas/News' },
            },
            activities: {
              type: 'array',
              items: { '$ref': '#/components/schemas/Activity' },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autentikasi pengguna' },
      { name: 'News', description: 'Berita masjid' },
      { name: 'Activities', description: 'Kegiatan masjid' },
      { name: 'Operational Hours', description: 'Jam operasional masjid' },
      { name: 'Locations', description: 'Lokasi masjid' },
      { name: 'Home', description: 'Data homepage' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
