const { verifyAccessToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access token tidak ditemukan!' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        
        // Attach user info ke request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        
        next();
        
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token tidak valid atau sudah expired!' 
        });
    }
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Anda belum login!' 
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Anda tidak memiliki akses untuk melakukan ini!' 
            });
        }
        
        next();
    };
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyAccessToken(token);
            
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        }
        
        next();
        
    } catch (error) {
        // Kalau token invalid, tetap lanjut tapi tanpa user
        next();
    }
};

module.exports = {
    verifyToken,
    checkRole,
    optionalAuth
};