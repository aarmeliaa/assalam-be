const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadToSupabase } = require('../middlewares/upload');

// Create
const createNews = async (req, res) => {
    try {
        const { title, summary, content, status, authorId } = req.body;
        let imageUrl = null;

        if (!title || !content || !authorId) {
            return res.status(400).json({ success: false, message: 'Judul, konten, dan Author ID wajib diisi!' });
        }

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

// Read
const getAllNews = async (req, res) => {
    try {
        const newsList = await prisma.news.findMany({
            orderBy: { createdAt: 'desc' }, 
            include: {
                author: {
                    select: { name: true } 
                }
            }
        });

        res.status(200).json({ success: true, data: newsList });
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
            newImageUrl = await uploadToSupabase(req.file);
            // To-do: tambahkan fungsi untuk menghapus gambar lama agar hemat resource.
        }

        const updatedNews = await prisma.news.update({
            where: { id: parseInt(id) },
            data: {
                title: title || existingNews.title,
                summary: summary || existingNews.summary,
                content: content || existingNews.content,
                status: status || existingNews.status,
                imageUrl: newImageUrl
            }
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

        await prisma.news.delete({ 
            where: { id: parseInt(id) } 
        });

        res.status(200).json({ success: true, message: 'Berita berhasil dihapus!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus berita: ' + error.message });
    }
};

module.exports = { createNews, getAllNews, updateNews, deleteNews };