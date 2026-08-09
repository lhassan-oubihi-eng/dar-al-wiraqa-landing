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
 * POST /api/order  ->  receives the checkout payload and persists/forwards it.
 *
 * Persistence strategy (configure via env):
 *   - ORDERS_WEBHOOK_URL : a Google Apps Script / Zapier / Make webhook that
 *     writes to your Google Sheet / CRM. If set, orders are forwarded there.
 *   - If unset: orders are console.log()'d so they still appear in Vercel logs.
 *
 * Always returns 200 (the checkout page redirects to /thank-you regardless),
 * so the Meta Pixel `Purchase` event on /thank-you never gets blocked by a
 * backend hiccup and conversions are always attributed.
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

    const normalized = {
      _subject: `طلب جديد من دار الوِراقة — ${packName || "طلب"}`,
      name: String(name).trim(),
      phone,
      address: String(address).trim(),
      message: `${packName || ""}\n${books || ""}`,
      books: books || "",
      price: price ? `${price} درهم` : "199 درهم",
      payment: payment || "نقداً عند الاستلام",
      count: count ?? 0,
      source: "dar-al-wiraqa-landing",
      createdAt: new Date().toISOString(),
    };

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
