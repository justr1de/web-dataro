
# Copilot Instructions for DATA-RO (web-dataro)

## Project Overview
BI dashboard platform for 48 CIMCERO municipalities in Rondônia. Public institutional pages + authenticated Power BI viewer + AI-powered federal data assistant.

**Stack:** React 19 + Vite 7 + React Router 7 SPA | Supabase (PostgreSQL) | Vercel | Power BI Embedded | OpenAI API

## Architecture

### Directory Structure
```
src/
├── pages/           # Route containers (homePage/, PaineisPage/, ServicesPage/)
├── components/      # Reusable UI with co-located CSS (Component/Component.jsx + Component.css)
├── contexts/        # AuthContext.jsx (custom auth), ThemeContext.jsx (dark mode)
├── services/        # API integrations (aiService.js, federalDataService.js)
├── utils/           # supabaseClient.js, bandeirasMap.js (CRITICAL: static imports)
scripts/             # SQL/Python for Supabase - execute via Dashboard, NOT terminal
```

### Authentication Flow
Custom auth in `AuthContext.jsx` - **NOT Supabase Auth**:
- Stores user in `localStorage` as `paineis_user`
- Passwords: plaintext comparison (legacy `senha_hash` column has no hashing)
- Audit logs all events to `log_auditoria` table
- `ProtectedRoute` in `App.jsx` redirects unauthenticated users to `/paineis/login`
- **Role checks must include both:** `user?.role === 'admin' || user?.role === 'superadmin'`

### Database Tables (Supabase)
| Table | Purpose |
|-------|---------|
| `municipios` | 48 municipalities (id, nome, cnpj, prefeito) |
| `paineis_bi` | Power BI panels - UNIQUE on municipio_id |
| `usuarios` | Users (email, senha_hash, role, ativo, primeiro_acesso) |
| `acessos` | User-municipality permissions |
| `log_auditoria` | Security audit trail |

## Critical Patterns

### ⚠️ Bandeiras (Municipality Flags) - MUST USE STATIC IMPORTS
Vite cannot bundle dynamic paths. All flags require static imports in `bandeirasMap.js`:
```javascript
// ✅ CORRECT - static import
import altaFloresta from '../assets/bandeiras/Alta floresta.png';
const bandeirasImportadas = { "ALTA FLORESTA DO OESTE": altaFloresta };

// ❌ WRONG - breaks in production
const img = require(`../assets/bandeiras/${name}.png`);
```
**To add a flag:** 1) Add to `src/assets/bandeiras/` 2) Add import + map entry in `bandeirasMap.js`

### Component Import Patterns
```jsx
import HomePage from './pages/homePage';                         // folder with index.jsx
import AdminPanel from '../../components/AdminPanel/AdminPanel'; // explicit file path
import { getBandeiraUrl } from '../../utils/bandeirasMap';       // named export
```

### Power BI Panel Rendering (`MunicipioPainel.jsx`)
Priority cascade:
1. `painel.embed_url` exists → Embedded iframe (preferred)
2. `painel.url_powerbi` exists → External link button
3. Neither → "Painel em desenvolvimento" placeholder

### AI Service Intent Detection (`aiService.js`)
Keyword-based routing via `detectarIntencao()`:
- `edital|recurso|captação` → `buscarInformacoesEditais()`
- `comparar|versus|vs|cruzar` → `compararMunicipios()`
- `ministério|mapa|mec|saúde|educação` → `informacoesMinisterio()`
- `transferência|convênio|repasse` → `buscarTransferencias()`
- Default → `gerarRespostaPadrao()`

### Icons
Prefer `phosphor-react`, `react-icons` also available:
```jsx
import { CaretDown } from 'phosphor-react';
```

## Development

```bash
npm install && npm run dev    # Vite dev server (port 5173)
npm run build                 # Production build
npm run lint                  # ESLint
```

**Deploy:** Push to `main` → Vercel auto-deploys. SPA routing configured in `vercel.json`.

**Environment Variables:**
- `VITE_OPENAI_API_KEY` - Required for AI assistant
- `VITE_PORTAL_TRANSPARENCIA_API_KEY` - Optional (mock fallback exists)

## Common Tasks

**Add Power BI panel** - via Supabase Dashboard SQL:
```sql
INSERT INTO paineis_bi (municipio_id, titulo, embed_url, status)
VALUES (5, 'Painel Ariquemes', 'https://app.powerbi.com/view?r=...', 'ativo');
```

**Create admin user** - Reference `scripts/create-user-romulo.sql`:
```sql
INSERT INTO usuarios (email, senha_hash, nome, role, ativo, primeiro_acesso)
VALUES ('email@example.com', 'senha', 'Nome', 'admin', true, true);
```

## Notes
- **No test suite** - Manual browser testing only
- **Scripts folder** - SQL/Python with inconsistent naming; follow existing patterns
- **Docs:** `POWER_BI_INTEGRATION.md`, `EXECUTAR_SQL_MANUALMENTE.md`, `PAINEIS_BI_README.md`
