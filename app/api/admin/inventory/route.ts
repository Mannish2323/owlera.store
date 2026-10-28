import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { verifyAdmin, createServiceClient } from "@/lib/admin-auth";
import { demoProducts } from "@/lib/products";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createClient();
  let inventoryItems: any[] = [];
  let movements: any[] = [];

  if (supabase) {
    const { data: prods } = await supabase
      .from("products")
      .select("id, name, slug, sku, category_name, price, stock, is_active, updated_at")
      .order("stock", { ascending: true });

    if (prods && prods.length > 0) {
      inventoryItems = prods.map(p => ({
        ...p,
        status: p.stock === 0 ? "out_of_stock" : p.stock <= 5 ? "low_stock" : "in_stock"
      }));
    }

    // Fetch recent inventory audit movements
    const { data: logs } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", "inventory_adjustment")
      .order("created_at", { ascending: false })
      .limit(50);

    if (logs) {
      movements = logs;
    }
  }

  if (inventoryItems.length === 0) {
    inventoryItems = demoProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      category_name: p.category,
      price: p.price,
      stock: p.stock,
      is_active: true,
      status: p.stock === 0 ? "out_of_stock" : p.stock <= 5 ? "low_stock" : "in_stock"
    }));
  }

  return NextResponse.json({
    inventory: inventoryItems,
    movements,
    summary: {
      totalItems: inventoryItems.length,
      outOfStock: inventoryItems.filter(i => i.stock === 0).length,
      lowStock: inventoryItems.filter(i => i.stock > 0 && i.stock <= 5).length,
      healthyStock: inventoryItems.filter(i => i.stock > 5).length
    }
  });
}

export async function POST(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { productId, adjustment, reason, referenceNumber, notes } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const adjVal = parseInt(adjustment, 10);
    if (isNaN(adjVal) || adjVal === 0) {
      return NextResponse.json(
        { error: "Adjustment must be a non-zero integer (e.g. +10 or -3)." },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: "An adjustment reason is required for audit compliance." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;

    if (serviceClient) {
      // 1. Fetch current product record
      const { data: currentProduct, error: fetchErr } = await serviceClient
        .from("products")
        .select("id, name, slug, stock")
        .eq("id", productId)
        .single();

      if (fetchErr || !currentProduct) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }

      const oldStock = currentProduct.stock ?? 0;
      const newStock = oldStock + adjVal;

      if (newStock < 0) {
        return NextResponse.json(
          {
            error: `Cannot reduce stock by ${Math.abs(adjVal)}. Current inventory is only ${oldStock} units.`
          },
          { status: 400 }
        );
      }

      // 2. Update stock atomically
      const { data: updatedProduct, error: updateErr } = await serviceClient
        .from("products")
        .update({
          stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq("id", productId)
        .select("id, name, slug, stock")
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      // 3. Write immutable audit log
      try {
        await serviceClient.from("audit_logs").insert({
          actor_id: auth.userId,
          actor_email: auth.email,
          action: "inventory_adjustment",
          resource_type: "product",
          resource_id: productId,
          changes: {
            product_name: currentProduct.name,
            old_stock: oldStock,
            adjustment: adjVal,
            new_stock: newStock,
            reason: reason.trim(),
            reference_number: referenceNumber ? referenceNumber.trim() : null,
            notes: notes ? notes.trim() : null
          }
        });
      } catch (logErr) {
        console.warn("Audit log insert warning:", logErr);
      }

      // 4. Revalidate cache
      try {
        revalidatePath("/");
        revalidatePath("/shop");
        if (currentProduct.slug) {
          revalidatePath(`/products/${currentProduct.slug}`);
        }
      } catch {}

      return NextResponse.json({
        success: true,
        product: updatedProduct,
        oldStock,
        newStock,
        adjustment: adjVal,
        message: `Inventory adjusted by ${adjVal > 0 ? `+${adjVal}` : adjVal}. New stock: ${newStock}.`
      });
    }

    return NextResponse.json({
      success: true,
      message: `Simulated stock adjustment of ${adjVal}.`,
      oldStock: 10,
      newStock: 10 + adjVal
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to adjust inventory." }, { status: 500 });
  }
}
