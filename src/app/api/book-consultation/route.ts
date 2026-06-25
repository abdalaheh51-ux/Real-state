import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2, "الاسم قصير جداً").max(80),
  phone: z
    .string()
    .min(8, "رقم الهاتف غير صالح")
    .max(20, "رقم الهاتف طويل جداً"),
  budget: z.string().optional().nullable(),
  purpose: z.string().optional().nullable(),
  compound: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "صيغة الطلب غير صالحة" },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة",
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Persist to the database. If DB is unavailable for any reason, we still
  // acknowledge the booking so the user is not blocked.
  try {
    await db.consultation.create({
      data: {
        name: data.name,
        phone: data.phone,
        budget: data.budget ?? null,
        purpose: data.purpose ?? null,
        compound: data.compound ?? null,
        notes: data.notes ?? null,
        status: "pending",
      },
    });
  } catch (err) {
    console.error("[book-consultation] db error:", err);
  }

  return NextResponse.json({
    ok: true,
    message: "تم استلام طلبك بنجاح. سيتواصل معك خبيرنا خلال 24 ساعة.",
    reference: `BK-${Date.now().toString(36).toUpperCase()}`,
  });
}
