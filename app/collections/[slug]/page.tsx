import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { demoCollections, getProducts } from "@/lib/products";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = demoCollections.find(c => c.slug === params.slug);

  if (!collection) {
    notFound();
  }

  const allProducts = await getProducts();
  const collectionProducts = allProducts.filter(p =>
    collection.productIds.includes(p.id) ||
    p.category.toLowerCase().includes(collection.slug.replace("-", " "))
  );

  return (
    <>
      <Header />

      <main>
        {/* Collection Hero Banner */}
        <section
          style={{
            position: "relative",
            minHeight: "360px",
            display: "flex",
            alignItems: "center",
            backgroundImage: `linear-gradient(rgba(30, 33, 30, 0.75), rgba(30, 33, 30, 0.9)), url('${collection.bannerImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "var(--warm-cream)",
            padding: "60px 0"
          }}
        >
          <div className="wrap">
            <Link
              href="/#collections"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--bronze-gold)",
                fontSize: "12px",
                marginBottom: "20px"
              }}
            >
              <ArrowLeft size={14} /> Back to Collections
            </Link>
            <p className="eyebrow" style={{ color: "var(--bronze-gold)" }}>
              <Sparkles size={14} /> OWLERA SIGNATURE EDIT
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(40px, 5vw, 60px)",
                fontWeight: 400,
                margin: "10px 0 16px",
                color: "var(--warm-cream)"
              }}
            >
              {collection.name}
            </h1>
            <p
              style={{
                fontSize: "15px",
                maxWidth: "540px",
                lineHeight: "1.8",
                color: "rgba(247, 243, 233, 0.9)"
              }}
            >
              {collection.description}
            </p>
          </div>
        </section>

        {/* Collection Products */}
        <section className="section wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">CURATED SELECTION</p>
              <h2 className="section-title">
                {collectionProducts.length} {collectionProducts.length === 1 ? "Piece" : "Pieces"} in this Suite
              </h2>
            </div>
            <Link href="/shop" className="section-link">
              Explore All Categories <ArrowRight size={14} />
            </Link>
          </div>

          {collectionProducts.length === 0 ? (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                padding: "60px 24px",
                textAlign: "center",
                borderRadius: "var(--radius-sm)"
              }}
            >
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px" }}>
                New pieces arriving shortly
              </h3>
              <p style={{ color: "var(--secondary-text)", fontSize: "13px", margin: "10px 0 20px" }}>
                Our artisans are currently assembling the next batch for this collection.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Browse Active Store
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {collectionProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
