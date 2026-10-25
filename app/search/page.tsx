"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { demoProducts, Product } from "@/lib/products";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>(demoProducts);

  useEffect(() => {
    fetch("/api/products")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.products?.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(p => {
      // Category match
      if (selectedCategory !== "all" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Query match (name, description, category, tags, sku)
      if (!q) return true;
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      return matchName || matchDesc || matchCat || matchSku;
    });
  }, [products, query, selectedCategory]);

  return (
    <>
      <Header />
      <main>
        {/* Search Header Banner */}
        <section
          style={{
            background: "linear-gradient(180deg, var(--soft-cream) 0%, var(--warm-cream) 100%)",
            borderBottom: "1px solid var(--border-color)",
            padding: "54px 0 46px"
          }}
        >
          <div className="wrap" style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
            <p className="eyebrow" style={{ justifyContent: "center", marginBottom: "8px" }}>
              <Sparkles size={14} /> SEARCH THE ATELIER
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(34px, 4vw, 48px)",
                fontWeight: 400,
                color: "var(--deep-charcoal)",
                margin: "0 0 20px"
              }}
            >
              Find Your Every Day Shine
            </h1>

            {/* Search Input Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#FFFFFF",
                border: "1.5px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 16px",
                boxShadow: "var(--shadow-sm)",
                gap: "12px"
              }}
            >
              <Search size={20} color="var(--bronze-gold)" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by jewellery type, gemstone, material, SKU or style…"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14px",
                  padding: "10px 0",
                  color: "var(--deep-charcoal)",
                  background: "transparent"
                }}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--secondary-text)",
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: "4px 8px"
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Category Chips */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "18px",
                flexWrap: "wrap"
              }}
            >
              {[
                { id: "all", label: "All Items" },
                { id: "jewellery", label: "Jewellery" },
                { id: "fashion", label: "Fashion" },
                { id: "lifestyle", label: "Lifestyle" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "11.5px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor: selectedCategory === cat.id ? "var(--bronze-gold)" : "var(--border-color)",
                    background: selectedCategory === cat.id ? "var(--bronze-gold)" : "#FFFFFF",
                    color: selectedCategory === cat.id ? "#FFFFFF" : "var(--secondary-text)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <div className="wrap" style={{ paddingTop: "36px", paddingBottom: "70px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "16px"
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--secondary-text)" }}>
              {query ? (
                <>
                  Found <b>{results.length}</b> {results.length === 1 ? "result" : "results"} for &ldquo;<b>{query}</b>&rdquo;
                </>
              ) : (
                <>
                  Showing all <b>{results.length}</b> pieces in atelier
                </>
              )}
            </span>

            {(query || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "var(--bronze-gold)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                <RotateCcw size={13} /> Reset search
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              <Search size={44} color="var(--border-color)" style={{ margin: "0 auto 16px" }} />
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "24px",
                  color: "var(--deep-charcoal)",
                  margin: "0 0 10px"
                }}
              >
                No exact matches found
              </h3>
              <p style={{ color: "var(--secondary-text)", fontSize: "13.5px", marginBottom: "24px" }}>
                We couldn&apos;t find any items matching &ldquo;{query}&rdquo;. Try checking the spelling or browse our popular categories.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/jewellery" className="btn btn-outline" style={{ fontSize: "11px", padding: "10px 18px" }}>
                  Jewellery
                </Link>
                <Link href="/fashion" className="btn btn-outline" style={{ fontSize: "11px", padding: "10px 18px" }}>
                  Fashion
                </Link>
                <Link href="/shop" className="btn btn-primary" style={{ fontSize: "11px", padding: "10px 18px" }}>
                  View Complete Shop
                </Link>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Link href="/shop" className="section-link">
              Explore Complete Catalogue <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>
          Searching catalogue…
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
