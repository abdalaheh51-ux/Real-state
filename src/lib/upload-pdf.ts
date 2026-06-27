import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ربط السوبابيز بالمفاتيح اللي حطيناها في الـ .env
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function uploadPdfDocument(file: File, documentTitle: string) {
  try {
    // 1. توليد اسم فريد للملف عشان الملفات ماتتمسحش لو اتكرر الاسم
    const fileName = `${Date.now()}-${file.name}`

    // 2. رفع ملف الـ PDF إلى الـ Storage (البحر السحابي)
    const { data, error } = await supabase.storage
      .from('pdf-files') // اسم الـ Bucket اللي عملناه
      .upload(`public/${fileName}`, file)

    if (error) throw error

    // 3. الحصول على الرابط المباشر (Public URL) للملف بعد ما ترفع
    const { data: publicUrlData } = supabase.storage
      .from('pdf-files')
      .getPublicUrl(`public/${fileName}`)

    const finalPdfUrl = publicUrlData.publicUrl

    // 4. حفظ الرابط واسم الملف في الداتا بيز عن طريق بريزما
    const newRecord = await prisma.document.create({
      data: {
        title: documentTitle,
        pdfUrl: finalPdfUrl, // 👈 هنا حفظنا الرابط النصي بنجاح
      },
    })

    return { success: true, data: newRecord }

  } catch (error) {
    console.error('فشل الرفع:', error)
    return { success: false, error }
  }
}

// دالة جديدة لحفظ رابط PDF معروف بالفعل
export async function savePdfDocument(pdfUrl: string, documentTitle: string) {
  try {
    const newRecord = await prisma.document.create({
      data: {
        title: documentTitle,
        pdfUrl: pdfUrl, // 👈 حفظ الرابط مباشرة
      },
    })

    return { success: true, data: newRecord }

  } catch (error) {
    console.error('فشل الحفظ:', error)
    return { success: false, error }
  }
}

