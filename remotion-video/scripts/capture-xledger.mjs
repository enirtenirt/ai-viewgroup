/**
 * Tar skjermbilder av Xledger demosider og lagrer dem som PNG-filer
 * som brukes i Remotion-videoen.
 *
 * Bruk:
 *   XLEDGER_URL=https://demo.xledger.net \
 *   XLEDGER_USER=brukernavn \
 *   XLEDGER_PASS=passord \
 *   bun run scripts/capture-xledger.mjs
 *
 * Legg til egne sider i PAGES-listen nedenfor.
 */

import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const XLEDGER_URL = process.env.XLEDGER_URL;
const XLEDGER_USER = process.env.XLEDGER_USER;
const XLEDGER_PASS = process.env.XLEDGER_PASS;

if (!XLEDGER_URL || !XLEDGER_USER || !XLEDGER_PASS) {
  console.error(
    "Mangler env-variabler. Sett XLEDGER_URL, XLEDGER_USER og XLEDGER_PASS."
  );
  process.exit(1);
}

// Legg til sider som skal fanges. path er relativ URL etter innlogging.
// headline brukes som on-screen tekst i videoen (valgfri override).
const PAGES = [
  {
    name: "screen-01",
    path: "/",
    headline: "Konsernrapportering i sanntid",
    waitFor: "networkidle",
    clip: null, // null = full side
  },
  // Eksempler på flere sider — kommenter inn og tilpass URL-sti:
  // { name: "screen-02", path: "/gl/consolidation", headline: "Automatisk konsolidering", waitFor: "networkidle" },
  // { name: "screen-03", path: "/report/cashflow", headline: "Likviditetsoversikt", waitFor: "networkidle" },
  // { name: "screen-04", path: "/budgets", headline: "Budsjettering på konsern-nivå", waitFor: "networkidle" },
];

const OUTPUT_DIR = path.resolve(__dirname, "../public/images/xledger");
mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

const page = await context.newPage();

console.log(`Logger inn på ${XLEDGER_URL} ...`);
await page.goto(XLEDGER_URL, { waitUntil: "domcontentloaded" });

// Fyll inn brukernavn
const userField =
  page.locator('input[name="username"], input[type="email"], input[name="email"], #username, #user').first();
await userField.fill(XLEDGER_USER);

// Fyll inn passord
const passField =
  page.locator('input[name="password"], input[type="password"], #password, #pass').first();
await passField.fill(XLEDGER_PASS);

// Klikk login-knapp
const loginBtn =
  page.locator('button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Logg inn"), button:has-text("Sign in")').first();
await loginBtn.click();

await page.waitForLoadState("networkidle");
console.log(`Innlogget. Starter skjermbildeopptak...`);

for (const p of PAGES) {
  const url = p.path.startsWith("http") ? p.path : XLEDGER_URL.replace(/\/$/, "") + p.path;
  console.log(`  → ${p.name}: ${url}`);

  await page.goto(url, { waitUntil: p.waitFor ?? "networkidle" });
  // Vent litt ekstra for at animasjoner og data skal laste
  await page.waitForTimeout(1500);

  const outPath = path.join(OUTPUT_DIR, `${p.name}.png`);
  await page.screenshot({
    path: outPath,
    clip: p.clip ?? undefined,
    fullPage: false,
  });

  // Skriv metadata-fil for bruk i Remotion
  const meta = { name: p.name, headline: p.headline, url };
  await Bun.write(
    path.join(OUTPUT_DIR, `${p.name}.json`),
    JSON.stringify(meta, null, 2)
  );

  console.log(`     Lagret: ${outPath}`);
}

await browser.close();
console.log(`\nFerdig! ${PAGES.length} skjermbilder lagret i ${OUTPUT_DIR}`);
