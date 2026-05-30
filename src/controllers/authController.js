const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { verifyGoogleToken, findOrCreateUser } = require('../services/authService');
const prisma = require('../config/prisma');

const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        
        if (!idToken) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID Token Google wajib diisi!' 
            });
        }
        
        // Verifikasi token Google
        const googlePayload = await verifyGoogleToken(idToken);
        
        // Cari atau buat user
        const user = await findOrCreateUser(googlePayload);
        
        // Generate JWT tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        
        const refreshToken = generateRefreshToken({
            userId: user.id
        });
        
        // Simpan refresh token ke database (untuk blacklist & multi-device)
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
            }
        });
        
        // Set refresh token sebagai httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only di production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
        });
        
        res.status(200).json({
            success: true,
            message: 'Login berhasil!',
            data: {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        });
        
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Autentikasi Google gagal: ' + error.message 
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token tidak ditemukan!' 
            });
        }
        
        // Cek apakah refresh token ada di database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });
        
        if (!storedToken) {
            return res.status(403).json({ 
                success: false, 
                message: 'Refresh token tidak valid!' 
            });
        }
        
        // Verifikasi refresh token
        const { verifyRefreshToken } = require('../utils/jwt');
        const decoded = verifyRefreshToken(refreshToken);
        
        // Generate access token baru
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        
        const newAccessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        
        res.status(200).json({
            success: true,
            data: { accessToken: newAccessToken }
        });
        
    } catch (error) {
        console.error('Refresh Token Error:', error);
        res.status(403).json({ 
            success: false, 
            message: 'Refresh token expired atau invalid!' 
        });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        // Hapus refresh token dari database (blacklist)
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            });
        }
        
        // Hapus cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.status(200).json({
            success: true,
            message: 'Logout berhasil!'
        });
        
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat logout!' 
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User tidak terautentikasi!' 
            });
        }
        
        // Cek user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User tidak ditemukan!' 
            });
        }
        
        // Hapus semua activity participation user
        await prisma.activityParticipant.deleteMany({
            where: { userId }
        });
        
        // Hapus semua news yang dibuat user
        await prisma.news.deleteMany({
            where: { authorId: userId }
        });
        
        // Hapus semua refresh tokens (cascade delete via Prisma)
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });
        
        // Hapus user account
        await prisma.user.delete({
            where: { id: userId }
        });
        
        // Hapus refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.status(200).json({
            success: true,
            message: 'Akun berhasil dihapus permanen. Semua data Anda telah dihapus dari sistem.'
        });
        
    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menghapus akun: ' + error.message 
        });
    }
};

module.exports = {
    googleAuth,
    refreshAccessToken,
    logout,
    deleteAccount
};