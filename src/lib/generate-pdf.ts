import { existsSync } from "fs";
import { platform } from "os";
import puppeteer from "puppeteer";

function resolveBrowserPath(): string | undefined {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const candidates =
    platform() === "win32"
      ? [
          // Microsoft Edge - الخيار الأول (يوجد عادة)
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
          // Google Chrome
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          // Brave
          "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
          "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
          // Chromium
          "C:\\Program Files\\Chromium\\Application\\chrome.exe",
        ]
      : [
          // Linux
          "/usr/bin/google-chrome",
          "/usr/bin/google-chrome-stable",
          "/usr/bin/chromium",
          "/usr/bin/chromium-browser",
          "/snap/bin/chromium",
        ];

  const found = candidates.find((path) => existsSync(path));
  if (found) {
    console.log("[resolveBrowserPath] Found browser at:", found);
  }
  return found;
}

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const executablePath = resolveBrowserPath();

  if (!executablePath) {
    throw new Error(
      "لم يتم العثور على متصفح (Chrome, Edge, Brave, Chromium). الرجاء تثبيت أحد هذه المتصفحات."
    );
  }

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
      "--disable-gpu",
      "--disable-web-security",
    ],
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to match PDF width
    await page.setViewport({ width: 794, height: 1122 });
    
    // Set content with optimized settings
    await page.setContent(html, {
      waitUntil: "load",
      timeout: 60000,
    });
    
    // Wait for fonts and images to load
    try {
      await page.evaluate(() => 
        Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 5000))
        ])
      );
    } catch (err) {
      console.warn("[generatePdfFromHtml] Font loading warning:", err);
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { 
        top: "0mm", 
        right: "0mm", 
        bottom: "0mm", 
        left: "0mm" 
      },
      scale: 1,
    });

    return Buffer.from(pdf);
  } catch (err) {
    console.error("[generatePdfFromHtml] Error generating PDF:", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      platform: platform(),
      executablePath,
    });
    throw err;
  } finally {
    await browser.close();
  }
}
