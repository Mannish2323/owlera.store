import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase-server";

// In-memory processed event tracker for serverless idempotency (backed by DB when available)
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  try {
    const headerList = headers();
    const signature = headerList.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    const rawBody = await req.text();

    // 1. Verify cryptographic HMAC-SHA256 signature
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature
    });

    if (!isValid) {
      console.error("[Razorpay Webhook] Invalid signature rejected.");
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventId = event.id || `${event.event}_${event.payload?.payment?.entity?.id || Date.now()}`;

    // 2. Idempotency Check — Duplicate Webhook Protection
    if (processedEvents.has(eventId)) {
      console.log(`[Razorpay Webhook] Duplicate event ${eventId} safely ignored.`);
      return NextResponse.json({ received: true, duplicate: true });
    }
    processedEvents.add(eventId);

    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;
    const orderEntity = event.payload?.order?.entity;

    console.log(`[Razorpay Webhook] Processing event: ${eventType}`);

    const supabase = createClient();

    if (supabase) {
      // Record webhook event into audit ledger
      try {
        await supabase.from("webhook_events").insert({
          event_id: eventId,
          event_type: eventType,
          payload: event,
          processed_at: new Date().toISOString()
        });
      } catch (logErr) {
        // Table might not exist yet if migrations are pending; continue safely
      }

      // Handle event types
      if (eventType === "payment.captured" || eventType === "order.paid") {
        const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
        const razorpayPaymentId = paymentEntity?.id;

        if (razorpayOrderId) {
          // Update order status to paid & confirmed
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              order_status: "confirmed",
              payment_reference: razorpayPaymentId,
              updated_at: new Date().toISOString()
            })
            .eq("razorpay_order_id", razorpayOrderId);

          // Update payments record
          await supabase
            .from("payments")
            .update({
              provider_payment_id: razorpayPaymentId,
              payment_status: "captured",
              verification_status: "verified",
              updated_at: new Date().toISOString()
            })
            .eq("provider_order_id", razorpayOrderId);

          // Inventory allocation & decrement
          const { data: order } = await supabase
            .from("orders")
            .select("id")
            .eq("razorpay_order_id", razorpayOrderId)
            .single();

          if (order?.id) {
            const { data: items } = await supabase
              .from("order_items")
              .select("product_id, quantity")
              .eq("order_id", order.id);

            if (items && items.length > 0) {
              for (const item of items) {
                if (item.product_id) {
                  const { data: prod } = await supabase
                    .from("products")
                    .select("stock")
                    .eq("id", item.product_id)
                    .single();

                  if (prod) {
                    const newStock = Math.max(0, prod.stock - item.quantity);
                    await supabase
                      .from("products")
                      .update({ stock: newStock })
                      .eq("id", item.product_id);
                  }
                }
              }
            }
          }
        }
      } else if (eventType === "payment.failed") {
        const razorpayOrderId = paymentEntity?.order_id;
        const reason = paymentEntity?.error_description || "Payment failed at gateway";

        if (razorpayOrderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              notes: `Gateway failure: ${reason}`,
              updated_at: new Date().toISOString()
            })
            .eq("razorpay_order_id", razorpayOrderId);

          await supabase
            .from("payments")
            .update({
              payment_status: "failed",
              notes: reason,
              updated_at: new Date().toISOString()
            })
            .eq("provider_order_id", razorpayOrderId);
        }
      } else if (eventType === "refund.processed" || eventType === "refund.created") {
        const refundEntity = event.payload?.refund?.entity;
        const razorpayPaymentId = refundEntity?.payment_id;

        if (razorpayPaymentId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "refunded",
              order_status: "cancelled",
              updated_at: new Date().toISOString()
            })
            .eq("payment_reference", razorpayPaymentId);
        }
      }
    }

    return NextResponse.json({
      success: true,
      event: eventType,
      id: eventId
    });
  } catch (err: any) {
    console.error("[Razorpay Webhook Error]:", err);
    return NextResponse.json(
      { error: "Webhook processing failure", details: err?.message },
      { status: 500 }
    );
  }
}
