import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createClient();
  if (supabase) {
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && coupons) {
      return NextResponse.json({ coupons, source: "supabase" });
    }
  }

  // Fallback default coupons for store bootstrapping
  return NextResponse.json({
    coupons: [
      {
        id: "c-1",
        code: "OWLFIRST10",
        discount_type: "percentage",
        discount_value: 10,
        min_order_value: 0,
        max_discount: 500,
        usage_limit: 1000,
        times_used: 12,
        is_active: true,
        expires_at: null
      },
      {
        id: "c-2",
        code: "SHINE200",
        discount_type: "fixed",
        discount_value: 200,
        min_order_value: 1999,
        max_discount: 200,
        usage_limit: 500,
        times_used: 5,
        is_active: true,
        expires_at: null
      }
    ],
    source: "default"
  });
}

export async function POST(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const {
      code,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      usage_limit,
      expires_at,
      is_active
    } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, "");
    const type = discount_type === "fixed" ? "fixed" : "percentage";
    const value = parseInt(discount_value, 10);

    if (isNaN(value) || value <= 0) {
      return NextResponse.json({ error: "Discount value must be greater than 0." }, { status: 400 });
    }

    if (type === "percentage" && value > 100) {
      return NextResponse.json({ error: "Percentage discount cannot exceed 100%." }, { status: 400 });
    }

    const minOrder = min_order_value ? Math.max(0, parseInt(min_order_value, 10)) : 0;
    const maxDisc = max_discount ? parseInt(max_discount, 10) : null;
    const limit = usage_limit ? parseInt(usage_limit, 10) : null;

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("coupons")
        .insert({
          code: cleanCode,
          discount_type: type,
          discount_value: value,
          min_order_value: minOrder,
          max_discount: maxDisc,
          usage_limit: limit,
          expires_at: expires_at || null,
          is_active: is_active !== undefined ? Boolean(is_active) : true
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, coupon: data });
    }

    return NextResponse.json({
      success: true,
      message: "Coupon created in demo mode.",
      coupon: { code: cleanCode, discount_type: type, discount_value: value, is_active: true }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create coupon" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, is_active, discount_value, min_order_value, max_discount, usage_limit, expires_at } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      const updateData: Record<string, any> = {};
      if (is_active !== undefined) updateData.is_active = Boolean(is_active);
      if (discount_value !== undefined) updateData.discount_value = parseInt(discount_value, 10);
      if (min_order_value !== undefined) updateData.min_order_value = parseInt(min_order_value, 10);
      if (max_discount !== undefined) updateData.max_discount = max_discount ? parseInt(max_discount, 10) : null;
      if (usage_limit !== undefined) updateData.usage_limit = usage_limit ? parseInt(usage_limit, 10) : null;
      if (expires_at !== undefined) updateData.expires_at = expires_at || null;

      const { data, error } = await supabase
        .from("coupons")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, coupon: data });
    }

    return NextResponse.json({ success: true, message: "Coupon updated." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete coupon" }, { status: 500 });
  }
}
