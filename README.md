# MARC — Construction Project Management

MARC is a role-based web application for managing construction projects end-to-end: from budget allocation through material procurement to on-site execution. Each user has a clearly-scoped role with hard-enforced boundaries to prevent over-allocation, over-spending, and over-use of materials.

## Role Scope

### Owner (strategic)
- Manage users (create, activate, deactivate, delete)
- Create projects, assign team (only active users), set **budget** and **material allocation** per project
- Update project details, team, status, budget, allocations mid-flight (with safety checks)
- Archive projects (soft delete — preserves history)
- See everything across all projects
- **Cannot** plan tasks, approve orders, place purchase orders, or submit reports

### Manager (project lead)
- See only assigned projects
- Plan day-wise tasks for engineer
- Request material orders (capped by remaining project allocation and budget)
- Cannot exceed budget or allocation; system blocks at request time

### Engineer (field executor)
- See only assigned projects
- Update task status (pending → in-progress → completed)
- Submit progress reports with **materials used today**
- Cannot use more material than has been **delivered** to the project (hard cap)

### Accountant (procurement & finance)
- See only assigned projects + their orders
- Approve or reject material requests
- Place purchase orders with vendor details and cost (capped by remaining budget)
- Mark deliveries as received (this updates the project's inventory ledger)

## Material & Budget Flow

```
1. Owner sets:        budget=$100,000    allocation.cement=500
2. Manager requests:  cement=200         estimatedCost=$10,000   → project.requested += 200
3. Accountant approves                                            → no ledger change
4. Accountant places PO: cost=$10,000                            → project.spent += 10,000
5. Accountant marks delivered                                    → project.requested -= 200, project.delivered += 200
6. Engineer reports: used cement=150                             → project.consumed += 150
                                                                   inventory on hand = 200 - 150 = 50
```

### Hard caps

| Action | Block when |
|---|---|
| Manager requests order | `requested + delivered + new_request > allocation` per material |
| Manager requests order | `estimatedCost + spent > budget` |
| Accountant places PO | `cost + spent > budget` |
| Engineer reports usage | `used > (delivered - consumed)` per material |
| Owner assigns user | `user.isActive === false` |
| Owner lowers allocation | `new_allocation < (requested + delivered)` per material |
| Owner lowers budget | `new_budget < spent` |
| Owner deactivates user | user is assigned to an active project |
| Owner deletes user | user is assigned to an active project |

### Soft delete
Projects are never hard-deleted. Archive sets `isArchived=true` and `status=archived`. Historical orders and reports remain queryable. Owner can unarchive via API (UI hook can be added later).

## Architecture

```
marc-frontend (Vite + React + Redux Toolkit + MUI)
        │
        │  REST API + JWT bearer
        ▼
marc-backend (Express + Mongoose)
        │
        ▼
MongoDB Atlas (database: MARC)
```

## Data Model

Six collections, normalized with ObjectId references:

- **users** — email, password (bcrypt-hashed), name, role, isActive
- **projects** — projectName, owner, manager, engineer, accountant, location, status, isArchived, budget, spent, allocation, requested, delivered, consumed, unitCost
- **taskplans** — one per project, nested days with nested tasks
- **engineerreports** — project, engineer, date, description, progress, issues, resolutions, materialsUsed
- **materialorders** — orderId, project, requestedBy, materials, estimatedCost, status, approvedBy
- **purchaseorders** — purchaseOrderId, materialOrder, project, placedBy, materials, vendor, tracking (with deliveredAt), totalCost, status

The **project document is the ledger of truth** — every order/PO/report write also updates the project's `requested` / `delivered` / `consumed` / `spent` fields atomically inside the corresponding service.

## REST API

```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/users                                 owner
POST   /api/users                                 owner
PATCH  /api/users/:id                             owner
DELETE /api/users/:id                             owner

GET    /api/projects[?archived=true]              all (scoped to assignment)
POST   /api/projects                              owner
GET    /api/projects/:id                          assigned
PATCH  /api/projects/:id                          owner
POST   /api/projects/:id/archive                  owner
POST   /api/projects/:id/unarchive                owner

GET    /api/projects/:id/task-plan                manager/engineer/owner
PUT    /api/projects/:id/task-plan                manager (assigned)
PATCH  /api/task-plans/:planId/days/:dayNumber/tasks/:taskId    engineer/manager

GET    /api/projects/:id/reports                  assigned
POST   /api/projects/:id/reports                  engineer (assigned)

GET    /api/orders                                owner/accountant/manager (scoped)
GET    /api/projects/:id/orders                   assigned
POST   /api/projects/:id/orders                   manager (assigned)
PATCH  /api/orders/:orderId/approve               accountant (assigned)
PATCH  /api/orders/:orderId/reject                accountant (assigned)
POST   /api/orders/:orderId/purchase              accountant (assigned)
POST   /api/orders/purchase-orders/:poId/deliver  accountant (assigned)
GET    /api/orders/purchase-orders                owner/accountant
```

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- **Note**: do not run from a OneDrive/Dropbox-synced folder

### Backend

```bash
cd marc-backend
cp .env.example .env
# Edit .env:
#   MONGO_CONNECTION=mongodb+srv://user:pass@cluster.mongodb.net/MARC?...
#   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
#   CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
npm install
npm run dev
```

Required env vars:

| Variable | Purpose |
|---|---|
| `MONGO_CONNECTION` | MongoDB Atlas connection string ending in `/MARC?...` |
| `JWT_SECRET` | 64-byte random hex string |
| `JWT_EXPIRES_IN` | Token lifetime (default `24h`) |
| `BCRYPT_SALT_ROUNDS` | Default `10` |
| `PORT` | Default `9000` |
| `CLIENT_URL` | Comma-separated allowed origins for CORS |
| `SEED_ON_START` | `true` to seed default users on startup |

### Frontend

```bash
cd marc-frontend
cp .env.example .env
# Default VITE_API_URL=http://localhost:9000/api is correct
npm install
npm run dev
```

Open http://localhost:5173.

### Seeded users

| Role | Email | Password |
|---|---|---|
| Owner | owner@marc.com | Owner@123 |
| Manager | manager1@marc.com | Manager@123 |
| Manager | manager2@marc.com | Manager@123 |
| Engineer | engineer1@marc.com | Engineer@123 |
| Engineer | engineer2@marc.com | Engineer@123 |
| Accountant | accountant1@marc.com | Accountant@123 |
| Accountant | accountant2@marc.com | Accountant@123 |

Change all passwords before production.

## Railway Deployment

Two Railway services, one per folder.

### Backend
1. New project → root directory `marc-backend`.
2. Environment variables (Railway sets `PORT`):
   ```
   MONGO_CONNECTION=...
   JWT_SECRET=...
   JWT_EXPIRES_IN=24h
   BCRYPT_SALT_ROUNDS=10
   NODE_ENV=production
   CLIENT_URL=https://<your-frontend>.up.railway.app
   SEED_ON_START=true     # flip to false after first deploy
   ```
3. MongoDB Atlas → Network Access → allow `0.0.0.0/0`.
4. Health check: `/health`.

### Frontend
1. New project → root directory `marc-frontend`.
2. Environment variable:
   ```
   VITE_API_URL=https://<your-backend>.up.railway.app/api
   ```
3. Railway will run `npm install && npm run build && npm start` (`vite preview` on injected `PORT`).

### Deployment order
1. Deploy backend; copy URL.
2. Set frontend `VITE_API_URL` to `<backend-url>/api`; deploy frontend.
3. Set backend `CLIENT_URL` to frontend URL; redeploy backend.
4. After first successful boot, flip `SEED_ON_START=false`.

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| `ERR_CONNECTION_REFUSED` | Backend not running, or env missing | Check backend logs; verify `MONGO_CONNECTION` and `JWT_SECRET` |
| `MongoServerError: bad auth` | Wrong Atlas user/password, or special chars not URL-encoded | Use Atlas autogenerated password |
| `MongoServerSelectionError` | Atlas IP whitelist | Allow `0.0.0.0/0` in Atlas Network Access |
| CORS preflight blocked | `CLIENT_URL` doesn't match origin | Include both `localhost:5173` and `127.0.0.1:5173` (comma-separated) |
| `ALLOCATION_EXCEEDED` | Manager requested more than allocated | Increase project allocation (owner) or reduce request |
| `INSUFFICIENT_INVENTORY` | Engineer reported usage > delivered | Wait for delivery or reduce reported usage |
| `BUDGET_EXCEEDED` | PO cost would push total above budget | Increase budget (owner) or reduce PO cost |
| `USER_INACTIVE` | Tried to assign deactivated user | Reactivate user or pick a different one |
| `USER_ASSIGNED` | Tried to deactivate user mid-project | Reassign their projects first |

## Folder Structure

```
marc-backend/
├── server.js
├── package.json, railway.json, Procfile, .env.example
└── src/
    ├── app.js                                       Express setup
    ├── config/db.js                                 mongoose connection
    ├── middleware/auth.js                           requireAuth, requireRole
    ├── models/                                      6 mongoose models
    │   ├── user.js
    │   ├── project.js                               + MATERIAL_KEYS export
    │   ├── taskPlan.js
    │   ├── engineerReport.js
    │   ├── materialOrder.js
    │   └── purchaseOrder.js
    ├── services/
    │   ├── _materials.js                            ledger math + validations
    │   ├── auth.service.js
    │   ├── user.service.js
    │   ├── project.service.js
    │   ├── taskPlan.service.js
    │   ├── report.service.js
    │   └── order.service.js
    ├── controllers/                                 thin HTTP wrappers
    ├── routes/                                      role-gated routers
    ├── utils/                                       response helpers, error class
    └── seed.js

marc-frontend/
├── package.json, tsconfig.json, vite.config.ts, index.html
└── src/
    ├── main.tsx
    ├── i18n.ts
    ├── routes/AppRoute.tsx                          role-guarded routes
    ├── components/
    │   ├── Navbar.tsx
    │   ├── ProtectedRoute.tsx
    │   └── ProgressBar.tsx                          shared allocation/budget bar
    ├── lib/
    │   ├── api.ts                                   axios + JWT interceptor
    │   └── types.ts                                 + formatMoney + MATERIAL_KEYS
    ├── redux/
    │   ├── actions/                                 typed thunks
    │   ├── reducer/                                 slices + root reducer
    │   └── store/store.ts
    ├── pages/
    │   ├── login/                                   split-screen purple
    │   ├── owner/                                   Dashboard, Overview, Projects, Users, Orders
    │   ├── manager/                                 Dashboard with allocation/budget bars
    │   ├── engineer/                                Dashboard with inventory bars
    │   ├── accountant/                              Dashboard with mark-delivered
    │   └── notFound/
    └── styles/                                      purple/lavender theme
```


