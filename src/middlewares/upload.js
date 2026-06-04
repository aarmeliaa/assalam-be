const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { config } = require('../config/env');

const supabase = createClient(config.supabase.url, config.supabase.key);

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const bucketName = 'articles';

const uploadToSupabase = async (file) => {
    const fileName = `article-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        throw new Error('Gagal upload gambar ke Supabase: ' + error.message);
    }

    const { data: publicUrlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
};

const deleteFromSupabase = async (imageUrl) => {
    if (!imageUrl) return;

    const fileName = imageUrl.split('/').pop();
    
    const { error } = await supabase
        .storage
        .from(bucketName)
        .remove([fileName]);

    if (error) {
        console.error('Gagal hapus gambar lama dari Supabase:', error.message);
    }
};

module.exports = { upload, uploadToSupabase, deleteFromSupabase, supabase };
