import { NextResponse } from "next/server";
import { writeFileSync, readFileSync, unlinkSync, mkdirSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { buildComparisonHtml } from "@/lib/pdf-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const tmpDir = join(process.cwd(), ".tmp-pdf");
  try {
    mkdirSync(tmpDir, { recursive: true });
    const stamp = Date.now();
    const htmlPath = join(tmpDir, `comparison-${stamp}.html`);
    const pdfPath = join(tmpDir, `comparison-${stamp}.pdf`);

    const html = buildComparisonHtml();
    writeFileSync(htmlPath, html, "utf-8");

    const scriptPath = join(
      process.cwd(),
      "skills",
      "pdf",
      "scripts",
      "html2poster.js"
    );

    // Convert HTML → PDF via the skill's poster converter (handles RTL Arabic natively).
    execSync(
      `node "${scriptPath}" "${htmlPath}" --output "${pdfPath}" --width 794px`,
      { timeout: 60000, stdio: "pipe" }
    );

    const pdfBuffer = readFileSync(pdfPath);

    // cleanup
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
      { error: "تعذّر إنشاء ملف PDF", detail: String(err) },
      { status: 500 }
    );
  }
}
