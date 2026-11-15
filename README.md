# Software Development Final Project

A lightweight, self-hostable, web-based **IT Asset & Support Ticket Management System**.

Enterprise ITSM suites (Jira Service Management, ServiceNow, Snipe-IT) are powerful but
heavy, expensive, and complex. For solo sysadmins, freelance network engineers, and
homelab environments that is overkill. This project provides a streamlined, low-overhead
way to track basic hardware assets and support tickets without the bloat.

## Problem & Vision

Targeted at solo sysadmins and homelab enthusiasts, the core value proposition is a fast,
easily deployable CRUD application for daily IT operations. Success is defined by the
ability to create tickets, link them to specific hardware assets, and securely
authenticate users in a live, deployed web environment with page loads under two seconds.

## Planned Stack

| Layer           | Choice                                      |
|-----------------|---------------------------------------------|
| Backend         | Node.js + Express                           |
| Frontend        | Server-rendered EJS + Pico.css              |
| Database        | SQLite (via Sequelize)                      |
| Design patterns | MVC + Observer (audit logging)              |
| CI/CD           | GitHub Actions                              |
| Deployment      | Render                                      |

## Project Status

Sprint 1 (MVP) — **in progress**. The MVP scope is: database schema, secure user
authentication, and a working dashboard, deployed to a public URL.

## Getting Started

Requires Node.js 20+.

```bash
# 1. Install dependencies
npm install

# 2. Create a local environment file
cp .env.example .env
# then set a real SESSION_SECRET

# 3. Run the app (http://localhost:3000)
npm start        # or: npm run dev  (auto-reload)

# 4. Run the test suite
npm test
```

## Project Structure

```
src/
  app.js            Express application factory
  server.js         Server entrypoint
  config.js         Environment-driven configuration
  db.js             Sequelize instance (data layer)
  models/           Sequelize models (Model)
  controllers/      Request handlers (Controller)
  routes/           URL -> controller mapping (Controller)
  views/            EJS templates (View)
  public/           Static assets (CSS)
tests/              Jest + Supertest tests
```

## Documentation

Setup, usage, architecture, and testing documentation will be expanded as the MVP is built.
