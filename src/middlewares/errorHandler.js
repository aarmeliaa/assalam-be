/**
 * Global Error Handler Middleware
 * Catches all errors and returns a standardized response
 */

const errorHandler = (err, req, res, next) => {
    // Log error untuk debugging
    console.error('[ERROR]', {
        timestamp: new Date().toISOString(),
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode || 500
    });

    // Set default status code
    const statusCode = err.statusCode || 500;
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Response standard format
    const response = {
        success: false,
        message: err.message || 'Terjadi kesalahan pada server',
        ...(isDevelopment && { details: err.stack })
    };

    // Specific error handling
    if (err.name === 'PrismaClientValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Data tidak valid',
            details: isDevelopment ? err.message : undefined
        });
    }

    if (err.name === 'PrismaClientKnownRequestError') {
        // Handle unique constraint violations
        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: `Data sudah ada: ${err.meta?.target?.join(', ')}`
            });
        }
        // Handle record not found
        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token sudah kadaluarsa'
        });
    }

    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Ukuran file terlalu besar'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Terlalu banyak file'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }

    // Generic error response
    res.status(statusCode).json(response);
};

/**
 * 404 Not Found Handler
 * Harus diletakkan SETELAH semua route definitions
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route tidak ditemukan: ${req.method} ${req.path}`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
