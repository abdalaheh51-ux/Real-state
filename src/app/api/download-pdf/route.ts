import { NextResponse } from "next/server";
import { writeFileSync, readFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { buildComparisonHtml } from "@/lib/pdf-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Check whether Playwright + Chromium are available for PDF generation.
 * Returns null if OK, or an Arabic error message describing what's missing.
 */
function checkPdfDeps(): string | null {
  const scriptPath = join(process.cwd(), "scripts", "html2poster.js");
  if (!existsSync(scriptPath)) {
    return "سكريبت توليد PDF مفقود (scripts/html2poster.js). تأكد من تنزيل المشروع كاملاً.";
  }

  // Check that playwright module is resolvable from the project node_modules.
  try {
    execSync(`node -e "require.resolve('playwright')"`, {
      stdio: "pipe",
      cwd: process.cwd(),
      timeout: 5000,
    });
  } catch {
    return [
      "حزمة 'playwright' غير مثبتة.",
      "",
      "لتفعيل توليد PDF، شغّل الأمر التالي في مجلد المشروع:",
      "    bun install",
      "",
      "ثم ثبّت متصفح Chromium:",
      "    npx playwright install chromium",
    ].join("\n");
  }

  // Check that a Chromium binary is actually installed.
  try {
    const out = execSync(
      `node -e "const {chromium}=require('playwright'); const p=chromium.executablePath(); console.log(p && require('fs').existsSync(p) ? 'OK' : 'MISSING')"`,
      { stdio: "pipe", cwd: process.cwd(), timeout: 5000 }
    ).toString().trim();
    if (out !== "OK") {
      return [
        "متصفح Chromium غير مثبت.",
        "",
        "شغّل الأمر التالي لتثبيته:",
        "    npx playwright install chromium",
      ].join("\n");
    }
  } catch {
    return "تعذّر التحقق من متصفح Chromium. شغّل: npx playwright install chromium";
  }

  return null;
}

export async function GET() {
  const tmpDir = join(process.cwd(), ".tmp-pdf");
  try {
    // Pre-flight dependency check — return a clear Arabic error if missing.
    const depError = checkPdfDeps();
    if (depError) {
      return NextResponse.json(
        {
          ok: false,
          error: "تعذّر توليد ملف PDF",
          reason: depError,
          hint: "باقي ميزات الموقع تعمل بشكل طبيعي — هذه المشكلة تؤثر فقط على زر تحميل PDF.",
        },
        { status: 503 }
      );
    }

    mkdirSync(tmpDir, { recursive: true });
    const stamp = Date.now();
    const htmlPath = join(tmpDir, `comparison-${stamp}.html`);
    const pdfPath = join(tmpDir, `comparison-${stamp}.pdf`);

    const html = buildComparisonHtml();
    writeFileSync(htmlPath, html, "utf-8");

    const scriptPath = join(process.cwd(), "scripts", "html2poster.js");

    execSync(
      `node "${scriptPath}" "${htmlPath}" --output "${pdfPath}" --width 794px`,
      { timeout: 60000, stdio: "pipe" }
    );

    const pdfBuffer = readFileSync(pdfPath);

    try {
      unlinkSync(htmlPath);
      unlinkSync(pdfPath);
    } catch {
      /* ignore */
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="comparison-guide-2026.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[download-pdf] error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "تعذّر إنشاء ملف PDF أثناء التوليد",
        reason: String(err),
        hint: "تأكد من تثبيت playwright و Chromium: npx playwright install chromium",
      },
      { status: 500 }
    );
  }
}
