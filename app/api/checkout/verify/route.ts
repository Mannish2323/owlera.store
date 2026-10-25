import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase-server";

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

    // 2. Update Supabase order and payment records
    const supabase = createClient();
    if (supabase) {
      try {
        // Update order status
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "confirmed",
            payment_reference: razorpayPaymentId,
            updated_at: new Date().toISOString()
          })
          .eq("order_number", orderNumber);

        // Update payment record
        await supabase
          .from("payments")
          .update({
            provider_payment_id: razorpayPaymentId,
            provider_signature: razorpaySignature,
            verification_status: "verified"
          })
          .eq("provider_order_id", razorpayOrderId);

        // Fetch order items to decrement product stock
        const { data: items } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", orderId);

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
