# Jayawardhana Motors Frontend

Web app for the Jayawardhana Motors motorcycle inventory, refurbishment and sales system.

**Stack:** React 19 · TypeScript · Vite · React Router · TanStack Query · Vitest + Testing Library

- Backend repo: https://github.com/yathushi28-lang/backend_Backoffice
- Task list and starting order: `documentation/TASKS.md` in the backend repo
- Project board: https://github.com/orgs/NSBM-GROUP-Assignments/projects/2

## Status

The app shell is in place: routing, sidebar layout (works on mobile), API client, data fetching, a system status card, tests and CI.
Every page is a placeholder that names the task and member who builds it.

Temporary pieces that other tasks replace:

| File | Replaced by |
|---|---|
| `src/components/ProtectedRoute.tsx` (everyone counts as signed in) | JM-08 |
| `src/pages/Login.tsx` | JM-08 |
| `src/services/firebase.ts` | JM-06 |
| `src/components/DataTable.tsx` | JM-13 |

## Getting started

You need **Node.js 24** (see `.nvmrc`; 22 also works) and the backend running (see the backend README).

```bash
git clone https://github.com/yathushi28-lang/frontend_Backoffice.git
cd frontend_Backoffice
git checkout dev
cd frontend
npm install
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173. The dashboard's **System status** card shows whether the backend and database are reachable.

If it says "Cannot reach the server", start the backend (`npm run dev` in `backend_Backoffice/backend`) and check `VITE_API_URL` in `.env`.

## Scripts

Run these inside `frontend/`.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm test` | Run all tests once (`npm run test:watch` to keep running) |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check TypeScript types |
| `npm run build` / `npm run preview` | Build for production and preview the build |

## Project structure

```
frontend/src/
├── main.tsx               entry: React Query provider + router
├── App.tsx                all routes
├── config/navigation.ts   sidebar items (label, path, task, owner)
├── layouts/               DashboardLayout (sidebar + navbar + page)
├── components/            shared components (Sidebar, Navbar, ProtectedRoute, ApiStatus, ...)
├── pages/                 one file per page
├── features/              bigger feature folders (forms, hooks, components per module)
├── hooks/                 shared hooks
├── services/              api.ts (backend client), queryClient.ts, firebase.ts
├── styles/global.css      design tokens (colours, spacing) and shared styles
├── types/                 shared TypeScript types (API shapes)
└── test/                  test setup and render helper
```

## Building a page

Example: the vehicle list (JM-18). Fetch with TanStack Query and the shared `api` client.

```tsx
// src/features/inventory/useVehicles.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { Money, Paginated } from "../../types/api";

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  registration: string;
  status: string;
  purchasePrice: Money;
}

export function useVehicles(params: { page: number; q?: string }) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: ({ signal }) => api.get<Paginated<Vehicle>>("/vehicles", params, signal),
  });
}
```

```tsx
// src/pages/Vehicles.tsx
import { useState } from "react";
import { useVehicles } from "../features/inventory/useVehicles";

export default function Vehicles() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useVehicles({ page });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">{error.message}</p>;
  if (data.data.length === 0) return <p>No vehicles yet. Register the first one.</p>;

  return (/* table of data.data, pager using data.meta */);
}
```

Saving data uses `useMutation`. Sales and payments must send an idempotency key so a double click can't create two records:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, ApiError, newIdempotencyKey } from "../../services/api";

const [idempotencyKey] = useState(newIdempotencyKey); // one key per form
const queryClient = useQueryClient();

const createSale = useMutation({
  mutationFn: (input: NewSale) => api.post("/sales", input, { idempotencyKey }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
});

// in the form: <button disabled={createSale.isPending}>Confirm sale</button>
// errors:      createSale.error instanceof ApiError && createSale.error.code === "VEHICLE_ALREADY_SOLD"
```

### Rules

- **Never** call `fetch` directly; use `api` from `services/api.ts`. It adds the token, handles 401 and turns errors into `ApiError` with the backend's `code`.
- Money is a **string** (`"125000.00"`). Format it for display with `Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" })`; never do maths on it in the browser.
- Use the colour and spacing variables from `styles/global.css` instead of hard-coded values.
- Every page handles loading, error and empty states.
- Hiding a button is not security. The backend checks permissions on every request.
- Add a test for important behaviour (see `src/App.test.tsx` and `src/services/api.test.ts`).

## Working on a task

1. Move your card on the board to **DEV IN PROGRESS**.
2. `git checkout dev && git pull`, then `git checkout -b feature/JM-18-inventory-pages`.
3. Build it, add tests, run `npm run lint && npm run typecheck && npm test`.
4. Push and open a PR into `dev` titled `JM-18 Inventory pages`. One teammate reviews.
5. After merge, move the card to **QA In Progress**, then **Done**.

Never commit `.env` files. Anything in a `VITE_` variable is visible to every browser, so never put secrets there.
