const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware untuk menangkap validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validasi data gagal',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Validation rules untuk Auth
 */
const validateGoogleAuth = [
    body('idToken')
        .notEmpty().withMessage('ID Token wajib diisi')
        .isString().withMessage('ID Token harus string'),
    handleValidationErrors
];

/**
 * Validation rules untuk News
 */
const validateCreateNews = [
    body('title')
        .trim()
        .notEmpty().withMessage('Judul wajib diisi')
        .isLength({ min: 3, max: 200 }).withMessage('Judul harus 3-200 karakter'),
    body('content')
        .trim()
        .notEmpty().withMessage('Konten wajib diisi')
        .isLength({ min: 10 }).withMessage('Konten minimal 10 karakter'),
    body('summary')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Summary maksimal 500 karakter'),
    body('status')
        .optional()
        .isIn(['DRAFT', 'PUBLISHED']).withMessage('Status harus DRAFT atau PUBLISHED'),
    handleValidationErrors
];

const validateUpdateNews = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID harus angka positif'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('Judul harus 3-200 karakter'),
    body('content')
        .optional()
        .trim()
        .isLength({ min: 10 }).withMessage('Konten minimal 10 karakter'),
    body('summary')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Summary maksimal 500 karakter'),
    body('status')
        .optional()
        .isIn(['DRAFT', 'PUBLISHED']).withMessage('Status harus DRAFT atau PUBLISHED'),
    handleValidationErrors
];

/**
 * Validation rules untuk Activity
 */
const validateCreateActivity = [
    body('title')
        .trim()
        .notEmpty().withMessage('Judul kegiatan wajib diisi')
        .isLength({ min: 3, max: 200 }).withMessage('Judul harus 3-200 karakter'),
    body('description')
        .trim()
        .notEmpty().withMessage('Deskripsi wajib diisi')
        .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter'),
    body('startDate')
        .notEmpty().withMessage('Tanggal mulai wajib diisi')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Format tanggal mulai harus YYYY-MM-DD'),
    body('startTime')
        .notEmpty().withMessage('Jam mulai wajib diisi')
        .matches(/^\d{2}:\d{2}$/).withMessage('Format jam mulai harus HH:mm'),
    body('endDate')
        .notEmpty().withMessage('Tanggal selesai wajib diisi')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Format tanggal selesai harus YYYY-MM-DD'),
    body('endTime')
        .notEmpty().withMessage('Jam selesai wajib diisi')
        .matches(/^\d{2}:\d{2}$/).withMessage('Format jam selesai harus HH:mm'),
    handleValidationErrors
];

const validateUpdateActivity = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID harus angka positif'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('Judul harus 3-200 karakter'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter'),
    body('startDate')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Format tanggal mulai harus YYYY-MM-DD'),
    body('startTime')
        .optional()
        .matches(/^\d{2}:\d{2}$/).withMessage('Format jam mulai harus HH:mm'),
    body('endDate')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Format tanggal selesai harus YYYY-MM-DD'),
    body('endTime')
        .optional()
        .matches(/^\d{2}:\d{2}$/).withMessage('Format jam selesai harus HH:mm'),
    handleValidationErrors
];

/**
 * Validation rules untuk Operational Hours
 */
const validateCreateOperationalHour = [
    body('day')
        .trim()
        .notEmpty().withMessage('Hari wajib diisi')
        .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        .withMessage('Hari tidak valid'),
    body('open')
        .trim()
        .notEmpty().withMessage('Jam buka wajib diisi')
        .matches(/^\d{2}:\d{2}$/).withMessage('Format jam harus HH:mm'),
    body('close')
        .trim()
        .notEmpty().withMessage('Jam tutup wajib diisi')
        .matches(/^\d{2}:\d{2}$/).withMessage('Format jam harus HH:mm'),
    body('isClosed')
        .optional()
        .isBoolean().withMessage('isClosed harus boolean'),
    handleValidationErrors
];

/**
 * Validation untuk ID parameter
 */
const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID harus angka positif'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateGoogleAuth,
    validateCreateNews,
    validateUpdateNews,
    validateCreateActivity,
    validateUpdateActivity,
    validateCreateOperationalHour,
    validateId
};
