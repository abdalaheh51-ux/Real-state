import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing Supabase credentials");
  console.error("   Add to .env:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function uploadPdfToSupabase() {
  try {
    console.log("📄 Starting PDF upload to Supabase Storage...\n");

    // تحديد مسار ملف PDF
    const pdfFileName = "دليل-المقارنة-أفضل-5-مجمعات-2026.pdf";
    const pdfPath = join(process.cwd(), "public", pdfFileName);

    // قراءة الملف
    console.log(`   📂 Reading file from: public/${pdfFileName}`);
    const fileBuffer = readFileSync(pdfPath);
    console.log(`   ✓ File size: ${(fileBuffer.length / 1024).toFixed(2)} KB\n`);

    // إنشاء bucket إذا لم يكن موجوداً
    const bucketName = "pdfs";
    console.log(`   🗂  Checking bucket: "${bucketName}"`);

    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error(`   ❌ Error listing buckets: ${bucketsError.message}`);
      process.exit(1);
    }

    const bucketExists = buckets?.some((b) => b.name === bucketName);

    if (!bucketExists) {
      console.log(`   📦 Creating public bucket: "${bucketName}"`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false, // خاص للأمان - يتم الوصول عبر API فقط
      });

      if (createError) {
        console.error(`   ❌ Error creating bucket: ${createError.message}`);
        process.exit(1);
      }
      console.log(`   ✓ Bucket created successfully\n`);
    } else {
      console.log(`   ✓ Bucket already exists\n`);
    }

    // رفع الملف
    console.log(`   ⬆  Uploading PDF to Supabase Storage...`);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`pdfs/${pdfFileName}`, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error(`   ❌ Upload error: ${error.message}`);
      process.exit(1);
    }

    console.log(`   ✓ File uploaded successfully\n`);

    console.log("✅ PDF upload completed successfully!\n");
    console.log(`📋 Summary:`);
    console.log(`   • File: ${pdfFileName}`);
    console.log(`   • Bucket: ${bucketName}`);
    console.log(`   • Path: pdfs/${pdfFileName}`);
    console.log(`   • Size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`   • Access: Via API (/api/download-pdf) - محمي\n`);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

uploadPdfToSupabase();
