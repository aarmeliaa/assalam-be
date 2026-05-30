const app = require('./app');
const { config, validateConfig } = require('./config/env');

// Validate environment configuration
try {
    validateConfig();
} catch (error) {
    console.error('❌ Configuration Error:', error.message);
    process.exit(1);
}

// Start server
const server = app.listen(config.port, () => {
    console.log(`
    ╭─────────────────────────────────────╮
    │   🕌 Server Assalam berjalan di:    │
    │   http://localhost:${config.port}                │
    │   Environment: ${config.nodeEnv.padEnd(18)} │
    ╰─────────────────────────────────────╯
    `);
});

// Graceful Shutdown
process.on('SIGINT', () => {
    console.log('\n📴 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});