"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Heart,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  Leaf,
  Clock,
  Droplets,
  Check
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { Product, money } from "@/lib/products";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("Lavender");
  const [justAdded, setJustAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>("specs");

  const { add } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const discountPercent =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : 29;

  // Variants based on category
  const isClothing =
    product.category.toLowerCase().includes("fashion") ||
    product.category.toLowerCase().includes("clothing");
  const isCandle =
    product.category.toLowerCase().includes("candle") ||
    product.slug.includes("candle");

  const variants = isClothing
    ? ["S", "M", "L", "XL"]
    : isCandle
    ? ["Lavender", "Rose", "Sandalwood", "Jasmine"]
    : ["Standard", "Gift Set", "Deluxe Edition"];

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    add(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    add(product, quantity);
    window.location.href = "/checkout";
  };

  return (
    <main className="wrap android-pdp-main">
      {/* Breadcrumb navigation */}
      <div className="pdp-breadcrumbs">
        <Link href="/shop" className="pdp-back-link">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
        <span className="pdp-breadcrumb-sep">/</span>
        <span className="pdp-breadcrumb-curr">{product.name}</span>
      </div>

      <div className="product-detail-grid">
        {/* Gallery View Stage (Matches Screen 4) */}
        <div className="pdp-gallery-stage">
          <div className="pdp-main-image-box">
            <img
              src={images[selectedImageIdx] || product.image}
              alt={product.name}
              className="pdp-main-image"
            />

            {/* Floating Wishlist Button */}
            <button
              className={`pdp-floating-wishlist ${inWishlist ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              type="button"
            >
              <Heart size={20} fill={inWishlist ? "#C0392B" : "none"} color={inWishlist ? "#C0392B" : "#1C1C1C"} />
            </button>
          </div>

          {/* Slider indicator dots */}
          {images.length > 1 && (
            <div className="pdp-slider-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`dot ${selectedImageIdx === idx ? "active" : ""}`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details & Specifications (Matches Screen 4) */}
        <div className="product-detail-info">
          <div>
            <span className="product-category-tag">{product.category}</span>
            <div className="pdp-title-row">
              <h1 className="pdp-title">{product.name}</h1>
              <div className="pdp-rating-badge">
                <Star size={13} fill="#D4AF37" color="#D4AF37" />
                <span>4.8</span>
                <small>(120)</small>
              </div>
            </div>
          </div>

          {/* Price Row (Matches Screen 4) */}
          <div className="pdp-price-row">
            <span className="pdp-price">{money(product.price)}</span>
            {product.compareAt && (
              <span className="pdp-compare">{money(product.compareAt)}</span>
            )}
            <span className="pdp-discount-badge">{discountPercent}% OFF</span>
          </div>

          {/* Description */}
          <p className="pdp-description-text">
            {product.description}
          </p>

          {/* 4 Feature Chips (Matches Screen 4) */}
          <div className="pdp-features-row">
            <div className="pdp-feature-chip">
              <div className="pdp-feature-icon-circle">
                <Leaf size={16} />
              </div>
              <span>Natural Ingredients</span>
            </div>
            <div className="pdp-feature-chip">
              <div className="pdp-feature-icon-circle">
                <Clock size={16} />
              </div>
              <span>Long Lasting</span>
            </div>
            <div className="pdp-feature-chip">
              <div className="pdp-feature-icon-circle">
                <Sparkles size={16} />
              </div>
              <span>Handmade</span>
            </div>
            <div className="pdp-feature-chip">
              <div className="pdp-feature-icon-circle">
                <Droplets size={16} />
              </div>
              <span>Premium Fragrance</span>
            </div>
          </div>

          {/* Select Variant (Matches Screen 4) */}
          <div className="pdp-variants-section">
            <span className="pdp-variant-label">Select Variant</span>
            <div className="pdp-variant-pills">
              {variants.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`variant-pill ${selectedVariant === v ? "active" : ""}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="pdp-desktop-actions">
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease">
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase">
                <Plus size={14} />
              </button>
            </div>

            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingBag size={16} />
              {justAdded ? "Added to Bag!" : "Add to Cart"}
            </button>

            <button className="btn btn-gold" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Specifications Accordion */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pdp-specs-box">
              <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "var(--deep-charcoal)" }}>Product Details</h4>
              <dl className="pdp-specs-list">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="pdp-spec-row">
                    <dt>{key}:</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar for Android Mobile (Matches Screen 4) */}
      <div className="android-sticky-pdp-bar">
        <div className="pdp-bottom-stepper">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="stepper-btn"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="stepper-num">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="stepper-btn"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          className={`pdp-bottom-add-btn ${justAdded ? "added" : ""}`}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {justAdded ? (
            <>
              <Check size={16} /> Added!
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="section-compact" style={{ marginTop: "48px" }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">Related Products</h2>
            <Link href="/shop" className="compact-section-link">
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div className="android-products-grid">
            {relatedProducts.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
