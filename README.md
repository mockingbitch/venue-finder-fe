# VenueFinder Frontend (Next.js)

Giao diện Next.js (App Router, TypeScript, Tailwind CSS) cho VenueFinder.

---

## Mục lục

- [Docker (compose riêng + network)](#docker-compose-riêng--network)
- [Cài đặt (chạy tay)](#cài-đặt-chạy-tay)
- [Scripts](#scripts)
- [Biến môi trường](#biến-môi-trường)
- [Cấu trúc & Components](#cấu-trúc--components)
- [Kết nối API](#kết-nối-api)

---

## Docker (compose riêng + network)

Frontend dùng network **`venuefinder_network`**. Tạo trước từ thư mục gốc: `make network` hoặc `docker network create venuefinder_network`.

```bash
# Từ thư mục frontend
docker compose up -d --build
```

→ App: **http://localhost:3000**

---

## Cài đặt (chạy tay)

**Yêu cầu:** Node.js 18+ (khuyến nghị 20+), npm.

```bash
npm install
```

---

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy dev server (http://localhost:3000) |
| `npm run build` | Build production |
| `npm start` | Chạy production (sau khi build) |
| `npm run lint` | Chạy ESLint |

**Chạy dev:**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

---

## Biến môi trường

Tạo file **`.env.local`** trong thư mục `frontend`:

| Biến | Mô tả | Mặc định (nếu không set) |
|------|--------|---------------------------|
| `NEXT_PUBLIC_API_URL` | Base URL API backend | http://localhost:8000/api |

**Ví dụ `.env.local`:**

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Lưu ý:** Backend Laravel cần chạy tại URL tương ứng và bật CORS cho `http://localhost:3000` (hoặc domain frontend của bạn).

---

## Cấu trúc & Components

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout chính, metadata
│   │   ├── page.tsx         # Trang chủ (danh sách + map + filter)
│   │   └── globals.css      # Tailwind, biến CSS
│   ├── components/
│   │   ├── VenueList.tsx    # Danh sách venues, gọi API, filter, pagination
│   │   ├── VenueCard.tsx    # Card venue (ảnh, favorite, Request Quote)
│   │   ├── VenueMap.tsx     # Wrapper map, header "X Venues | Y Spaces"
│   │   ├── VenueMapInner.tsx # Leaflet map, marker, cluster, popup
│   │   ├── FavoriteButton.tsx # Nút heart, gọi toggle favorite
│   │   └── RequestQuoteModal.tsx # Modal form gửi quote request
│   └── lib/
│       └── api.ts           # Client API: types, fetchVenues, fetchMapVenues, ...
├── public/
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

**Chức năng chính:**

- **VenueList** – Gọi `GET /venues`, hiển thị grid VenueCard, filter (search, category, suburb), favorite IDs.
- **VenueCard** – Ảnh, tag OFFER, FavoriteButton, category, suburb, capacity, rating, price level, nút "Request Quote" mở RequestQuoteModal.
- **VenueMap / VenueMapInner** – Bản đồ Leaflet, marker đơn và cluster, popup; dữ liệu từ `GET /venues/map`.
- **FavoriteButton** – Gọi `POST /favorites/{id}/toggle`, cập nhật state favorite.
- **RequestQuoteModal** – Form (name, email, phone, event_date, guests, message) gửi `POST /quote-requests`.

---

## Kết nối API

- **Client:** `src/lib/api.ts` dùng `NEXT_PUBLIC_API_URL` (hoặc mặc định `http://localhost:8000/api`) cho mọi request.
- **CORS:** Backend phải cho phép origin frontend (vd. `http://localhost:3000`) trong `config/cors.php` và `FRONTEND_URL`.
- **Session (guest):** Favorite dùng `X-Session-Id` (lưu trong `sessionStorage` với key `venuefinder_session_id`).

Chi tiết API: xem [docs/API.md](../docs/API.md) và [backend/README.md](../backend/README.md).
