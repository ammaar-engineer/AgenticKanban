# INIT_AGENT.md

> Auto-generated oleh Explorer Agent
> Tanggal: 2026-10-03 07:31:03
> Root: /home/quanta/Documents/AgenticKanban

## 1. Ringkasan Project

**AgenticKanban** — "Agentic workflow with kanban style".

Monorepo dua-folder (bukan npm workspace) berisi:

- **`client/`** — SPA frontend berbasis **React 19 + TypeScript + Vite**, styling **Tailwind CSS v4 + shadcn/ui**, state via **Zustand + TanStack Query**, HTTP via **Axios**, routing **react-router-dom**.
- **`server/`** — REST API backend berbasis **Hono** (di atas Node), ORM **TypeORM** dengan database **SQLite (`better-sqlite3`)**, validasi **superstruct**, test **Vitest**.

Contoh nyata monorepo poliglot: FE dashboard kanban + BE API yang mengelola entitas `Provider`, `Agent`, `KanbanBoard`, `KanbanLayer`, `KanbanAgent`. Kedua sisi dikembangkan bersama lewat `dev.sh` yang menjalankan dua proses dev.

## 2. Struktur Folder

```text
.
├── client
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── components
│   │   │   ├── app
│   │   │   │   ├── kanban.agent.tsx
│   │   │   │   ├── kanban.board.tsx
│   │   │   │   └── kanban.layer.tsx
│   │   │   ├── dialog
│   │   │   │   ├── agents.detail.dialog.tsx
│   │   │   │   ├── create.agent.dialog.tsx
│   │   │   │   ├── create.kanban.agents.tsx
│   │   │   │   ├── create.kanban.board.dialog.tsx
│   │   │   │   ├── create.kanban.layer.dialog.tsx
│   │   │   │   ├── create.provider.dialog.tsx
│   │   │   │   └── pick.agent.dialog.tsx
│   │   │   └── ui
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── textarea.tsx
│   │   │       ├── toast.tsx
│   │   │       └── tooltip.tsx
│   │   ├── hooks
│   │   │   ├── api
│   │   │   │   ├── agent.mutation.ts
│   │   │   │   ├── agent.query.ts
│   │   │   │   ├── kanban-agent.mutation.ts
│   │   │   │   ├── kanban-layer.mutation.ts
│   │   │   │   ├── kanban.mutation.ts
│   │   │   │   ├── kanban.query.ts
│   │   │   │   ├── provider.mutation.ts
│   │   │   │   └── provider.query.ts
│   │   │   ├── use-mobile.ts
│   │   │   └── user.provider.ts
│   │   ├── lib
│   │   │   ├── axios.ts
│   │   │   └── utils.ts
│   │   ├── pages
│   │   │   ├── agents.dashboard.tsx
│   │   │   ├── main.dashboard.tsx
│   │   │   └── providers.dashboard.tsx
│   │   ├── services
│   │   │   ├── api
│   │   │   │   ├── agent.api.ts
│   │   │   │   ├── error.ts
│   │   │   │   ├── kanban.agent.api.ts
│   │   │   │   ├── kanban.api.ts
│   │   │   │   ├── kanban-layer.api.ts
│   │   │   │   └── provider.api.ts
│   │   │   └── toast.category.ts
│   │   ├── stores
│   │   │   ├── agents.store.ts
│   │   │   ├── kanban.store.ts
│   │   │   └── providers.store.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── code.html
│   ├── components.json
│   ├── eslint.config.js
│   ├── formdialog-test.html
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── server
│   ├── dist
│   │   ├── config
│   │   │   └── database.config.js
│   │   ├── entities
│   │   │   ├── agent.entity.js
│   │   │   ├── index.js
│   │   │   ├── kanban-agent.entity.js
│   │   │   ├── kanban-board.entity.js
│   │   │   ├── kanban-layer.entity.js
│   │   │   └── provider.entity.js
│   │   ├── routes
│   │   │   ├── agents
│   │   │   │   └── controllers.js
│   │   │   └── providers
│   │   │       └── controllers.js
│   │   ├── Routes
│   │   │   ├── agents
│   │   │   │   └── controllers.js
│   │   │   └── providers
│   │   │       └── controllers.js
│   │   ├── types
│   │   │   └── standard.response.js
│   │   ├── utils
│   │   │   ├── custom.httpexception.js
│   │   │   └── response.wrapper.js
│   │   └── index.js
│   ├── src
│   │   ├── config
│   │   │   └── database.config.ts
│   │   ├── entities
│   │   │   ├── agent.entity.ts
│   │   │   ├── index.ts
│   │   │   ├── kanban-agent.entity.ts
│   │   │   ├── kanban-board.entity.ts
│   │   │   ├── kanban-layer.entity.ts
│   │   │   └── provider.entity.ts
│   │   ├── routes
│   │   │   ├── agents
│   │   │   │   └── controllers.ts
│   │   │   ├── kanban.agents
│   │   │   │   └── controllers.ts
│   │   │   ├── kanban.boards
│   │   │   │   └── controllers.ts
│   │   │   ├── kanban.layers
│   │   │   │   └── controllers.ts
│   │   │   └── providers
│   │   │       └── controllers.ts
│   │   ├── types
│   │   │   └── standard.response.ts
│   │   ├── utils
│   │   │   ├── custom.httpexception.ts
│   │   │   ├── response.wrapper.ts
│   │   │   ├── struct-validator.ts
│   │   │   ├── typeorm.wrapper.ts
│   │   │   └── validation.wrapper.ts
│   │   └── index.ts
│   ├── test
│   │   └── agent.controller.test.ts
│   ├── agentickanban.db
│   ├── package.json
│   ├── package-lock.json
│   ├── racersr.db
│   ├── README.md
│   ├── tsconfig.json
│   └── vitest.config.ts
├── commit.sh
├── dev.sh
└── README.md
```

## 3. Penjelasan Folder

| Folder | Deskripsi |
|---|---|
| `client/` | **Frontend SPA**. Aplikasi React 19 + Vite + TypeScript; berisi UI kanban, dashboard, dan layer komunikasi ke API. |
| `client/public/` | Aset statis yang disajikan apa adanya (favicon, sprite ikon). |
| `client/src/` | Seluruh source code frontend (entry `main.tsx`, root layout `App.tsx`, styling `index.css`). |
| `client/src/components/` | Komponen React aplikasi. |
| `client/src/components/app/` | Komponen inti domain kanban: papan, layer, dan agen (`kanban.board/layer/agent.tsx`). |
| `client/src/components/dialog/` | Dialog/modal form — pembuatan & detail entitas (provider, agent, board, layer). |
| `client/src/components/ui/` | Komponen UI primitif bergaya shadcn/ui (button, dialog, sidebar, toast, dll). |
| `client/src/hooks/` | Custom hook React. |
| `client/src/hooks/api/` | Hook data-fetching berbasis TanStack Query, dipisah `*.query` (baca) dan `*.mutation` (tulis) per resource. |
| `client/src/lib/` | Utility bersama: instance `axios` dan helper `cn`/utils. |
| `client/src/pages/` | Halaman level-route: dashboard utama, providers, agents. |
| `client/src/services/` | Layer service frontend. |
| `client/src/services/api/` | Pemanggilan endpoint HTTP per resource + normalisasi error & kategori toast. |
| `client/src/stores/` | State global ringan dengan Zustand (agents, kanban, providers). |
| `server/` | **Backend REST API**. Hono + TypeORM + SQLite. |
| `server/dist/` | *Output build (generated) dari `tsc` — di-skip.* |
| `server/src/` | Seluruh source code backend (entry `index.ts`; server listen di port 3000, CORS aktif). |
| `server/src/config/` | Konfigurasi aplikasi, utamanya inisialisasi DataSource TypeORM (SQLite, `synchronize: true`). |
| `server/src/entities/` | Definisi entity TypeORM: `Provider`, `Agent`, `KanbanBoard`, `KanbanLayer`, `KanbanAgent` (barrel di `index.ts`). |
| `server/src/routes/` | Definisi route/controller per resource (satu folder = satu resource: agents, providers, kanban.boards, kanban.layers, kanban.agents). |
| `server/src/types/` | Tipe/interface bersama, termasuk bentuk respons standar (`StandardResponse`). |
| `server/src/utils/` | Helper lintas-cuti: error HTTP kustom, response wrapper, validator (superstruct), dan wrapper TypeORM. |
| `server/test/` | Test backend (Vitest), contoh: `agent.controller.test.ts`. |
| `server/agentickanban.db` | *Database SQLite (generated/runtime data).* |
| `server/racersr.db` | *Database SQLite — nama default dari `database.config.ts`; runtime data.* |

**File root yang perlu diketahui** (bukan folder):
- `dev.sh` — menjalankan `client` & `server` dev server bersamaan (trap SIGINT untuk cleanup).
- `commit.sh` — helper `git add . && git commit && git push origin main`.
- `README.md` — deskripsi singkat project ("Agentic workflow with kanban style").
- `.gitignore` — mengabaikan `client/node_modules` dan `server/node_modules`.

## 4. Dependencies

**Package manager:** **npm** — ditandai oleh `client/package-lock.json` dan `server/package-lock.json` (tidak ada `yarn.lock`/`pnpm-lock.yaml`). Tidak ada `package.json` di root, jadi tidak ada workspace hoisting.

### Client — Runtime (`dependencies`)

- `@base-ui/react` — ^1.7.0 — komponen headless/anatomy untuk UI primitif.
- `@fontsource-variable/inter` — ^5.3.0 — font Inter (variable) yang di-self-host.
- `@tailwindcss/vite` — ^4.3.3 — plugin resmi Tailwind CSS v4 untuk Vite.
- `@tanstack/react-query` — ^5.102.8 — manajemen server-state (caching, fetch, mutation).
- `axios` — ^1.20.0 — HTTP client untuk memanggil API backend.
- `class-variance-authority` — ^0.7.1 — helper varian styling komponen.
- `clsx` — ^2.1.1 — penggabung className kondisional.
- `immer` — ^11.1.18 — update state immutable.
- `lucide-react` — ^1.34.0 — set ikon React.
- `react` — ^19.2.8 — library UI.
- `react-dom` — ^19.2.8 — renderer React untuk DOM.
- `react-router-dom` — ^7.18.2 — routing SPA.
- `shadcn` — ^4.19.0 — CLI/registry shadcn untuk komponen UI.
- `tailwind-merge` — ^3.6.0 — merge class Tailwind tanpa konflik.
- `tailwindcss` — ^4.3.3 — framework utility CSS.
- `tw-animate-css` — ^1.4.0 — utility animasi untuk Tailwind.
- `zustand` — ^5.0.15 — state management ringan.

### Client — Dev (`devDependencies`)

- `@babel/core` — ^7.29.7 — core Babel (untuk React Compiler).
- `@eslint/js` — ^10.0.1 — konfigurasi ESLint dasar.
- `@rolldown/plugin-babel` — ^0.2.3 — integrasi Babel dengan Rolldown (bundler).
- `@types/babel__core` — ^7.20.5 — tipe untuk `@babel/core`.
- `@types/node` — ^24.13.3 — tipe Node.js.
- `@types/react` — ^19.2.18 — tipe React.
- `@types/react-dom` — ^19.2.4 — tipe React DOM.
- `@vitejs/plugin-react` — ^6.1.0 — plugin React resmi Vite.
- `babel-plugin-react-compiler` — ^1.0.0 — React Compiler (auto-memoization).
- `eslint` — ^10.9.0 — linter.
- `eslint-plugin-react-hooks` — ^7.1.1 — aturan hooks React.
- `eslint-plugin-react-refresh` — ^0.5.4 — aturan Fast Refresh.
- `globals` — ^17.11.0 — definisi global env untuk ESLint.
- `typescript` — ~6.0.2 — compiler TypeScript.
- `typescript-eslint` — ^8.67.0 — integrasi TypeScript untuk ESLint.
- `vite` — ^8.2.2 — dev server & bundler.

### Server — Runtime (`dependencies`)

- `@hono/node-server` — ^2.1.1 — adapter Node.js untuk Hono.
- `better-sqlite3` — ^12.11.1 — driver SQLite sinkron.
- `dotenv` — ^17.4.2 — memuat variabel `.env`.
- `hono` — ^4.13.3 — framework HTTP ringan (entry server).
- `reflect-metadata` — ^0.2.2 — polyfill metadata (dipakai TypeORM decorator).
- `superstruct` — ^2.0.2 — validasi skema runtime.
- `typeorm` — ^1.1.0 — ORM.

### Server — Dev (`devDependencies`)

- `@types/node` — ^26.1.1 — tipe Node.js.
- `tsx` — ^4.23.12 — menjalankan TypeScript langsung (dev watch).
- `typescript` — ^7.0.2 — compiler TypeScript.
- `vitest` — ^4.1.11 — test runner.

### Scripts

**Client (`client/package.json`)**
- `npm run dev` — `vite` (dev server FE).
- `npm run build` — `tsc -b && vite build`.
- `npm run lint` — `eslint .`.
- `npm run preview` — `vite preview`.

**Server (`server/package.json`)**
- `npm run dev` — `tsx watch src/index.ts`.
- `npm run build` — `tsc`.
- `npm run test` — `vitest` (watch).
- `npm run test:run` — `vitest run` (sekali jalan).
- `npm run start` — `node dist/index.js`.

## 5. Catatan

- **Tidak ada `package.json` root** — ini monorepo dua-project terpisah, bukan npm/yarn/pnpm workspace. Dependency di-install per folder (`client` dan `server` masing-masing punya lockfile). Orkestrasi dev dilakukan oleh `dev.sh`.
- **Arsitektur berlapis di kedua sisi** (pola konsisten):
  - Client: `services/api` (HTTP) → `hooks/api` (query/mutation) → `components`/`pages` (UI) → `stores` (state global).
  - Server: `entities` (model) → `routes/*/controllers` (handler per resource) → di-route di `src/index.ts` (`/providers`, `/agents`, `/kanban-boards`, `/kanban-layers`, `/kanban-agents`).
- **Backend**: port `3000`, CORS terbuka, `synchronize: true` (schema auto-sync — cocok untuk dev, perlu perhatian untuk produksi). DB default dari config adalah `racersr.db` (bisa di-override lewat `DB_FILE_NAME`). Keberadaan dua file `.db` (`agentickanban.db`, `racersr.db`) menandakan bekas/bergantinya nama database.
- **Anomali kecil**: di `server/dist/` terdapat duplikasi folder `routes/` **dan** `Routes/` (beda kapitalisasi). Ini artefak build lama/sisa, bukan source aktif (`server/src/routes/`). Bisa jadi jejak rename folder di case-insensitive filesystem.
- **File non-source di `client/`**: `code.html` (mockup statis halaman "Agent Orchestrator - Agents" dengan Tailwind CDN) dan `formdialog-test.html` (harness uji runtime `FormDialogShell`, meng-import dari dev server `localhost:5174`). Keduanya tampak sebagai artefak desain/testing, bukan bagian build aplikasi.
- **Konfigurasi UI**: `client/components.json` menandai penggunaan shadcn/ui (style `base-mira`, base color `zinc`, alias `@/components`, `@/lib`, `@/hooks`).
- **Test**: hanya ada satu file test saat ini (`server/test/agent.controller.test.ts`) dengan Vitest; tidak ada konfigurasi test di sisi client.
- **Keterbatasan**: `tree` tersedia di environment ini sehingga struktur dapat dipetakan langsung; laporan ini tidak menelusuri isi setiap file, penjelasan folder disimpulkan dari nama + verifikasi titik-titik kunci (entry point, config, entity, layout).

---
*Jumlah folder dijelaskan: 21 (7 top-level area utama + sub-folder bermakna) · Total dependency tercatat: 44 (17 Client runtime + 16 Client dev + 7 Server runtime + 4 Server dev) + 9 script.*
