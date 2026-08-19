# FIT5032 Portfolio - Ling Dai (36667145)

This private repository contains my FIT5032 assessed labs and assessment projects. The work was developed progressively during the semester, so most later labs and assessments extend the same Vue application rather than duplicate it into separate folders.

## Repository guide

| Coursework | Location | Key commits |
| --- | --- | --- |
| Assessed Lab 1 | [`week1-create-vue/`](week1-create-vue/) | [`4ef8a0e`](../../commit/4ef8a0e), [`74b0bbe`](../../commit/74b0bbe) |
| Assessed Labs 2-5 | [`ldai-library/`](ldai-library/) | [`3cd1de4`](../../commit/3cd1de4), [`a7dec9d`](../../commit/a7dec9d), [`54a5874`](../../commit/54a5874), [`9b6cd30`](../../commit/9b6cd30), [`0df6e81`](../../commit/0df6e81) |
| Assessment 2 - MindBridge Basic App | [`ldai-library/`](ldai-library/) | [`55e863f`](../../commit/55e863f), [`08d9bc1`](../../commit/08d9bc1), [`07dedfc`](../../commit/07dedfc) |
| Assessed Labs 7-12 | [`ldai-library/`](ldai-library/) | [`3247913`](../../commit/3247913), [`317489e`](../../commit/317489e), [`088913f`](../../commit/088913f), [`efbf19f`](../../commit/efbf19f), [`3b9b0c1`](../../commit/3b9b0c1) |
| Assessment 3 - MindBridge Extension | [`ldai-library/`](ldai-library/) | [`e853fac`](../../commit/e853fac), [`c1b41a5`](../../commit/c1b41a5), [`634b766`](../../commit/634b766), [`ab80fe1`](../../commit/ab80fe1) |

## Main application

`ldai-library/` is the current Vue 3 application. It contains the progressively developed MindBridge interface, authentication and role-based routes, dynamic resources and ratings, Firebase features, API integrations, and assessment extensions.

Run it locally with:

```sh
cd ldai-library
npm install
npm run dev
```

Create a production build with:

```sh
cd ldai-library
npm run build
```

### A3 deployment configuration

The A3 service-map page uses the public `VITE_MAPBOX_TOKEN` value at build time.
The bulk-email function keeps `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, and
`STAFF_EMAILS` in the Cloudflare Pages secret store. These values are intentionally
not committed to this repository. Without them the application presents an
explicit demo/configuration message rather than exposing a secret or silently
claiming that a live integration is available.

## Supporting configuration

- `.github/workflows/deploy.yml` builds `ldai-library/` and deploys it to GitHub Pages.
- `functions/` and `firebase.json` contain the Firebase Cloud Functions configuration used by the later assessed labs.
- `ldai-library/functions/` contains application-side serverless API handlers used by later MindBridge work.

The Git history is intentionally preserved as a chronological record of each lab and assessment milestone.
