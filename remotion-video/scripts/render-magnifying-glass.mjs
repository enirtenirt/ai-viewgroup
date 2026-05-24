import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const outDir = path.resolve(__dirname, "../../output");
mkdirSync(outDir, { recursive: true });

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ??
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const browser = await openBrowser("chrome", {
  browserExecutable: chromePath,
  chromiumOptions: {
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
    ],
    ignoreCertificateErrors: true,
  },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({
  serveUrl: bundled,
  id: "magnifying-glass",
  puppeteerInstance: browser,
});

const outputLocation = path.join(outDir, "magnifying-glass.mp4");

console.log("Rendering magnifying-glass composition…");
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

await browser.close({ silent: false });
console.log("Done →", outputLocation);
