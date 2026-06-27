'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { savePdfToDatabase } from '@/lib/document-client'

export function SavePdfForm() {
  const [pdfUrl, setPdfUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!pdfUrl || !title) {
      toast.error('الرجاء ملء جميع الحقول')
      return
    }

    setLoading(true)
    try {
      const result = await savePdfToDatabase(pdfUrl, title)

      if (result.success) {
        toast.success('تم حفظ الـ PDF بنجاح! ✅')
        setPdfUrl('')
        setTitle('')
      } else {
        toast.error(`خطأ: ${result.error}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">حفظ ملف PDF</h3>

      <div>
        <label className="block text-sm font-medium mb-1">عنوان المستند</label>
        <Input
          placeholder="مثال: دليل المقارنة 2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">رابط الـ PDF</label>
        <Input
          placeholder="https://..."
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          disabled={loading}
          className="text-xs"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'جاري الحفظ...' : 'حفظ الـ PDF'}
      </Button>
    </div>
  )
}
