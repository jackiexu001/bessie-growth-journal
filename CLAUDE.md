# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build + TypeScript type check
npm run lint     # ESLint
npm run start    # Start production server (run after build)
```

No test suite exists. Use `npm run build` to verify TypeScript correctness before committing.

Always install with the alternate cache to avoid a known permission issue on this machine:
```bash
npm install --cache /tmp/npm-cache
```

## Architecture

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · 腾讯云 COS

### Data flow

All pages are **server components** that call `getMemories()` directly — there is no client-side data fetching for reads. Mutations go through two API routes:

- `POST /api/upload` → validates file → uploads binary to COS via `COSStorage` → appends record to `data/memories.json`
- `DELETE /api/delete?id=` → removes file from COS → removes record from `data/memories.json`

### Storage layer (`lib/storage/`)

`StorageProvider` interface (`index.ts`) defines three methods: `uploadFile`, `uploadThumbnail`, `deleteFile`.

`factory.ts` selects the implementation based on `STORAGE_TYPE` env var:
- `cos` → `COSStorage` (production — **required**)
- `local` → `LocalStorage` (dev only; throws in `NODE_ENV=production`)
- Missing `STORAGE_TYPE` in production → throws immediately

### Metadata persistence (`lib/data.ts`)

Memories are stored as a flat JSON array in `data/memories.json` on the server filesystem. This file is **not** in git (add to `.gitignore` if deploying fresh). All four CRUD operations read/write this file with `fs/promises`.

### Memory type (`lib/types.ts`)

```ts
interface Memory {
  id: string          // "${timestamp}-${random}"
  title: string
  description?: string
  date: string        // YYYY-MM-DD
  location?: string
  url: string         // Full COS HTTPS URL
  thumbnail?: string  // Same as url for images; separate COS URL for videos
  type: 'image' | 'video'
  createdAt: string   // ISO 8601
}
```

### Pages

| Route | Data | Notes |
|-------|------|-------|
| `/` | All memories | Timeline component grouped by year |
| `/gallery` | Images only | Grid layout |
| `/videos` | Videos only | Grid with inline player |
| `/upload` | — | Client component `UploadForm`; supports batch upload with per-file status |

`UploadForm` generates video thumbnails client-side via canvas before uploading; the thumbnail is sent as a separate `FormData` field (`thumbnail`).

## Environment variables

Copy `env.example` to `.env.local` (dev) or `.env` (production). Required for COS:

```
STORAGE_TYPE=cos
COS_SECRET_ID=
COS_SECRET_KEY=
COS_BUCKET_NAME=       # Format: BucketName-APPID
COS_REGION=            # e.g. ap-guangzhou
COS_PUBLIC_URL=        # Optional: https://<bucket>.cos.<region>.myqcloud.com
```

## Deployment target

Tencent Cloud lightweight server, deployed as a long-running Node.js process behind Nginx at `bessie.xulangli.com.cn`. PM2 manages the process. The `data/` directory containing `memories.json` must persist across deployments — back it up before any server wipe.
