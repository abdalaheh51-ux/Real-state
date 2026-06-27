# Real Estate — دليل المقارنة العقارية

موقع عقاري عربي (RTL) يقدّم دليلاً شاملاً للمقارنة بين أفضل 5 مجمعات سكنية في
القاهرة الجديدة لعام 2026، مع توليد ملف PDF وتسجيل استشارات.

## المتطلبات (Prerequisites)

| الأداة | الإصدار المطلوب | كيفية التثبيت |
|--------|----------------|---------------|
| **Node.js** | 18+ | https://nodejs.org |
| **Bun** (موصى به) | 1.0+ | `curl -fsSL https://bun.sh/install \| bash` |

> ✅ **لا حاجة لـ Playwright أو Chromium!** ملف PDF جاهز مسبقاً في
> `public/comparison-guide-2026.pdf` ويُخدَّم كملف ثابت — تنزيل فوري بدون أي
> معالجة على الخادم.

## طريقة التشغيل (Local Setup)

### 1. فك ضغط المشروع
```bash
unzip real-estate-project.zip
cd real-estate-project
```

### 2. تثبيت الحزم (Dependencies)

**باستخدام Bun (موصى به — أسرع):**
```bash
bun install
```

**أو باستخدام npm:**
```bash
npm install
```

> إذا واجهت أخطاء مع `sharp`، شغّل: `npm rebuild sharp` أو استخدم Bun.

### 3. إعداد قاعدة البيانات

المشروع يستخدم **SQLite** (قاعدة بيانات ملف واحد، لا تحتاج خادم). ملف `.env`
يحتوي بالفعل على المسار النسبي:
```
DATABASE_URL=file:./db/custom.db
```

شغّل أمر إنشاء قاعدة البيانات:
```bash
bun run db:push
# أو: npx prisma db push
```

سيُنشئ ملف `db/custom.db` تلقائياً.

### 4. تشغيل خادم التطوير

```bash
bun run dev
# أو: npm run dev
```

افتح المتصفح على: **http://localhost:3000**

## الأوامر المتاحة

| الأمر | الوظيفة |
|-------|--------|
| `bun run dev` | تشغيل خادم التطوير (المنفذ 3000) |
| `bun run build` | بناء نسخة الإنتاج |
| `bun run start` | تشغيل نسخة الإنتاج (بعد البناء) |
| `bun run lint` | فحص جودة الكود (ESLint) |
| `bun run db:push` | مزامنة مخطط Prisma مع قاعدة البيانات |
| `bun run db:generate` | توليد عميل Prisma |
| `bun run db:reset` | إعادة تعيين قاعدة البيانات (يمسح البيانات) |

## هيكل المشروع

```
real-estate-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              # الصفحة الرئيسية (الواجهة الكاملة)
│   │   ├── layout.tsx            # التخطيط الجذري (RTL + خطوط عربية)
│   │   ├── globals.css           # نظام التصميم (ألوان، ظلال، حركات)
│   │   └── api/
│   │       ├── download-pdf/      # توليد ملف PDF للمقارنة
│   │       ├── download-project/  # تنزيل الكود المصدري (zip)
│   │       └── book-consultation/ # تسجيل طلبات الاستشارة
│   ├── components/
│   │   ├── booking-dialog.tsx     # نافذة حجز الاستشارة
│   │   ├── pdf-download-button.tsx
│   │   └── ui/                    # مكوّنات shadcn/ui
│   ├── lib/
│   │   ├── compounds-data.ts      # بيانات المجمعات + الشهادات + الخريطة
│   │   ├── pdf-template.ts        # قالب HTML للـ PDF
│   │   └── db.ts                  # عميل Prisma
│   └── hooks/
├── prisma/schema.prisma           # مخطط قاعدة البيانات
├── scripts/html2poster.js         # سكريبت تحويل HTML → PDF
├── public/images/                 # صور المجمعات (مُولّدة بالـ AI)
├── .env                           # متغيرات البيئة
└── package.json
```

## الميزات

- ✅ صفحة عربية RTL كاملة بخط Cairo
- ✅ جدول مقارنة تفاعلي (5 مجمعات × 9 معايير)
- ✅ توليد ملف PDF للمقارنة (12 صفحة)
- ✅ نموذج حجز استشارة (يُحفظ في SQLite)
- ✅ خريطة مواقع تفاعلية + شهادات عملاء + عدّاد تنازلي
- ✅ تصميم متجاوب (موبايل + سطح مكتب)
- ✅ ألوان: أخضر زمردي + كهرماني (بدون أزرق)

## استكشاف الأخطاء

**خطأ "Cannot find module '@prisma/client'":**
- شغّل: `bun run db:generate` أو `npx prisma generate`

**خطأ في قاعدة البيانات:**
- احذف ملف `db/custom.db` وأعد تشغيل `bun run db:push`

**الخطوط العربية لا تظهر:**
- المشروع يستخدم `next/font/google` (Cairo + Tajawal) — يتطلب اتصال إنترنت
  لأول مرة لتحميل الخطوط، ثم تُخزّن محلياً.

**خطأ في تثبيت الحزم (sharp / native modules):**
- استخدم Bun بدلاً من npm: `bun install`
- أو: `npm rebuild sharp`

## إعادة توليد ملف PDF (اختياري)

ملف `public/comparison-guide-2026.pdf` جاهز مسبقاً ولا يحتاج إعادة توليد.
لكن إذا أردت تعديل محتوى PDF (البيانات، الألوان، التخطيط):

1. عدّل `src/lib/pdf-template.ts` (قالب HTML العربي)
2. ثبّت Playwright مؤقتاً: `npx playwright install chromium`
3. شغّل أمر إعادة التوليد:
   ```bash
   curl http://localhost:3000/api/download-pdf -o public/comparison-guide-2026.pdf
   ```
4. الآن ملف PDF الثابت محدّث — احذف Playwright إن أردت

> هذا النهج يفصل **وقت التطوير** (يحتاج Playwright) عن **وقت التشغيل**
> (لا يحتاج شيئاً — فقط ملف ثابت).

## التقنيات المستخدمة

- **Next.js 16** (App Router) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York style)
- **Prisma ORM** + **SQLite**
- **Framer Motion** للحركات
- **Playwright** لتوليد PDF
- **Lucide Icons**

---

© 2026 Real Estate — استشارات عقارية محايدة
