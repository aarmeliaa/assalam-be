const { OAuth2Client } = require('google-auth-library');
const prisma = require('../config/prisma');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    
    return ticket.getPayload(); // { sub, email, name, picture, etc }
};

const findOrCreateUser = async (googlePayload) => {
    const { sub: googleId, email, name, picture } = googlePayload;
    
    let user = await prisma.user.findUnique({
        where: { googleId }
    });
    
    if (!user) {
        // Cek berdasarkan email kalau sudah pernah daftar
        user = await prisma.user.findUnique({
            where: { email }
        });
        
        if (user) {
            // Update googleId untuk user yang sudah ada
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId }
            });
        } else {
            // Buat user baru
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    googleId,
                    role: 'USER' // Default role
                }
            });
        }
    }
    
    return user;
};

module.exports = {
    verifyGoogleToken,
    findOrCreateUser
};