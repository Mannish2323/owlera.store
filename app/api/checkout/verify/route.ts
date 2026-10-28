import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/admin-auth";

const verifySchema = z.object({
  orderId: z.string(),
  orderNumber: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment verification payload." },
        { status: 400 }
      );
    }

    const { orderId, orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

    // 1. Verify Razorpay cryptographic signature on the server
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isValid) {
      console.error(`Invalid Razorpay signature for order ${orderNumber}`);
      return NextResponse.json(
        { error: "Payment verification failed. Invalid cryptographic signature." },
        { status: 400 }
      );
    }

    // 2. Update Supabase order and payment records using service client (bypasses RLS for server-verified payment)
    const supabase = createServiceClient() || createClient();
    if (supabase) {
      try {
        // Fetch current order status first to prevent duplicate stock decrements
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, payment_status")
          .or(`order_number.eq.${orderNumber},id.eq.${orderId}`)
          .single();

        const alreadyPaid = existingOrder?.payment_status === "paid";
        const realOrderId = existingOrder?.id || orderId;

        // Update order status
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "confirmed",
            payment_reference: razorpayPaymentId,
            updated_at: new Date().toISOString()
          })
          .eq("id", realOrderId);

        // Update payment record
        await supabase
          .from("payments")
          .update({
            provider_payment_id: razorpayPaymentId,
            provider_signature: razorpaySignature,
            verification_status: "verified"
          })
          .eq("provider_order_id", razorpayOrderId);

        // Only decrement stock if the order was not previously marked as paid
        if (!alreadyPaid) {
          const { data: items } = await supabase
            .from("order_items")
            .select("product_id, quantity")
            .eq("order_id", realOrderId);

          if (items && items.length > 0) {
            for (const item of items) {
              if (item.product_id) {
                const { data: prod } = await supabase
                  .from("products")
                  .select("stock")
                  .eq("id", item.product_id)
                  .single();

                if (prod) {
                  const updatedStock = Math.max(0, prod.stock - item.quantity);
                  await supabase
                    .from("products")
                    .update({ stock: updatedStock })
                    .eq("id", item.product_id);
                }
              }
            }
          }
        } else {
          console.log(`[Verify Route] Order ${orderNumber} already marked as paid. Skipping redundant stock decrement.`);
        }
      } catch (dbErr) {
        console.error("Database update on payment verification:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and captured.",
      orderNumber
    });
  } catch (error: any) {
    console.error("Verification POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
