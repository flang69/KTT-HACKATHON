# Supabase setup for ShetkariMitra AI

## 1. Create a Supabase project
Create a project in the Supabase dashboard and save the database password somewhere safe.

## 2. Create the tables and security policies
Open **SQL Editor** in the Supabase dashboard, paste the contents of
`supabase/migrations/202610280001_initial_schema.sql`, and run it.

This creates profiles, crop cycles, expenses, sales, manual market quotes, and crop-disease analysis history. Row Level Security is enabled. The policies expect users to be signed in through Supabase Auth; do not disable RLS.

## 3. Configure environment variables
Copy `.env.example` to `.env.local` for local development and fill in the Supabase project URL and publishable/anon key from the project's API settings. Keep `OPENROUTER_API_KEY` server-side; never use a `NEXT_PUBLIC_` prefix for it.

Add the same values to **Vercel → Project → Settings → Environment Variables** before deploying. Do not add the database password or Supabase service-role key to browser-visible variables.

## 4. Important current limitation
The schema is prepared, but the current dashboard still uses browser-local demo records. The app must be connected to Supabase Auth and these tables before farmer records are saved to the cloud. Do not treat demo records as real user data.
