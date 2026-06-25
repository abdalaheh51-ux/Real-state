"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PdfDownloadButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  label?: string;
  withIcon?: boolean;
}

export function PdfDownloadButton({
  variant = "default",
  size = "lg",
  className,
  label = "تحميل ملف المقارنة الشامل (PDF) مجاناً",
  withIcon = true,
}: PdfDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch("/api/download-pdf", { method: "GET" });
      if (!res.ok) throw new Error("generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "دليل-المقارنة-أفضل-5-مجمعات-2026.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("تم تحميل ملف المقارنة الشامل بنجاح");
    } catch {
      toast.error("تعذّر إنشاء الملف، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={loading}
      className={cn("gap-2", className)}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          جارٍ إنشاء الملف...
        </>
      ) : withIcon ? (
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
