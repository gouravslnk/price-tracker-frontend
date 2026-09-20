You are a senior frontend engineer and UI/UX engineer.

Build the complete frontend for my INE Software Engineer Intern assignment.

The project is a Product Price Tracker for the INE mock store:

https://demo.inelabteamdev.com/

The backend is a Node.js/Express service connected to Supabase PostgreSQL and a Playwright-based scraper.

Your job is to build a polished, production-quality React frontend that communicates with that backend.

Do NOT create a generic admin dashboard.

Build a proper product price tracking application.

The interface should feel like a premium, minimal e-commerce/product monitoring dashboard while visually matching the INE Store's black-and-white identity.

============================================================
1. CORE TECHNOLOGY
============================================================

Use:

- React
- Vite
- TypeScript if practical
- Tailwind CSS
- React Router
- TanStack Query / React Query for server state
- Recharts for price graphs
- Lucide React for icons
- Sonner or another lightweight toast library
- date-fns for date formatting
- Axios or fetch for API requests

Prefer simple, maintainable libraries.

Do not add unnecessary dependencies.

============================================================
2. VISUAL REFERENCE
============================================================

The actual INE Store UI has:

- white background
- black typography
- thin borders
- black primary buttons
- serif-style large headings
- uppercase category labels
- restrained spacing
- minimal visual decoration
- editorial/e-commerce appearance

Examples from the store:

Header:
"INE Store"

Tagline:
"Everyday goods, honestly priced."

Product listing:

category
product name
brand
SKU
VIEW DETAILS

Product detail:

category
product name
brand / SKU
description
price panel
"Price hidden"
"REVEAL PRICE"

Use this visual language for the tracker.

Do NOT copy the store page literally.

The tracker should clearly look like a separate application built around the store.

============================================================
3. DESIGN DIRECTION
============================================================

Primary visual style:

BLACK + WHITE + GRAYSCALE

Do not use colorful gradients.

Do not use excessive rounded cards.

Do not make it look like a generic SaaS template.

Do not use emojis.

Use icons where appropriate.

Use:

- black
- white
- neutral gray
- subtle borders
- muted gray text
- green ONLY for price decrease / positive price movement
- red ONLY for price increase / negative price movement

These red/green indicators should be used sparingly.

Example:

Price decreased:

↓ ₹250
-4.8%

Price increased:

↑ ₹250
+5.2%

Unchanged:

— No change

============================================================
4. THEME SYSTEM
============================================================

Implement a proper Light/Dark theme.

Provide a polished theme toggle in the header.

Light theme:

- white/off-white background
- black text
- subtle gray borders
- black primary buttons

Dark theme:

- near-black background
- white text
- dark gray surfaces
- subtle gray borders
- white/near-white primary buttons

Do NOT simply invert colors.

Dark mode should be intentionally designed.

Persist the user's theme preference in localStorage.

Respect:

prefers-color-scheme

on first visit.

Theme should persist between page refreshes.

============================================================
5. GLOBAL LAYOUT
============================================================

Desktop layout:

--------------------------------------------------
Header
--------------------------------------------------

Left:

INE Price Tracker

or:

INE Store Tracker

Center/right:

Dashboard
Tracked Products
Add Product

Right:

Theme toggle
(optional settings)

--------------------------------------------------
Main content
--------------------------------------------------

Responsive.

Desktop:

max-width around 1400px.

Mobile:

single-column layout.

Tablet:

adaptive grid.

============================================================
6. HEADER
============================================================

Create a clean fixed/sticky header.

Desktop:

Left:

small INE-style square/logo mark
INE Price Tracker

Navigation:

Dashboard
Tracked Products

Right:

Add Product button
Theme toggle

Optional:

system status indicator

Example:

● Scraper operational

Use a small monochrome status indicator.

On mobile:

logo/name

theme toggle

hamburger menu

Do not overcrowd the header.

============================================================
7. ROUTING
============================================================

Create:

/

Dashboard

/products

Tracked Products

/products/:id

Product Details

/products/add

Add Product

Optional:

/settings

Settings

404 page

============================================================
8. DASHBOARD
============================================================

The dashboard should immediately communicate:

- how many products are tracked
- how many are currently available
- how many are out of stock
- how many prices increased
- how many prices decreased
- latest scraping status
- recent price changes
- tracked product list

Do not overwhelm the user.

============================================================
9. DASHBOARD HERO
============================================================

Top section:

Eyebrow:

PRICE TRACKER

Heading:

Track prices.
Know when they move.

Subtext:

Monitor product prices and availability from the INE Store.

Right side:

large:

"+ Add Product"

button

Primary black button.

Secondary:

"View all products"

============================================================
10. DASHBOARD SUMMARY CARDS
============================================================

Create four summary cards:

1.

TRACKED PRODUCTS

Example:

12

2.

PRICE DROPS

Example:

4

3.

PRICE INCREASES

Example:

3

4.

OUT OF STOCK

Example:

2

Use simple typography.

Do not create giant colorful metric cards.

Cards should be minimal.

Example:

--------------------------------------------------
TRACKED PRODUCTS

12

+2 this month
--------------------------------------------------

Price drops can be calculated from latest vs previous successful price.

Price increases can be calculated similarly.

Out of stock is based on latest valid stock value:

stock === 0

Important:

A missing scrape is NOT the same as out of stock.

Do not display:

stock = 0

when the scraper failed.

============================================================
11. LAST SCRAPE STATUS
============================================================

Show a small status panel:

LAST UPDATED

2 minutes ago

12 products checked
10 successful
2 failed

Example:

Last scrape
Today, 10:02 AM

● 10 successful
● 2 failed

Provide:

"View scrape activity"

button/link.

This makes the scraper reliability visible.

============================================================
12. PRICE MOVEMENT SECTION
============================================================

Create:

Recent price movements

Display products whose latest price differs from the previous successful observation.

Each row:

product image
product name
SKU
current price
previous price
percentage change
absolute change
time

Example:

Helix Air Fryer Max

₹4,821

↓ ₹240
-4.75%

2 hours ago

For price decrease:

use green.

For increase:

use red.

For unchanged:

gray.

Do NOT rank products as "best" or "worst".

============================================================
13. TRACKED PRODUCTS SECTION
============================================================

Dashboard should show the user's tracked products.

Header:

Tracked products

Search input:

Search products...

Right:

View all

Grid/table toggle optional.

Display product cards.

Desktop:

3 or 4 columns depending on screen.

============================================================
14. PRODUCT CARD
============================================================

Every tracked product card should contain:

Image

Category

Product name

Brand

SKU

Current price

MRP if available

Price movement

Stock

Last updated

Scrape status

Actions

Example:

--------------------------------------------------

[ PRODUCT IMAGE ]

KITCHEN

Helix Air Fryer Max

Helix
SKU HEL-10312

₹4,821
MRP ₹6,887

↓ ₹240  -4.75%

In stock · 43 units

Updated 2h ago

--------------------------------------------------

Bottom actions:

View details

Remove

Use icon buttons where appropriate.

Do not make the card excessively rounded.

Use subtle borders.

============================================================
15. PRODUCT IMAGE FALLBACK
============================================================

Some products may not have a usable image.

Create a consistent fallback.

Do NOT show broken image icons.

Fallback:

simple monochrome product placeholder.

Prefer a Lucide icon or simple CSS placeholder.

============================================================
16. SEARCH
============================================================

On /products create:

Search tracked products

Search by:

- product name
- SKU
- brand
- store product ID

Search should be debounced.

Example:

Search products...

Add filters:

All
In stock
Out of stock
Price up
Price down
No change
Scrape failed

Do not overcomplicate.

============================================================
17. SORTING
============================================================

Allow sorting by:

Recently updated
Price: low to high
Price: high to low
Largest price drop
Largest price increase
Stock
Name

Default:

Recently updated

Do not create subjective rankings.

============================================================
18. ADD PRODUCT
============================================================

Create a polished Add Product workflow.

Primary button:

+ Add Product

Open either:

dedicated page

or

modal/drawer.

I prefer a dedicated page on desktop and modal/drawer for quick addition if practical.

============================================================
19. ADD PRODUCT FLOW
============================================================

The user should be able to search products from the INE Store.

Do NOT ask the user to manually type arbitrary external URLs.

Only INE Store products are allowed.

Ideal flow:

Add Product

↓

Search INE Store products

↓

Results

↓

Product card

↓

Track Product

↓

Backend stores product metadata

↓

Product appears in tracked list

If backend product-search API is not implemented yet, create the frontend API abstraction so it can be connected later.

============================================================
20. ADD PRODUCT SEARCH UI
============================================================

Header:

Add a product to track

Search:

Search INE Store products...

Results:

product image
category
name
brand
SKU
Track button

When already tracked:

button becomes:

Tracked

and is disabled.

============================================================
21. REMOVE PRODUCT
============================================================

Every product should have:

Remove

action.

Clicking it MUST NOT immediately delete.

Show confirmation dialog:

Remove product?

"Are you sure you want to stop tracking Helix Air Fryer Max?"

Secondary:

Cancel

Primary:

Remove product

Use destructive styling carefully.

After successful removal:

toast:

Product removed from tracking.

If API fails:

do not remove it from local UI.

Show:

Unable to remove product. Please try again.

============================================================
22. PRODUCT DETAIL PAGE
============================================================

Route:

/products/:id

This is one of the most important pages.

Layout:

--------------------------------------------------
Back to tracked products
--------------------------------------------------

Product information

--------------------------------------------------

Left:

large product image

Right:

category

Product name

Brand
SKU

Current price

Price movement

Stock

Last updated

Scrape status

--------------------------------------------------

Below:

Price History

Price graph

Statistics

Scrape activity

Product information

--------------------------------------------------

============================================================
23. PRODUCT DETAIL HEADER
============================================================

Show:

KITCHEN

Helix Air Fryer Max

Helix · SKU HEL-10312

Current price:

₹4,821

Then:

↓ ₹240
-4.75%

Last updated:

2 hours ago

============================================================
24. STOCK DISPLAY
============================================================

Show stock clearly.

If:

stock > 0

Display:

In stock

43 units available

Use a subtle green indicator.

If:

stock === 0

Display:

Out of stock

Use a neutral/red indicator.

IMPORTANT:

If latest scrape failed:

do NOT say out of stock.

Instead:

Availability unavailable

Last successful check:
2 hours ago

This distinction is critical.

============================================================
25. PRICE HISTORY GRAPH
============================================================

Use Recharts.

Create a clean responsive line chart.

X-axis:

date/time

Y-axis:

price

Tooltip:

date/time
price

Example:

₹4,821
Sep 20, 10:00 AM

Do not use excessive chart decoration.

Grid:

very subtle.

Line:

black in light mode.

white/light gray in dark mode.

Price increase/decrease indicators can remain red/green outside the chart.

============================================================
26. GRAPH CONTROLS
============================================================

Provide:

7D
30D
90D
All

If there is insufficient data:

show:

Not enough price history yet.

instead of a broken chart.

If only one data point:

show the point and message:

Price history will appear as more observations are collected.

============================================================
27. PRICE STATISTICS
============================================================

Below graph show:

Current price

Lowest recorded

Highest recorded

Average price

Price change

Observations

Example:

Current
₹4,821

Lowest
₹4,599

Highest
₹5,199

Average
₹4,876

Observations
38

Calculate from actual database history.

Do not invent data.

============================================================
28. MRP / SAVINGS
============================================================

If MRP exists:

Current price
₹4,821

MRP
₹6,887

Difference
₹2,066

Discount
30%

If MRP is unavailable:

do not show fake discount.

============================================================
29. SCRAPE ACTIVITY
============================================================

Product detail page should include:

Scrape activity

Example:

10:00 AM
SUCCESS
₹4,821 · 43 units

8:00 AM
RETRY
503 upstream error

8:00 AM
RETRY
429 rate limited

8:00 AM
SUCCESS
₹4,821 · 45 units

Use expandable details for errors.

Each event:

status
timestamp
HTTP status
duration
error message

This demonstrates the reliability work.

============================================================
30. SCRAPE STATUS BADGES
============================================================

Use clear statuses:

SUCCESS
RETRYING
FAILED
NEVER SCRAPED

Avoid overly colorful badges.

Light mode:

SUCCESS:
subtle green

RETRYING:
subtle amber/gray

FAILED:
subtle red

NEVER SCRAPED:
gray

Dark mode should have accessible equivalents.

============================================================
31. FAILED SCRAPE UI
============================================================

If the latest scrape failed:

Do not overwrite the last successful price.

Example:

Current price

₹4,821

Last successful observation:
2 hours ago

Latest scrape:

Failed

503 upstream error

This is very important.

The frontend should distinguish:

last known successful data

from

latest scraping status.

============================================================
32. STALE DATA INDICATOR
============================================================

If data has not been successfully updated for a long time:

show:

Data may be stale

Last successful update:
18 hours ago

Do not hide the existing last known price.

Do not replace it with zero/null.

============================================================
33. MANUAL REFRESH
============================================================

Product detail page should have:

Refresh price

button.

Click:

Refresh price

↓

show:

Checking latest price...

↓

backend triggers scrape

↓

success:

Price updated

or

failure:

Latest check failed.
Showing last successful price.

Do not block the entire application while scraping.

Use polling or async job handling if the backend becomes asynchronous.

============================================================
34. GLOBAL LOADING STATES
============================================================

Every API request must have a proper loading state.

Do not show blank screens.

Use:

Skeleton loaders

rather than spinners everywhere.

Dashboard:

skeleton metric cards

skeleton product cards

Product detail:

skeleton product header

skeleton graph

skeleton history

============================================================
35. ERROR STATES
============================================================

Create polished error states.

Examples:

Unable to load tracked products.

Try again

Unable to load price history.

Try again

Unable to connect to backend.

Check your connection.

Do not expose stack traces.

============================================================
36. EMPTY STATES
============================================================

If no products tracked:

Show:

No products tracked yet.

Start tracking products from the INE Store to monitor their price and availability.

Button:

+ Add Product

If search returns nothing:

No tracked products match "air fryer".

Clear search

============================================================
37. TOAST NOTIFICATIONS
============================================================

Use a toast library.

Examples:

Product added successfully.

Product removed successfully.

Price updated successfully.

Scrape failed. Showing the last successful price.

Failed to connect to backend.

Do not overuse toasts.

============================================================
38. API CLIENT
============================================================

Create:

src/api/

or:

src/services/api/

with separate modules:

productsApi
historyApi
scrapeApi

Centralize:

base URL

headers

error handling

Do not put fetch calls directly throughout components.

Environment:

VITE_API_BASE_URL

Example:

VITE_API_BASE_URL=http://localhost:3000

Production:

Render backend URL.

============================================================
39. TANSTACK QUERY
============================================================

Use React Query for server state.

Queries:

useTrackedProducts()

useProduct(id)

usePriceHistory(id)

useScrapeLogs(id)

Mutations:

useTrackProduct()

useRemoveProduct()

useScrapeProduct()

After mutations:

invalidate appropriate queries.

Avoid manually maintaining duplicated server state.

============================================================
40. REFRESH BEHAVIOR
============================================================

Dashboard can automatically refresh data periodically.

Example:

tracked products:
30-60 seconds

scrape status:
30 seconds

Do not trigger a new scrape just because the frontend refetches data.

Data refresh and scraping are separate concepts.

Important:

GET /products

must NOT trigger scraping.

Scraping should only happen through:

scheduled backend job

or

explicit manual refresh.

============================================================
41. PRICE MOVEMENT CALCULATION
============================================================

Use two most recent SUCCESSFUL price observations.

Current:

latest successful price

Previous:

previous successful price

Change:

current - previous

Percentage:

((current - previous) / previous) * 100

If previous price is unavailable:

show:

No previous price

Do not calculate a percentage.

If current == previous:

show:

No change

============================================================
42. IMPORTANT DATA SEMANTICS
============================================================

Never interpret:

missing scrape

as:

price = 0

Never interpret:

missing stock

as:

out of stock.

Never overwrite valid previous data because a scrape failed.

Example:

Previous successful:

₹4,821
43 units

Latest scrape:

503 error

UI should still show:

₹4,821
43 units

but clearly indicate:

Latest scrape failed

This is one of the most important product behaviors.

============================================================
43. ACCESSIBILITY
============================================================

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible buttons
- accessible dialog
- aria labels for icon-only buttons
- sufficient contrast
- keyboard-accessible theme toggle
- keyboard-accessible search
- graph tooltip accessible as far as library allows

Do not rely only on color.

For price movement:

use:

↑ / ↓ icons

AND text.

============================================================
44. RESPONSIVE DESIGN
============================================================

Desktop:

3-4 column product grid.

Tablet:

2 columns.

Mobile:

1 column.

Dashboard metrics:

Desktop:
4 columns

Tablet:
2 columns

Mobile:
2 or 1 depending on width.

Product detail:

Desktop:
two-column header

Mobile:
single column.

Charts must resize.

Dialogs must work on mobile.

============================================================
45. DARK MODE
============================================================

Dark mode example:

background:
near black

surface:
dark gray

border:
gray

text:
white

secondary text:
muted gray

Primary button:
white background / black text

Hover:
slightly darker/lighter surface.

Do not use pure black everywhere because it reduces hierarchy.

============================================================
46. TYPOGRAPHY
============================================================

Match the INE Store's editorial feel.

Use a serif display font for major headings.

Use a clean sans-serif for:

- navigation
- metadata
- prices
- buttons
- tables

Recommended:

Display:
a tasteful serif such as Georgia or a suitable web font.

UI:
Inter or system sans-serif.

Do not use excessive font variations.

============================================================
47. BUTTON STYLE
============================================================

Primary:

black background
white text

Dark mode:

white background
black text

Secondary:

transparent
thin border

Danger:

border/very subtle red treatment

Do not make every button filled.

============================================================
48. ICONS
============================================================

Use Lucide React.

Examples:

Search
Plus
Trash2
ArrowUp
ArrowDown
RefreshCw
Package
CircleCheck
CircleAlert
Clock
TrendingUp
TrendingDown
Moon
Sun
ChevronRight
ArrowLeft
MoreHorizontal
Filter
SlidersHorizontal

No emojis.

============================================================
49. TABLE VIEW
============================================================

For larger tracked-product collections, support a table view.

Columns:

Product
Current Price
Change
Stock
Last Updated
Scrape Status
Actions

Desktop table.

Mobile switches to cards.

============================================================
50. PRODUCT CARD ACTIONS
============================================================

Avoid putting too many actions.

Main:

View details

Secondary:

Remove

Optional:

Refresh

Use a three-dot menu if necessary.

============================================================
51. CONFIRMATION DIALOG
============================================================

Create reusable ConfirmDialog.

Props:

title
description
confirmText
cancelText
danger

Example:

Remove product?

You're about to stop tracking:

Helix Air Fryer Max

Historical price data will also be removed if backend cascade deletion is configured.

Buttons:

Cancel

Remove

IMPORTANT:

If deleting historical data is destructive, make the text explicit.

Do not silently delete data.

============================================================
52. PRICE CHART DATA
============================================================

Backend response may look like:

[
  {
    "price": 4821,
    "stock": 43,
    "scraped_at": "..."
  }
]

Transform it in a chart adapter.

Do not manipulate backend response throughout components.

Create:

priceChart.utils.ts

or similar.

============================================================
53. DASHBOARD DATA
============================================================

Create dashboard aggregation from API data.

Show:

tracked product count

in stock count

out of stock count

price increases

price decreases

recent movements

recent scrape activity

last scrape time

If backend does not yet provide an aggregation endpoint, create:

GET /api/dashboard/summary

Expected:

{
  trackedProducts: 12,
  inStock: 10,
  outOfStock: 2,
  priceDrops: 4,
  priceIncreases: 3,
  lastScrapeAt: "...",
  successfulScrapes: 10,
  failedScrapes: 2
}

Do not make the frontend perform hundreds of requests unnecessarily.

============================================================
54. PRODUCT SEARCH
============================================================

For adding a product:

Search the INE Store product catalog.

If backend exposes:

GET /api/store/products?search=...

use that.

If not currently available, build the frontend abstraction and clearly document the required endpoint.

The frontend must never directly scrape the INE Store.

The browser frontend talks only to our backend.

============================================================
55. SECURITY
============================================================

Never put:

SUPABASE_SERVICE_ROLE_KEY

in Vite environment variables.

Never put:

INTERNAL_CRON_SECRET

in frontend environment variables.

Frontend should only know:

VITE_API_BASE_URL

Never expose backend secrets.

============================================================
56. ERROR BOUNDARY
============================================================

Create a global React Error Boundary.

If an unexpected component error occurs:

show:

Something went wrong.

Try again

Do not show raw stack trace to user.

============================================================
57. ROUTE HANDLING
============================================================

Use React Router.

Routes:

/
  Dashboard

/products
  Tracked Products

/products/add
  Add Product

/products/:id
  Product Details

/settings
  Settings

*

  Not Found

============================================================
58. SETTINGS
============================================================

Optional but useful.

Settings page:

Theme:
Light
Dark
System

Backend status:

Connected

or

Unavailable

About:

INE Price Tracker

Version:

1.0.0

Do not expose backend secrets.

============================================================
59. DATA FRESHNESS
============================================================

Show relative time:

Updated 2 minutes ago

Updated 2 hours ago

Updated yesterday

Also provide exact timestamp on hover or detail.

Use date-fns.

============================================================
60. CURRENT PRICE VS LAST KNOWN PRICE
============================================================

This distinction must be reflected in the UI model.

Use:

latestSuccessfulObservation

latestScrapeStatus

These are separate.

Example:

Current tracked price:
₹4,821

Last successful check:
2 hours ago

Latest scrape:
FAILED · 10:02 AM

Do not replace current tracked price with an error.

============================================================
61. COMPONENT STRUCTURE
============================================================

Suggested structure:

src/

├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── dashboard/
│   │   ├── DashboardHero.tsx
│   │   ├── MetricCard.tsx
│   │   ├── PriceMovements.tsx
│   │   ├── RecentScrapes.tsx
│   │   └── TrackedProductPreview.tsx
│   │
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductTable.tsx
│   │   ├── ProductSearch.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductPrice.tsx
│   │   ├── StockStatus.tsx
│   │   ├── PriceChange.tsx
│   │   └── RemoveProductDialog.tsx
│   │
│   ├── product-detail/
│   │   ├── ProductHeader.tsx
│   │   ├── PriceChart.tsx
│   │   ├── PriceStatistics.tsx
│   │   ├── ScrapeActivity.tsx
│   │   └── ProductSpecifications.tsx
│   │
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   └── theme/
│       └── ThemeToggle.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── AddProduct.tsx
│   ├── ProductDetails.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
│
├── api/
│   ├── client.ts
│   ├── products.ts
│   ├── history.ts
│   ├── scraping.ts
│   └── dashboard.ts
│
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── usePriceHistory.ts
│   ├── useScrapeLogs.ts
│   └── useTheme.ts
│
├── types/
│   ├── product.ts
│   ├── history.ts
│   └── scrape.ts
│
├── utils/
│   ├── price.ts
│   ├── date.ts
│   └── chart.ts
│
└── main.tsx

Keep components reusable.

============================================================
62. TYPES
============================================================

Create proper TypeScript types.

Example:

TrackedProduct:

{
  id: string;
  store_product_id: string;
  name: string;
  sku?: string;
  url: string;
  image_url?: string;
  is_active: boolean;
  last_scraped_at?: string;
  created_at: string;
  updated_at: string;
}

PriceObservation:

{
  id: string;
  tracked_product_id: string;
  price: number;
  mrp?: number;
  stock: number;
  currency: string;
  scraped_at: string;
}

ScrapeLog:

{
  id: string;
  tracked_product_id: string;
  attempt_number: number;
  status: "SUCCESS" | "RETRY" | "FAILED";
  http_status?: number;
  error_message?: string;
  duration_ms?: number;
  created_at: string;
}

============================================================
63. NO FAKE FRONTEND DATA
============================================================

Do not permanently hard-code demo data.

During UI development you may use mock data behind a clearly isolated mock layer.

But production mode must use backend APIs.

Do not make the application appear successful with fake data.

============================================================
64. API FAILURE BEHAVIOR
============================================================

If dashboard API fails:

show dashboard error state.

If price history fails:

show error only for history section.

Do not make entire product page unusable.

If scrape status fails:

still show existing product/price information.

Use partial failure handling.

============================================================
65. OPTIMISTIC UPDATES
============================================================

Use optimistic updates only where safe.

For removing a product:

optimistic removal is acceptable if rollback is implemented.

For price updates:

DO NOT optimistically change the price.

Wait for actual successful scrape result.

============================================================
66. MANUAL SCRAPE UX
============================================================

When user clicks:

Refresh price

show button state:

Checking...

Disable duplicate clicks.

Show:

Checking latest price...

If backend returns success:

update product data.

If backend returns failure:

keep old price.

Show:

Latest check failed.
Showing last successful price.

This is mandatory.

============================================================
67. PRODUCT DETAILS UX
============================================================

Top:

← Back to products

Then:

product image

category

name

brand / SKU

current price

price change

stock

refresh

remove

Then:

Price history

chart

statistics

Scrape activity

Specifications

============================================================
68. PRICE GRAPH VISUAL STYLE
============================================================

Graph should match monochrome UI.

Light mode:

black line

gray grid

white background

Dark mode:

white/light line

subtle dark grid

Use red/green only for explicit price movement indicators, not the entire chart.

Tooltip should be clean.

No unnecessary area gradients.

============================================================
69. MOBILE
============================================================

Mobile header:

logo
theme toggle
menu

Dashboard:

stack sections.

Product card:

full width.

Product details:

image first
information second
chart below.

Search:

full width.

Confirmation dialog:

mobile-friendly bottom sheet or centered dialog.

============================================================
70. PERFORMANCE
============================================================

Avoid unnecessary re-renders.

Use React Query caching.

Use pagination where necessary.

Lazy-load pages if useful.

Do not load all price history for every product on dashboard.

Dashboard should use summary endpoints.

Do not request the same product multiple times.

============================================================
71. POLISH
============================================================

Add subtle interactions:

button hover

card hover

navigation transition

chart tooltip

skeleton animation

modal animation

Do NOT add:

excessive animations

parallax

large gradients

glassmorphism

neon effects

3D effects

The design should feel mature and restrained.

============================================================
72. PAGE TITLE
============================================================

Update document title based on page.

Examples:

INE Price Tracker

Dashboard | INE Price Tracker

Tracked Products | INE Price Tracker

Helix Air Fryer Max | INE Price Tracker

============================================================
73. 404 PAGE
============================================================

Create:

Page not found

The page you're looking for doesn't exist.

Back to dashboard

============================================================
74. FRONTEND README
============================================================

Document:

installation

environment variables

development

build

preview

API configuration

routing

theme

component architecture

deployment to Vercel

============================================================
75. DEPLOYMENT
============================================================

Frontend should be deployable to Vercel.

Environment variable:

VITE_API_BASE_URL

Example local:

http://localhost:3000

Production:

Render backend URL.

Configure SPA fallback correctly so:

/products/274

works after refreshing the page.

============================================================
76. FINAL QUALITY CHECK
============================================================

Before declaring complete, verify:

[ ] Dashboard works

[ ] Theme toggle works

[ ] Theme persists

[ ] Tracked products load

[ ] Search works

[ ] Filters work

[ ] Sorting works

[ ] Add product works

[ ] Duplicate product handling works

[ ] Remove confirmation works

[ ] Remove rollback works

[ ] Product details work

[ ] Price graph works

[ ] 7D filter works

[ ] 30D filter works

[ ] 90D filter works

[ ] All filter works

[ ] Insufficient history handled

[ ] Price increase shown correctly

[ ] Price decrease shown correctly

[ ] No change handled

[ ] Stock > 0 shown as available

[ ] Stock === 0 shown as out of stock

[ ] Failed scrape NOT shown as out of stock

[ ] Failed scrape does not erase last successful price

[ ] Stale data indicated

[ ] Manual refresh works

[ ] Manual refresh loading state works

[ ] Manual refresh failure preserves old price

[ ] Scrape activity displayed

[ ] HTTP status displayed where appropriate

[ ] Error states work

[ ] Empty states work

[ ] Skeleton states work

[ ] Toasts work

[ ] Mobile responsive

[ ] Tablet responsive

[ ] Desktop responsive

[ ] Keyboard accessible

[ ] No emojis

[ ] No secrets in frontend

[ ] No fake production data

[ ] No direct scraping from frontend

[ ] All API calls centralized

[ ] React Query used for server state

[ ] Vercel deployment works

============================================================
77. IMPORTANT FINAL DESIGN PRINCIPLE
============================================================

The application should look like:

"INE Store evolved into a professional price monitoring dashboard"

not:

"a generic Tailwind admin template".

Use the original INE Store screenshots as visual inspiration:

- thin black borders
- serif editorial headings
- uppercase metadata
- black CTA buttons
- white space
- grayscale
- simple product imagery
- restrained layout

But improve usability substantially:

- dashboard
- price movement
- historical graph
- stock status
- scrape status
- search
- filtering
- theme
- product management
- detailed product page
- responsive design

The final application should look polished enough to demonstrate during an interview.

Do not use emojis anywhere in the UI or source-generated UI text.

============================================================
78. IMPLEMENTATION ORDER
============================================================

Build in this exact order:

PHASE 1:
Project setup
React
Vite
Tailwind
Router
Lucide
React Query
Recharts

PHASE 2:
Theme system
Light/dark
localStorage
system preference

PHASE 3:
App shell
Header
navigation
responsive layout

PHASE 4:
API client
types
React Query hooks

PHASE 5:
Tracked Products page

PHASE 6:
Dashboard

PHASE 7:
Product detail

PHASE 8:
Price chart

PHASE 9:
Scrape activity

PHASE 10:
Add product

PHASE 11:
Remove product confirmation

PHASE 12:
Manual refresh

PHASE 13:
Loading/error/empty states

PHASE 14:
Responsive polish

PHASE 15:
Accessibility

PHASE 16:
Production build

PHASE 17:
Vercel deployment configuration

At each phase, keep the application runnable.

============================================================
79. WHAT I EXPECT FROM YOU
============================================================

Do not merely explain the frontend architecture.

Generate the actual frontend project.

Start by:

1. Creating the project structure.
2. Creating package.json.
3. Creating Vite configuration.
4. Creating Tailwind configuration.
5. Creating theme system.
6. Creating router.
7. Creating API client.
8. Creating types.
9. Creating React Query setup.
10. Creating AppShell/Header.
11. Creating Dashboard.
12. Creating Tracked Products.
13. Creating Add Product.
14. Creating Product Details.
15. Creating Price Chart.
16. Creating Scrape Activity.
17. Creating confirmation dialog.
18. Creating loading/error/empty states.
19. Creating responsive mobile layout.
20. Creating README.

Do not skip error handling.

Do not use fake fallback values for real production data.

Do not hide scraper failures.

Do not replace unavailable values with zero.

Do not show "Out of stock" unless the backend has a successful observation with stock === 0.

Do not replace the last successful price when the latest scrape fails.

Make the final application visually polished, restrained, monochrome, responsive, accessible, and clearly connected to the INE Store design language.