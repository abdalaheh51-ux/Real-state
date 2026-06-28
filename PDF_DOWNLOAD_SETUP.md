# 📋 دليل تحميل PDF من Supabase

## 🚀 الخطوات المطلوبة

### 1. احصل على Supabase Credentials

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى: **Settings → API**
4. انسخ:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Service Role Key (Secret)** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️

### 2. أضف البيانات إلى `.env`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...YOUR_SERVICE_ROLE_KEY

# API Security
PDF_DOWNLOAD_API_KEY=your_strong_secret_key_here
NEXT_PUBLIC_PDF_API_KEY=your_strong_secret_key_here
```

### 3. ثبّت المكتبات

```bash
bun install @supabase/supabase-js
```

### 4. رفع الملف إلى Supabase

```bash
bun run seed
```

**الناتج:**
- ✅ ينشئ bucket `pdfs` إن لم يكن موجوداً
- ✅ يرفع الملف: `دليل-المقارنة-أفضل-5-مجمعات-2026.pdf`
- ✅ يحفظه في: `pdfs/pdfs/دليل-المقارنة-أفضل-5-مجمعات-2026.pdf`

### 5. تشغيل المشروع

```bash
bun run dev
```

---

## 🔐 ميزات الأمان المُطبّقة

✅ **API Key Authentication**: كل طلب يحتاج مفتاح API صحيح  
✅ **Rate Limiting**: حد أقصى 5 طلبات/دقيقة لكل IP  
✅ **Storage Bucket Private**: الملفات خاصة ولا تُرجع بـ URL عام  
✅ **Server-Side Verification**: التحقق يحدث على الخادم فقط  
✅ **Cache Control**: تخزين مؤقت آمن (max-age=3600)  

---

## 📊 سير العمل

```
المستخدم يضغط الزر
    ↓
Client يرسل GET + x-api-key header
    ↓
API يتحقق من المفتاح + Rate Limit
    ↓
Supabase Server يحمل الملف من Storage
    ↓
API يرجع الملف كـ binary
    ↓
Browser يحمل الملف تلقائياً
```

---

## ⚠️ ملاحظات مهمة

1. **المفاتيح الآمنة**: استخدم `openssl rand -base64 32` لإنشاء مفاتيح قوية
2. **الحد الأدنى**: استخدم مفاتيح بطول 32 حرف على الأقل
3. **الإنتاج**: في production، استخدم Redis أو قاعدة بيانات للـ rate limiting
4. **التطوير**: إذا لم تعيّن API_KEY، سيتم السماح بالطلبات (للتطوير فقط)

---

## 🐛 استكشاف الأخطاء

| الخطأ | الحل |
|-------|------|
| `Missing Supabase credentials` | أضف SUPABASE_SERVICE_ROLE_KEY و NEXT_PUBLIC_SUPABASE_URL إلى .env |
| `Unauthorized` (401) | مفتاح API غير صحيح |
| `Rate limit exceeded` (429) | انتظر دقيقة وحاول مرة أخرى |
| `File not found` (404) | شغّل seed مرة أخرى لرفع الملف |

---

© 2026 Real Estate
