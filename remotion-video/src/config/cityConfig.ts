export type CityConfig = {
  city: string;
  contactName: string;
  quote: string;
  quoteAuthor: string;
  quoteCompany?: string;
  priceRegnskap: string; // e.g. "2 995"
  priceLohn: string;     // e.g. "250"
  benefits: [string, string, string];
  benefitSubs: [string, string, string];
};

export const KRISTIANSAND: CityConfig = {
  city: "Kristiansand",
  contactName: "Stian",
  quote:
    "Jeg synes mat er mer spennende enn tall — og da er det fint å ha VIEW Group som passer på at jeg får den oversikten jeg trenger.",
  quoteAuthor: "Trond Moi",
  priceRegnskap: "2 995",
  priceLohn: "250",
  benefits: [
    "Spar 3–5 timer i uken",
    "Se lønnsomhet i sanntid",
    "Alltid fastpris",
  ],
  benefitSubs: [
    "på faktura, utlegg og lønn",
    "dashboards og rapporter klare når du er",
    "ingen overraskelser på fakturaen",
  ],
};

// ── Template for new cities ──────────────────────────────────────────────────
// Copy KRISTIANSAND and change: city, contactName, quote, quoteAuthor
// export const BERGEN: CityConfig = { ...KRISTIANSAND, city: "Bergen", contactName: "...", ... };
