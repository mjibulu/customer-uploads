# Attach Public Showcase

A controlled public UI showcase for the customer upload journey.

This package intentionally exposes only the marketing site, a fixed customer upload preview, and the upload success screen. Internal staff tools, authentication, storage, and operational backend behavior are private and are not included here.

## What This Public Showcase Includes

- Landing page
- Fixed upload preview at `/upload/demo-preview`
- Upload success confirmation after a demo upload

## What Is Intentionally Omitted

- Staff login and internal workspace
- Advisor history, search, and file review flows
- Download and file-preview endpoints
- Production auth, storage, and database integrations

## Quick Start

Requirements: [Node.js 20+](https://nodejs.org) and [pnpm](https://pnpm.io)

```bash
git clone https://github.com/YOUR_USERNAME/attach-upload-portal.git
cd attach-upload-portal/showcase
pnpm install
pnpm demo
```

Then open:

- `http://localhost:5173/`
- `http://localhost:5173/upload/demo-preview`

The local mock server only accepts the fixed public preview token `demo-preview` and always returns the same demo upload code `UPLOAD-DEMO-001`.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Express 5 mock server

## License

MIT
