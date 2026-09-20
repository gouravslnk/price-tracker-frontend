# INE Product Price Tracker — Frontend Application

Modern, real-time React + Vite frontend for tracking product prices, viewing price movements, and inspecting scrape diagnostic logs from the INE mock storefront (`https://demo.inelabteamdev.com`).

---

## 🚀 Live Deployments & Demo

- **Frontend (Vercel)**: [https://price-tracker-frontend-gray.vercel.app](https://price-tracker-frontend-gray.vercel.app)
- **Backend API (Render)**: [https://price-tracker-backend-352r.onrender.com](https://price-tracker-backend-352r.onrender.com)
- **Headed Scraper Demo Recording**: [Google Drive Video Demo](https://drive.google.com/file/d/1-X1a9-u7oqQ_UsXIBzuHLADjCHcQbITA/view?usp=sharing)
- **Target Mock Storefront**: [https://demo.inelabteamdev.com](https://demo.inelabteamdev.com)

---

## 📋 Features

1. **Live Dashboard & KPI Overview**: Summary statistics for tracked products, price drops, price increases, in-stock/out-of-stock items, and scrape health metrics.
2. **Interactive Headed Browser Run Toggle**: On-screen toggle (`[Browser: Visible]` / `[Browser: Headless]`) in the navigation bar to observe the Playwright automation browser window live on your screen during video recording and evaluations.
3. **Automated Scheduled Scraping**: 2-hour cron job integration via `cron-job.org` with manual one-click **"Refresh All"** and individual product refresh capabilities.
4. **Product Directory & Search**: Live catalog search directly against the INE store with one-click tracking.
5. **Product Detail Analytics**: Price history time-series charts, statistical highs/lows/averages, and honest attempt-by-attempt diagnostic logs (success, retries, failures, latency).
6. **Dark & Light Mode**: High-contrast monochrome aesthetic with clean vector icons.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite (Pure JavaScript `.jsx`)
- **State & Data Fetching**: TanStack React Query v5 (Adaptive Polling)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom Dark Mode Theme Tokens
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## ⚙️ Environment Variables

Create a `.env` file in the root of `price-tracker-frontend`:

```ini
# Backend API URL
VITE_API_BASE_URL=https://price-tracker-backend-352r.onrender.com/api
```

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/gouravslnk/price-tracker-frontend.git
cd price-tracker-frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

App will be available at `http://localhost:3000`.

---

## 📦 Production Build

```bash
npm run build
npm run preview
```
