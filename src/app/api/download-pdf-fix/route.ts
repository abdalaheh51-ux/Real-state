import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { readFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const projectRoot = process.cwd();
  const tmpDir = join(projectRoot, ".tmp-zip");
  try {
    mkdirSync(tmpDir, { recursive: true });
    const stamp = Date.now();
    const zipPath = join(tmpDir, `pdf-fix-${stamp}.zip`);

    // All PDF-related files with their target paths inside the zip.
    const files: { src: string; dest: string }[] = [
      // 1. The API route that generates the PDF
      {
        src: "src/app/api/download-pdf/route.ts",
        dest: "pdf-fix/api/download-pdf/route.ts",
      },
      // 2. The HTML template used to build the PDF content
      {
        src: "src/lib/pdf-template.ts",
        dest: "pdf-fix/lib/pdf-template.ts",
      },
      // 3. The Node script that converts HTML → PDF via Playwright/Chromium
      {
        src: "scripts/html2poster.js",
        dest: "pdf-fix/scripts/html2poster.js",
      },
      // 4. The frontend button component
      {
        src: "src/components/pdf-download-button.tsx",
        dest: "pdf-fix/components/pdf-download-button.tsx",
      },
    ];

    // Verify all source files exist before zipping.
    const missing = files.filter((f) => !existsSync(join(projectRoot, f.src)));
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: "بعض الملفات مفقودة",
          missing: missing.map((m) => m.src),
        },
        { status: 500 }
      );
    }

    // Build a README explaining every file + setup instructions.
    const readme = buildReadme();
    const readmePath = join(tmpDir, `pdf-fix-readme-${stamp}.md`);
    const { writeFileSync } = await import("fs");
    writeFileSync(readmePath, readme, "utf-8");

    // Also extract the relevant package.json snippets (dependencies + scripts).
    const pkgSnippet = buildPackageSnippet();
    const pkgPath = join(tmpDir, `pdf-fix-package-${stamp}.json`);
    writeFileSync(pkgPath, pkgSnippet, "utf-8");

    // Build a staging directory, copy each source file to its dest path, then zip it.
    const stagingDir = join(tmpDir, `pdf-fix-staging-${stamp}`);
    mkdirSync(stagingDir, { recursive: true });

    for (const f of files) {
      const destFull = join(stagingDir, f.dest);
      const destDir = destFull.substring(0, destFull.lastIndexOf("/"));
      mkdirSync(destDir, { recursive: true });
      const content = readFileSync(join(projectRoot, f.src));
      writeFileSync(destFull, content);
    }
    // Copy README + package snippet to the pdf-fix/ subfolder for consistency.
    writeFileSync(join(stagingDir, "pdf-fix", "README.md"), readme, "utf-8");
    writeFileSync(join(stagingDir, "pdf-fix", "package.pdf-deps.json"), pkgSnippet, "utf-8");

    // Zip the staging directory.
    execSync(`cd "${stagingDir}" && zip -r -q -X "${zipPath}" .`, {
      timeout: 15000,
      stdio: "pipe",
    });

    const zipBuffer = readFileSync(zipPath);

    // Cleanup staging + temp files.
    try {
      unlinkSync(zipPath);
      unlinkSync(readmePath);
      unlinkSync(pkgPath);
      execSync(`rm -rf "${stagingDir}"`, { stdio: "pipe" });
    } catch {
      /* ignore */
    }

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="pdf-fix.zip"`,
        "Content-Length": String(zipBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[download-pdf-fix] error:", err);
    return NextResponse.json(
      { error: "تعذّر إنشاء ملف pdf-fix", detail: String(err) },
      { status: 500 }
    );
  }
}

function buildReadme(): string {
  return `# 📄 ملف pdf-fix — أكواد توليد PDF الكاملة

هذا الملف يحتوي على **جميع الأكواد المتعلقة بتوليد PDF** في مشروع Real Estate.
استخدمه لفهم آلية العمل أو لنقل ميزة توليد PDF إلى مشروع آخر.

---

## 📁 محتويات الملف

\`\`\`
pdf-fix/
├── README.md                          ← هذا الدليل
├── package.pdf-deps.json              ← الحزم والأوامر المطلوبة (أضفها لـ package.json)
├── api/
│   └── download-pdf/
│       └── route.ts                   ← نقطة API: GET /api/download-pdf
├── lib/
│   └── pdf-template.ts                ← قالب HTML العربي للـ PDF (يُولّد المحتوى)
├── scripts/
│   └── html2poster.js                 ← سكريبت Node: HTML → PDF (يستخدم Playwright)
└── components/
    └── pdf-download-button.tsx        ← زر الواجهة الأمامية (Frontend)
\`\`\`

---

## 🔧 دور كل ملف في سلسلة توليد PDF

\`\`\`
المستخدم يضغط زر "تحميل PDF"
         │
         ▼
[components/pdf-download-button.tsx]   ← يرسل fetch إلى /api/download-pdf
         │
         ▼
[api/download-pdf/route.ts]           ← يستقبل الطلب
         │  1. checkPdfDeps() — يفحص playwright + Chromium
         │  2. buildComparisonHtml() — يستدعي قالب HTML
         ▼
[lib/pdf-template.ts]                  ← يبني HTML عربي كامل (RTL) بالمحتوى
         │
         ▼
[scripts/html2poster.js]              ← node script يفتح HTML في Chromium
         │  - يحمّل Playwright + Chromium
         │  - page.pdf() → ملف PDF متجه (vector)
         ▼
إرجاع PDF للمستخدم (584KB)
\`\`\`

---

## 📦 الحزم المطلوبة (أضفها لـ package.json)

انظر ملف \`package.pdf-deps.json\` المرفق. باختصار:

**في \`devDependencies\`:**
\`\`\`json
"playwright": "^1.40.0"
\`\`\`

**في \`scripts\`:**
\`\`\`json
"postinstall": "playwright install chromium 2>/dev/null || echo 'Playwright Chromium install skipped — run: npx playwright install chromium'"
\`\`\`

---

## 🚀 طريقة التركيب في مشروع آخر

### 1. انسخ الملفات
\`\`\`bash
# من داخل مشروعك
cp -r pdf-fix/api/download-pdf    src/app/api/
cp -r pdf-fix/lib/pdf-template.ts src/lib/
cp -r pdf-fix/scripts/html2poster.js scripts/
cp -r pdf-fix/components/pdf-download-button.tsx src/components/
\`\`\`

### 2. أضف الحزم لـ package.json
\`\`\`bash
# أضف playwright يدوياً أو:
bun add -d playwright
\`\`\`

### 3. ثبّت متصفح Chromium (مرة واحدة)
\`\`\`bash
npx playwright install chromium
\`\`\`

### 4. ثبّت مكوّنات shadcn/ui المطلوبة للزر
الزر يعتمد على:
- \`@/components/ui/button\`
- \`sonner\` (للإشعارات toast)
- \`@/lib/utils\` (cn function)

\`\`\`bash
bun add sonner
npx shadcn@latest add button
\`\`\`

### 5. تأكد من وجود البيانات
القالب \`pdf-template.ts\` يستورد من \`@/lib/compounds-data\` — تأكد من وجود
هذا الملف بمحتوى مماثل، أو عدّل القالب لاستخدام بياناتك الخاصة.

---

## ⚙️ كيف يعمل ملف html2poster.js؟

هذا السكريبت (256 سطر):
1. **يستقبل HTML + عرض محدد** (794px = عرض A4 عند 96dpi)
2. **يحمّل Playwright + Chromium** (يحاول المسار الافتراضي ثم مسارات النظام)
3. **يفتح HTML في متصفح headless** مع \`@page { margin: 0 }\`
4. **يقيس الارتفاع الفعلي** للمحتوى (scrollHeight)
5. **يستدعي \`page.pdf()\`** لتوليد PDF متجه (vector) بصفحة واحدة طويلة
6. **الناتج**: PDF بنص قابل للتحديد + تدرجات لونية حقيقية + خطوط عربية صحيحة

### لماذا Chromium وليس مكتبة JS عادية؟
- مكتبات مثل jsPDF/pdfkit لا تدعم CSS متقدمة ولا RTL بشكل جيد
- Chromium يعرض HTML كأنه متصفح حقيقي → جودة طباعية ممتازة
- النص يبقى قابلاً للتحديد والنسخ (vector text)
- يدعم خطوط Google (Cairo) والتدرجات والظلال

---

## 🐛 استكشاف الأخطاء

| الخطأ | السبب | الحل |
|-------|------|------|
| \`"حزمة 'playwright' غير مثبتة"\` | playwright ليست في node_modules | \`bun install\` أو \`npm install\` |
| \`"متصفح Chromium غير مثبت"\` | الحزمة موجودة لكن المتصفح غير محمّل | \`npx playwright install chromium\` |
| \`"سكريبت توليد PDF مفقود"\` | مجلد scripts/ غير موجود | أعد نسخ الملفات |
| Timeout بعد 60 ثانية | جهاز بطيء أو HTML معقّد جداً | زِد timeout في route.ts |
| خطأ في تحميل الخطوط | لا يوجد إنترنت لتحميل Cairo من Google Fonts | شغّل مرة واحدة بأنتترنت للتخزين المؤقت |

---

## 🎨 تخصيص محتوى PDF

عدّل ملف \`lib/pdf-template.ts\`:
- الدالة \`buildComparisonHtml()\` تُعيد نص HTML كامل
- تستخدم بيانات من \`compounds-data.ts\` (مصفوفات compounds, buyerProfiles)
- الألوان: أخضر زمردي (#0f766e) + كهرماني (#d97706)
- الخط: Cairo من Google Fonts
- العرض: 794px (A4)

لتغيير الحجم: عدّل \`--width 794px\` في استدعاء \`html2poster.js\` داخل route.ts

---

## 📊 مواصفات الـ PDF الناتج

- **الحجم**: ~584 كيلوبايت
- **عدد الصفحات**: 1 (طويلة، تناسب المحتوى)
- **النوع**: PDF متجه (vector) — نص قابل للتحديد
- **الخط**: Cairo (عربي + لاتيني)
- **الاتجاه**: RTL (من اليمين لليسار)
- **العرض**: 794px ≈ A4 portrait

---

© 2026 Real Estate — ميزة توليد PDF
`;
}

function buildPackageSnippet(): string {
  return `{
  "name": "pdf-fix-dependencies",
  "description": "الحزم والأوامر المطلوبة لميزة توليد PDF — أضفها لـ package.json مشروعك",
  "scripts": {
    "postinstall": "playwright install chromium 2>/dev/null || echo 'Playwright Chromium install skipped — run: npx playwright install chromium'"
  },
  "devDependencies": {
    "playwright": "^1.40.0"
  },
  "_comments": {
    "playwright": "محرّك المتصفح الذي يحوّل HTML → PDF عبر Chromium",
    "postinstall": "يحاول تثبيت Chromium تلقائياً بعد bun install — يتجاهل الفشل بهدوء",
    "chromium_manual_install": "إذا فشل postinstall، شغّل يدوياً: npx playwright install chromium",
    "runtime_dependency": "Chromium يُحمّل لمرة واحدة (~150MB) ويُخزّن في ~/.cache/ms-playwright/"
  }
}
`;
}
