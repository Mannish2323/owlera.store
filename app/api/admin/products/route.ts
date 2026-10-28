import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { verifyAdmin, createServiceClient } from "@/lib/admin-auth";
import { demoProducts } from "@/lib/products";

export async function GET(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase().trim();
  const category = searchParams.get("category");
  const stockFilter = searchParams.get("stock"); // 'all', 'low', 'out'

  const supabase = createClient();
  if (supabase) {
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category_name", category);
    }

    const { data, error } = await query;

    if (!error && data) {
      let filtered = data;
      if (search) {
        filtered = filtered.filter(
          p =>
            p.name.toLowerCase().includes(search) ||
            p.sku?.toLowerCase().includes(search) ||
            p.category_name?.toLowerCase().includes(search)
        );
      }
      if (stockFilter === "out") {
        filtered = filtered.filter(p => (p.stock ?? 0) === 0);
      } else if (stockFilter === "low") {
        filtered = filtered.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5);
      }
      return NextResponse.json({ products: filtered, total: filtered.length, source: "supabase" });
    }
  }

  // Fallback to demo catalogue
  let filteredDemo = demoProducts;
  if (category && category !== "all") {
    filteredDemo = filteredDemo.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    filteredDemo = filteredDemo.filter(
      p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }
  if (stockFilter === "out") {
    filteredDemo = filteredDemo.filter(p => p.stock === 0);
  } else if (stockFilter === "low") {
    filteredDemo = filteredDemo.filter(p => p.stock > 0 && p.stock <= 5);
  }

  return NextResponse.json({ products: filteredDemo, total: filteredDemo.length, source: "demo" });
}

export async function POST(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

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
      gallery,
      stock,
      sku,
      badge,
      featured,
      isNew,
      isActive,
      specifications,
      seoTitle,
      seoDescription
    } = body;

    if (!name || price === undefined || price === null || !category) {
      return NextResponse.json(
        { error: "Product name, category, and price are required fields." },
        { status: 400 }
      );
    }

    const numPrice = parseInt(price, 10);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: "Price must be a valid non-negative integer." }, { status: 400 });
    }

    const numStock = parseInt(stock || "0", 10);
    if (isNaN(numStock) || numStock < 0) {
      return NextResponse.json({ error: "Stock must be a non-negative integer." }, { status: 400 });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;

    if (serviceClient) {
      const { data, error } = await serviceClient
        .from("products")
        .insert({
          name: name.trim(),
          slug: generatedSlug,
          category_name: category,
          description: description || "",
          price: numPrice,
          compare_at: compareAt ? parseInt(compareAt, 10) : null,
          image_url: image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
          gallery_urls: Array.isArray(gallery) ? gallery : [],
          stock: numStock,
          sku: sku || `OWL-${Date.now().toString().slice(-4)}`,
          badge: badge || null,
          is_active: isActive !== undefined ? Boolean(isActive) : true,
          is_featured: Boolean(featured),
          is_new: Boolean(isNew),
          specifications: specifications || {},
          seo_title: seoTitle || name,
          seo_description: seoDescription || description || ""
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Revalidate all storefront routes that display products
      try {
        revalidatePath("/", "layout");
        revalidatePath("/shop");
        revalidatePath(`/products/${generatedSlug}`);
      } catch {}

      return NextResponse.json({ success: true, product: data });
    }

    return NextResponse.json({
      success: true,
      message: "Product simulated in demo mode.",
      product: { ...body, id: `demo-${Date.now()}`, slug: generatedSlug }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;

    if (serviceClient) {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (updates.name !== undefined) updatePayload.name = updates.name.trim();
      if (updates.slug !== undefined) {
        updatePayload.slug = updates.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      }
      if (updates.category !== undefined) updatePayload.category_name = updates.category;
      if (updates.price !== undefined) {
        const p = parseInt(updates.price, 10);
        if (isNaN(p) || p < 0) return NextResponse.json({ error: "Invalid price." }, { status: 400 });
        updatePayload.price = p;
      }
      if (updates.compareAt !== undefined) {
        updatePayload.compare_at = updates.compareAt ? parseInt(updates.compareAt, 10) : null;
      }
      if (updates.stock !== undefined) {
        const s = parseInt(updates.stock, 10);
        if (isNaN(s) || s < 0) return NextResponse.json({ error: "Invalid stock." }, { status: 400 });
        updatePayload.stock = s;
      }
      if (updates.sku !== undefined) updatePayload.sku = updates.sku.trim();
      if (updates.badge !== undefined) updatePayload.badge = updates.badge;
      if (updates.image !== undefined) updatePayload.image_url = updates.image;
      if (updates.gallery !== undefined) updatePayload.gallery_urls = updates.gallery;
      if (updates.description !== undefined) updatePayload.description = updates.description;
      if (updates.isActive !== undefined) updatePayload.is_active = Boolean(updates.isActive);
      if (updates.featured !== undefined) updatePayload.is_featured = Boolean(updates.featured);
      if (updates.isNew !== undefined) updatePayload.is_new = Boolean(updates.isNew);
      if (updates.specifications !== undefined) updatePayload.specifications = updates.specifications;
      if (updates.seoTitle !== undefined) updatePayload.seo_title = updates.seoTitle;
      if (updates.seoDescription !== undefined) updatePayload.seo_description = updates.seoDescription;

      const { data, error } = await serviceClient
        .from("products")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Revalidate storefront cache
      try {
        revalidatePath("/", "layout");
        revalidatePath("/shop");
        if (data.slug) revalidatePath(`/products/${data.slug}`);
      } catch {}

      return NextResponse.json({ success: true, product: data });
    }

    return NextResponse.json({ success: true, message: "Updated in demo mode." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
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
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    const serviceClient = createServiceClient() || supabase;

    if (serviceClient) {
      const { data: prod } = await serviceClient.from("products").select("slug").eq("id", id).single();
      const { error } = await serviceClient.from("products").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      try {
        revalidatePath("/", "layout");
        revalidatePath("/shop");
        if (prod?.slug) revalidatePath(`/products/${prod.slug}`);
      } catch {}
    }

    return NextResponse.json({ success: true, message: "Product permanently removed from catalogue." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete product" }, { status: 500 });
  }
}
