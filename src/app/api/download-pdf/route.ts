import { NextResponse } from "next/server";
import { buildComparisonHtml } from "@/lib/pdf-template";
import { generatePdfFromHtml } from "@/lib/generate-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const html = buildComparisonHtml();
    const pdfBuffer = await generatePdfFromHtml(html);

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
        error: "تعذّر إنشاء ملف PDF",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
