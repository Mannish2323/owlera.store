import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");

    const allProducts = await getProducts();

    let filtered = allProducts;

    if (category && category !== "all") {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(
        p => p.category.toLowerCase() === catLower || p.categorySlug?.toLowerCase() === catLower
      );
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      products: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to retrieve products." }, { status: 500 });
  }
}
