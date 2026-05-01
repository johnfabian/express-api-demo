# express-api-demo

Monorepo-style layout with the Express API in `server/` and (planned) a React frontend alongside it.

## Structure

```
.
├── server/   # Express + Bun API
└── client/   # (planned) React app
```

## Server

```bash
cd server
bun install
bun run dev    # nodemon
# or
bun run start  # node server.js
```

API runs on http://localhost:3000, Swagger UI at http://localhost:3000/swagger-ui/.
