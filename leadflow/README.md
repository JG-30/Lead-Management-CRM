# LeadFlow CRM

A full-stack Lead Management CRM built with React, Node.js/Express, and MongoDB.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Recharts  |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB + Mongoose                      |
| State     | TanStack Query (React Query)            |
| Forms     | React Hook Form                         |
| Deploy    | Docker + Docker Compose + Nginx         |

---

## Project Structure

```
leadflow/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   └── leadController.js # All lead CRUD + stats logic
│   │   ├── models/
│   │   │   └── Lead.js           # Mongoose schema
│   │   ├── routes/
│   │   │   └── leadRoutes.js     # Express routes
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # Global error handler
│   │   └── server.js             # App entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── StatusBadge.jsx   # Colored status pill
│   │   │   ├── LeadModal.jsx     # Add/Edit form modal
│   │   │   └── DeleteModal.jsx   # Confirm delete dialog
│   │   ├── hooks/
│   │   │   └── useLeads.js       # React Query hooks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Stats + charts
│   │   │   └── LeadsPage.jsx     # Full leads table
│   │   ├── services/
│   │   │   └── api.js            # Axios API client
│   │   └── utils/
│   │       └── constants.js      # Shared constants & helpers
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
└── docker-compose.yml
```

---

## Quick Start (Local Dev)

### Prerequisites
- Node.js 18+
- MongoDB running locally (or use Docker)

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd leadflow
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET

npm install
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:3000
```

> The Vite dev server proxies `/api` to `localhost:5000` automatically.

---

## Docker Deployment (Production)

```bash
# From the project root
docker compose up -d --build

# App will be live at http://localhost
# API at http://localhost:5000
# MongoDB at localhost:27017
```

To stop:
```bash
docker compose down
```

To view logs:
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

---

## API Reference

### Base URL: `http://localhost:5000/api`

#### Get all leads
```
GET /leads
```
Query params: `search`, `status`, `sort`, `order`, `page`, `limit`, `source`

**Example:**
```
GET /leads?search=priya&status=Qualified&sort=createdAt&order=desc&page=1&limit=10
```

#### Get single lead
```
GET /leads/:id
```

#### Create lead
```
POST /leads
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@techcorp.in",
  "phone": "+91 98765 43210",
  "company": "TechCorp India",
  "status": "New",
  "source": "Website",
  "notes": "Inbound via contact form"
}
```

#### Update lead
```
PUT /leads/:id
Content-Type: application/json

{ "status": "Qualified", "notes": "Demo scheduled" }
```

#### Delete lead
```
DELETE /leads/:id
```

#### Get statistics
```
GET /leads/stats
```
Returns: totals, win rate, status breakdown, recent leads, monthly trend.

#### Bulk update status
```
PATCH /leads/bulk-status
Content-Type: application/json

{ "ids": ["id1", "id2"], "status": "Contacted" }
```

---

## Lead Schema

| Field       | Type    | Required | Notes                                         |
|-------------|---------|----------|-----------------------------------------------|
| name        | String  | ✅       | Max 100 chars                                 |
| email       | String  | ✅       | Unique, lowercased                            |
| phone       | String  | ❌       | Max 20 chars                                  |
| company     | String  | ❌       | Max 100 chars                                 |
| status      | Enum    | ❌       | New / Contacted / Qualified / Converted / Lost |
| source      | Enum    | ❌       | Website / Referral / Cold Call / Email / etc  |
| notes       | String  | ❌       | Max 1000 chars                                |
| assignedTo  | String  | ❌       | Team member name                              |
| createdAt   | Date    | auto     | Mongoose timestamp                            |
| updatedAt   | Date    | auto     | Mongoose timestamp                            |

---

## Features

- ✅ Add / Edit / Delete leads
- ✅ Search by name, email, company
- ✅ Filter by status
- ✅ Sort by name or date
- ✅ Pagination (10 per page)
- ✅ Bulk row selection
- ✅ Statistics dashboard (bar chart, donut chart, win rate)
- ✅ Monthly trend chart
- ✅ Recent leads table
- ✅ Status-filtered sidebar nav
- ✅ Toast notifications
- ✅ Delete confirmation modal
- ✅ Responsive dark-mode UI
- ✅ Rate limiting, CORS, Helmet security
- ✅ Dockerized deployment

---

## Deployment to Cloud

### Railway / Render / Fly.io (Backend)
1. Set environment variables from `.env.example`
2. Deploy the `backend/` folder
3. Use MongoDB Atlas for managed database

### Vercel / Netlify (Frontend)
1. Set `VITE_API_URL=https://your-backend-url/api` in environment
2. Build: `npm run build`
3. Deploy the `dist/` folder

### MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get connection string, replace `MONGO_URI` in backend env

---

## Environment Variables

### Backend `.env`
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/leadflow
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend `.env`
```env
VITE_API_URL=https://your-backend-url/api
```
