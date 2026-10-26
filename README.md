# Mando Abierto – Reseñas de videojuegos (Vercel)

## Estructura
- `public/index.html` → frontend estático
- `api/reviews.js` → GET (listar) y POST (crear) reseñas · guarda en Upstash Redis
- `api/upload.js` → sube la miniatura a Vercel Blob

## Despliegue
1. Sube esta carpeta a un repositorio de GitHub e impórtalo en vercel.com (o ejecuta `npx vercel`).
2. En el proyecto de Vercel → **Storage**:
   - Crea un **Blob store** (define `BLOB_READ_WRITE_TOKEN` automáticamente).
   - Añade **Upstash Redis** desde el Marketplace (define `KV_REST_API_URL` y `KV_REST_API_TOKEN`).
3. Vuelve a desplegar. Listo.

## Desarrollo local
```
npm install
npx vercel link
npx vercel env pull .env.local
npx vercel dev
```
