# express-api-demo

Monorepo with an Express 4 API server and a React (Vite) client. Demonstrates server-side and client-side paging/sorting/filtering, two styles of OpenAPI documentation (YAML/JSDoc vs Zod), and an embedded Postgres via [PGlite](https://pglite.dev/) which is for demo purposes only.

## Structure

```
.
├── server/                # Express 4 API (Node 24, ES modules)
│   ├── routes/            # /todos, /products
│   ├── controllers/
│   ├── repositories/
│   ├── lib/paging.mjs     # parsePagingQuery, parseFilterQuery, buildWhere, paginate
│   ├── models/            # OpenAPI schemas (YAML JSDoc + Zod)
│   └── db/                # init.sql, products.sql, pglite bridge
└── client/express-client/ # React + Vite + PrimeReact + TanStack Query
    ├── src/pages/         # TodosClientPagingPage, TodosServerPagingPage
    ├── src/services/      # API client wrappers
    └── src/lib/           # Shared filter UI helpers
```

## Quick start

Requires **Node 24** (any 24.x release; pinned in `server/package.json` engines).

```bash
git clone <repo>
cd express-api-demo
npm install            # workspaces — installs server + client in one shot
npm run dev            # starts both servers in parallel
```

On the first run, PGlite seeds `todos` (1000 rows) and `products` (50 rows) automatically. URLs are printed in the server banner once both processes are up:

```
  ───────────────────────────────────────────
  Client UI:      http://localhost:5173
  Server API:     http://localhost:3000
  Swagger:        http://localhost:3000/swagger-ui
  ───────────────────────────────────────────
```

If you launch via `npm run database` instead (starts the dev server **and** Drizzle Studio together), the banner adds one more line:

```
  Drizzle Studio: https://local.drizzle.studio
```

Drizzle Studio is just a web UI for browsing the PGlite data (tables, rows, ad-hoc queries) — it's a viewer, not part of the runtime API.

## Scripts

Run from the repo root:

| Script | What it does |
|---|---|
| `npm run dev` | Start server + client in parallel via `concurrently` |
| `npm run dev:server` | Server only (port 3000) |
| `npm run dev:client` | Client only (port 5173) |
| `npm start` | Production server (`node --env-file=.env.production`) |
| `npm run stop-servers` | Free ports 3000, 5173, 5174, 5175 |
| `npm run database` | Open Drizzle Studio against the PGlite bridge |
| `npm run db:pull` | Regenerate `db/schema.ts` from the live DB |
| `npm run db:reseed-products` | Drop and recreate the `products` table from `db/products.sql` |

## Demo highlights

### Paging strategies (todos)
- `/todos` (Client paging) — fetches the full list once, PrimeReact handles paging/sorting/column-filtering in the browser. Global search hits the server with `?q=...`.
- `/todos-server` (Server paging) — the DataTable runs in `lazy` mode, so each new combination of page, sort, filter, and search issues one request. TanStack Query caches each result, so revisiting the same combination is served instantly from cache without another network call.

#### Caching with TanStack Query
Both pages wrap their fetches in `useQuery` with request parameters folded into the `queryKey`:
- Server-paging: `['todos', 'server-paging', { page, rows, sortField, order, filters, q }]`
- Client-paging: `['todos', 'client-paging', { q }]`

What that buys:
- **Per-combination cache.** Each unique parameter set is its own cache entry, so revisiting an already-fetched page is instant — TanStack returns the cached result immediately and (since the default `staleTime` is 0) silently revalidates in the background.
- **No flicker between pages.** The server-paging page sets `placeholderData: keepPreviousData`, so while the next page is loading the previous page's rows stay visible — no flash to empty.
- **No refetch on local interactions.** The client-paging page's queryKey only includes `q`, so changing column filters or paging in the browser never triggers a network request; TanStack reuses the cached full list.
- **Automatic GC.** Cache entries unused for `gcTime` (5 minutes by default) are dropped, so navigating around the app doesn't accumulate memory.

### Filter pipeline
`server/lib/paging.mjs` exposes:
- `parsePagingQuery` — validates `page`, `pageSize`, `sortField`, `sortOrder`
- `parseFilterQuery` — validates per-field filters and an optional global `q`
- `buildWhere` — composes a safe SQL `WHERE` fragment with `postgres.js` tagged templates
- `paginate` — wires it all together, returns `{ items, total, page, pageSize, totalPages }`

Match modes supported on text filters: `contains`, `notContains`, `startsWith`, `endsWith`, `equals`, `notEquals`. Sent on the wire as `<field>=...&<field>MatchMode=...`.

### YAML vs Zod OpenAPI
Both endpoints appear identically in Swagger UI, but the source files differ:
- `server/models/todos.model.mjs` — YAML in JSDoc comments
- `server/models/product.model.mjs` — Zod schemas via `@asteasolutions/zod-to-openapi`

Compare the two when adding the same six filter parameters: ~36 lines of duplicated YAML vs 6 lines reusing a single `MatchMode = z.enum([...])`.

## Resetting the data

PGlite persists to `server/data/pgdata/`. To start fresh:

```bash
rm -rf server/data/pgdata
npm run dev
```

To reseed only products without losing todos:

```bash
npm run db:reseed-products
```

(Stop the dev server first — PGlite holds an exclusive lock on the data dir.)
