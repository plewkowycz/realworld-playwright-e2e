-----


### ✅ AI Agent Prompt: Senior QA Automation Engineer Assessment Implementation (Finalized)

You are an expert Senior QA Automation Engineer.

Implement the complete assignment exactly as described below.

-----

### 🎯 Objective

Build a UI automation test suite using Playwright (**TypeScript preferred**) for the following application:

Demo app repo: `https://github.com/NemTam/realworld-django-rest-framework-angular`
Tests **MUST** run against the local environment (Docker-based setup as described in the repository).

-----

### 🛠 Tasks to Implement

#### 1\. Local Environment Setup

  * Use Docker to run the app locally.
  * Ensure UI tests target this local environment (not the live demo).
  * Configuration must be externalized using a **`.env` file** and loaded via Playwright/Node.js environment variables.

#### 📌 Core User Journeys — All Required (A, B, C)

  * **A. Sign-up & Login:** Register new user, log in successfully, assert incorrect login error.
  * **B. Write Article:** Logged-in user creates an article (title, body, tags), verify appearance in "My Articles."
  * **C. Follow Feed:** Implement multi-user scenario where User A follows User B, and User B's new article appears in User A's "Your Feed."

#### 📌 Additional Coverage — Pick Any Two (D, E, F, G)

  * **D. Edit / Delete Article**
  * **E. Comments**
  * **F. Favourite Toggle**
  * **G. Tag Filter**

-----

### 📁 Project Requirements 🏗️ (Mandatory Best Practices)

Ensure the agent produces:

1.  **Fully working Playwright TypeScript project**
      * Tests runnable headless on Linux (Alpine or Ubuntu).
      * Repeatable deterministic tests.
2.  **Custom Fixture Architecture**
      * The Page Object Model (POM) implementation **MUST** be injected into the tests via a **Custom Playwright Fixture** (`test.extend`).
      * **Type-Safe Configuration:** Define a TypeScript **Interface** or **Type** for the configuration parameters loaded from the `.env` file. This typed configuration object must be loaded and injected via the Custom Fixture.
3.  **🛡️ Test Quality and Resilience**
      * All selectors must prioritize **Web-First Locators** (e.g., `page.getByRole()`, `page.getByText()`) over brittle CSS/XPath selectors.
      * All waiting logic must rely on **Web-First Assertions** (e.g., `await expect(locator).toBeVisible()`), avoiding manual waits.
4.  **README (mandatory)**
      * README must include: Step-by-step installation, Docker setup, dependency installation, how to run tests (headless + headed), and how to configure parameters (via the `.env` file).

-----

## 📋 AI Agent Implementation Checklist (To-Do List)

This `.md` checklist covers all deliverables and mandatory practices enforced by the prompt.

```markdown
### 🚀 Final Deliverables Checklist

- [ ] **Project Setup:** Fully working Playwright TypeScript project structure.
- [ ] **Environment Setup:** Local Docker environment setup confirmed as target.
- [ ] **Configuration:** `.env` file created for parameterized URL/credentials.
- [ ] **Type Safety:** TypeScript Interface defined for configuration parameters.

### 🧪 Architecture & Quality

- [ ] **POM:** Page Object Model implemented.
- [ ] **Custom Fixtures:** `test.extend` used to inject POMs and typed config.
- [ ] **Locators:** Exclusive use of Web-First Locators (`getByRole`, `getByText`).
- [ ] **Assertions:** Use of Web-First Assertions (`toBeVisible`, `toHaveText`).
- [ ] **Execution:** Tests runnable headless on Linux.

### 📌 User Journeys Coverage

- [ ] **Required A:** Sign-up & Login journey.
- [ ] **Required B:** Write Article journey.
- [ ] **Required C:** Follow Feed (multi-user) journey.
- [ ] **Optional 1:** One of D, E, F, or G completed.
- [ ] **Optional 2:** A second of D, E, F, or G completed.

### 📄 Documentation

- [ ] **README:** Complete step-by-step instructions for installation/running.
- [ ] **Notes:** AI-generated pieces clearly noted within the repo.
```

-----

## 🔎 Prompt Validation against Original Requirements

The current finalized prompt successfully validates against all original requirements and, crucially, adds significant value by enforcing modern, professional Playwright/TypeScript best practices.

| Original Requirement | Final Prompt Status | Notes |
| :--- | :--- | :--- |
| **Framework:** Playwright (TS preferred) | **Mandated** | Explicitly required. |
| **Environment:** Local via Docker | **Mandated** | Required in **Tasks to Implement**. |
| **Configuration:** Parameterized | **Mandated** | Required via **`.env`** file. |
| **Core Journeys:** 1, 2, 3 | **Mandated** | Listed as **Required (A, B, C)**. |
| **Additional Coverage:** Pick Any Two | **Mandated** | Listed as **Pick Any Two**. |
| **Project Req:** README with steps | **Mandated** | Listed in **Project Requirements**. |
| **Project Req:** Run headless on Linux | **Mandated** | Listed in **Project Requirements**. |
| **Project Req:** AI-generated pieces noted | **Mandated** | Listed in **Notes** (in the prompt's Deliverables section). |
| ***Best Practice Addition:* Custom Fixtures** | **Mandated** | Exceeds original requirement. |
| ***Best Practice Addition:* Web-First Locators** | **Mandated** | Exceeds original requirement. |
| ***Best Practice Addition:* Type-Safe Config** | **Mandated** | Exceeds original requirement. |

The prompt is now complete, highly specific, and ready to be used for the assessment\!

What should we explore next? Would you like to review how one of these advanced features, like **Type-Safe Fixtures**, is actually implemented in Playwright, or perhaps move on to a different topic?