# Authy

React, TypeScript, Vite, Tailwind CSS, Firebase auth, and a dashboard section that loads articles from a local Strapi instance.

## Environment

Create a `.env.local` file in the project root and configure the Strapi connection:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your-strapi-api-token
```

`VITE_STRAPI_API_TOKEN` is sent as a bearer token when the dashboard fetches `/api/articles` from Strapi.

## Run locally

```bash
npm install
npm run dev
```
