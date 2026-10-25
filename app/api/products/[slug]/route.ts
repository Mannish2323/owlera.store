import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "Product slug is required." }, { status: 400 });
    }

    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: `Product with slug "${slug}" not found.` }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Failed to fetch product by slug:", error);
    return NextResponse.json({ error: "Failed to fetch product details." }, { status: 500 });
  }
}
