const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getHomepageData = async (req, res) => {
    try {
        const latestNews = await prisma.news.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: {
                author: {
                    select: { name: true }
                }
            }
        });

        const upcomingActivities = await prisma.activity.findMany({
            where: { startTime: { gte: new Date() } },
            orderBy: { startTime: 'asc' },
            take: 4
        });

        res.status(200).json({
            success: true,
            data: {
                news: latestNews,
                activities: upcomingActivities
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data homepage: ' + error.message });
    }
};

module.exports = { getHomepageData };