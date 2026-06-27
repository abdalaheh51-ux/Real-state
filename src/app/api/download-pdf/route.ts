import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * التحقق من API Key
 */
function verifyApiKey(req: NextRequest): boolean {
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = process.env.PDF_DOWNLOAD_API_KEY;

  if (!expectedKey) {
    console.warn("[download-pdf] Warning: PDF_DOWNLOAD_API_KEY not set in .env");
    return true; // للتطوير فقط
  }

  if (!apiKey) {
    return false;
  }

  return apiKey === expectedKey;
}

/**
 * Rate limiting بسيط (في الإنتاج استخدم Redis)
 */
const requestCounts = new Map<string, number[]>();

function checkRateLimit(clientIp: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = requestCounts.get(clientIp) || [];

  // احذف الطلبات القديمة
  const recentRequests = timestamps.filter((t) => now - t < windowMs);

  if (recentRequests.length >= maxRequests) {
    return false; // تجاوز الحد
  }

  recentRequests.push(now);
  requestCounts.set(clientIp, recentRequests);
  return true;
}

export async function GET(req: NextRequest) {
  try {
    // تهيئة Supabase داخل الدالة
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[download-pdf] Missing Supabase credentials");
      return NextResponse.json(
        {
          error: "خطأ في الخادم",
          detail: "بيانات الاتصال ناقصة",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // التحقق من API Key
    if (!verifyApiKey(req)) {
      return NextResponse.json(
        {
          error: "تعذّر الوصول",
          detail: "مفتاح API غير صحيح",
        },
        { status: 401 }
      );
    }

    // التحقق من Rate Limit
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          error: "تم تجاوز حد الطلبات",
          detail: "حاول لاحقاً",
        },
        { status: 429 }
      );
    }

    console.log(`[download-pdf] PDF download request from: ${clientIp}`);

    // تحميل الملف من Supabase Storage
    const pdfFileName = "دليل-المقارنة-أفضل-5-مجمعات-2026.pdf";
    const bucketName = "pdfs";
    const filePath = `pdfs/${pdfFileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      console.error(`[download-pdf] Download error: ${error.message}`);
      return NextResponse.json(
        {
          error: "تعذّر تحميل الملف",
          detail: error.message,
        },
        { status: 404 }
      );
    }

    if (!data) {
      console.error("[download-pdf] No data returned");
      return NextResponse.json(
        {
          error: "تعذّر تحميل الملف",
          detail: "لم يتم استرجاع البيانات",
        },
        { status: 500 }
      );
    }

    // تحويل البيانات إلى Buffer
    const buffer = await data.arrayBuffer();

    console.log(`[download-pdf] ✓ PDF downloaded successfully. Size: ${(buffer.byteLength / 1024).toFixed(2)} KB`);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfFileName}"`,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "private, max-age=3600", // تخزين مؤقت لمدة ساعة
      },
    });
  } catch (error) {
    console.error("[download-pdf] Error:", error);
    return NextResponse.json(
      {
        error: "خطأ في الخادم",
        detail: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      },
      { status: 500 }
    );
  }
}
