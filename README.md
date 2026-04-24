# Expense Tracker Backend

A minimal yet production-minded backend for a personal expense tracking application.

---

## 🚀 Tech Stack

* Node.js + TypeScript
* LoopBack 4
* PostgreSQL
* Mocha + Supertest (integration testing)

---

## 📦 Features

* Create expense (`POST /expenses`)
* List expenses (`GET /expenses`)

  * Filter by category
  * Sort by date (newest first)
* Total aggregation of visible expenses
* Idempotent request handling (safe retries)
* Request validation
* Structured logging
* Integration tests

---

## 🧠 Key Design Decisions

### 1. Money Handling

* Amounts are stored in **paise (integer)** instead of floating point.
* Example: ₹10.50 → `1050`

**Why?**

* Avoid floating point precision issues
* Ensures financial correctness

---

### 2. Idempotency Handling

* Implemented via `Idempotency-Key` header
* Middleware stores:

  * request hash
  * response
  * status (`IN_PROGRESS`, `COMPLETED`)

**Behavior:**

* Same key + same request → cached response returned
* Same key + different request → `409 Conflict`
* Concurrent duplicate requests → prevented

**Why?**

* Handles retries, double clicks, network failures

---

### 3. Database Choice

* PostgreSQL used instead of in-memory or file DB

**Why?**

* Better simulates real production systems
* Strong data integrity guarantees

**Trade-off:**

* Slightly more setup complexity vs SQLite

---

### 4. Logging

* Implemented using middleware
* Logs:

  * request method + URL
  * response status
  * duration
  * errors

**Why?**

* Provides observability
* Useful for debugging and monitoring

---

### 5. Validation

* Request validation handled via LoopBack schema decorators

**Why?**

* Ensures invalid data never reaches database
* Keeps controller logic clean

---

### 6. Architecture

* Controller → Repository → Database
* Middleware for cross-cutting concerns (logging, idempotency)

**Why?**

* Clear separation of concerns
* Easier to extend and maintain

---

## 🧪 Testing

Integration tests cover:

* Expense creation
* Idempotency behavior
* Filtering logic

Run tests:

```bash
npm test
```

---

## ⚠️ Trade-offs & Limitations

Due to time constraints:

* Idempotency store is **in-memory**

  * Not suitable for distributed systems
  * Would use Redis in production

* No pagination on `/expenses`

* No authentication/authorization

* No category normalization (simple string field)

---

## 🔮 Future Improvements

* Redis-backed idempotency store
* Pagination & indexing
* Category analytics (spending per category)
* Authentication layer
* Rate limiting

---

## ▶️ Running Locally

### 1. Start PostgreSQL

```bash
docker run --name expense-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=expense_tracker \
  -p 5432:5432 \
  -d postgres
```

---

### 2. Setup environment

Create `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=expense_tracker
```

---

### 3. Install dependencies

```bash
npm install
```

---

### 4. Run migrations

```bash
npx lb4 migrate
```

---

### 5. Start server

```bash
npm start
```

---

### 6. Open API Explorer

```
http://127.0.0.1:3000/explorer
```

---

## 📌 Notes

This project focuses on **correctness under real-world conditions**:

* retry safety
* data integrity
* predictable API behavior

---

## 👨‍💻 Author

Built as part of a backend assignment focusing on production-quality design.
