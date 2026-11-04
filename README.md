# StudioSpace

**Live site:** https://app-studio-client.vercel.app
**API:** https://app-studio-server.vercel.app

StudioSpace is a high-performance peer-to-peer marketplace for creative spaces — a one-stop booking platform where creators, filmmakers, photographers, podcasters and musicians discover, filter, inspect dynamic availability and reserve studio slots with transparent pricing and real-time booking management. Studio owners list spaces ranging from photography cyc walls and cinema sound stages to podcast lounges, music recording suites and art workshops.

## ✨ Features

- **Hero slider + dynamic featured studios** — an interactive 3-slide Swiper.js banner and a "Top-rated studios" grid fetched live from MongoDB (`.limit(6)`), plus browsable studio categories that deep-link into pre-filtered search results.
- **Full authentication** — email/password login & registration with password validation (uppercase, lowercase, 6+ characters), optional Google social login, JWT stored in **HTTPOnly cookies**, and private-route guarding that never logs a signed-in user out on reload.
- **Complete studio CRUD** — hosts add studios through a rich form (category select, hourly rate, security deposit, max capacity, amenities tags, imgbb image upload/URL, read-only host info), manage them in *My Studio Listings*, update them in a pre-filled edit form, and delete only after a confirmation modal.
- **Booking system with double-booking protection** — booking modal with live price calculation; the server rejects overlapping reservations against existing *Confirmed/Pending* bookings with a clear error. *My Bookings* shows status badges (Pending / Confirmed / Completed / Cancelled), cancel actions for pending slots and downloadable **PDF invoices** for confirmed bookings.
- **Challenge 3: theme customization** — a light ⇄ dark toggle in the navbar that restyles the entire system, persisted across sessions.
- **Polish across the board** — branded skeleton loaders on every route transition, custom 404 page with a "Return to Home" CTA, modern toast notifications (Sonner) for every auth/CRUD/booking action, friendly empty states with CTAs, saved-studios wishlist with heart icons, and a fully responsive layout (mobile / tablet / desktop).

## 🛠 Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4, Swiper.js, Sonner, next-themes, Lucide, jsPDF |
| Backend | Express 5 (Node.js), MongoDB (native driver), JSON Web Tokens, bcryptjs |
| Auth | JWT in HTTPOnly cookies + Google Identity Services |
| Media | Unsplash imagery, imgbb direct upload integration |

## 💻 Local Setup

```bash
# 1. Backend (Express + MongoDB)
cd app-studio-server
cp .env.example .env          # add your MONGODB_URI (and optional GOOGLE_CLIENT_ID)
npm install
npm run seed                  # seeds 12 studios, 3 demo users and sample bookings
npm run dev                   # API runs on http://localhost:5000

# 2. Frontend (Next.js)
cd ../app-studio-client
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev                   # app runs on http://localhost:3000
```

## 🧪 Examiner Test Credentials

Use these seeded accounts (created by `npm run seed` on the server):

| Role | Email | Password |
| --- | --- | --- |
| Host / renter (primary) | `sarah@studiospace.io` | `Demo1234` |
| Host | `marcus@studiospace.io` | `Demo1234` |
| Renter | `aisha@studiospace.io` | `Demo1234` |

> Google sign-in activates automatically once `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (client) and `GOOGLE_CLIENT_ID` (server) are set; until then the button explains how to enable it.

## 🔐 Challenges Implemented

1. **JWT security with HTTPOnly cookies** — `POST /api/studios`, `DELETE /api/studios/:id`, `POST /api/bookings` and all private routes reject unauthorized requests with `401`.
2. **Booking double-booking prevention** — the server verifies time overlaps against existing Confirmed/Pending bookings before saving a reservation.
3. **Theme customization** — full light/dark theming with a single toggle.

**Optional extras:** PDF booking invoice generator (jsPDF) and a saved-studios wishlist (heart icon backed by MongoDB).
