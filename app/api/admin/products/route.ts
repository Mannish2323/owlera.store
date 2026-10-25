import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { demoProducts } from "@/lib/products";

export async function GET() {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return NextResponse.json({ products: data, source: "supabase" });
    }
  }
  return NextResponse.json({ products: demoProducts, source: "demo" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      category,
      price,
      compareAt,
      description,
      image,
      stock,
      sku,
      badge,
      featured,
      isNew,
      specifications
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Product name, category, and price are required." },
        { status: 400 }
      );
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const supabase = createClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name,
          slug: generatedSlug,
          category_name: category,
          description: description || "",
          price: parseInt(price, 10),
          compare_at: compareAt ? parseInt(compareAt, 10) : null,
          image_url: image || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
          stock: parseInt(stock || "0", 10),
          sku: sku || `OWL-${Date.now().toString().slice(-4)}`,
          badge: badge || null,
          is_featured: Boolean(featured),
          is_new: Boolean(isNew),
          specifications: specifications || {}
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, product: data });
    }

    return NextResponse.json({
      success: true,
      message: "Product simulated in demo mode (Configure Supabase to persist).",
      product: { ...body, id: `demo-${Date.now()}`, slug: generatedSlug }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: updates.name,
          price: updates.price ? parseInt(updates.price, 10) : undefined,
          compare_at: updates.compareAt ? parseInt(updates.compareAt, 10) : null,
          stock: updates.stock !== undefined ? parseInt(updates.stock, 10) : undefined,
          is_active: updates.isActive,
          is_featured: updates.featured,
          description: updates.description,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, product: data });
    }

    return NextResponse.json({ success: true, message: "Updated in demo mode." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Product removed." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
