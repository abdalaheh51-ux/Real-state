"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  CalendarCheck,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCompound?: string;
}

type Status = "idle" | "loading" | "success";

export function BookingDialog({
  open,
  onOpenChange,
  defaultCompound,
}: BookingDialogProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    budget: "",
    purpose: "",
    compound: defaultCompound ?? "",
    notes: "",
  });

  const handleField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف على الأقل");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/book-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      toast.success("تم استلام طلبك! سيتواصل معك خبيرنا خلال 24 ساعة.");
    } catch {
      setStatus("idle");
      toast.error("تعذّر إرسال الطلب، حاول مرة أخرى");
    }
  }

  function reset() {
    setStatus("idle");
    setForm({
      name: "",
      phone: "",
      budget: "",
      purpose: "",
      compound: defaultCompound ?? "",
      notes: "",
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : reset())}>
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto custom-scroll p-0 gap-0">
        {/* Top gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-teal-600 to-amber-400 rounded-t-xl" />

        {status === "success" ? (
          <div className="flex flex-col items-center text-center px-6 py-8 gap-5">
            <div className="relative">
              <div className="size-20 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/10 flex items-center justify-center ring-1 ring-primary/20">
                <CheckCircle2 className="size-11 text-primary" />
              </div>
              <span className="absolute inset-0 rounded-full pulse-ring" />
            </div>
            <DialogHeader className="items-center gap-2">
              <DialogTitle className="text-2xl font-extrabold">
                تم استلام طلبك بنجاح
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed max-w-md">
                شكراً لك يا{" "}
                <span className="font-semibold text-foreground">
                  {form.name.split(" ")[0]}
                </span>
                . سيتواصل معك أحد خبرائنا العقاريين على الرقم{" "}
                <span dir="ltr" className="font-semibold text-foreground tabular">
                  {form.phone}
                </span>{" "}
                خلال 24 ساعة عمل لتحديد موعد الاستشارة المجانية.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-xl bg-muted/60 border border-border/60 p-4 text-sm text-muted-foreground w-full text-right">
              <p className="flex items-center gap-2 mb-2">
                <span className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PhoneCall className="size-4 text-primary" />
                </span>
                <span className="font-bold text-foreground">ماذا الآن؟</span>
              </p>
              جهّز 3 معلومات: ميزانيتك التقريبية، غرض الشراء (سكن/استثمار)،
              والمنطقة المفضلة. هذا سيوفر وقتك ووقت الخبير.
            </div>
            <Button
              onClick={reset}
              className="mt-1 w-full sm:w-auto h-11 shadow-[0_4px_12px_-2px_oklch(0.45_0.12_162/0.35)]"
            >
              حسناً
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="gap-1 bg-primary/10 text-primary border-primary/20"
                >
                  <Sparkles className="size-3.5" />
                  مجاناً • بدون التزام
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-1 text-muted-foreground"
                >
                  <ShieldCheck className="size-3.5 text-primary" />
                  سرّي تماماً
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                احجز استشارة عقارية مجانية
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed mt-1.5">
                خبير عقاري سيتواصل معك خلال 24 ساعة، يطرح 5 أسئلة فقط عن
                ميزانيتك وغرضك وتوقيتك، ثم يرشح لك 2-3 مجمعات بأسباب واضحة.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    الاسم الكامل <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="مثال: أحمد محمد"
                    value={form.name}
                    onChange={(e) => handleField("name", e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    رقم الهاتف <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    placeholder="01X XXXX XXXX"
                    value={form.phone}
                    onChange={(e) => handleField("phone", e.target.value)}
                    required
                    className="text-right h-11 tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budget" className="text-sm font-semibold">
                    الميزانية التقريبية
                  </Label>
                  <Select
                    value={form.budget}
                    onValueChange={(v) => handleField("budget", v)}
                  >
                    <SelectTrigger id="budget" className="h-11">
                      <SelectValue placeholder="اختر النطاق" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5m">أقل من 5 مليون</SelectItem>
                      <SelectItem value="5-10m">5 - 10 مليون</SelectItem>
                      <SelectItem value="10-20m">10 - 20 مليون</SelectItem>
                      <SelectItem value="over-20m">أكثر من 20 مليون</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purpose" className="text-sm font-semibold">
                    غرض الشراء
                  </Label>
                  <Select
                    value={form.purpose}
                    onValueChange={(v) => handleField("purpose", v)}
                  >
                    <SelectTrigger id="purpose" className="h-11">
                      <SelectValue placeholder="اختر الغرض" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">سكن عائلي</SelectItem>
                      <SelectItem value="invest">استثمار إيجاري</SelectItem>
                      <SelectItem value="both">سكن + استثمار</SelectItem>
                      <SelectItem value="vacation">سكن ثانٍ/صيفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="compound" className="text-sm font-semibold">
                  مجمع تفضّله <span className="text-muted-foreground font-normal">(اختياري)</span>
                </Label>
                <Select
                  value={form.compound}
                  onValueChange={(v) => handleField("compound", v)}
                >
                  <SelectTrigger id="compound" className="h-11">
                    <SelectValue placeholder="اختر مجمعاً من القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="montage">مونتاج ريزيدنس</SelectItem>
                    <SelectItem value="greenplaza">جرين بلازا</SelectItem>
                    <SelectItem value="skylife">سكاي لايف</SelectItem>
                    <SelectItem value="palmgardens">بالم جاردنز</SelectItem>
                    <SelectItem value="orchidhills">أوركيد هيلز</SelectItem>
                    <SelectItem value="undecided">لست متأكداً بعد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes" className="text-sm font-semibold">
                  ملاحظات إضافية <span className="text-muted-foreground font-normal">(اختياري)</span>
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="مثال: أحتاج تسليم خلال سنة، أو أفضّل دور أرضي بحديقة..."
                  value={form.notes}
                  onChange={(e) => handleField("notes", e.target.value)}
                  className="resize-none"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-2 pt-2 flex-col sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={status === "loading"}
                  className="h-11 w-full sm:w-auto"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 gap-2 shadow-[0_6px_18px_-4px_oklch(0.45_0.12_162/0.4)] flex-1 w-full sm:w-auto"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="size-4" />
                      احجز الاستشارة المجانية
                    </>
                  )}
                </Button>
              </DialogFooter>
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                بياناتك سرية ولن تُشارك مع أي طرف ثالث. نتواصل مرة واحدة فقط.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
