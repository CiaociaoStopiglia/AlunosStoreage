import sharp from 'sharp';
import supabase from '../services/supabase.js';

const BUCKET = 'arquivos';

const prepararFoto = async (buffer) =>
    sharp(buffer).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();

export const upload = async (id, file) => {
    const ehFoto = file.mimetype.startsWith('image/');

    const buffer = ehFoto ? await prepararFoto(file.buffer) : file.buffer;
    const path = ehFoto
        ? `${id}/foto.webp`
        : `${id}/documento.${file.originalname.split('.').pop()}`;
    const contentType = ehFoto ? 'image/webp' : file.mimetype;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType, upsert: true });

    if (error) throw new Error(error.message);

    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

export const uploadViaUrl = async (id, imageUrl) => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error('Falha ao baixar imagem a partir da URL fornecida.');
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const optimizedBuffer = await prepararFoto(buffer);
    const path = `${id}/foto.webp`;
    const contentType = 'image/webp';

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, optimizedBuffer, { contentType, upsert: true })

    if (error) throw new Error(error.message);

    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export const deletar = async (url) => {
    if (!url) return;

    const partes = url.split(`${BUCKET}/`);
    if (partes.length < 2) return;

    const path = partes[1];
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(error.message);
};
