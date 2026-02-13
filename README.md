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
- View venues list
- Interactive map with markers
- Marker clustering
- Click marker to highlight card
- Auto refetch when map bounds change

### Admin
- JWT login
- Create / Edit / Delete venues
- Protected routes
- Secure token storage (localStorage + cookie for middleware)

### Map
- react-leaflet
- Marker clustering (react-leaflet-markercluster)
- Bounding box filter sent to API on map move
- Synced map and list

## Project Structure

```
src/
├── app/
│   ├── admin/dashboard/     # Admin CRUD (protected)
│   ├── login/               # Login page
│   ├── venues/              # Public venue listing + map
│   ├── layout.tsx
│   ├── page.tsx             # Home
│   └── providers.tsx        # React Query
├── components/
│   ├── admin/               # VenueFormModal
│   ├── auth/                # ProtectedRoute
│   ├── map/                 # VenueMap, VenueMarker
│   └── venues/              # VenueCard
├── hooks/
│   └── useVenues.ts
├── lib/
│   └── axios.ts             # API client with JWT interceptors
├── services/
│   ├── api.ts               # Venues API
│   └── auth.service.ts
├── stores/
│   └── auth.store.ts        # Zustand auth state
├── types/
│   ├── auth.ts
│   └── venue.ts
└── middleware.ts            # Admin route protection
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set your API URL:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## API Contract

The frontend expects a backend with these endpoints:

### Auth
- `POST /api/auth/login` — `{ email, password }` → `{ token, user, expiresIn }`

### Venues
- `GET /api/venues` — Query: `?north=&south=&east=&west=` (bounding box)
- `GET /api/venues/:id`
- `POST /api/venues` — Auth required
- `PATCH /api/venues/:id` — Auth required
- `DELETE /api/venues/:id` — Auth required

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
