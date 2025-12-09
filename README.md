## RealWorld Playwright E2E harness

This repository wraps the RealWorld Django REST + Angular app, parameterized Playwright E2E setup that can run headless on Linux (local and CI).

- Upstream app: https://github.com/NemTam/realworld-django-rest-framework-angular
- We keep the upstream code in `app/` (cloned locally, not committed).
- All E2E tooling lives in `e2e/` (isolated Node deps, dotenv, tests).
- This repository is a practical assignment demonstrating Playwright E2E tests against a third‑party RealWorld application. The RealWorld app is not authored or maintained by us; we clone it from the upstream repository and run it as‑is.

### What is the RealWorld app?
The RealWorld project is a community effort to implement a Medium.com‑style clone (“Conduit”) across many tech stacks. This repo uses the Django REST Framework backend with an Angular frontend as the application under test. See the upstream project for details and its README: https://github.com/NemTam/realworld-django-rest-framework-angular

### What is the Playwright app?

Playwright is a modern browser automation and testing framework. Here we use `@playwright/test` with TypeScript tests under `e2e/tests/`. Tests run headless by default and can run on your host or inside a Linux container.

For more details about the E2E setup and test scenarios, see `e2e/README.md`.

### Deliverables
- Smoke test to verify the app is up before running scenarios
- E2E scenarios covering core user journeys + Edit/Delete Article and Comments (see `e2e/doc/TEST_CASES.md`)
- Static validation for E2E tests with Prettier, ESLint, and TypeScript
- Test design following the Page Object pattern and AAA (Arrange–Act–Assert)
- Docker Compose integration to run the RealWorld app; Playwright can run in Docker on Linux
- GitHub Actions workflow for CI (headless on Ubuntu)

### Prerequisites
- To run the app via Docker and run tests on your machine:
  - Docker + Docker Compose
  - Node.js 18+ 
- To run everything through Docker (app + Playwright tests in containers):
  - Docker + Docker Compose
  - No local Node.js or Python required
- To run the application locally without Docker (per upstream `app/README.md`):
  - Python 3.10+
  - Node.js 18.5.0+

### Install the tools
- Docker Desktop (macOS/Windows) or Docker Engine (Linux): https://docs.docker.com/get-docker/
- Node.js: https://nodejs.org/en/download/
  - Optional Node version manager: https://github.com/nvm-sh/nvm
- Python 3 (if running the app locally without Docker): https://www.python.org/downloads/

### 1) Get the application under test

Clone once (into `app/`):

```bash
git clone https://github.com/NemTam/realworld-django-rest-framework-angular app
```

Update when needed:

```bash
git -C app pull --ff-only
```

### 2) Install E2E dependencies

```bash
cd e2e
npm install
npx playwright install
```

### 3) Configure environment (dotenv)

Copy the example and adjust values as needed. All configuration is parameterized via dotenv.

```bash
cd e2e
cp .env.example .env
```

Available variables:
- `APP_BASE_URL` (required; recommended `http://host.docker.internal:4200` when running dockerized tests)
- Credentials (configure in `e2e/.env`):
  ```
  # Demo credentials for registration (optional; for future tests)
  E2E_USERNAME_FOR_REGISTRATION=
  E2E_EMAIL_FOR_REGISTRATION=
  E2E_PASSWORD_FOR_REGISTRATION=

  # Demo credentials for login (optional; for future tests)
  E2E_EMAIL_FOR_LOGIN=
  E2E_PASSWORD_FOR_LOGIN=
  ```

### 4) Run tests locally (headless)

```bash
cd e2e
npm run test:e2e
```

What this does:
- Starts the app stack via `docker compose -f ../app/docker-compose.yml up -d`
- Waits for the frontend to respond at `APP_BASE_URL`
- Runs Playwright tests (headless by default)
- Tears the stack down afterwards

Run headed locally:
```bash
cd e2e
npm run test:e2e:headed
```

Optional root-level invocation:
```bash
# From repo root (no cd):
npm --prefix e2e run test:e2e
```

### Run everything with Docker (app + Dockerized Playwright)

If you want the tests to run inside a Linux Docker container as well:
```bash
# From repo root
# 1) Ensure app is cloned
git clone https://github.com/NemTam/realworld-django-rest-framework-angular app || true

# 2) Run dockerized Playwright tests (this starts the app, waits, runs tests, then tears down)
npm --prefix e2e run test:e2e:docker
```
Notes:
- `APP_BASE_URL` is required. For dockerized tests on macOS/Windows/Linux, set it to `http://host.docker.internal:4200` in `e2e/.env`.
- The `e2e/docker-compose.yml` defines only the `tests` service (official Playwright image). The application stack is started/stopped using `app/docker-compose.yml` directly to avoid cross‑compose complexity.

Linux (Docker) note:
- The steps above already use Docker Compose for the application and run Playwright headless by default, so they work on Linux.
- On Linux desktops/servers you may prefer installing browsers with OS deps once using:
  ```bash
  cd e2e
  npx playwright install --with-deps
  ```

### Run the application (without tests) using Docker

If you want to just run the RealWorld app locally:
```bash
# Clone the app once
git clone https://github.com/NemTam/realworld-django-rest-framework-angular app

# Or, if already cloned, update to latest:
# git -C app pull --ff-only

# Start the stack
docker compose -f app/docker-compose.yml up -d

# Access the frontend
# http://localhost:4200

# Tear down when finished
docker compose -f app/docker-compose.yml down -v
```
For alternative (non‑Docker) ways to run the app, follow the upstream README linked above.

### CI (GitHub Actions on Ubuntu)

A workflow is provided at `.github/workflows/e2e.yml` to run headless on Linux (Ubuntu):
- Installs Node deps in `e2e/` and Playwright browsers with `--with-deps`
- Clones/updates the app into `app/`
- Brings up Docker Compose services, waits for the frontend, runs tests
- Uploads the Playwright report as an artifact

### Notes
- The upstream stack is managed via Docker Compose and follows its own README.
- If the landing page content changes upstream, update the smoke assertion in `e2e/tests/smoke.spec.ts`.
- To update the app at any time:
  ```bash
  git -C app pull --ff-only
  ```


