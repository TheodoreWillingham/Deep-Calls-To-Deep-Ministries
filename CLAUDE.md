# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for Deep Calls To Deep Ministries (Deana Bringolf). React + TypeScript frontend with Supabase as the backend/database.

## Development Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Type-check (tsc -b) then build for production
npm run lint     # ESLint
npm run preview  # Preview production build
```

No test framework is configured yet.

## Architecture

- **Vite + React 19 + TypeScript** — single-page app, no router currently
- **Supabase** — backend-as-a-service; client initialized in `src/Components/supabaseClient.tsx`
- **No CSS framework** — inline styles used throughout components

### Key paths

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Root component; composes top-level page sections |
| `src/Components/` | All feature components (EventSchedule, PrayerRequests, Testimonials) and the Supabase client |
| `src/Components/supabaseClient.tsx` | Exports the shared `supabase` client instance |

### Data flow

Components fetch data directly from Supabase using `@supabase/supabase-js`. The `events` table is currently the only table in use (queried by `EventSchedule.tsx`). PrayerRequests and Testimonials are placeholder components not yet connected to data.

### Supabase tables

- **events** — columns: `id`, `name`, `description`, `location`, `event_date`, `event_time`, `contact_name`, `contact_email`, `contact_phone`, `created_at`
