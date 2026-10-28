"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { demoProducts, Product } from "@/lib/products";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "";

  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory.toLowerCase());
  const [priceRange, setPriceRange] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "name">("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // If URL search param changes
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat.toLowerCase());
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== "all") {
          const catLower = p.category.toLowerCase();
          const slugLower = (p.categorySlug || "").toLowerCase();
          const matchCat =
            catLower === selectedCategory ||
            slugLower === selectedCategory ||
            (selectedCategory === "home-decor" && catLower === "home decor") ||
            (selectedCategory === "pooja-spiritual" && (catLower === "pooja & spiritual" || catLower.includes("pooja"))) ||
            (selectedCategory === "gifts" && (catLower === "gifting" || slugLower === "gifting")) ||
            (selectedCategory === "gifting" && (catLower === "gifts" || slugLower === "gifts"));
          if (!matchCat) return false;
        }

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchSearch =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!matchSearch) return false;
        }

        // New arrivals filter if param set
        if (initialFilter === "new" && !p.isNew) {
          return false;
        }

        // In Stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Price range filter
        if (priceRange === "under-1500" && p.price >= 1500) return false;
        if (priceRange === "1500-2500" && (p.price < 1500 || p.price > 2500)) return false;
        if (priceRange === "above-2500" && p.price <= 2500) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0; // Default order
      });
  }, [products, selectedCategory, search, inStockOnly, priceRange, sortBy, initialFilter]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearch("");
    setPriceRange("all");
    setInStockOnly(false);
    setSortBy("newest");
  };

  return (
    <>
      <Header />

      <main className="wrap">
        {/* Breadcrumb & Title */}
        <div style={{ paddingTop: "36px", paddingBottom: "20px" }}>
          <p className="eyebrow" style={{ marginBottom: "6px" }}>OWLERA ATELIER</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4vw, 48px)",
              color: "var(--dark-green)",
              margin: 0
            }}
          >
            The Complete Catalogue
          </h1>
          <p style={{ color: "var(--secondary-text)", fontSize: "14px", marginTop: "8px" }}>
            Explore every piece designed for subtle luxury, tactile delight and enduring grace.
          </p>
        </div>

        {/* Top Filter and Search Bar */}
        <div className="shop-topbar">
          <div className="search-input-wrap">
            <Search />
            <input
              type="text"
              placeholder="Search by name, SKU or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "12.5px", color: "var(--secondary-text)" }}>
              Showing <b>{filteredProducts.length}</b> {filteredProducts.length === 1 ? "piece" : "pieces"}
            </span>

            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="Sort products"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>

            <button
              className="btn btn-outline mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              style={{ padding: "8px 12px", display: "none" }}
            >
              <SlidersHorizontal size={14} /> Filter
            </button>
          </div>
        </div>

        {/* Main Shop Grid & Sidebar */}
        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            {/* Category Filter */}
            <div className="filter-block">
              <h4>Category</h4>
              <div className="filter-options">
                {[
                  { id: "all", label: "All Categories" },
                  { id: "jewellery", label: "Jewellery" },
                  { id: "fashion", label: "Fashion & Accessories" },
                  { id: "lifestyle", label: "Lifestyle & Sanctuary" },
                  { id: "home-decor", label: "Home Decor" },
                  { id: "pooja-spiritual", label: "Pooja & Spiritual" },
                  { id: "gifts", label: "Curated Gift Suites" }
                ].map(cat => (
                  <label key={cat.id} className="filter-label">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-block">
              <h4>Price (INR)</h4>
              <div className="filter-options">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-1500", label: "Under ₹1,500" },
                  { id: "1500-2500", label: "₹1,500 – ₹2,500" },
                  { id: "above-2500", label: "Above ₹2,500" }
                ].map(p => (
                  <label key={p.id} className="filter-label">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(p.id)}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="filter-block">
              <h4>Availability</h4>
              <div className="filter-options">
                <label className="filter-label">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="btn btn-outline"
              style={{ width: "100%", padding: "10px", fontSize: "11px" }}
            >
              <RotateCcw size={13} /> Reset All Filters
            </button>
          </aside>

          {/* Product Grid or Empty State */}
          <section>
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "60px 24px",
                  textAlign: "center"
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "26px",
                    color: "var(--dark-green)",
                    margin: "0 0 10px"
                  }}
                >
                  No matching pieces found
                </h3>
                <p style={{ color: "var(--secondary-text)", fontSize: "13px", maxWidth: "380px", margin: "0 auto 20px" }}>
                  Try adjusting your search terms, changing category filters, or resetting the price bounds.
                </p>
                <button onClick={resetFilters} className="btn btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>Loading catalogue…</div>}>
      <ShopContent />
    </Suspense>
  );
}
