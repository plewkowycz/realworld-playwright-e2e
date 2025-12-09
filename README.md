## RealWorld Playwright E2E Harness

This repository wraps the RealWorld Django REST + Angular app with a parameterized Playwright E2E setup that can run headless on Linux (local and CI).

- **Upstream app:** https://github.com/NemTam/realworld-django-rest-framework-angular
- We keep the upstream code in `app/` (cloned locally, not committed).
- All E2E tooling lives in `e2e/` (isolated Node deps, dotenv, tests).
- This repository is a practical assignment demonstrating Playwright E2E tests against a third‑party RealWorld application. The RealWorld app is not authored or maintained by us; we clone it from the upstream repository and run it as‑is.

### What is the RealWorld App?

The RealWorld project is a community effort to implement a Medium.com‑style clone ("Conduit") across many tech stacks. This repo uses the Django REST Framework backend with an Angular frontend as the application under test. See the [upstream project](https://github.com/NemTam/realworld-django-rest-framework-angular) for details.

### What is Playwright?

Playwright is a modern browser automation and testing framework. Here we use `@playwright/test` with TypeScript tests under `e2e/tests/`. Tests run headless by default and can run on your host or inside a Linux container.

For more details about the E2E setup and test scenarios, see [`e2e/README.md`](e2e/README.md).

### Project Structure

```
.
├── app/                  # RealWorld app (cloned, gitignored)
├── e2e/                  # Playwright E2E test suite
│   ├── config/           # Environment configuration
│   ├── src/              # Page objects, fixtures, utilities
│   ├── tests/            # Test specifications
│   ├── doc/              # Test case documentation
│   └── playwright.config.ts
└── README.md             # This file
```

### Deliverables

- Smoke test to verify the app is up before running scenarios
- E2E scenarios covering core user journeys + Edit/Delete Article and Comments (see [`e2e/doc/TEST_CASES.md`](e2e/doc/TEST_CASES.md))
- Static validation for E2E tests with Prettier, ESLint, and TypeScript
- Test design following the Page Object pattern and AAA (Arrange–Act–Assert)
- Docker Compose integration to run the RealWorld app; Playwright can run in Docker on Linux
- GitHub Actions workflow for CI (headless on Ubuntu)

### TL;DR – most common commands

- **Run app only (Docker):**

  ```bash
  docker compose -f app/docker-compose.yml up -d
  ```

- **Run tests (starts/stops app via Docker):**

  ```bash
  npm --prefix e2e run test:e2e
  ```

- **Run app + tests fully in Docker:**

  ```bash
  cd e2e && npm run test:e2e:docker
  ```

### Prerequisites

**To run the app via Docker and tests on your machine:**
- Docker + Docker Compose
- Node.js 18+

**To run everything through Docker (app + Playwright tests in containers):**
- Docker + Docker Compose
- No local Node.js or Python required

**To run the application locally without Docker** (per upstream `app/README.md`):
- Python 3.10+
- Node.js 18.5.0+

### Install the Tools

- [Docker Desktop](https://docs.docker.com/get-docker/) (macOS/Windows) or Docker Engine (Linux)
- [Node.js](https://nodejs.org/en/download/) (optional: [nvm](https://github.com/nvm-sh/nvm) for version management)
- [Python 3](https://www.python.org/downloads/) (only if running the app locally without Docker)

---

## Quick Start

### 1) Get the Application Under Test

Clone once (into `app/`):

```bash
git clone https://github.com/NemTam/realworld-django-rest-framework-angular app
```

Update when needed:

```bash
git -C app pull --ff-only
```

### 2) Install E2E Dependencies

```bash
cd e2e
npm install
npx playwright install
```

### 3) Configure Environment

Copy the example and adjust values as needed:

```bash
cd e2e
cp .env.example .env
```

Required variables in `e2e/.env`:
- `APP_BASE_URL` – Frontend URL (default: `http://localhost:4200`)
- `APP_API_URL` – Backend API URL (default: `http://localhost:8000`)

### 4) Run the Application (Docker)

If you want to **run only the RealWorld app** (without tests):

```bash
# From repo root
docker compose -f app/docker-compose.yml up -d
# App is now available at http://localhost:4200
```

To stop it:

```bash
docker compose -f app/docker-compose.yml down -v
```

### 5) Run Tests

The test scripts will start and stop the app stack for you automatically.

**Headless (default):**

```bash
cd e2e
npm run test:e2e
```

**Headed (visible browser):**

```bash
cd e2e
npm run test:e2e:headed
```

**From repo root:**

```bash
npm --prefix e2e run test:e2e
```

What `test:e2e` does:
1. Starts the app stack via `docker compose -f ../app/docker-compose.yml up -d`
2. Waits for the frontend to respond at `APP_BASE_URL`
3. Runs Playwright tests (headless by default)
4. Tears the stack down afterwards

---

## Running Everything in Docker

Both the application and tests can run entirely in Docker containers:

```bash
# From repo root
cd e2e && npm run test:e2e:docker
```

Or manually:

```bash
# 1) Clone app (if not already done)
git clone https://github.com/NemTam/realworld-django-rest-framework-angular app || true

# 2) Start the application stack
docker compose -f app/docker-compose.yml up -d

# 3) Run Playwright tests in Docker
cd e2e && docker compose run --rm tests

# 4) Tear down
docker compose -f app/docker-compose.yml down -v
```

**How it works:**
- The app runs in Docker via `app/docker-compose.yml`, exposing ports `4200` (frontend) and `8000` (backend)
- The test container uses `network_mode: host` to access `localhost` directly
- This avoids Docker internal networking complexity and works on macOS, Windows, and Linux

---

## Running the App Without Tests

```bash
# Start the stack
docker compose -f app/docker-compose.yml up -d

# Access at http://localhost:4200

# Tear down when finished
docker compose -f app/docker-compose.yml down -v
```

For non‑Docker setup, see the [upstream README](https://github.com/NemTam/realworld-django-rest-framework-angular).

---

## CI (GitHub Actions)

A workflow is provided at `.github/workflows/e2e.yml` to run tests on every push/PR to `master`:

**What it does:**
1. **Code quality** — Runs Prettier and ESLint checks
2. **Smoke tests** — Runs smoke tests first (fail-fast if app is broken)
3. **E2E tests** — Runs full test suite

**Features:**
- Playwright browser caching for faster runs
- Shallow clone of the app for speed
- Container logs on failure for debugging
- HTML report and traces uploaded as artifacts (14-day retention)

**Required repository variables:**
- `APP_BASE_URL` — Frontend URL (e.g., `http://localhost:4200`)
- `APP_API_URL` — Backend API URL (e.g., `http://localhost:8000`)

Set these in: Repository → Settings → Secrets and variables → Actions → Variables

---

## Notes

- The upstream stack is managed via Docker Compose and follows its own README.
- If the landing page content changes upstream, update the smoke assertion in `e2e/tests/smoke.spec.ts`.
- **Linux users:** You may prefer installing browsers with OS deps once:
  ```bash
  cd e2e && npx playwright install --with-deps
  ```

