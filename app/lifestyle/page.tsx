"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, RotateCcw } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { demoProducts, Product } from "@/lib/products";

function LifestyleContent() {
  const [products, setProducts] = useState<Product[]>(
    demoProducts.filter(p => p.category.toLowerCase() === "lifestyle")
  );
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.products?.length > 0) {
          setProducts(data.products.filter((p: Product) =>
            p.category.toLowerCase() === "lifestyle"
          ));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        if (inStockOnly && p.stock <= 0) return false;
        if (priceRange === "under-1500" && p.price >= 1500) return false;
        if (priceRange === "1500-2500" && (p.price < 1500 || p.price > 2500)) return false;
        if (priceRange === "above-2500" && p.price <= 2500) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, priceRange, sortBy, inStockOnly]);

  const reset = () => {
    setPriceRange("all");
    setSortBy("newest");
    setInStockOnly(false);
  };

  return (
    <>
      <Header />
      <main>
        {/* Category Hero */}
        <section
          style={{
            background: "linear-gradient(135deg, #FDFAF6 0%, var(--soft-cream) 60%, rgba(217, 193, 156, 0.12) 100%)",
            borderBottom: "1px solid var(--border-color)",
            padding: "60px 0 52px"
          }}
        >
          <div className="wrap">
            <nav style={{ fontSize: "12px", color: "var(--secondary-text)", marginBottom: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
              <Link href="/" style={{ color: "var(--secondary-text)" }}>Home</Link>
              <span>›</span>
              <span style={{ color: "var(--deep-charcoal)", fontWeight: 600 }}>Lifestyle</span>
            </nav>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-end", gap: "24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(173, 128, 72, 0.12)", display: "grid", placeItems: "center", color: "var(--bronze-gold)" }}>
                    <Leaf size={20} />
                  </div>
                  <p className="eyebrow">OWLERA ATELIER</p>
                </div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, color: "var(--deep-charcoal)", margin: "0 0 14px", lineHeight: 1.1 }}>
                  Lifestyle <em style={{ fontStyle: "italic", color: "var(--bronze-gold)" }}>& Home</em>
                </h1>
                <p style={{ color: "var(--secondary-text)", fontSize: "15px", maxWidth: "520px", lineHeight: 1.7, margin: 0 }}>
                  Hand-poured botanical soy candles, artisanal brass keepsakes, sculptural home objects and mindful sanctuary finds — curated for those who believe everyday should feel luxurious.
                </p>
              </div>
              <div style={{ textAlign: "right", fontSize: "13px", color: "var(--secondary-text)" }}>
                <b style={{ fontSize: "28px", fontFamily: "var(--font-serif)", color: "var(--deep-charcoal)", display: "block" }}>{filtered.length}</b>
                pieces
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Grid */}
        <div className="wrap" style={{ paddingTop: "36px", paddingBottom: "60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "All Prices" },
                { id: "under-1500", label: "Under ₹1,500" },
                { id: "1500-2500", label: "₹1,500–₹2,500" },
                { id: "above-2500", label: "Above ₹2,500" }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPriceRange(p.id)}
                  style={{
                    padding: "7px 14px",
                    fontSize: "12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor: priceRange === p.id ? "var(--bronze-gold)" : "var(--border-color)",
                    background: priceRange === p.id ? "rgba(173, 128, 72, 0.1)" : "transparent",
                    color: priceRange === p.id ? "var(--bronze-gold)" : "var(--secondary-text)",
                    fontWeight: priceRange === p.id ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {p.label}
                </button>
              ))}
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--secondary-text)", cursor: "pointer" }}>
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
                In Stock Only
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="sort-select"
                aria-label="Sort lifestyle products"
              >
                <option value="newest">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button onClick={reset} style={{ fontSize: "11.5px", color: "var(--secondary-text)", display: "flex", alignItems: "center", gap: "5px" }}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
              <Leaf size={40} color="var(--border-color)" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "var(--deep-charcoal)", margin: "0 0 10px" }}>No items match your filters</h3>
              <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginBottom: "20px" }}>Try adjusting the filters or browse the full catalogue.</p>
              <button onClick={reset} className="btn btn-primary">Reset Filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/shop" className="section-link">
              Browse Complete Catalogue <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function LifestylePage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>Loading…</div>}>
      <LifestyleContent />
    </Suspense>
  );
}
