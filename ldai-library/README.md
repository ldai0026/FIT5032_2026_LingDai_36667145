# MindBridge

MindBridge is a responsive Vue 3 web application developed progressively for FIT5032 assessed labs and assessments. It supports mental health resource discovery, member and staff access, ratings, Firebase data, external services, and later assessment extensions.

## Student

- Name: Ling Dai
- Student ID: 36667145
- GitHub: [ldai0026](https://github.com/ldai0026)

## Technology

- Vue 3 and Vite
- Vue Router
- Bootstrap
- Firebase Authentication, Firestore, and Cloud Functions
- Cloudflare Pages deployment with Pages Functions

## Main features

- Responsive public pages and mental health resource browsing
- Registration, login, logout, and protected routes
- Member and staff role-based access
- Dynamic resource filtering and persistent ratings
- Firebase-backed book management activities
- Weather, book, service-location, and EmailJS outreach integrations
- Accessible layouts and data export features

## Local development

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in a browser.

## Production build

```sh
npm run build
```

Environment variables required by optional integrations are documented in `.env.example`. Secrets are not committed to this repository.

For the A3 recording, configure the Cloudflare Pages Production `STAFF_EMAILS` variable with the dedicated Firebase staff demo address `ling.dai.a3.staff@example.org`.
