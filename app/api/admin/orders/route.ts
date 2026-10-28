import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { verifyAdmin, createServiceClient } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");
  const searchQuery = searchParams.get("q")?.toLowerCase().trim();

  const supabase = createClient();
  if (supabase) {
    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (*),
        shipping_fulfilment (*)
      `)
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("order_status", statusFilter);
    }

    const { data: orders, error } = await query;

    if (!error && orders) {
      let filtered = orders;
      if (searchQuery) {
        filtered = filtered.filter(
          o =>
            o.order_number?.toLowerCase().includes(searchQuery) ||
            o.customer_name?.toLowerCase().includes(searchQuery) ||
            o.customer_email?.toLowerCase().includes(searchQuery) ||
            o.customer_phone?.includes(searchQuery)
        );
      }
      return NextResponse.json({ orders: filtered, total: filtered.length, source: "supabase" });
    }
  }

  return NextResponse.json({ orders: [], total: 0, source: "none", message: "Database not configured." });
}

export async function PUT(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { orderId, orderStatus, courierName, trackingNumber, trackingUrl, notes, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    // Explicit valid transitions
    const validOrderStatuses = [
      "pending",
      "confirmed",
      "processing",
      "packed",
      "dispatched",
      "shipped",
      "delivered",
      "cancelled",
      "returned"
    ];

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json({ error: `Invalid order status: ${orderStatus}` }, { status: 400 });
    }

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;

    if (!serviceClient) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    // 1. Fetch current order
    const { data: existingOrder, error: fetchErr } = await serviceClient
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (fetchErr || !existingOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Security check: An admin cannot arbitrarily fabricate a 'paid' payment status on an order without verified provider records
    if (paymentStatus && paymentStatus === "paid" && existingOrder.payment_status !== "paid") {
      // Check if there is a verified record in payments table
      const { data: verifiedPayment } = await serviceClient
        .from("payments")
        .select("id, verification_status")
        .eq("order_id", orderId)
        .eq("verification_status", "verified")
        .limit(1);

      if (!verifiedPayment || verifiedPayment.length === 0) {
        return NextResponse.json(
          {
            error: "Cannot mark order as paid without verified payment provider credentials or webhook reconciliation record."
          },
          { status: 403 }
        );
      }
    }

    // Handle restocking if order is cancelled from a confirmed/processing state
    if (orderStatus === "cancelled" && existingOrder.order_status !== "cancelled") {
      if (existingOrder.order_items && Array.isArray(existingOrder.order_items)) {
        for (const item of existingOrder.order_items) {
          if (item.product_id && item.quantity > 0) {
            // Fetch current stock
            const { data: p } = await serviceClient
              .from("products")
              .select("stock")
              .eq("id", item.product_id)
              .single();

            if (p) {
              const restoredStock = (p.stock || 0) + item.quantity;
              await serviceClient.from("products").update({ stock: restoredStock }).eq("id", item.product_id);

              // Log audit trail
              await serviceClient.from("audit_logs").insert({
                actor_id: auth.userId,
                actor_email: auth.email,
                action: "inventory_adjustment",
                resource_type: "product",
                resource_id: item.product_id,
                changes: {
                  reason: "Cancellation Restock",
                  order_number: existingOrder.order_number,
                  restored_quantity: item.quantity,
                  new_stock: restoredStock
                }
              });
            }
          }
        }
      }
    }

    // 2. Update order
    const orderUpdates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    if (orderStatus) orderUpdates.order_status = orderStatus;
    if (notes !== undefined) orderUpdates.internal_notes = notes;

    const { error: orderErr } = await serviceClient
      .from("orders")
      .update(orderUpdates)
      .eq("id", orderId);

    if (orderErr) {
      return NextResponse.json({ error: orderErr.message }, { status: 400 });
    }

    // 3. Update shipping fulfilment
    const { data: existingFulfilment } = await serviceClient
      .from("shipping_fulfilment")
      .select("id")
      .eq("order_id", orderId)
      .single();

    const shippingPayload: Record<string, any> = {
      courier_name: courierName || "BlueDart Express",
      tracking_number: trackingNumber || "",
      tracking_url: trackingUrl || (trackingNumber ? `https://www.bluedart.com/tracking?track=${trackingNumber}` : ""),
      notes: notes || "",
      updated_at: new Date().toISOString()
    };

    if (orderStatus === "shipped" || orderStatus === "dispatched") {
      shippingPayload.dispatched_at = new Date().toISOString();
    }
    if (orderStatus === "delivered") {
      shippingPayload.delivered_at = new Date().toISOString();
    }

    if (existingFulfilment) {
      await serviceClient
        .from("shipping_fulfilment")
        .update(shippingPayload)
        .eq("order_id", orderId);
    } else {
      await serviceClient
        .from("shipping_fulfilment")
        .insert({ order_id: orderId, ...shippingPayload });
    }

    // Revalidate tracking pages
    try {
      revalidatePath("/orders");
      revalidatePath("/track-order");
      revalidatePath("/account");
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Order #${existingOrder.order_number} status updated to ${orderStatus || existingOrder.order_status}.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update order" }, { status: 500 });
  }
}
