import { NextRequest, NextResponse } from "next/server";

interface Order {
  name: string;
  phone: string;
  address: string;
  packName?: string;
  books?: string;
  price?: string | number;
  payment?: string;
  count?: number;
}

const PHONE_RE = /^(06|07)\d{8}$/;

/**
 * POST /api/order  ->  secondary order sink (optional webhook / logs).
 *
 * NOTE: The checkout form now sends leads DIRECTLY to FormSubmit's AJAX
 * endpoint from the browser (see CheckoutSection.tsx) — FormSubmit blocks
 * server-to-server relays as spam. This endpoint no longer touches
 * FormSubmit; it only forwards to an optional ORDERS_WEBHOOK_URL (Google
 * Sheets / Zapier / Make) and always logs the order to the Vercel console.
 * It still always returns 200 so nothing can block the funnel.
 */
export async function POST(req: NextRequest) {
  try {
    const body: Order = await req.json();
    const { name, phone, address, packName, books, price, payment, count } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { ok: false, error: "الحقول المطلوبة ناقصة." },
        { status: 400 }
      );
    }

    if (!PHONE_RE.test(phone)) {
      return NextResponse.json(
        { ok: false, error: "رقم الهاتف غير صالح." },
        { status: 400 }
      );
    }

    const offer = packName || "طلب";
    const normalized = {
      _subject: `طلب جديد من دار الوِراقة — ${offer}`,
      name: String(name).trim(),
      phone,
      city: String(address).trim(),
      offer,
      books: books || "",
      price: price ? `${price} درهم` : "199 درهم",
      payment: payment || "نقداً عند الاستلام",
      count: count ?? 0,
      source: "dar-al-wiraqa-landing",
      createdAt: new Date().toISOString(),
    };

    // Optional secondary webhook (Google Sheet / Zapier / Make).
    const webhookUrl = process.env.ORDERS_WEBHOOK_URL;
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      }).catch(() => null);

      if (!res || !res.ok) {
        // Non-fatal: never block the funnel. Order is still logged below.
        console.error(
          "Order forward to webhook failed:",
          res?.status,
          await res?.text().catch(() => "")
        );
      }
    }

    // Visible in Vercel logs even when no webhook is configured.
    console.log("Order received:", JSON.stringify(normalized));

    return NextResponse.json({
      ok: true,
      message: "تم تسجيل طلبك بنجاح. سيتواصل معك فريقنا قريباً.",
    });
  } catch (err) {
    console.error("Order endpoint error:", err);
    return NextResponse.json({ ok: false, error: "خطأ في الخادم." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: "Dar Al Wiraqa orders endpoint",
  });
}
