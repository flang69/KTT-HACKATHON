# ShetkariMitra AI 🌾

**Your farm. Your language. Your profit.**

Mobile-first hackathon prototype for crop expense tracking and farm decision support.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features implemented

- Crop cycles with budgets, expected yields and expected prices
- Add, search and delete crop-linked expenses
- Browser speech-recognition entry where supported, with manual correction before saving
- Record sales and compute recorded costs and sales
- Interactive yield/price/cost scenario simulator
- Live five-day Open-Meteo forecast for fixed Pune coordinates
- Manual market-price quote notes (not live mandi data)
- Browser localStorage persistence
- JSON export/import and reset for local farm records
- Responsive farmer-first dashboard

## Important status and limitations

This repository is an initial local-demo implementation. Sample records are illustrative, not real farmer data. Data stays in the current browser and is not synced to a server. Supabase authentication/database, server-side AI, receipt OCR, arbitrary-village geocoding, official mandi prices, and complete Marathi/Hindi translations are not implemented yet. Speech recognition varies by browser. The weather feature fetches live data but only for Pune coordinates. The simulator is a simplified assumption model, not a financial guarantee. Crop selection should be validated with local agricultural guidance.

## Next steps

1. Add Supabase Auth, database migrations and Row Level Security.
2. Add tested financial calculations and end-to-end tests.
3. Add location geocoding and documented crop-specific suitability rules.
4. Integrate official market price data where accessible.
5. Add secure server-side AI and receipt OCR.
