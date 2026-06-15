const prisma = require('../config/prisma');
const { uploadToSupabase, deleteFromSupabase } = require('../middlewares/upload');

// Create
const createNews = async (req, res) => {
    try {
        const { title, summary, content, status } = req.body;
        const authorId = req.user.userId;
        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadToSupabase(req.file);
        }

        const newArticle = await prisma.news.create({
            data: {
                title,
                summary,
                content,
                status: status || 'DRAFT',
                imageUrl,
                authorId: parseInt(authorId)
            }
        });

        res.status(201).json({ 
            success: true, 
            message: 'Berita berhasil disimpan!', 
            data: newArticle 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menyimpan berita: ' + error.message });
    }
};

// Read (with pagination)
const getAllNews = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 10;
        const skip = (page - 1) * limit;

        const [newsList, total] = await Promise.all([
            prisma.news.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    author: {
                        select: { name: true }
                    }
                }
            }),
            prisma.news.count()
        ]);

        res.status(200).json({
            success: true,
            data: newsList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data berita: ' + error.message });
    }
};

// Update
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, status } = req.body;

        const existingNews = await prisma.news.findUnique({ 
            where: { id: parseInt(id) } 
        });
        
        if (!existingNews) {
            return res.status(404).json({ success: false, message: 'Berita tidak ditemukan!' });
        }

        let newImageUrl = existingNews.imageUrl;

        if (req.file) {
            await deleteFromSupabase(existingNews.imageUrl);
            newImageUrl = await uploadToSupabase(req.file);
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (summary !== undefined) updateData.summary = summary;
        if (content !== undefined) updateData.content = content;
        if (status !== undefined) updateData.status = status;
        updateData.imageUrl = newImageUrl;

        const updatedNews = await prisma.news.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.status(200).json({ 
            success: true, 
            message: 'Berita berhasil diperbarui!', 
            data: updatedNews 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui berita: ' + error.message });
    }
};

// Delete
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const existingNews = await prisma.news.findUnique({ 
            where: { id: parseInt(id) } 
        });

        if (!existingNews) {
            return res.status(404).json({ success: false, message: 'Berita tidak ditemukan!' });
        }

        await deleteFromSupabase(existingNews.imageUrl);

        await prisma.news.delete({ 
            where: { id: parseInt(id) } 
        });

        res.status(200).json({ success: true, message: 'Berita berhasil dihapus!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus berita: ' + error.message });
    }
};

// Read by Id
const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const newsItem = await prisma.news.findUnique({
            where: { id: parseInt(id) },
            include: {
                author: {
                    select: { name: true }
                }
            }
        });

        if (!newsItem) {
            return res.status(404).json({ success: false, message: 'Berita tidak ditemukan!' });
        }

        res.status(200).json({ success: true, data: newsItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil detail berita: ' + error.message });
    }
};

module.exports = { createNews, getAllNews, updateNews, deleteNews, getNewsById };