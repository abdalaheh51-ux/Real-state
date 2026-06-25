import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "دليلك الشامل للمقارنة بين أفضل 5 مجمعات سكنية في القاهرة الجديدة 2026",
  description:
    "دليل محايد من خبراء العقار لمقارنة أفضل 5 مجمعات سكنية في القاهرة الجديدة لعام 2026: متوسط سعر المتر، مواعيد التسليم، المساحات الخضراء، وخطط السداد. حمّل ملف المقارنة الشامل PDF مجاناً أو احجز استشارة مجانية.",
  keywords: [
    "مقارنة مجمعات سكنية",
    "عقارات القاهرة الجديدة",
    "أفضل كمبوندات 2026",
    "استشارة عقارية مجانية",
    "سعر المتر التجمع الخامس",
  ],
  icons: {
      icon: "/Gemini_Generated_Image_l5cv03l5cv03l5cv.png",
  },
  authors: [{ name: "Real Estate" }],

  openGraph: {
    title: "دليلك الشامل للمقارنة بين أفضل 5 مجمعات سكنية 2026",
    description:
      "مقارنة محايدة بين أفضل المجمعات السكنية: الأسعار، التسليم، المساحات الخضراء، وخطط السداد.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${tajawal.variable} font-cairo antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
