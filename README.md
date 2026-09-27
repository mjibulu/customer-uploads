# Attach: customer document upload demo

**Live demo: https://mjibulu.github.io/customer-uploads/**

Advisors send a single-use upload link during a call. The customer uploads from their phone without an account and reads back an upload ID. The advisor searches the ID to find the files.

This demo runs in the browser with sample data. The production backend (auth, API, database, storage) is private.

## Pages

| Page | Shows |
|---|---|
| `/demo` | Guided tour: advisor and customer side by side |
| `/login` | Staff sign in (demo code filled in) |
| `/portal/new-link` | Create an upload link |
| `/portal/direct-upload` | Upload on a customer's behalf |
| `/portal/history` | Your links and uploads |
| `/portal/search` | Search by upload ID or account number |
| `/portal/records/:uploadId` | Record with image, PDF and video previews |
| `/upload/:token` | Customer upload page, including invalid and used links |

Limits match production: JPEG, PNG, GIF, WebP, PDF, MP4, MOV and WebM; 20 files per upload; 100 MB per file.

## How it works

- `src/demo/store.ts` replaces the API, mirroring the production routes.
- Records are kept in `localStorage`. **Reset** in the top bar restores the sample records.
- Uploaded files stay in memory until the page reloads. Nothing is sent to a server.

## Run locally

Requires Node.js 24 and pnpm 11.

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm typecheck
pnpm build      # dist/, plus 404.html for deep links
```

## Deployment

`.github/workflows/deploy.yml` deploys to GitHub Pages on every push to `main`.

One-time setup: **Settings**, **Pages**, **Source**: **GitHub Actions**.

## Contact

https://techshub.pro/start

## License

MIT
