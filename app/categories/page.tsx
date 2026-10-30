import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getCategories, getProducts } from "@/lib/products";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  const newArrivals = [
    products.find(p => p.slug === "lavender-aromatherapy-candle") || products[0],
    products.find(p => p.slug === "rudraksha-bead-bracelet") || products[1],
    products.find(p => p.slug === "mata-ne-graphic-tee") || products[2],
    products.find(p => p.slug === "botanical-crystal-prosperity-tree") || products[3]
  ].filter(Boolean);

  return (
    <>
      <Header />

      <main className="wrap" style={{ paddingTop: "20px", paddingBottom: "70px" }}>
        {/* Title */}
        <div style={{ marginBottom: "20px" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 5vw, 32px)",
              color: "var(--deep-charcoal)",
              fontWeight: 500,
              margin: 0
            }}
          >
            All Categories
          </h1>
        </div>

        {/* 4-Column Categories Grid (Matches Screen 2) */}
        <div className="all-categories-grid">
          {categories.map((cat: any) => (
            <Link href={`/${cat.slug}`} key={cat.id} className="all-category-tile">
              <div className="all-category-img-box">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="all-category-overlay" />
              </div>
              <div className="all-category-meta">
                <span className="all-category-title">{cat.name}</span>
                <span className="all-category-count">{cat.count || 50}+ Items</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Thoughtful Gifts Banner (Matches Screen 2) */}
        <div className="android-promo-section" style={{ marginTop: "28px" }}>
          <Link href="/gifts" className="android-promo-card gifts-promo">
            <div className="promo-card-content">
              <span className="promo-badge">Thoughtful Gifts</span>
              <h3 className="promo-title">For Every Occasion</h3>
              <div className="promo-btn-wrap">
                <span className="promo-pill-btn">
                  Explore Gifts <ArrowRight size={13} />
                </span>
              </div>
            </div>
            <div className="promo-card-image">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=85"
                alt="Luxury curated gift box"
                loading="lazy"
              />
            </div>
          </Link>
        </div>

        {/* New Arrivals (Matches Screen 2) */}
        <section className="section-compact" style={{ marginTop: "24px" }} id="new-arrivals">
          <div className="compact-section-header">
            <h2 className="compact-section-title">New Arrivals</h2>
            <Link href="/shop?filter=new" className="compact-section-link">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="android-products-grid">
            {newArrivals.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

