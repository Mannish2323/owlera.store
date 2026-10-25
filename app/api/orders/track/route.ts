import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();
    const contact = searchParams.get("contact")?.trim().toLowerCase();

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order reference number is required (e.g. OWL-XXXXXXXX)." },
        { status: 400 }
      );
    }

    const supabase = createClient();

    if (supabase) {
      let query = supabase
        .from("orders")
        .select(`
          id,
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          subtotal,
          shipping_fee,
          discount,
          total,
          currency,
          order_status,
          payment_status,
          created_at,
          order_items (
            product_name,
            sku,
            unit_price,
            quantity,
            line_total,
            image_url
          ),
          shipping_fulfilment (
            courier_name,
            tracking_number,
            tracking_url,
            dispatched_at,
            delivered_at,
            notes
          )
        `)
        .eq("order_number", orderNumber);

      const { data: order, error } = await query.single();

      if (error || !order) {
        return NextResponse.json(
          { error: `No order found with reference "${orderNumber}".` },
          { status: 404 }
        );
      }

      // Privacy verification: If contact matches, return verified full details.
      // If contact is omitted, mask customer name to prevent information harvesting.
      let isVerified = false;
      if (contact) {
        const cleanContact = contact.replace(/\D/g, "");
        const cleanOrderPhone = (order.customer_phone || "").replace(/\D/g, "");
        const emailMatch = order.customer_email?.toLowerCase() === contact;
        const phoneMatch = cleanContact.length >= 10 && cleanOrderPhone.endsWith(cleanContact);
        if (!emailMatch && !phoneMatch) {
          return NextResponse.json(
            { error: "The provided contact details do not match this order." },
            { status: 403 }
          );
        }
        isVerified = true;
      }

      // Helper to mask name (e.g. "Ananya Sharma" -> "A***** S*****")
      const maskName = (name: string) => {
        if (!name) return "Customer";
        return name
          .split(" ")
          .map(part => (part.length > 1 ? part[0] + "*".repeat(part.length - 1) : part))
          .join(" ");
      };

      return NextResponse.json({
        orderNumber: order.order_number,
        customerName: isVerified ? order.customer_name : maskName(order.customer_name),
        isVerified,
        date: order.created_at,
        orderStatus: order.order_status,
        paymentStatus: order.payment_status,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        discount: order.discount,
        total: order.total,
        items: order.order_items || [],
        shipping: order.shipping_fulfilment?.[0] || order.shipping_fulfilment || null
      });
    }

    // Demo fallback mock for testing tracking
    return NextResponse.json({
      orderNumber,
      customerName: "Valued Customer",
      date: new Date().toISOString(),
      orderStatus: "confirmed",
      paymentStatus: "paid",
      subtotal: 1899,
      shippingFee: 0,
      discount: 0,
      total: 1899,
      items: [
        {
          product_name: "Luna Pendant Necklace",
          sku: "OWL-JW-002",
          unit_price: 1899,
          quantity: 1,
          line_total: 1899,
          image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=85"
        }
      ],
      shipping: {
        courier_name: "BlueDart Express",
        tracking_number: "BD-884920491",
        tracking_url: "https://www.bluedart.com",
        dispatched_at: null,
        notes: "Awaiting courier pickup from Hyderabad hub"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch order status." },
      { status: 500 }
    );
  }
}
