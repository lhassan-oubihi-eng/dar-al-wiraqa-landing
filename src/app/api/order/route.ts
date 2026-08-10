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

/** FormSubmit AJAX endpoint — returns JSON, never redirects, never shows a captcha. */
const FORMSUBMIT_EMAIL = process.env.FORMSUBMIT_EMAIL;
const FORMSUBMIT_AJAX = "https://formsubmit.co/ajax";

/**
 * POST /api/order  ->  receives the checkout payload and silently forwards it.
 *
 * The checkout page sends this via navigator.sendBeacon() so the request is
 * flushed even as the browser navigates to /thank-you. This endpoint:
 *   1. Validates the payload.
 *   2. Forwards the lead to FormSubmit (FORMSUBMIT_EMAIL env) so the order
 *      lands in the team's inbox the second the form is submitted — even if
 *      the customer bounces before clicking the WhatsApp button.
 *   3. Optionally forwards to ORDERS_WEBHOOK_URL (Google Sheets / Zapier /
 *      Make) when that env var is set.
 *
 * Always returns 200: the user must be redirected instantly and must never
 * see a FormSubmit "Thank You" page or captcha. Captcha is disabled via
 * `_captcha: "false"` and the AJAX endpoint is used so no redirect happens.
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

    // 1. Silent lead capture via FormSubmit (email inbox).
    if (FORMSUBMIT_EMAIL) {
      const fsRes = await fetch(`${FORMSUBMIT_AJAX}/${FORMSUBMIT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _captcha: "false",
          _template: "table",
          ...normalized,
        }),
      }).catch(() => null);

      if (!fsRes || !fsRes.ok) {
        // Non-fatal: never block the funnel; order is still logged below.
        console.error(
          "FormSubmit relay failed:",
          fsRes?.status,
          await fsRes?.text().catch(() => "")
        );
      } else {
        console.log(
          "FormSubmit relay OK:",
          await fsRes.text().catch(() => "")
        );
      }
    }

    // 2. Optional secondary webhook (Google Sheet / Zapier / Make).
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

    // Visible in Vercel logs even when no email/webhook is configured.
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
