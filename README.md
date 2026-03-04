# Convites Digitais (PT-PT) — MVP

## Objetivo
MVP funcional hoje: criar convite, publicar e recolher RSVP.

## Estrutura
- `backend/` API (Express + SQLite)
- `frontend/` app Next.js (App Router)

## Arranque rapido (dev)

### API
```bash
cd backend
npm install
PORT=8787 CORS_ORIGIN=https://dev.tryklozt.com ADMIN_SECRET=dev-admin-secret npm run dev
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Por defeito, a frontend usa `https://dev-api.tryklozt.com`.

Para usar outra API, define `NEXT_PUBLIC_API_BASE` em `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_BASE=http://localhost:8787
```

### Build de producao
```bash
cd frontend
npm run build
npm run start
```

## Dominios de teste
- Frontend: **https://dev.tryklozt.com**
- API: **https://dev-api.tryklozt.com**

## Endpoints
- `POST /api/invites`
- `POST /api/invites/:slug/publish`
- `GET /api/invites/:slug`
- `POST /api/invites/:slug/rsvp`
- `GET /api/invites/:slug/rsvps?adminKey=...`

## Notas
- Pagamento esta em modo teste (publicacao imediata).
- Para producao, integrar Stripe Checkout e substituir o endpoint `/publish`.
