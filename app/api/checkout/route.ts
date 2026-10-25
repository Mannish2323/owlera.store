import { NextResponse } from "next/server";
import { z } from "zod";
import { demoProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase-server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { validateAddressDetails } from "@/lib/pincode-validator";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Full name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
    address: z.string().min(6, "Address must be at least 6 characters").max(300),
    city: z.string().min(2, "City name is required").max(100),
    state: z.string().min(2, "State name is required").max(100),
    pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit Indian PIN code"),
    landmark: z.string().optional()
  }),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().min(1).max(20),
      variant: z.string().optional()
    })
  ).min(1, "Cart cannot be empty"),
  couponCode: z.string().optional().nullable()
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = checkoutSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid delivery details";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { customer, items, couponCode } = parsed.data;

    // Validate Indian PIN code, state, and city consistency
    const addrCheck = validateAddressDetails(customer.pincode, customer.state, customer.city);
    if (!addrCheck.isValid) {
      return NextResponse.json(
        { error: addrCheck.errorMessage || "Delivery address mismatch detected. Please verify your PIN code, State, and City." },
        { status: 400 }
      );
    }

    // 1. Fetch products from database or fallback to demoProducts to ensure server-verified prices & stock
    const supabase = createClient();
    let dbProducts = demoProducts;

    if (supabase) {
      const { data } = await supabase.from("products").select("*").eq("is_active", true);
      if (data && data.length > 0) {
        dbProducts = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          slug: d.slug,
          category: d.category_name || d.category || "Jewellery",
          price: d.price,
          description: d.description || "",
          image: d.image_url,
          stock: d.stock ?? 0,
          sku: d.sku || "OWL-000"
        }));
      }
    }

    // 2. Validate availability and calculate totals strictly on server
    const orderLines = [];
    for (const item of items) {
      const product = dbProducts.find(p => p.id === item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found or is currently unavailable.` },
          { status: 400 }
        );
      }
      if (item.quantity > product.stock) {
        return NextResponse.json(
          { error: `Requested quantity for "${product.name}" exceeds available stock (Only ${product.stock} available).` },
          { status: 400 }
        );
      }

      orderLines.push({
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        variant_info: item.variant || "Standard",
        unit_price: product.price,
        quantity: item.quantity,
        line_total: product.price * item.quantity,
        image_url: product.image
      });
    }

    const subtotal = orderLines.reduce((sum, line) => sum + line.line_total, 0);

    // 3. Validate coupon code server-side
    let discount = 0;
    if (couponCode) {
      const cleanCoupon = couponCode.trim().toUpperCase();
      if (cleanCoupon === "OWLFIRST10") {
        discount = Math.min(Math.round(subtotal * 0.1), 500);
      } else if (cleanCoupon === "SHINE200") {
        if (subtotal >= 1999) {
          discount = 200;
        }
      }
    }

    // 4. Calculate shipping fee server-side: free if subtotal >= 999, else 99
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const finalAmount = Math.max(0, subtotal - discount + shippingFee);

    // 5. Generate unique public order number
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const orderNumber = `OWL-${randomHex}`;

    // 6. Check if Razorpay credentials exist
    const hasRazorpay = Boolean(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    );

    let razorpayOrder = null;

    if (hasRazorpay) {
      try {
        // Razorpay expects amount in paise (1 INR = 100 paise)
        razorpayOrder = await createRazorpayOrder({
          amount: finalAmount * 100,
          currency: "INR",
          receipt: orderNumber,
          notes: {
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            order_number: orderNumber
          }
        });
      } catch (err: any) {
        console.error("Razorpay order creation error:", err);
        return NextResponse.json(
          { error: `Payment gateway error: ${err.message || "Failed to initiate payment."}` },
          { status: 500 }
        );
      }
    }

    // 7. Persist order in Supabase if configured
    let savedOrderId = orderNumber;
    if (supabase) {
      try {
        const { data: orderData, error: orderErr } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            shipping_address: customer,
            subtotal,
            shipping_fee: shippingFee,
            discount,
            total: finalAmount,
            currency: "INR",
            payment_provider: hasRazorpay ? "razorpay" : "demo_offline",
            payment_reference: razorpayOrder?.id || null,
            payment_status: "pending",
            order_status: "confirmed"
          })
          .select("id")
          .single();

        if (orderData?.id) {
          savedOrderId = orderData.id;
          // Insert order items
          const itemsToInsert = orderLines.map(l => ({
            order_id: orderData.id,
            product_id: l.product_id,
            product_name: l.product_name,
            sku: l.sku,
            variant_info: l.variant_info,
            unit_price: l.unit_price,
            quantity: l.quantity,
            line_total: l.line_total,
            image_url: l.image_url
          }));
          await supabase.from("order_items").insert(itemsToInsert);

          // Insert payment record
          if (razorpayOrder) {
            await supabase.from("payments").insert({
              order_id: orderData.id,
              payment_provider: "razorpay",
              provider_order_id: razorpayOrder.id,
              amount: finalAmount,
              currency: "INR",
              verification_status: "pending",
              raw_response: razorpayOrder
            });
          }

          // Initialise shipping fulfillment record
          await supabase.from("shipping_fulfilment").insert({
            order_id: orderData.id,
            shipping_method: "Standard Insured Delivery",
            shipping_cost: shippingFee
          });
        }
      } catch (dbErr) {
        console.error("Database order insertion error (continuing with session):", dbErr);
      }
    }

    // 8. Return response
    if (hasRazorpay && razorpayOrder) {
      return NextResponse.json({
        mode: "razorpay",
        orderId: savedOrderId,
        orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
        customer,
        summary: {
          subtotal,
          shippingFee,
          discount,
          total: finalAmount
        }
      });
    }

    // Demo / Test mode fallback
    return NextResponse.json({
      mode: "demo",
      orderId: savedOrderId,
      orderNumber,
      customer,
      summary: {
        subtotal,
        shippingFee,
        discount,
        total: finalAmount
      },
      message: "Order confirmed in test / demo mode. Razorpay gateway keys pending configuration."
    });
  } catch (error: any) {
    console.error("Checkout POST Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during checkout." },
      { status: 500 }
    );
  }
}
