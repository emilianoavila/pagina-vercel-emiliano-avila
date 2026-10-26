import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const type = req.headers['content-type'] || '';
  if (!/^image\/(jpeg|png|webp)$/.test(type)) {
    return res.status(400).json({ error: 'Solo se permiten imágenes JPG, PNG o WebP.' });
  }
  try {
    const blob = await put(`miniaturas/${Date.now()}.jpg`, req, {
      access: 'public',
      addRandomSuffix: true,
      contentType: type,
    });
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'No se pudo subir la imagen.' });
  }
}
