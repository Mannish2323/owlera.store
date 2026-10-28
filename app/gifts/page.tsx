"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { Gift, RotateCcw } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { demoProducts, Product } from "@/lib/products";

function GiftsContent() {
  const [products, setProducts] = useState<Product[]>(
    demoProducts.filter(p =>
      p.category.toLowerCase().includes("gift") ||
      p.categorySlug === "gifts" ||
      p.categorySlug === "gifting"
    )
  );
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.products?.length > 0) {
          const matched = data.products.filter((p: Product) =>
            p.category.toLowerCase().includes("gift") ||
            p.categorySlug === "gifts" ||
            p.categorySlug === "gifting"
          );
          if (matched.length > 0) setProducts(matched);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        if (inStockOnly && p.stock <= 0) return false;
        if (priceRange === "under-3000" && p.price >= 3000) return false;
        if (priceRange === "above-3000" && p.price < 3000) return false;
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
            background: "linear-gradient(rgba(18, 61, 46, 0.88), rgba(18, 61, 46, 0.94)), url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=85') center/cover",
            color: "#FFFFFF",
            padding: "80px 0 60px",
            textAlign: "center"
          }}
        >
          <div className="wrap" style={{ maxWidth: "700px" }}>
            <p className="eyebrow" style={{ color: "var(--gold-light)", justifyContent: "center" }}>
              <Gift size={13} style={{ display: "inline", marginRight: "6px" }} />
              SIGNATURE PRESENTATION
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "42px",
                margin: "8px 0 16px",
                color: "#FFFFFF",
                fontWeight: 400
              }}
            >
              Curated Gift Suites
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: "1.7", margin: "0 auto" }}>
              Thoughtfully composed pairings presented in OWLERA’s signature forest green and warm gold presentation boxes with handwritten personalized messages.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="wrap" style={{ padding: "32px 0 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border-color)"
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "var(--secondary-text)", fontWeight: 600 }}>PRICE:</span>
              {[
                { id: "all", label: "All" },
                { id: "under-3000", label: "Under ₹3,000" },
                { id: "above-3000", label: "Above ₹3,000" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPriceRange(opt.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    border: priceRange === opt.id ? "1px solid var(--forest-green)" : "1px solid var(--border-color)",
                    background: priceRange === opt.id ? "var(--forest-green)" : "#FFFFFF",
                    color: priceRange === opt.id ? "#FFFFFF" : "var(--primary-text)",
                    cursor: "pointer"
                  }}
                >
                  {opt.label}
                </button>
              ))}

              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", marginLeft: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                />
                In Stock Only
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--secondary-text)" }}>
                {filtered.length} {filtered.length === 1 ? "suite" : "suites"}
              </span>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="sort-select"
                aria-label="Sort gift suites"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {(priceRange !== "all" || inStockOnly || sortBy !== "newest") && (
                <button onClick={reset} className="icon-btn" title="Reset Filters">
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="wrap" style={{ paddingBottom: "80px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "var(--secondary-text)", fontSize: "14px" }}>
                No gift suites match your current selection.
              </p>
              <button onClick={reset} className="btn btn-outline" style={{ marginTop: "12px" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function GiftsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px" }}>Preparing gift edit…</div>}>
      <GiftsContent />
    </Suspense>
  );
}
