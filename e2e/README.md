## Playwright E2E (realworld-playwright-e2e/e2e)

This folder contains the Playwright E2E test harness, isolated Node dependencies, dotenv configuration, and test code for the RealWorld Django REST + Angular app.

- Tests live in `e2e/tests/`
- Configuration is in `e2e/playwright.config.ts`
- Environment variables are read from `e2e/.env`
- Test cases are documented in `e2e/doc/TEST_CASES.md`
- All commands below are run from the `e2e/` directory unless noted otherwise

### Deliverables & coverage

- Smoke test to ensure the platform is ready before executing full E2E runs.
- Core user journeys + two additional scenarios (Edit/Delete Article, Comments). Details in `e2e/doc/TEST_CASES.md`.

### Environment

Required:
- `APP_BASE_URL` – Base URL of the running frontend.
  - Local host runs: `http://localhost:4200`
  - When running dockerized tests on macOS/Windows/Linux: `http://host.docker.internal:4200`
- `APP_API_URL` – Base URL of the backend API (Django REST).
  - Local host runs: `http://localhost:8000`
  - When running dockerized tests on macOS/Windows/Linux: `http://host.docker.internal:8000`

Create your `.env` from the example:

```bash
cp .env.example .env
```

Backend login error code note:

- The assessment requires that a wrong‑password login returns HTTP 401 (Unauthorized). The current upstream backend returns HTTP 422 (Unprocessable Entity) for invalid credentials. Tests assert the visible error message in the UI; if strict HTTP‑status validation is desired, account for this discrepancy (tolerate 401 or 422) or adjust backend behavior.

### Scripts

- `app:clone` – Clone the upstream RealWorld app into `../app` (once).
- `app:update` – Update the app in `../app` to the latest upstream.
- `e2e:up` – Start the app stack via `docker compose -f ../app/docker-compose.yml up -d`.
- `e2e:wait` – Wait until `APP_BASE_URL` responds (requires `.env`).
- `e2e:down` – Tear the app stack down (volumes removed).
- `test:e2e` – Start app, wait, run Playwright headless, then tear down.
- `test:e2e:headed` – Same as above, but run tests headed.
- `test:e2e:ci` – Install Playwright deps on CI then run `test:e2e`.
- `test:e2e:docker` – Start the app, run tests inside the official Playwright container, then tear down.

### Run tests locally (headless)

```bash
# From repo root
cd e2e
npm install
npx playwright install
cp .env.example .env
# Set APP_BASE_URL in .env
npm run test:e2e
```

Headed:

```bash
npm run test:e2e:headed
```

### Run tests inside Docker (Linux container)

```bash
# From repo root (no cd)
npm --prefix e2e run test:e2e:docker
```

Tip: For dockerized tests, set `APP_BASE_URL=http://host.docker.internal:4200` in `e2e/.env`.

### Test scenarios

Currently a basic smoke test is provided:
- `smoke.spec.ts`: navigates to the home page, asserts the page title contains "conduit" and that the "conduit" brand link is visible.

If the upstream landing page content changes, adjust the assertions in `e2e/tests/smoke.spec.ts`.

### Test coverage

- Core user journeys (required) are listed in `e2e/doc/TEST_CASES.md`.
- Additional scenarios chosen: Comments and Edit/Delete Article.
  - Rationale: Compared to Favourite Toggle and Tag Filter, Comments and Edit/Delete Article are higher priority because they validate critical CRUD paths (content lifecycle) and user interaction threads that are more likely to impact core functionality and data integrity.
- Smoke tests also ensure the platform is responsive before executing full E2E runs.

### Test design (Page Objects + AAA)

- Page Object pattern:
  - Location for page objects: `e2e/src/ui/pages/`
  - Puts the selectors and actions in one place so tests stay easy to read and change.
  - Selectors and roles: we try to use Playwright’s role-based selectors (e.g., `getByRole`) as recommended. Where that isn’t possible due to missing accessibility roles or stable attributes, we fall back to other selectors. Future improvement: add better roles or `data-test` attributes in the app to make selectors more robust.
- AAA (Arrange–Act–Assert) convention in tests:
  - Arrange: prepare test data and state (e.g., navigate, log in).
  - Act: perform the user action (e.g., create article, add comment).
  - Assert: verify expected UI/API outcomes.

### Source layout (@src)

The E2E sources live under `e2e/src` and are split by responsibility:

- `e2e/src/api/` — API-layer helpers and types used by tests
  - `factories/` — data factories for API payloads (e.g., `user.factory.ts`)
  - `models/` — API models/types (e.g., `user.api.model.ts`)
  - `utilis/` — small API utilities (e.g., `users.ts`)
- `e2e/src/ui/` — UI-layer (Page Objects + supporting test helpers)
  - `pages/` — Page Objects for major screens (e.g., `home.page.ts`, `login.page.ts`, `article.page.ts`, `profile.page.ts`, `register.page.ts`)
  - `components/` — reusable UI fragments used by pages (e.g., `header.component.ts`)
  - `fixtures/` — Playwright fixtures that provide typed Page Objects to tests (e.g., `page-object.fixture.ts`, `merge.fixture.ts`)
  - `factories/` — UI-focused factories for view models/test data
  - `models/` — UI/view-layer models

Why this split?
- **api**: keep API payload building and types isolated so tests can seed/verify data cleanly.
- **ui**: centralize selectors and user actions in Page Objects to keep specs readable and resilient to UI changes.

### How tests use @ui today

- Tests live in `e2e/tests/*.spec.ts` and import the custom fixtures from `e2e/src/ui/fixtures/`.
- Specs follow AAA:
  - Arrange with factories and navigate using a Page Object (e.g., `HomePage`).
  - Act by calling Page Object methods (e.g., `login`, `createArticle`, `addComment`).
  - Assert via page getters/locators exposed by the Page Objects.

### Adding a new test quickly

1. Create or extend a Page Object in `e2e/src/ui/pages/` and prefer `getByRole` selectors.
2. If a reusable fragment emerges, factor it into `e2e/src/ui/components/`.
3. Expose the Page Object via `e2e/src/ui/fixtures/page-object.fixture.ts` so specs can use it directly.
4. Write the spec under `e2e/tests/`, using AAA and the provided fixtures.

### CI

This repo includes a GitHub Actions workflow (`.github/workflows/e2e.yml`) that runs headless on Ubuntu:
- Installs Node deps and Playwright browsers with `--with-deps`
- Clones/updates the app into `app/`
- Brings up Docker Compose services, waits for the frontend, runs tests
- Uploads the Playwright report as an artifact

### Linting, formatting, and type-checking

Run ESLint:
```bash
npm run lint
```

Fix lint issues automatically:
```bash
npm run lint:fix
```

Format with Prettier:
```bash
npm run format
```

Type-check TypeScript:
```bash
npx tsc -p e2e/tsconfig.json
```


