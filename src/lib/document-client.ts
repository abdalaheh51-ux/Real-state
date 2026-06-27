/**
 * دالة helper لاستدعاء API حفظ الـ PDF
 * @param pdfUrl - رابط الـ PDF
 * @param title - عنوان المستند
 */
export async function savePdfToDatabase(pdfUrl: string, title: string) {
  try {
    const response = await fetch('/api/documents/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdfUrl, title }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'فشل حفظ الـ PDF')
    }

    return { success: true, data: data.data }
  } catch (error) {
    console.error('خطأ في حفظ الـ PDF:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * دالة helper لجلب جميع الملفات من قاعدة البيانات
 */
export async function getDocuments() {
  try {
    const response = await fetch('/api/documents/save')
    const data = await response.json()

    if (!response.ok) {
      throw new Error('فشل جلب الملفات')
    }

    return { success: true, documents: data.data }
  } catch (error) {
    console.error('خطأ في جلب الملفات:', error)
    return { success: false, error: String(error) }
  }
}
