import { savePdfDocument } from '@/lib/upload-pdf'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // تعريف Supabase داخل الدالة
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { pdfUrl, title } = await req.json()

    // التحقق من البيانات المطلوبة
    if (!pdfUrl || !title) {
      return NextResponse.json(
        { error: 'pdfUrl و title مطلوبان' },
        { status: 400 }
      )
    }

    // حفظ الـ PDF في قاعدة البيانات
    const result = await savePdfDocument(pdfUrl, title)

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'تم حفظ الـ PDF بنجاح',
          data: result.data 
        },
        { status: 201 }
      )
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'فشل حفظ الـ PDF' 
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('خطأ في API:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}

// GET: الحصول على قائمة جميع الملفات
export async function GET(req: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error('خطأ في جلب الملفات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
