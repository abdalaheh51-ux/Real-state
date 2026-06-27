import { NextResponse } from "next/server";
import { buildComparisonHtml } from "@/lib/pdf-template";
import { generatePdfFromHtml } from "@/lib/generate-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes timeout for serverless

export async function GET() {
  try {
    console.log("[download-pdf] Starting PDF generation...");
    
    const html = buildComparisonHtml();
    console.log("[download-pdf] HTML built successfully, size:", html.length, "bytes");
    
    const pdfBuffer = await generatePdfFromHtml(html);
    console.log("[download-pdf] PDF generated successfully, size:", pdfBuffer.length, "bytes");

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D9%85%D9%82%D8%A7%D8%B1%D9%86%D8%A9-2026.pdf; filename="comparison-guide-2026.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : "";
    
    console.error("[download-pdf] Error:", {
      message: errorMessage,
      stack: errorStack,
    });
    
    return NextResponse.json(
      {
        error: "تعذّر إنشاء ملف PDF",
        detail: errorMessage,
        hint: errorMessage.includes("browser")
          ? "تأكد من تثبيت Chrome أو Edge على الجهاز"
          : errorMessage.includes("timeout")
          ? "المخدم مشغول، حاول مرة أخرى"
          : "حاول مرة أخرى لاحقاً",
      },
      { status: 500 }
    );
  }
}
