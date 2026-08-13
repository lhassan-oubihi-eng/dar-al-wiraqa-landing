import { NextRequest, NextResponse } from "next/server";

interface Order {
  name?: string;
  phone?: string;
  address?: string;
  packName?: string;
  books?: string;
  price?: string | number;
  count?: number;
  /** Passed through from the browser form (fbclid) for CAPI dedup */
  fbclid?: string;
  client_user_agent?: string;
}

const PHONE_RE = /^(06|07)\d{8}$/;

/** Meta CAPI config — set these in Vercel (Settings → Environment Variables) */
const META_PIXEL_ID = process.env.META_PIXEL_ID ?? "";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN ?? "";

/** Hashes a string with SHA-256 (lowercase hex) as Meta's CAPI expects. */
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Sends a server-side event to the Meta Graph API (Conversions API / CAPI).
 * Recovers conversions that browser-only pixel fire misses due to
 * iOS 14.5+ ATT / ad blockers — the #1 reason Moroccan COD accounts see
 * "no tracked purchases" and get throttled by Meta's delivery.
 *
 * Normalizes Moroccan 06/07 numbers to international (2126/2127) format
 * before hashing so the phone matches what Meta stores on-device.
 */
async function sendMetaCapi(params: {
  eventName: string;
  phone: string;
  name: string;
  city: string;
  value: number;
  contentName: string;
  orderId?: string;
  fbclid?: string;
  client_user_agent?: string;
}) {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
    console.warn(
      "[CAPI] META_PIXEL_ID / META_ACCESS_TOKEN not set — skipping server event."
    );
    return;
  }

  const phoneNumeric = params.phone.replace(/\D/g, "");
  // 06XXXXXXXX / 07XXXXXXXX  ->  2126XXXXXXXX / 2127XXXXXXXX
  const intlPhone = /^(06|07)/.test(phoneNumeric)
    ? "212" + phoneNumeric.replace(/^0/, "")
    : phoneNumeric;

  const [emH, phH, ctH] = await Promise.all([
    sha256(params.name),
    sha256(intlPhone),
    sha256(params.city),
  ]);

  const data = [
    {
      event_name: params.eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: `https://dar-al-wiraqa.vercel.app/${params.contentName}`,
      ...(params.orderId ? { event_id: params.orderId } : {}),
      ...(params.fbclid
        ? { fbp: `fb.1.${Date.now()}.${params.fbclid}` }
        : {}),
      ...(params.client_user_agent
        ? { client_user_agent: params.client_user_agent }
        : {}),
      user_data: {
        em: [emH],
        ph: [phH],
        ct: [ctH],
        country: "ma",
      },
      custom_data: {
        currency: "MAD",
        value: params.value,
        content_name: params.contentName,
        content_type: "product_group",
        num_items: 1,
      },
    },
  ];

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      }
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(
        "[CAPI] Meta rejected event:",
        res.status,
        JSON.stringify(json)
      );
    } else {
      console.log(`[CAPI] ${params.eventName} sent OK`, JSON.stringify(json));
    }
  } catch (err) {
    console.error("[CAPI] send failed (non-fatal):", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Order = await req.json();
    const { name, phone, address, packName, books, price, count } = body;
    const fbclid = typeof body.fbclid === "string" ? body.fbclid : undefined;
    const client_user_agent =
      typeof body.client_user_agent === "string"
        ? body.client_user_agent
        : req.headers.get("user-agent") ?? undefined;

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
    const numericPrice = Number(String(price ?? "").replace(/[^\d.]/g, "") || 199);
    const orderId = `daw-${Date.now().toString(36)}-${Math.floor(
      Math.random() * 1e4
    )}`;
    const normalized = {
      _subject: `طلب جديد من دار الوِراقة — ${offer}`,
      name: String(name).trim(),
      phone,
      city: String(address).trim(),
      offer,
      books: books || "",
      price: `${numericPrice} درهم`,
      payment: "نقداً عند الاستلام",
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

    // Meta Conversions API — fire the Lead (qualified intent) event server-side.
    await sendMetaCapi({
      eventName: "Lead",
      phone: String(phone),
      name: String(name),
      city: String(address),
      value: numericPrice,
      contentName: offer,
      fbclid,
      client_user_agent,
    });

    // Also fire a Purchase event server-side for the COD conversion.
    await sendMetaCapi({
      eventName: "Purchase",
      phone: String(phone),
      name: String(name),
      city: String(address),
      value: numericPrice,
      contentName: offer,
      orderId,
      fbclid,
      client_user_agent,
    });

    // Visible in Vercel logs even when no webhook is configured.
    console.log("Order received:", JSON.stringify(normalized));

    return NextResponse.json({
      ok: true,
      message: "تم تسجيل طلبك بنجاح. سيتواصل معك فريقنا قريباً.",
    });
  } catch (err) {
    console.error("Order endpoint error:", err);
    return NextResponse.json(
      { ok: false, error: "خطأ في الخادم." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: "Dar Al Wiraqa orders endpoint",
  });
}

