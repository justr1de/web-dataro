# Copilot Instructions for DATA-RO (web-dataro)

## 📦 Project Overview
- **Stack:** React 19 + Vite (frontend), Supabase (backend), Power BI (BI integration), Vercel (deploy)
- **Purpose:** BI dashboards and resource management for municipalities in Rondônia (CIMCERO)
- **Key Features:** Modular React components, AI assistant, Power BI panel embedding, Supabase integration, responsive UI

## 🗂️ Key Structure & Patterns
- **src/components/**: All UI components (e.g., `AIAssistant/`, `header/`, `footer/`, `heroCarousel/`)
- **src/pages/**: Page-level containers (e.g., `homePage/`, `PaineisPage/`, `ServicesPage/`)
- **src/services/**: Service modules for API, AI, and data logic (e.g., `aiService.js`)
- **src/contexts/**: React context providers (e.g., `AuthContext.jsx`)
- **src/utils/**: Utility functions and external client setup (e.g., `supabaseClient.js`)
- **public/**: Static assets

## 🧩 Component & Styling Conventions
- Each component/page has its own `.css` file (modular CSS)
- Use functional React components and hooks
- Prefer composition and prop-driven design
- Use icons from `phosphor-react` or `react-icons`
- Responsive layouts via CSS flex/grid and media queries

## 🔗 Integration & Data Flow
- **Supabase:**
  - Credentials in `src/utils/supabaseClient.js` (public anon key)
  - SQL scripts for schema in `/scripts/` and docs
- **Power BI:**
  - Panels embedded via iframe, one per municipality
  - URLs must be public (see `POWER_BI_INTEGRATION.md`)
- **AI Assistant:**
  - Logic in `src/components/AIAssistant/` and `src/services/aiService.js`
  - Uses OpenAI API, context-aware prompts

## ⚙️ Developer Workflows
- **Install:** `npm install`
- **Dev server:** `npm run dev` (Vite, port 5173)
- **Build:** `npm run build`
- **Deploy:**
  - Push to `main` triggers Vercel auto-deploy
  - Manual: `vercel --prod`
- **Supabase SQL:** See `EXECUTAR_SQL_MANUALMENTE.md` for DB changes

## 📝 Project-Specific Notes
- No environment variables required for deploy (public keys only)
- All navigation is handled in `App.jsx` (React Router)
- Use Git for versioning; update `README.md` for major changes
- For BI/Power BI, maintain one panel per municipality (see constraints in `POWER_BI_INTEGRATION.md`)

## 📚 Reference Files
- `README.md`, `PAINEIS_BI_README.md`, `POWER_BI_INTEGRATION.md`, `EXECUTAR_SQL_MANUALMENTE.md`
- Example: To add a new service, create a component in `src/components/serviceItem/` and register it in `ServicesPage/`

---
For questions, see `README.md` or contact the maintainers listed there.
