# LEADLOOP

An editorial revenue recovery desk for independent service businesses. LEADLOOP brings lead follow-ups, deal context, quotations, activity history, and simple revenue signals into one small workspace.

![LEADLOOP overview](preview.png)

## Install on a laptop

LEADLOOP is a local web app, not a native `.dmg` or `.exe` installer. Install Node.js 20.19+ or 22.12+ (npm is included), then either download the project ZIP from GitHub and extract it, or clone the repository:

```sh
git clone <repository-url>
cd leadloop
npm install
npm run dev
```

Open the localhost address printed by Vite (usually `http://localhost:5173`). To stop the local server, press `Ctrl+C` in that terminal. The app saves its demo workspace in that browser’s local storage.

For an instructor, share the repository for source review and a deployed static preview URL for hands-on verification. The repository alone is not a hosted app; the instructor can also run it locally using the steps above. Do not put private client data in the demo workspace or public repository.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The first visit shows a short business setup with an optional skip. INR is the default currency. Realistic Studio June photography and event records are marked as demo data in the interface.

## Production build

```sh
npm run build
npm run preview
```

The static site is written to `dist/`. Deploy that directory to any static host such as Vercel, Netlify, Cloudflare Pages, or an S3 website bucket. No server environment variables or API keys are needed. For client-side routing, configure the host to serve `index.html` as the fallback; the current prototype uses in-app state and does not require deep-link rewrites.

## 90-second walkthrough

1. Skip setup and notice the **DEMO DATA** label. The overview shows the current open pipeline, won revenue, overdue and due-today work, and close rate.
2. Open **Follow-up radar**. Read the reason attached to an overdue, due-today, stale high-value, or upcoming lead. Open a lead, draft a WhatsApp note, or schedule a reminder.
3. In the message assistant, change purpose and tone, edit the copy, then copy it or open the encoded `wa.me` draft. LEADLOOP never sends automatically. Use “I sent it · log contact” only after sending outside the app.
4. Open **Leads**, filter or search, click a person, and review the context panel’s deal value and chronological history. Try a stage change or add a note.
5. Build a quotation from that lead, add an item and discount, save it, then use **Print / PDF** and the browser’s “Save as PDF” option.
6. Mark a lead won or lost and see the revenue, conversion, and lost-reason figures recompute from the current records. Refresh to confirm the browser save, then reset the demo from workspace settings.

## Data and business logic

- `src/types.ts` defines leads, quotes, workspace settings, and activity records.
- `src/data.ts` supplies the resettable sample workspace.
- `src/store.ts` is the local persistence adapter. It is the intended seam for a hosted storage adapter.
- `src/logic.ts` centralizes currency formatting, date arithmetic, radar priority, quote totals, pipeline metrics, and trend grouping.
- `src/templates.ts` creates deterministic, editable WhatsApp drafts without a model or external service.

This prototype stores its current workspace in browser `localStorage`. It has no authentication, server backup, access controls, or multi-user collaboration. Treat browser data as non-secure and device-local. A production migration can add authenticated workspace identity and a hosted relational store behind the same application domain layer; enforce tenant ownership and authorization on the server, and keep the local adapter only for development or offline demos.

## Product and billing boundary

The settings view sketches Free, Pro, and Team plan architecture for future packaging. The tier chooser is only a local UI preview: there is no checkout, payment gateway, entitlement enforcement, or paid feature claim.
