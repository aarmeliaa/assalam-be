const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Setting Multer
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // batas maksimal ukuran gambar: 5MB
});

const uploadToSupabase = async (file) => {
    const fileName = `article-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    const { data, error } = await supabase
        .storage
        .from('articles')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        throw new Error('Gagal upload gambar ke Supabase: ' + error.message);
    }

    const { data: publicUrlData } = supabase
        .storage
        .from('articles')
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
};

module.exports = { upload, uploadToSupabase, supabase };