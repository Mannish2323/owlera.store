import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createClient();
  if (supabase) {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*),
        shipping_fulfilment (*)
      `)
      .order("created_at", { ascending: false });

    if (!error && orders) {
      return NextResponse.json({ orders, source: "supabase" });
    }
  }

  // Demo fallback orders
  const sampleOrders = [
    {
      id: "ord-1",
      order_number: "OWL-9A4B8C1D",
      customer_name: "Ananya Sharma",
      customer_email: "ananya@example.com",
      customer_phone: "9876543210",
      shipping_address: {
        address: "Flat 402, Royal Palms, Banjara Hills",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034"
      },
      subtotal: 3398,
      shipping_fee: 0,
      discount: 340,
      total: 3058,
      currency: "INR",
      payment_status: "paid",
      order_status: "shipped",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      order_items: [
        { product_name: "Celeste Gold Hoops", quantity: 1, unit_price: 1499, line_total: 1499 },
        { product_name: "Luna Pendant Necklace", quantity: 1, unit_price: 1899, line_total: 1899 }
      ],
      shipping_fulfilment: [
        {
          courier_name: "BlueDart Express",
          tracking_number: "BD-904829103",
          tracking_url: "https://www.bluedart.com",
          dispatched_at: new Date(Date.now() - 86400000).toISOString(),
          notes: "Dispatched via air express"
        }
      ]
    },
    {
      id: "ord-2",
      order_number: "OWL-2F5E7B9A",
      customer_name: "Rohan Mehta",
      customer_email: "rohan@example.com",
      customer_phone: "9123456780",
      shipping_address: {
        address: "12, Indiranagar 100ft Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038"
      },
      subtotal: 4999,
      shipping_fee: 0,
      discount: 200,
      total: 4799,
      currency: "INR",
      payment_status: "paid",
      order_status: "packed",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      order_items: [
        { product_name: "Signature OWLERA Luxe Gift Suite", quantity: 1, unit_price: 4999, line_total: 4999 }
      ],
      shipping_fulfilment: [
        {
          courier_name: "Delhivery Surface",
          tracking_number: "DLH-77492019",
          tracking_url: "https://www.delhivery.com",
          dispatched_at: null,
          notes: "Handcrafted gift ribbon packaging completed"
        }
      ]
    }
  ];

  return NextResponse.json({ orders: sampleOrders, source: "demo" });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, orderStatus, courierName, trackingNumber, trackingUrl, notes } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      // 1. Update order status
      if (orderStatus) {
        await supabase
          .from("orders")
          .update({
            order_status: orderStatus,
            updated_at: new Date().toISOString()
          })
          .eq("id", orderId);
      }

      // 2. Update shipping fulfilment
      const { data: existingFulfilment } = await supabase
        .from("shipping_fulfilment")
        .select("id")
        .eq("order_id", orderId)
        .single();

      const shippingPayload = {
        courier_name: courierName || "",
        tracking_number: trackingNumber || "",
        tracking_url: trackingUrl || "",
        notes: notes || "",
        dispatched_at: orderStatus === "shipped" || orderStatus === "dispatched" ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString()
      };

      if (existingFulfilment) {
        await supabase
          .from("shipping_fulfilment")
          .update(shippingPayload)
          .eq("order_id", orderId);
      } else {
        await supabase
          .from("shipping_fulfilment")
          .insert({ order_id: orderId, ...shippingPayload });
      }

      return NextResponse.json({ success: true, message: "Order & shipping updated in database." });
    }

    return NextResponse.json({ success: true, message: "Updated in demo mode." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
