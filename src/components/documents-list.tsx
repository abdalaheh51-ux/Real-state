'use client'

import { useEffect, useState } from 'react'
import { getDocuments } from '@/lib/document-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { FileText, Download, Calendar } from 'lucide-react'

interface Document {
  id: string
  title: string
  pdfUrl: string
  createdAt: string
}

export function DocumentsList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const result = await getDocuments()
      if (result.success) {
        setDocuments(result.documents)
      } else {
        toast.error('فشل تحميل الملفات')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لم يتم العثور على ملفات
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">الملفات المحفوظة</h3>
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <FileText className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <h4 className="font-medium">{doc.title}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(doc.createdAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>

            <Link href={doc.pdfUrl} target="_blank">
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-1" />
                تحميل
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
