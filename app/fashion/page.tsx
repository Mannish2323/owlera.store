"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { demoProducts, Product } from "@/lib/products";

function FashionContent() {
  const [products, setProducts] = useState<Product[]>(
    demoProducts.filter(p =>
      p.category.toLowerCase().includes("fashion") ||
      p.category.toLowerCase().includes("clothing") ||
      p.categorySlug === "fashion"
    )
  );
  const [selectedTag, setSelectedTag] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  useEffect(() => {
    fetch("/api/products")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.products?.length > 0) {
          const fetched = data.products.filter((p: Product) =>
            p.category.toLowerCase().includes("fashion") ||
            p.category.toLowerCase().includes("clothing") ||
            p.categorySlug === "fashion"
          );
          if (fetched.length > 0) setProducts(fetched);
        }
      })
      .catch(() => {});
  }, []);

  const subcategories = [
    { id: "all", label: "All" },
    { id: "anime", label: "Anime" },
    { id: "minimal", label: "Minimal" },
    { id: "oversized", label: "Oversized" },
    { id: "graphic", label: "Graphic" },
    { id: "hoodie", label: "Hoodies" }
  ];

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        if (selectedTag !== "all") {
          const match =
            p.name.toLowerCase().includes(selectedTag) ||
            p.description.toLowerCase().includes(selectedTag) ||
            (p.badge && p.badge.toLowerCase().includes(selectedTag));
          if (!match) return false;
        }
        if (priceRange === "under-500" && p.price >= 500) return false;
        if (priceRange === "500-1000" && (p.price < 500 || p.price > 1000)) return false;
        if (priceRange === "above-1000" && p.price <= 1000) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, selectedTag, priceRange, sortBy]);

  return (
    <>
      <Header />
      <main className="android-category-view">
        {/* Category Hero Banner (Matches Screen 3) */}
        <section className="category-hero-banner clothing-hero">
          <div className="category-hero-backdrop">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85"
              alt="Clothing collection apparel"
              className="category-hero-img"
            />
            <div className="category-hero-overlay" />
          </div>
          <div className="wrap category-hero-content">
            <h1 className="category-hero-title">Clothing</h1>
            <p className="category-hero-subtitle">Wear Your Story</p>
          </div>
        </section>

        {/* Sub-Category Pills (Matches Screen 3) */}
        <div className="wrap subcategory-pills-bar">
          <div className="subcategory-pills-scroll">
            {subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedTag(sub.id)}
                className={`subcategory-pill ${selectedTag === sub.id ? "active" : ""}`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid & Products */}
        <div className="wrap" style={{ paddingTop: "14px", paddingBottom: "70px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <p style={{ color: "var(--secondary-text)", fontSize: "14px" }}>No items found in this subcategory.</p>
              <button onClick={() => setSelectedTag("all")} className="btn btn-primary" style={{ marginTop: "12px" }}>
                View All Clothing
              </button>
            </div>
          ) : (
            <div className="android-products-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function FashionPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>Loading…</div>}>
      <FashionContent />
    </Suspense>
  );
}
