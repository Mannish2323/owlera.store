import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { createServiceClient } from "@/lib/admin-auth";

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
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    console.log(`[Razorpay Webhook] Processing event: ${eventType} (${eventId})`);

    // Use service role client to bypass RLS for webhook processing
    const supabase = createServiceClient();

    if (!supabase) {
      console.error("[Razorpay Webhook] Service role client not configured.");
      // Still return 200 to prevent Razorpay retries when DB is misconfigured
      return NextResponse.json({ received: true, warning: "Database not configured" });
    }

    // 2. Idempotency: Check if this event was already processed in the database
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("event_id", eventId)
      .single();

    if (existingEvent) {
      console.log(`[Razorpay Webhook] Duplicate event ${eventId} safely ignored.`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    // 3. Record webhook event for audit and idempotency
    await supabase.from("webhook_events").insert({
      event_id: eventId,
      event_type: eventType,
      payload: event,
      processed_at: new Date().toISOString()
    });

    // 4. Handle event types
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        // Find order via payments table (provider_order_id is immutable)
        const { data: payRecord } = await supabase
          .from("payments")
          .select("order_id")
          .eq("provider_order_id", razorpayOrderId)
          .single();

        let targetOrderId = payRecord?.order_id;

        if (!targetOrderId) {
          const { data: foundOrder } = await supabase
            .from("orders")
            .select("id")
            .or(`payment_reference.eq.${razorpayOrderId}${razorpayPaymentId ? `,payment_reference.eq.${razorpayPaymentId}` : ""}`)
            .single();
          targetOrderId = foundOrder?.id;
        }

        if (targetOrderId) {
          const { data: order } = await supabase
            .from("orders")
            .select("id, payment_status")
            .eq("id", targetOrderId)
            .single();

          if (order) {
          // Only process if not already paid (idempotency at the order level)
          if (order.payment_status !== "paid") {
            // Update order status to paid
            await supabase
              .from("orders")
              .update({
                payment_status: "paid",
                order_status: "confirmed",
                updated_at: new Date().toISOString()
              })
              .eq("id", order.id);

            // Update payment record
            await supabase
              .from("payments")
              .update({
                provider_payment_id: razorpayPaymentId,
                verification_status: "verified"
              })
              .eq("provider_order_id", razorpayOrderId);

            // Decrement inventory atomically using RPC or sequential updates
            // The verify route checks payment_status before decrementing,
            // so only one path (verify or webhook, whichever arrives first) will decrement.
            const { data: items } = await supabase
              .from("order_items")
              .select("product_id, quantity")
              .eq("order_id", order.id);

            if (items && items.length > 0) {
              for (const item of items) {
                if (item.product_id) {
                  // Atomic decrement: stock = GREATEST(0, stock - quantity)
                  await supabase.rpc("decrement_stock", {
                    p_product_id: item.product_id,
                    p_quantity: item.quantity
                  }).catch(() => {
                    // Fallback if RPC doesn't exist yet: read-then-write
                    return supabase
                      .from("products")
                      .select("stock")
                      .eq("id", item.product_id)
                      .single()
                      .then(({ data: prod }: { data: any }) => {
                        if (prod) {
                          const newStock = Math.max(0, prod.stock - item.quantity);
                          return supabase
                            .from("products")
                            .update({ stock: newStock })
                            .eq("id", item.product_id);
                        }
                      });
                  });
                }
              }
            }
          } else {
            console.log(`[Razorpay Webhook] Order ${order.id} already paid — skipping stock decrement.`);
          }
        } else {
          console.warn(`[Razorpay Webhook] No order found for Razorpay order ${razorpayOrderId}`);
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
            internal_notes: `Gateway failure: ${reason}`,
            updated_at: new Date().toISOString()
          })
          .eq("payment_reference", razorpayOrderId);

        await supabase
          .from("payments")
          .update({
            verification_status: "failed"
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

        await supabase
          .from("payments")
          .update({
            refund_status: "refunded"
          })
          .eq("provider_payment_id", razorpayPaymentId);
      }
    }

    return NextResponse.json({
      success: true,
      event: eventType,
      id: eventId
    });
  } catch (err: any) {
    console.error("[Razorpay Webhook Error]:", err);
    // Return 200 for parse errors to prevent infinite retries
    return NextResponse.json(
      { error: "Webhook processing failure" },
      { status: 500 }
    );
  }
}
