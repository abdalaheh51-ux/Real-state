"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfDownloadButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  label?: string;
  withIcon?: boolean;
}

/**
 * تنزّل ملف PDF ثابت من مجلد public/.
 *
 * الملف (comparison-guide-2026.pdf) تم توليده مسبقاً ويُخدَّم كملف ثابت،
 * لذا لا يحتاج الموقع إلى Playwright أو Chromium في وقت التشغيل — التنزيل فوري.
 */
export function PdfDownloadButton({
  variant = "default",
  size = "lg",
  className,
  label = "تحميل ملف المقارنة الشامل (PDF) مجاناً",
  withIcon = true,
}: PdfDownloadButtonProps) {
  function handleDownload() {
    // ملف PDF ثابت في public/ — تنزيل مباشر بدون أي معالجة على الخادم.
    const a = document.createElement("a");
    a.href = "/comparison-guide-2026.pdf";
    a.download = "دليل-المقارنة-أفضل-5-مجمعات-2026.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      className={cn("gap-2", className)}
    >
      {withIcon ? (
        <>
          <Download className="size-4" />
          {label}
        </>
      ) : (
        <>
          <FileText className="size-4" />
          {label}
        </>
      )}
    </Button>
  );
}
