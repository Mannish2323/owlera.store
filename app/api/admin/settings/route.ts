import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { createServiceClient, verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createClient();
  const serviceClient = createServiceClient() || supabase;

  // 1. Integration Health Diagnostics
  let dbStatus = "not_configured";
  let dbLatencyMs = 0;
  let authStatus = "not_configured";
  let storageStatus = "not_configured";

  if (supabase) {
    try {
      const start = Date.now();
      const { data, error } = await supabase.from("products").select("id").limit(1);
      dbLatencyMs = Date.now() - start;
      dbStatus = error ? `error: ${error.message}` : "healthy";
    } catch (e: any) {
      dbStatus = `unreachable: ${e.message}`;
    }

    try {
      const { error } = await supabase.auth.getSession();
      authStatus = error ? `error: ${error.message}` : "healthy";
    } catch {
      authStatus = "unknown";
    }

    if (serviceClient) {
      try {
        const { error } = await serviceClient.storage.getBucket("product-images");
        storageStatus = error ? `bucket missing or unconfigured: ${error.message}` : "healthy";
      } catch {
        storageStatus = "unreachable";
      }
    }
  }

  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const paymentHealth = {
    provider: "Razorpay (India)",
    configured: Boolean(razorpayKeyId && razorpayKeySecret),
    keyIdPresent: Boolean(razorpayKeyId),
    keyIdMasked: razorpayKeyId ? `${razorpayKeyId.slice(0, 8)}...` : null,
    secretPresent: Boolean(razorpayKeySecret),
    webhookConfigured: Boolean(razorpayWebhookSecret),
    currency: "INR (Indian Rupee)"
  };

  const notificationHealth = {
    whatsappConcierge: {
      configured: true,
      numberMasked: "+91 63056 30468",
      channel: "Direct WhatsApp Click-to-Chat"
    },
    emailProvider: {
      configured: Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST),
      channel: process.env.RESEND_API_KEY ? "Resend API" : "Standard SMTP / Supabase Auth Emails"
    }
  };

  // 2. Site settings retrieval
  let storedSettings: Record<string, any> = {};
  if (supabase) {
    try {
      const { data: rows } = await supabase.from("site_settings").select("*");
      if (rows) {
        for (const row of rows) {
          storedSettings[row.key] = row.value;
        }
      }
    } catch (e) {
      console.warn("Could not load site_settings:", e);
    }
  }

  const defaultSettings = {
    hero_headline: "Quiet Luxury, Mindfully Curated for the Indian Connoisseur",
    hero_subtitle: "Heirloom craftsmanship, lustrous gold tones, and sacred sanctuary essentials designed to endure.",
    hero_image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85",
    hero_cta_text: "Explore The Catalogue",
    hero_cta_link: "/shop",
    announcement_bar: "Complimentary Pan-India Insured Shipping on all orders above ₹999 • Handcrafted with Pride in India",
    store_name: "OWLERA",
    contact_email: "concierge@owlera.store",
    contact_phone: "+91 63056 30468",
    store_currency: "INR",
    store_timezone: "Asia/Kolkata",
    free_shipping_threshold: 999,
    low_stock_threshold: 5
  };

  const finalSettings = { ...defaultSettings, ...storedSettings };

  return NextResponse.json({
    health: {
      database: { status: dbStatus, latencyMs: dbLatencyMs },
      auth: { status: authStatus },
      storage: { status: storageStatus, bucket: "product-images" },
      payment: paymentHealth,
      notifications: notificationHealth,
      timestamp: new Date().toISOString()
    },
    settings: finalSettings
  });
}

export async function PUT(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Settings object is required." }, { status: 400 });
    }

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;

    if (serviceClient) {
      for (const [key, value] of Object.entries(settings)) {
        await serviceClient
          .from("site_settings")
          .upsert({
            key,
            value,
            updated_at: new Date().toISOString()
          }, { onConflict: "key" });
      }

      // Revalidate storefront cache
      try {
        revalidatePath("/", "layout");
      } catch {}

      return NextResponse.json({ success: true, message: "Site settings updated and storefront revalidated." });
    }

    return NextResponse.json({ success: true, message: "Settings simulated in demo mode." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save settings." }, { status: 500 });
  }
}
