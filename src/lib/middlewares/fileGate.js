import multer from 'multer';

const storage = multer.memoryStorage();

const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
    tiposPermitidos.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Tipo de arquivo não permitido. Apenas imagens (JPEG, PNG, WEBP, GIF).'));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});
