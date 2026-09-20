# Frontend Technical Design Note

**Project**: INE Product Price Tracker — Web Application & Analytics Dashboard  
**Author**: Gourav Solanki  
**Role**: Software Engineer Intern Assessment  
**Repository**: [https://github.com/gouravslnk/price-tracker-frontend](https://github.com/gouravslnk/price-tracker-frontend)  
**Live Site**: [https://price-tracker-frontend-gray.vercel.app](https://price-tracker-frontend-gray.vercel.app)  

---

## 1. How We Made the Frontend Resilient & User-Centric

The frontend dashboard serves as the central command center for tracking products, observing real-time price movements, and inspecting attempt-by-attempt diagnostic logs.

### A. Adaptive Polling & Instant Query Invalidation
- **Challenge**: Scrapes take between 4–15 seconds to execute. Users adding a product or triggering a refresh shouldn't be left wondering if an operation succeeded or be forced to manually refresh the page.
- **Solution**: We integrated **TanStack React Query v5** with adaptive refetch intervals:
  - **Fast Polling (2000ms)**: When any product in the dashboard is in a pending state (`current_price === null` or currently being scraped), the query polls every 2 seconds.
  - **Background Polling (8000ms)**: Once all products have settled price observations, polling throttles down to 8 seconds to minimize server load.
  - **Successive Staggered Invalidation**: Triggering "Add Product", "Refresh", or "Refresh All" immediately dispatches scheduled invalidations at 2s, 4s, 7s, and 11s to capture background scraper completions smoothly.

### B. High-Contrast Monochrome Design & Clean Typography
- **Design System**: Built with Tailwind CSS using a curated monochromatic color palette (neutral grays, stark zinc, subtle borders, and semantic indicators for stock/price movement).
- **No Inappropriate Visuals**: Zero generic emojis; all visual states utilize clean SVG vector icons (`lucide-react`) and monospace data labels.
- **Fluid Responsiveness**: Full grid-to-list layout toggles, responsive stat cards, collapsible mobile drawer, and accessible modal confirmation dialogs.

### C. Honest Diagnostic Visibility & Historical Analysis
- **Scrape Log Drawer / Modal**: Users can click any product to inspect historical observations, price trends, and full diagnostic logs (displaying HTTP status, attempt duration in ms, and specific error reasons).
- **Price Delta Indicators**: Explicit calculation of price drops vs. price increases relative to the product's baseline price observation.

---

## 2. Frontend Engineering Trade-offs

| Decision | Trade-off Chosen | Rationale |
| :--- | :--- | :--- |
| **Client-Side Data Polling vs. WebSockets/SSE** | Adaptive TanStack Query Polling | Avoids persistent stateful socket connection overhead and reconnect complexity on serverless/sleepable free-tier backends while delivering near-instant UI updates. |
| **Local Headed Toggle vs. Global State** | Localhost-Only Scraper Toggle in Navigation Bar | Shows the visible browser toggle only on `localhost` (for demo recordings and evaluations), and hides it cleanly on production Vercel builds where cloud servers cannot open display windows. |
| **Optimistic Card Updates** | Instant card state updates + background sync | Immediately renders newly added products in a `SCRAPING...` state on the dashboard so the user gets instant feedback before the first price arrives. |

---

## 3. What AI Tools Got Wrong on the First Attempt & How We Fixed It

### 1. Static Query Invalidation & Stale Dashboard Prices
- **What AI Generated**: A single `queryClient.invalidateQueries()` called immediately when the "Track Product" button was clicked.
- **Why It Failed**: The backend returns `201 Created` immediately and runs Playwright asynchronously in the background. A single instant refetch fetched the product before the scraper finished, leaving the price blank until a full browser refresh.
- **How We Fixed It**: Implemented dynamic adaptive polling in `useTrackedProducts()` (`refetchInterval: (q) => hasPending ? 2000 : 8000`) and staggered invalidation timers (2s, 4s, 7s, 11s).

### 2. Confusing Browser Controls in Production
- **What AI Generated**: Placing a generic "Visible Browser Mode" toggle in the header for all users.
- **Why It Failed**: In production on Vercel/Render, cloud containers have no display server ($DISPLAY). Toggling visible mode in production caused confusion and potential launch errors.
- **How We Fixed It**: Added `isLocalhost` environment checks in `Header.jsx` to render the button only on developer machines (`localhost:3000`) for recording evaluations, keeping the live production navbar clean.

### 3. Missing Empty & Loading States
- **What AI Generated**: Basic unstyled table loading spinners.
- **How We Fixed It**: Created custom skeleton loading components (`CardSkeleton`), descriptive empty states with action triggers (`EmptyState`), and custom dark/light mode toggle with smooth transitions.
