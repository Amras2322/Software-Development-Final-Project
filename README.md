# IT Asset & Ticket Manager

A lightweight, self-hostable, web-based **IT Asset & Support Ticket Management System**.

**Live app:** _coming soon_

Enterprise ITSM suites (Jira Service Management, ServiceNow, Snipe-IT) are powerful but
heavy, expensive, and complex — overkill for a solo sysadmin, a freelance network engineer,
or a homelab. This project is a streamlined, low-overhead way to track hardware assets and
support tickets without the bloat.

## Features

- **Accounts** — register, log in, log out. Passwords are stored as bcrypt hashes, never in plain text.
- **Assets** — create, list, edit, and delete hardware (laptops, switches, servers…).
- **Tickets** — create, list, view, edit, resolve, and delete support tickets.
- **Linking** — a ticket can point at a specific hardware asset.
- **Dashboard** — open tickets grouped by **High / Medium / Low** priority; resolved tickets drop off.
- **Audit trail** — every ticket status change is recorded with a timestamp.

## Screenshots

_coming soon_

## Tech stack

| Layer       | Choice                                  |
|-------------|-----------------------------------------|
| Runtime     | Node.js + Express 5                     |
| Views       | Server-rendered EJS                     |
| Database    | SQLite (via Sequelize)                  |
| Styling     | Hand-written CSS (`src/public/styles.css`) |
| Tests       | Jest + Supertest                        |
| CI          | GitHub Actions                          |
| Deployment  | Render                                  |

## Architecture

The app follows **MVC**:

| Part       | Where         | Job                                                        |
|------------|---------------|------------------------------------------------------------|
| Model      | `src/models/` | Sequelize models and the SQLite connection (`src/db.js`)   |
| View       | `src/views/`  | EJS templates plus shared partials (header/nav/footer)     |
| Controller | `src/routes/` | Express routers that handle requests and talk to the models |

`src/server.js` wires it together: static files, sessions, the view engine, the routers, and
the database sync on startup.

### Design patterns

**MVC** — the data layer (`models/`), the request-handling layer (`routes/`), and the
presentation layer (`views/`) are kept separate, so a change to one rarely touches the others.

**Observer** — when a ticket's status changes, the ticket route *announces* it and an
independent listener writes the audit row:

```js
// announce (src/routes/tickets.js)
ticketEvents.emit('ticket:statusChanged', { ticketId, from, to });

// listen (src/audit/observer.js)
ticketEvents.on('ticket:statusChanged', ({ ticketId, from, to }) => {
    AuditLog.create({ ticketId, action: 'status_changed', detail: `${from} -> ${to}` });
});
```

The ticket code knows nothing about logging, so another reaction (for example, emailing an
admin when a High ticket is resolved) could be added without touching it.

## Project structure

```
src/
  server.js            Express app: static files, sessions, routes, database sync
  db.js                Sequelize connection (SQLite)
  models/              User, Asset, Ticket, AuditLog + their relationships
  routes/              auth, assets, and tickets routers
  views/               EJS templates + partials (shared header/nav/footer)
  public/              styles.css
  auth/passwords.js    bcrypt hash / verify helpers
  middleware/          requireLogin
  audit/observer.js    the Observer pattern
tests/                 Jest + Supertest tests
```

## Getting started

Requires **Node.js 20+**.

```bash
npm install
npm start          # http://localhost:3000   (npm run dev auto-reloads)
npm test           # runs the tests with coverage
```

### Environment variables

| Variable         | Default                | Purpose                                              |
|------------------|------------------------|------------------------------------------------------|
| `PORT`           | `3000`                 | Port to listen on                                    |
| `SESSION_SECRET` | `dev-secret-change-me` | Signs session cookies — **set a real one in production** |
| `NODE_ENV`       | `development`          | `test` uses a throwaway in-memory database           |
| `DB_STORAGE`     | `./instance/app.db`    | Where the SQLite file lives                          |

## Usage

1. Open the app and click **Register** to create an account (you're logged in automatically).
2. Go to **Assets → Add asset** and record some hardware.
3. Go to **Tickets → Add ticket**, give it a title and priority, and link it to an asset.
4. The **Dashboard** lists open tickets under High / Medium / Low. Resolving a ticket removes
   it from the dashboard and writes an audit row.

## Testing

```bash
npm test
```

39 tests (Jest + Supertest) cover the models, authentication, both CRUD areas, the observer,
and the dashboard. Line coverage is around **95%**, and Jest is configured to **fail the run
if coverage drops below 80%**, so it can't silently slip. GitHub Actions runs the suite on
every push and pull request.

## Deployment

Deployed on **Render** as a Node web service:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment:** set `SESSION_SECRET` to a long random value and `NODE_ENV=production`

> **Data persistence:** Render's filesystem is ephemeral, so the SQLite file resets whenever
> the service restarts or redeploys. That's fine for an MVP demo; for real use you'd attach a
> persistent disk or migrate to PostgreSQL.

## Known limitations

- The audit write is fire-and-forget, so a failed write wouldn't be reported anywhere.
- SQLite on Render's ephemeral disk means data doesn't survive a redeploy (see above).
- No CSRF protection on the forms.
- No password strength rules and no email verification.
- A resolved ticket can't be reopened.
- A single role — everyone who logs in has full access.

## Troubleshooting

- **Port 3000 already in use** — something else is on that port (`lsof -iTCP:3000`); stop it or set `PORT`.
- **`Cannot find module 'sqlite3'`** — run `npm install`; it's a native module that builds on install.
- **Logged out on every request** — `SESSION_SECRET` is missing or changing between restarts.

## Future improvements

From the original project plan: SSO/LDAP login, a REST API so scripts can open tickets
automatically (e.g. a homelab router reporting a dead server), PostgreSQL with role-based
access control, and reopening resolved tickets.
