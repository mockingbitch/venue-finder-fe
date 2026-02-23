# Venue Finder

Production-ready Next.js 15 App Router application for discovering and managing venues.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Axios** (HTTP client)
- **React Query** (server state)
- **Zustand** (auth state)
- **Leaflet** + **react-leaflet** (maps, marker clustering)

## Features

### Public
- View venues list (paginated in admin; full list on public page)
- Interactive map with markers
- Marker clustering (react-leaflet-markercluster)
- Click marker to highlight card
- Map loads all venues in one request (`per_page=0`)

### Admin
- JWT login
- Create / Edit / Delete venues (CRUD)
- Protected routes (middleware)
- Secure token storage (localStorage + cookie for middleware)

### Map
- react-leaflet + react-leaflet-markercluster
- Single load of all venues for map (`GET /api/venues?per_page=0`)
- Synced map and list

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx         # Admin entry
│   │   └── dashboard/       # CRUD venues (protected)
│   ├── login/
│   ├── venues/              # Public listing + Leaflet map
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx        # React Query
├── components/
│   ├── admin/               # VenueFormModal
│   ├── auth/                # ProtectedRoute
│   ├── map/                 # VenueMap, VenueMarker, VenueMarkersCluster
│   └── venues/              # VenueCard
├── data/
│   └── mockVenues.ts        # Mock data when NEXT_PUBLIC_USE_MOCK_DATA not false
├── hooks/
│   └── useVenues.ts         # useVenues(bounds) — fetches with per_page=0 for map
├── lib/
│   └── axios.ts             # API client, JWT interceptors
├── services/
│   ├── api.ts               # venuesApi (getAll, getPaginated, CRUD)
│   └── auth.service.ts
├── stores/
│   └── auth.store.ts        # Zustand auth
├── types/
│   ├── auth.ts
│   └── venue.ts
└── middleware.ts            # Protects /admin
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` và set:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8089/api
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```

   Set `NEXT_PUBLIC_USE_MOCK_DATA=true` (hoặc bỏ dòng) để chạy không cần backend.  
   **Sau khi sửa file env, cần restart dev server** (`Ctrl+C` rồi `npm run dev` lại) thì mới nhận giá trị mới.

3. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## API Contract

The frontend expects a backend with these endpoints (base URL from `NEXT_PUBLIC_API_URL`):

### Auth
- `POST /api/auth/login` — body `{ email, password }` → `{ token, user, expiresIn }`

### Venues (public)
- `GET /api/venues` — Optional query: `min_lat`, `max_lat`, `min_lng`, `max_lng` (bounds), `per_page` (0 = all, used for map)
- `GET /api/venues?page=1&per_page=10` — Paginated list (Laravel-style `{ data, meta }`)
- `GET /api/venues/:id` — Single venue

### Venues (admin, auth required)
- `POST /api/admin/venues` — Create (body: name, lat, lng, price, description, address, capacity, images)
- `PUT /api/admin/venues/:id` — Update
- `DELETE /api/admin/venues/:id` — Delete

## Docker

```bash
# Build and run
docker-compose up -d

# Or build only
docker build -t venue-finder .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-api/api venue-finder
```

## Scripts

| Command  | Description        |
|----------|--------------------|
| `npm run dev`    | Start dev server   |
| `npm run build`  | Production build   |
| `npm run start`  | Start production   |
| `npm run lint`   | Run ESLint         |
