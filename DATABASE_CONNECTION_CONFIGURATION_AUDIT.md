# DATABASE CONNECTION CONFIGURATION AUDIT

**Project:** C:\Users\WinDows\Desktop\yalabena-main  
**Date:** 2026-10-31  
**Audit type:** Read-only configuration audit (no changes made)

---

## 1. Discovered Configuration Files

| File | Purpose |
|------|---------|
| `C:\Users\WinDows\Desktop\yalabena-main\.env` | Root backend runtime environment (loaded by NestJS ConfigModule) |
| `C:\Users\WinDows\Desktop\yalabena-main\.env.example` | Template for root `.env` |
| `C:\Users\WinDows\Desktop\yalabena-main\docker-compose.yml` | Docker Compose orchestration (backend + postgres + redis) |
| `C:\Users\WinDows\Desktop\yalabena-main\front\docker-compose.yml` | Frontend nginx container (standalone, joins external network) |
| `C:\Users\WinDows\Desktop\yalabena-main\front\.env.example` | Frontend Vite environment variables (VITE_ prefixed only) |
| `C:\Users\WinDows\Desktop\yalabena-main\src\database\database.module.ts` | NestJS TypeORM module (ACTIVE — imported by AppModule) |
| `C:\Users\WinDows\Desktop\yalabena-main\src\database\data-source.ts` | Alternative TypeORM DataSource (NOT imported by AppModule) |
| `C:\Users\WinDows\Desktop\yalabena-main\src\app.module.ts` | App root module — loads `.env` via `ConfigModule.forRoot({ envFilePath: '.env' })` |
| `C:\Users\WinDows\Desktop\yalabena-main\front\vite.config.js` | Frontend dev server — proxies `/api/v1` to `http://localhost:3000` |
| `C:\Users\WinDows\Desktop\yalabena-main\front\vite.config.ts` | Duplicate Vite config (same proxy target) |
| `C:\Users\WinDows\Desktop\yalabena-main\run_backend.bat` | Backend startup script (local: `node dist/main.js`) |
| `C:\Users\WinDows\Desktop\yalabena-main\start_backend.cmd` | Backend startup script (local: `node dist/main.js`) |

## 2. Actual Configuration Loaded by the Backend

### app.module.ts (line 41)
```typescript
ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
```
This explicitly loads `C:\Users\WinDows\Desktop\yalabena-main\.env`. **Not** Docker environment variables.

### Active TypeORM config: `src/database/database.module.ts`
```typescript
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', 5432),
    username: config.get('DB_USERNAME', 'postgres'),
    password: config.get('DB_PASSWORD', ''),
    database: config.get('DB_NAME', 'speakup_tms'),
    ...
  }),
})
```
This is the configuration actually used at runtime (imported at `app.module.ts` line 4).

### Secondary TypeORM config: `src/database/data-source.ts`
This file exists but is **NOT imported** by `app.module.ts` or any other source file. It is dead code at runtime.

### Root `.env` values (the ones actually loaded)
| Variable | Value |
|----------|-------|
| DB_HOST | `localhost` |
| DB_PORT | `5432` |
| DB_USERNAME | `postgres` |
| DB_PASSWORD | `postgres` (rejected by local PostgreSQL) |
| DB_NAME | `speakup_tms` |
| DB_SSL | `false` |

### Frontend proxy configuration
`front/vite.config.js` proxies `/api/v1` → `http://localhost:3000`. This assumes the backend runs locally on port 3000.

## 3. PostgreSQL Instances Identified

| Instance | Status | Port | Auth Method |
|----------|--------|------|-------------|
| **Local Windows PostgreSQL 18** (`postgresql-x64-18` service) | **Running** | 5432 | `scram-sha-256` (password required) |
| Docker `speakup-postgres` (from `docker-compose.yml`) | **Not running** | — | `POSTGRES_PASSWORD: postgres` |

Docker verification: `docker ps -a` and `docker compose ps` both return **no containers**. Docker Desktop containers `speakup-postgres`, `speakup-api`, `speakup-frontend`, `speakup-redis` are **not currently running**. The `.kilo/containers.txt` file is a cached audit artifact from an earlier date (10/11/26), not current state.

## 4. Expected Connection Target

For the **current local Windows setup**:
- **Host:** `localhost` (correct — matches `.env`)
- **Port:** `5432` (correct — matches `.env` and running service)
- **Database:** `speakup_tms`
- **Username:** `postgres`
- **Password:** `postgres` (**REJECTED** — `FATAL: password authentication failed for user "postgres"`)

The backend is expected to connect to the local Windows PostgreSQL 18 service on `127.0.0.1:5432`. The host configuration is correct; the password is the blocker.

## 5. Conflicting or Duplicated Settings

### Conflict 1: `docker-compose.yml` vs `.env` on `DB_HOST`
| File | DB_HOST | Correct for |
|------|---------|-------------|
| `docker-compose.yml` | `postgres` (Docker service name) | Docker Compose mode only |
| `.env` | `localhost` | Local Windows mode |

The docker-compose value `postgres` would fail if used locally because there is no Docker service named `postgres` on the host. However, the backend loads `.env` (not docker-compose env), so this conflict is dormant unless Docker Compose is used.

### Conflict 2: Two TypeORM configurations
- `database.module.ts` — **active**, used by `AppModule`
- `data-source.ts` — **inactive**, not imported anywhere

This is code duplication but not a runtime conflict since only one is loaded.

### Conflict 3: `.env.example` vs `.env` on `DB_PASSWORD`
- `.env.example`: `DB_PASSWORD=your_secure_password` (placeholder)
- `.env`: `DB_PASSWORD=postgres` (actual, but rejected by PostgreSQL)

## 6. Correct `DB_HOST` for Each Deployment Mode

| Deployment Mode | Correct `DB_HOST` | Reason |
|-----------------|-------------------|--------|
| Backend running directly on Windows | `localhost` | PostgreSQL 18 service listens on `127.0.0.1:5432` |
| Backend running inside Docker Compose | `postgres` | Docker service name resolves to the `postgres` container on the Compose network |

## 7. Configuration Mixing Assessment

| Potential Mix | Found? | Details |
|---------------|--------|---------|
| Docker service names with local connections | No (dormant) | `docker-compose.yml` uses `postgres`, but backend loads `.env` which says `localhost` |
| Different database names | No | All configs use `speakup_tms` |
| Different ports | No | All configs use `5432` |
| Different `.env` files | Yes | Root `.env` is loaded; `front/.env.example` is frontend-only (VITE_ vars) |

**No active mixing of incompatible settings.** The backend uses root `.env` exclusively.

## 8. Is the Password Mismatch Still a Genuine Independent Issue?

**YES.** Even after resolving all configuration inconsistencies:

- `DB_HOST=localhost` is correct for local Windows PostgreSQL.
- `DB_PORT=5432` is correct.
- `DB_NAME=speakup_tms` matches the database.
- `DB_USERNAME=postgres` matches the role.
- **`DB_PASSWORD=postgres` is REJECTED** by the local PostgreSQL 18 installation (`scram-sha-256` auth).

The password mismatch is a **separate, genuine, independent issue** from configuration inconsistencies. It must be resolved before the backend can connect, regardless of which `.env` or deployment mode is used.

## 9. Recommended Configuration for Current Local Windows Setup

No changes to `DB_HOST`, `DB_PORT`, `DB_NAME`, or `DB_USERNAME` are needed. They are already correct for local Windows PostgreSQL.

The only required change is `DB_PASSWORD` — it must be set to a password that the local PostgreSQL `postgres` role actually accepts. Since the current password `postgres` is rejected and no `.pgpass` file exists, the `postgres` role password must be recovered or changed (via PostgreSQL's supported single-user mode recovery, or by creating a dedicated application role).

## 10. Evidence Summary

| Evidence | Source |
|----------|--------|
| Docker not running | `docker ps -a` and `docker compose ps` return empty |
| PostgreSQL 18 running locally | Windows service `postgresql-x64-18` status: Running; port 5432 LISTENING |
| Backend loads root `.env` | `app.module.ts` line 41: `envFilePath: '.env'` |
| Active TypeORM config | `database.module.ts` imported by `AppModule`; `data-source.ts` not imported |
| Frontend proxies to localhost:3000 | `front/vite.config.js` lines 27-33 |
| Password rejected | `psql -U postgres -d speakup_tms` with `PGPASSWORD=postgres` → `FATAL: password authentication failed` |
| Auth method | `pg_hba.conf`: `scram-sha-256` for all local/host connections |
| No `.pgpass` file | Confirmed absent |

---

**No changes were made during this audit.** All findings are read-only observations from the actual codebase and runtime state.
