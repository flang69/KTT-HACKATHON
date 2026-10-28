# ShetkariMitra AI 🌾

**Your farm. Your language. Your profit.**

ShetkariMitra AI is a mobile-first agricultural decision-support prototype built to make everyday farm record-keeping and basic planning more accessible. It brings crop budgets, expense and sales records, a simple scenario simulator, and weather information into one interface.

## 1. Chosen challenge vertical

**Agriculture / AI-assisted farming and decision support.**

The project focuses on practical tools that can help farmers organize farm finances and consider basic crop-planning scenarios. It is a prototype, not a replacement for qualified agronomists, official weather alerts, or financial advice.

## 2. Approach and decision logic

The application uses a farmer-first dashboard and separates recorded information from estimates:

- **Crop cycles:** Users create crop records with budgets, expected yields, and expected prices.
- **Expense ledger:** Users add, search, and delete expenses linked to a crop.
- **Sales and summaries:** Users record sales and view totals based on the records entered.
- **Scenario simulator:** Users change assumed yield, price, or cost values to compare estimated outcomes. Results are estimates based on user inputs, not guaranteed profits.
- **Voice entry:** Speech recognition can help enter an expense in supported browsers; the user can review and correct the text before saving.
- **Weather:** The app retrieves a five-day Open-Meteo forecast for fixed Pune coordinates.
- **Market notes:** Users can record market-price quotes manually. These notes are not live mandi prices.
- **Local data controls:** Records are stored in browser localStorage. Users can export/import records as JSON and reset their local demo data.

The app does not claim to diagnose a crop with a validated machine-learning model or to provide official market-price information. Treat any decision support as preliminary and verify important farming decisions with local agricultural experts and trusted sources.

## 3. How the solution works

### Run locally

Requirements: Node.js 18 or later and npm.

1. Clone the public repository:
   ```bash
   git clone https://github.com/flang69/KTT-HACKATHON.git
   cd KTT-HACKATHON
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser.

### Useful commands

```bash
npm run dev       # Start local development
npm run build     # Create a production build
npm run start     # Serve the production build
npm run typecheck # Run TypeScript checks
npm run lint      # Run Next.js linting
```

### Configuration

A sample environment file is provided as `.env.example`. If you are using features that require provider credentials, copy it to `.env.local` and fill in the values locally:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local
```

Never commit `.env.local`, API keys, service-role keys, or other secrets. Keep private credentials on the server and never expose them in `NEXT_PUBLIC_*` variables. Do not add real credentials to this README or to source control.

## 4. Assumptions and limitations

- This is an early-stage local-demo prototype; sample values are illustrative and should not be treated as real farmer data.
- Farm records are saved in the current browser using localStorage. They do not automatically sync between devices or users.
- Supabase authentication/database synchronization is not currently integrated into the running app, even though setup notes and a schema may be present in the repository.
- The weather forecast uses fixed Pune coordinates rather than the farmer's live location.
- Market-price notes are manually entered and are not verified live mandi data.
- Speech recognition depends on browser and device support; manual entry remains available.
- The scenario simulator uses simplified assumptions and is not a financial guarantee.
- Full Hindi/Marathi translations, arbitrary-village geocoding, receipt OCR, and a validated crop-disease diagnosis model are not implemented.
- External APIs can be unavailable or rate-limited. Users should verify important information independently.

## 5. Technology stack

- Next.js 14 and React
- TypeScript
- Tailwind CSS
- Open-Meteo weather API
- Browser localStorage and browser speech-recognition support where available
- OpenRouter integration files are present; AI-powered routes require valid local/server environment configuration and should be tested before relying on them

## 6. Security, accessibility, and testing notes

- Keep provider secrets out of Git and browser-exposed environment variables.
- Do not upload sensitive personal or farm data to a public demo.
- Review voice-recognition output before saving it.
- Use responsive layouts and keyboard-accessible controls where provided; accessibility still needs manual testing with keyboard navigation and assistive technology.
- Before a release, run `npm run typecheck`, `npm run lint`, and `npm run build`, then manually test the main flows: crop creation, expense entry/editing or deletion, sales totals, simulator calculations, data export/import, and weather error handling.
- Passing a build is not a substitute for testing the actual deployed app.

## 7. Future improvements

1. Integrate Supabase authentication, database persistence, and Row Level Security.
2. Add automated tests for calculations and end-to-end user journeys.
3. Add location selection/geocoding and documented crop-specific guidance.
4. Integrate trusted official market-price data where access is available.
5. Add secure, tested AI assistance and receipt OCR with clear user-facing limitations.

## Links

- **GitHub repository:** https://github.com/flang69/KTT-HACKATHON
- **Live demo (verify availability before submission):** https://ktt-hackathon-alpha.vercel.app/
