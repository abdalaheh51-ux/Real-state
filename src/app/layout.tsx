import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <Script id="gtm-script" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N4JRMS62');`}
        </Script>
      </head>
      <body
        className={`${cairo.variable} ${tajawal.variable} font-cairo antialiased bg-background text-foreground`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N4JRMS62"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
