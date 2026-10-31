# Use AdonisJS + Inertia/Vue + PostgreSQL, hosted on Render and Neon

**Status:** accepted

The farmer uses the app remotely from her phone, and every Weighing must be saved behind a login. We chose one AdonisJS (TypeScript) server with Vue pages through Inertia and a PostgreSQL database. It runs on Render's free web service, with the database on Neon's free tier. Everything is in one language the developer already knows, and login, validation (VineJS) and tests (Japa) come built in. Hosting costs nothing.

## Considered Options
- **Laravel + MySQL**: cheapest to host on shared PHP hosting, but it needs two languages (PHP and JS).
- **Static Vue site + Supabase**: no server code, but security depends on hand-written database access rules, which is easy for a beginner to get wrong.

## Consequences
- The free Render service sleeps when idle, so the first visit after a quiet period takes about 30–60 s. Moving to a paid Render plan fixes this with no code change.
- Render's free service has no lasting disk, so the database must be hosted (Neon), not SQLite on the server.
