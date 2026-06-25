import { compounds, buyerProfiles, type Compound } from "@/lib/compounds-data";

function formatPrice(n: number) {
  return n.toLocaleString("en-US");
}

const accentColor: Record<Compound["accent"], { bg: string; text: string }> = {
  emerald: { bg: "#0f766e", text: "#0d5c56" },
  amber: { bg: "#d97706", text: "#b45309" },
  teal: { bg: "#0d9488", text: "#0b6e64" },
  rose: { bg: "#e11d48", text: "#be123c" },
  violet: { bg: "#7c3aed", text: "#6d28d9" },
};

// Builds a self-contained Arabic RTL HTML string for the comparison guide PDF.
export function buildComparisonHtml(): string {
  const bestPrice = Math.min(...compounds.map((c) => c.pricePerMeter));
  const bestGreen = Math.max(...compounds.map((c) => c.greenSpacePercent));
  const bestDown = Math.min(...compounds.map((c) => c.downPaymentPercent));
  const bestYears = Math.max(...compounds.map((c) => c.installmentYears));
  const earliest = "Q1 2026";

  const today = new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const headerCell = (c: Compound) => {
    const a = accentColor[c.accent];
    return `
      <th style="padding:14px 8px;text-align:center;border-bottom:2px solid #e7e5e4;min-width:130px;vertical-align:top;">
        <div style="width:38px;height:38px;border-radius:10px;background:${a.bg};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;margin:0 auto 6px;">${c.name.charAt(0)}</div>
        <div style="font-weight:700;color:#1c1917;font-size:13px;line-height:1.3;">${c.name}</div>
        <div style="font-size:11px;color:#78716c;margin-top:2px;">${c.developer}</div>
      </th>`;
  };

  const dataCell = (value: string, isBest: boolean) => `
    <td style="padding:12px 8px;text-align:center;border-bottom:1px solid #f1ede8;font-size:13px;font-variant-numeric:tabular-nums;${isBest ? "background:#ecfdf5;font-weight:700;color:#047857;" : "color:#292524;"}">
      ${isBest ? "✓ " : ""}${value}
    </td>`;

  const rows = [
    {
      label: "متوسط سعر المتر",
      unit: "ج.م",
      get: (c: Compound) => formatPrice(c.pricePerMeter),
      best: (c: Compound) => c.pricePerMeter === bestPrice,
    },
    {
      label: "موعد التسليم",
      unit: "",
      get: (c: Compound) => c.deliveryDate,
      best: (c: Compound) => c.deliveryQuarter === earliest,
    },
    {
      label: "المساحات الخضراء",
      unit: "%",
      get: (c: Compound) => `${c.greenSpacePercent}%`,
      best: (c: Compound) => c.greenSpacePercent === bestGreen,
    },
    {
      label: "المقدم",
      unit: "%",
      get: (c: Compound) => `${c.downPaymentPercent}%`,
      best: (c: Compound) => c.downPaymentPercent === bestDown,
    },
    {
      label: "سنوات السداد",
      unit: "سنة",
      get: (c: Compound) => `${c.installmentYears} سنة`,
      best: (c: Compound) => c.installmentYears === bestYears,
    },
    {
      label: "المساحات المتاحة",
      unit: "م²",
      get: (c: Compound) => `${c.minArea} - ${c.maxArea} م²`,
      best: () => false,
    },
    {
      label: "عدد الوحدات",
      unit: "",
      get: (c: Compound) => `${formatPrice(c.totalUnits)} وحدة`,
      best: () => false,
    },
    {
      label: "الموقع",
      unit: "",
      get: (c: Compound) => c.location,
      best: () => false,
    },
    {
      label: "الأفضل لـ",
      unit: "",
      get: (c: Compound) => c.bestFor,
      best: () => false,
    },
  ];

  const tableRowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:12px 14px;background:#fafaf9;font-weight:600;border-bottom:1px solid #f1ede8;position:sticky;right:0;font-size:13px;color:#44403c;">
          ${r.label}${r.unit ? ` <span style="font-size:10px;color:#a8a29e;">(${r.unit})</span>` : ""}
        </td>
        ${compounds
          .map((c) => dataCell(r.get(c), r.best(c)))
          .join("")}
      </tr>`
    )
    .join("");

  const compoundCardsHtml = compounds
    .map((c) => {
      const a = accentColor[c.accent];
      return `
      <div style="margin-bottom:18px;border:1px solid #e7e5e4;border-radius:14px;overflow:hidden;page-break-inside:avoid;">
        <div style="height:5px;background:${a.bg};"></div>
        <div style="padding:18px 20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="width:44px;height:44px;border-radius:12px;background:${a.bg};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;">${c.name.charAt(0)}</div>
            <div style="flex:1;">
              <div style="font-weight:800;font-size:18px;color:#1c1917;">${c.name}</div>
              <div style="font-size:12px;color:#78716c;">${c.developer} • ${c.location}</div>
            </div>
            <div style="font-size:13px;color:${a.text};font-weight:700;background:${a.bg}15;padding:6px 12px;border-radius:20px;">★ ${c.rating.toFixed(1)}</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
            <div style="background:#fafaf9;border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:#78716c;margin-bottom:2px;">سعر المتر</div>
              <div style="font-size:14px;font-weight:800;${c.pricePerMeter === bestPrice ? "color:#047857;" : "color:#1c1917;"}">${formatPrice(c.pricePerMeter)} ج.م</div>
            </div>
            <div style="background:#fafaf9;border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:#78716c;margin-bottom:2px;">التسليم</div>
              <div style="font-size:14px;font-weight:700;color:#1c1917;">${c.deliveryDate}</div>
            </div>
            <div style="background:#fafaf9;border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:#78716c;margin-bottom:2px;">مساحات خضراء</div>
              <div style="font-size:14px;font-weight:800;${c.greenSpacePercent === bestGreen ? "color:#047857;" : "color:#1c1917;"}">${c.greenSpacePercent}%</div>
            </div>
            <div style="background:#fafaf9;border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:#78716c;margin-bottom:2px;">المقدم</div>
              <div style="font-size:14px;font-weight:800;${c.downPaymentPercent === bestDown ? "color:#047857;" : "color:#1c1917;"}">${c.downPaymentPercent}%</div>
            </div>
            <div style="background:#fafaf9;border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:#78716c;margin-bottom:2px;">سنوات السداد</div>
              <div style="font-size:14px;font-weight:800;${c.installmentYears === bestYears ? "color:#047857;" : "color:#1c1917;"}">${c.installmentYears} سنة</div>
            </div>
            <div style="background:#fafaf9;border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:#78716c;margin-bottom:2px;">عدد الوحدات</div>
              <div style="font-size:14px;font-weight:700;color:#1c1917;">${formatPrice(c.totalUnits)}</div>
            </div>
          </div>
          <div style="margin-bottom:10px;">
            <div style="font-size:11px;font-weight:600;color:#78716c;margin-bottom:5px;">المميزات</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px;">
              ${c.amenities.map((am) => `<span style="font-size:11px;background:#f5f5f4;color:#44403c;padding:3px 9px;border-radius:12px;">${am}</span>`).join("")}
            </div>
          </div>
          <div style="background:#f0fdf4;border-right:4px solid #047857;padding:10px 14px;border-radius:6px;font-size:13px;line-height:1.6;color:#292524;">
            <span style="font-weight:700;color:#047857;">رأي الخبير: </span>${c.verdict}
          </div>
        </div>
      </div>`;
    })
    .join("");

  const profilesHtml = buyerProfiles
    .map((p) => {
      const rec = compounds.find((c) => c.id === p.recommendedId)!;
      const a = accentColor[rec.accent];
      return `
      <div style="border:1px solid #e7e5e4;border-radius:12px;padding:14px;">
        <div style="font-weight:800;font-size:14px;color:#1c1917;margin-bottom:5px;">${p.title}</div>
        <div style="font-size:11px;color:#78716c;margin-bottom:8px;">${p.description}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <div style="width:24px;height:24px;border-radius:6px;background:${a.bg};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">${rec.name.charAt(0)}</div>
          <span style="font-weight:700;font-size:13px;color:${a.text};">${rec.name}</span>
        </div>
        <div style="font-size:11px;color:#57534e;line-height:1.5;">${p.reason}</div>
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>دليل المقارنة الشامل — أفضل 5 مجمعات سكنية في القاهرة الجديدة 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: #fefdfb;
    font-family: 'Cairo', 'Tajawal', sans-serif;
    color: #1c1917;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .poster {
    width: 794px;
    background: #fefdfb;
    padding: 0;
  }
</style>
</head>
<body>
<div class="poster">

  <!-- Cover -->
  <div style="background:linear-gradient(135deg,#0f766e 0%,#047857 100%);color:#fff;padding:48px 40px 40px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:radial-gradient(rgba(255,255,255,0.08) 1px,transparent 1px);background-size:20px 20px;"></div>
    <div style="position:relative;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:18px;">دليل 2026 — محدّث ${today}</div>
      <h1 style="font-size:30px;font-weight:900;line-height:1.25;margin-bottom:14px;">دليلك الشامل للمقارنة بين<br>أفضل 5 مجمعات سكنية في القاهرة الجديدة</h1>
      <p style="font-size:14px;line-height:1.7;opacity:0.9;max-width:560px;">مقارنة محايدة من خبير عقاري مستقل: متوسط سعر المتر، مواعيد التسليم، المساحات الخضراء، وخطط السداد — دون أي لغة بيع مُلحّة.</p>
      <div style="display:flex;gap:28px;margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.2);">
        <div><div style="font-size:22px;font-weight:900;">+4,200</div><div style="font-size:11px;opacity:0.8;">عميل سعيد</div></div>
        <div><div style="font-size:22px;font-weight:900;">15</div><div style="font-size:11px;opacity:0.8;">عاماً خبرة</div></div>
        <div><div style="font-size:22px;font-weight:900;">94%</div><div style="font-size:11px;opacity:0.8;">رضا العملاء</div></div>
        <div><div style="font-size:22px;font-weight:900;">3</div><div style="font-size:11px;opacity:0.8;">خبراء يراجعون</div></div>
      </div>
    </div>
  </div>

  <!-- Intro -->
  <div style="padding:32px 40px 8px;">
    <div style="background:#fffbeb;border-right:4px solid #d97706;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <div style="font-weight:700;color:#b45309;font-size:14px;margin-bottom:6px;">كيف نعمل؟ نحن مستشار لا بائع</div>
      <div style="font-size:12px;line-height:1.7;color:#78716c;">لا نبيعك وحدتنا، بل نبحث معك عن الأنسب لميزانيتك وغرضك. عمولتنا تأتي من المطوّر بعد البيع، أما نصيحتك فمجانية دائماً — حتى لو لم تشترِ. القيم المُظلَّلة بالأخضر في الجدول هي الأفضل في كل معيار.</div>
    </div>

    <h2 style="font-size:20px;font-weight:800;color:#1c1917;margin-bottom:6px;">المقارنة الحاسمة</h2>
    <p style="font-size:12px;color:#78716c;margin-bottom:16px;">5 مجمعات • 9 معايير • مصدر واحد موثوق</p>
  </div>

  <!-- Table -->
  <div style="padding:0 40px 24px;">
    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <thead>
        <tr style="background:#fafaf9;">
          <th style="padding:14px;text-align:right;border-bottom:2px solid #e7e5e4;font-size:12px;color:#57534e;font-weight:700;min-width:150px;">المعيار</th>
          ${compounds.map(headerCell).join("")}
        </tr>
      </thead>
      <tbody>
        ${tableRowsHtml}
      </tbody>
    </table>
    <div style="font-size:10px;color:#a8a29e;margin-top:8px;text-align:center;">✓ الأخضر = الأفضل في المعيار • الأسعار محدّثة ${today} وقابلة للتحقق من مكاتب المبيعات</div>
  </div>

  <!-- Compound details -->
  <div style="padding:8px 40px 24px;">
    <h2 style="font-size:20px;font-weight:800;color:#1c1917;margin-bottom:6px;">التفاصيل الكاملة لكل مجمع</h2>
    <p style="font-size:12px;color:#78716c;margin-bottom:16px;">كل ما تحتاج معرفته قبل أن تدفع مقدماً واحداً</p>
    ${compoundCardsHtml}
  </div>

  <!-- Buyer profiles -->
  <div style="padding:8px 40px 24px;background:#fafaf9;">
    <h2 style="font-size:20px;font-weight:800;color:#1c1917;margin-bottom:6px;padding-top:16px;">ماذا يناسبك أنت؟</h2>
    <p style="font-size:12px;color:#78716c;margin-bottom:16px;">لا يوجد «الأفضل» مطلقاً، بل الأفضل لظروفك</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${profilesHtml}
    </div>
  </div>

  <!-- Methodology -->
  <div style="padding:24px 40px;">
    <h2 style="font-size:18px;font-weight:800;color:#1c1917;margin-bottom:14px;">منهجيتنا — شفافة بالكامل</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <div style="background:#fff;border:1px solid #e7e5e4;border-radius:10px;padding:14px;">
        <div style="font-size:24px;font-weight:900;color:#0f766e;opacity:0.3;">01</div>
        <div style="font-weight:700;font-size:13px;margin-bottom:4px;">جمع ميداني</div>
        <div style="font-size:11px;color:#78716c;line-height:1.6;">زيارات أسبوعية لمكاتب المبيعات وتسجيل الأسعار الفعلية للوحدات المتاحة.</div>
      </div>
      <div style="background:#fff;border:1px solid #e7e5e4;border-radius:10px;padding:14px;">
        <div style="font-size:24px;font-weight:900;color:#0f766e;opacity:0.3;">02</div>
        <div style="font-weight:700;font-size:13px;margin-bottom:4px;">تحليل محايد</div>
        <div style="font-size:11px;color:#78716c;line-height:1.6;">12 معياراً موحداً: السعر، الموقع، التسليم، الخدمات، الكثافة، سمعة المطور.</div>
      </div>
      <div style="background:#fff;border:1px solid #e7e5e4;border-radius:10px;padding:14px;">
        <div style="font-size:24px;font-weight:900;color:#0f766e;opacity:0.3;">03</div>
        <div style="font-weight:700;font-size:13px;margin-bottom:4px;">مراجعة لجنة</div>
        <div style="font-size:11px;color:#78716c;line-height:1.6;">3 خبراء عقاريين يراجعون التقييم ويصوتون، بدون تواصل مع المطور.</div>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div style="background:#0f766e;color:#fff;padding:32px 40px;text-align:center;">
    <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;">توقف عن التشتت. ابدأ بقرار واعٍ.</h2>
    <p style="font-size:13px;opacity:0.9;margin-bottom:18px;">احجز استشارة مجانية مع خبير يسمع ظروفك ويوصي بالأنسب — دون أي التزام.</p>
    <div style="display:inline-block;background:#fff;color:#0f766e;padding:10px 24px;border-radius:8px;font-weight:700;font-size:14px;margin:0 6px;">📞 +20 100 123 4567</div>
    <div style="display:inline-block;background:rgba(255,255,255,0.15);color:#fff;padding:10px 24px;border-radius:8px;font-weight:600;font-size:13px;margin:0 6px;">expert@realestate.com</div>
  </div>

  <!-- Footer -->
  <div style="padding:16px 40px;background:#1c1917;color:#a8a29e;font-size:10px;text-align:center;">
    © 2026 Real Estate — استشارات عقارية محايدة • التجمع الخامس، القاهرة الجديدة • هذا الملف لأغراض إرشادية ولا يُعدّ عرضاً قانونياً.
  </div>

</div>
</body>
</html>`;
}
