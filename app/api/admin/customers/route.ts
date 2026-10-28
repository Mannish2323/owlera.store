import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase().trim();

  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({
      customers: [],
      source: "none",
      message: "Database not configured."
    });
  }

  try {
    // 1. Fetch user profiles (customer role or all profiles)
    let profilesQuery = supabase
      .from("profiles")
      .select("id, name, email, phone, role, created_at")
      .order("created_at", { ascending: false });

    const { data: profiles, error: profileErr } = await profilesQuery;

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    // 2. Fetch all orders to compute order statistics per customer
    const { data: orders } = await supabase
      .from("orders")
      .select("id, customer_email, customer_phone, total, payment_status, created_at, shipping_address");

    // 3. Map statistics
    const emailToStats = new Map<string, { totalOrders: number; totalSpend: number; lastOrderAt: string | null; sampleAddress: any }>();

    if (orders) {
      for (const ord of orders) {
        const emailKey = (ord.customer_email || "").toLowerCase().trim();
        if (!emailKey) continue;

        const current = emailToStats.get(emailKey) || {
          totalOrders: 0,
          totalSpend: 0,
          lastOrderAt: null,
          sampleAddress: ord.shipping_address
        };

        current.totalOrders += 1;
        if (ord.payment_status === "paid") {
          current.totalSpend += ord.total || 0;
        }

        if (!current.lastOrderAt || new Date(ord.created_at) > new Date(current.lastOrderAt)) {
          current.lastOrderAt = ord.created_at;
          current.sampleAddress = ord.shipping_address;
        }

        emailToStats.set(emailKey, current);
      }
    }

    // Combine profiles with computed metrics
    let customerList = (profiles || []).map(p => {
      const emailKey = (p.email || "").toLowerCase().trim();
      const stats = emailToStats.get(emailKey) || {
        totalOrders: 0,
        totalSpend: 0,
        lastOrderAt: null,
        sampleAddress: null
      };

      return {
        id: p.id,
        name: p.name || "Customer",
        email: p.email,
        phone: p.phone || "—",
        role: p.role,
        registeredAt: p.created_at,
        totalOrders: stats.totalOrders,
        totalSpend: stats.totalSpend,
        lastOrderAt: stats.lastOrderAt,
        shippingAddress: stats.sampleAddress
      };
    });

    // Also include guest checkout customers from orders who may not have created accounts
    for (const [email, stats] of emailToStats.entries()) {
      const exists = customerList.some(c => (c.email || "").toLowerCase().trim() === email);
      if (!exists && email) {
        customerList.push({
          id: `guest-${Buffer.from(email).toString("hex").slice(0, 8)}`,
          name: stats.sampleAddress?.name || email.split("@")[0],
          email: email,
          phone: stats.sampleAddress?.phone || "—",
          role: "customer (guest)",
          registeredAt: stats.lastOrderAt || new Date().toISOString(),
          totalOrders: stats.totalOrders,
          totalSpend: stats.totalSpend,
          lastOrderAt: stats.lastOrderAt,
          shippingAddress: stats.sampleAddress
        });
      }
    }

    // Apply search filter if provided
    if (query) {
      customerList = customerList.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.phone?.includes(query)
      );
    }

    return NextResponse.json({
      customers: customerList,
      totalCount: customerList.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch customers" }, { status: 500 });
  }
}
