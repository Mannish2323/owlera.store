import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { verifyAdmin } from "@/lib/admin-auth";
import { demoCategories } from "@/lib/products";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ categories: data, source: "supabase" });
    }
  }

  // Fallback to core OWLERA categories if database has no rows
  return NextResponse.json({
    categories: demoCategories.map((c, idx) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.image,
      display_order: idx + 1,
      is_active: true,
      count: c.count || 0
    })),
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
    const { name, slug, description, image_url, display_order, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const cleanSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const supabase = createClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: name.trim(),
          slug: cleanSlug,
          description: description || "",
          image_url: image_url || "",
          display_order: display_order ? parseInt(display_order, 10) : 0,
          is_active: is_active !== undefined ? Boolean(is_active) : true
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Revalidate storefront navigation and category pages
      try {
        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath(`/${cleanSlug}`);
      } catch {}

      return NextResponse.json({ success: true, category: data });
    }

    return NextResponse.json({
      success: true,
      message: "Category created in memory (Supabase not configured).",
      category: { id: `cat-${Date.now()}`, name, slug: cleanSlug, is_active: true }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, name, slug, description, image_url, display_order, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name.trim();
      if (slug !== undefined) updateData.slug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      if (description !== undefined) updateData.description = description;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (display_order !== undefined) updateData.display_order = parseInt(display_order, 10);
      if (is_active !== undefined) updateData.is_active = Boolean(is_active);

      const { data, error } = await supabase
        .from("categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      try {
        revalidatePath("/");
        revalidatePath("/shop");
        if (data.slug) revalidatePath(`/${data.slug}`);
      } catch {}

      return NextResponse.json({ success: true, category: data });
    }

    return NextResponse.json({ success: true, message: "Category updated." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update category" }, { status: 500 });
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
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    const supabase = createClient();
    if (supabase) {
      // Safety check: check if any products are assigned to this category
      const { data: linkedProducts } = await supabase
        .from("products")
        .select("id")
        .eq("category_id", id)
        .limit(1);

      if (linkedProducts && linkedProducts.length > 0) {
        return NextResponse.json(
          {
            error: "Cannot delete category: Active products are currently assigned to it. Reassign products first or mark the category inactive."
          },
          { status: 409 }
        );
      }

      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      try {
        revalidatePath("/");
        revalidatePath("/shop");
      } catch {}
    }

    return NextResponse.json({ success: true, message: "Category deleted safely." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete category" }, { status: 500 });
  }
}
