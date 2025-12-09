## Test Cases

This document outlines the end-to-end test coverage for the RealWorld app. Core user journeys are mandatory; selected additional scenarios extend coverage of critical interactions.

### Core user journeys – required

1. Sign‑up & Login
   - Register a new user
   - Log in successfully
   - Attempt login with a wrong password → expect HTTP 422 / error message (backend returns 422 Unprocessable Entity for invalid credentials)

2. Write Article
   - Logged-in user creates an article (title, body, tags)
   - Article appears in “My Articles” list

3. Follow Feed
   - User A follows User B
   - User B publishes a new article
   - Article shows up in User A’s “Your Feed”

### Additional coverage – selected

4. Edit / Delete Article
   - Author can update body & tags; changes are visible
   - Author can delete the article; it disappears from all lists

5. Comments
   - Add a comment → it displays
   - Delete the comment → it disappears

### Notes

- Smoke tests validate the platform is up and responsive before running E2E scenarios.
