"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { demoProducts, Product } from "@/lib/products";

function Content() {
  const [products, setProducts] = useState<Product[]>(
    demoProducts.filter(p =>
      p.category.toLowerCase().includes("room") ||
      (p.categorySlug && p.categorySlug.includes("room"))
    )
  );

  useEffect(() => {
    fetch("/api/products")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.products?.length > 0) {
          const matched = data.products.filter((p: Product) =>
            p.category.toLowerCase().includes("room") ||
            (p.categorySlug && p.categorySlug.includes("room"))
          );
          if (matched.length > 0) setProducts(matched);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="android-category-view">
        <section className="category-hero-banner">
          <div className="category-hero-backdrop">
            <img
              src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1200&q=85"
              alt="Room Fresheners Collection"
              className="category-hero-img"
            />
            <div className="category-hero-overlay" />
          </div>
          <div className="wrap category-hero-content">
            <h1 className="category-hero-title">Room Fresheners</h1>
            <p className="category-hero-subtitle">Artisanal reed diffusers & natural room mists</p>
          </div>
        </section>

        <div className="wrap" style={{ paddingTop: "14px", paddingBottom: "70px" }}>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <p style={{ color: "var(--secondary-text)", fontSize: "14px" }}>Handcrafting new additions for this department.</p>
              <Link href="/categories" className="btn btn-primary" style={{ marginTop: "12px" }}>
                Browse All Categories
              </Link>
            </div>
          ) : (
            <div className="android-products-grid">
              {products.map(product => (
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

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>Loading…</div>}>
      <Content />
    </Suspense>
  );
}
