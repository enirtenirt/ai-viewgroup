import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sett REMOTION_COMPOSITION=main for å rendre LinkedInAd-versjonen
const COMPOSITION_ID = process.env.REMOTION_COMPOSITION ?? "demo";
const OUTPUT = process.env.REMOTION_OUTPUT ?? `/mnt/documents/xledger-demo.mp4`;

console.log(`Bygger bundle...`);
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

console.log(`Velger komposisjon: ${COMPOSITION_ID}`);
const composition = await selectComposition({ serveUrl: bundled, id: COMPOSITION_ID, puppeteerInstance: browser });

console.log(`Renderer ${composition.durationInFrames} frames til ${OUTPUT} ...`);
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: OUTPUT,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

await browser.close({ silent: false });
console.log(`Ferdig: ${OUTPUT}`);
