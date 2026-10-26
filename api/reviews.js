import { Redis } from '@upstash/redis';

// Vercel Marketplace (Upstash) define KV_REST_API_*; Upstash directo define UPSTASH_REDIS_REST_*
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY = 'reviews';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const reviews = await redis.lrange(KEY, 0, 99);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(reviews);
    }

    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const game = String(b.game || '').trim().slice(0, 80);
      const author = String(b.author || '').trim().slice(0, 40) || 'Anónimo';
      const text = String(b.text || '').trim().slice(0, 2000);
      const rating = Math.round(Number(b.rating));
      const image = String(b.image || '');

      if (!game || !text) return res.status(400).json({ error: 'Falta el nombre del juego o la reseña.' });
      if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ error: 'La puntuación debe ser de 1 a 5.' });
      if (image && !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(image)) {
        return res.status(400).json({ error: 'Miniatura no válida.' });
      }

      const review = { id: crypto.randomUUID(), game, author, rating, text, image, createdAt: Date.now() };
      await redis.lpush(KEY, review);
      await redis.ltrim(KEY, 0, 499);
      return res.status(201).json(review);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
