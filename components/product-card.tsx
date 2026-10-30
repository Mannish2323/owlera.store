"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product, money } from "@/lib/products";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { add } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if click was not on an interactive control
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(`/products/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.stock <= 0) return;
    add(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <article
      className="premium-product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* Product Image Stage */}
      <div className="product-media-wrap">
        <Link
          href={`/products/${product.slug}`}
          className="product-media-link"
          aria-label={`View ${product.name}`}
          onClick={e => e.stopPropagation()}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="product-image"
          />
        </Link>

        {/* Real Badge */}
        {product.badge ? (
          <span className="product-tag-badge">{product.badge}</span>
        ) : product.isNew ? (
          <span className="product-tag-badge new">New In</span>
        ) : null}

        {/* Wishlist Button */}
        <button
          className={`wishlist-action-btn ${inWishlist ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          type="button"
        >
          <Heart size={14} fill={inWishlist ? "#C0392B" : "none"} color={inWishlist ? "#C0392B" : "currentColor"} />
        </button>

        {/* Desktop Quick Add Hover Bar */}
        <div className="product-quick-actions">
          {product.stock > 0 ? (
            <button
              className={`quick-bag-btn ${justAdded ? "added" : ""}`}
              onClick={handleQuickAdd}
              type="button"
              aria-label={`Add ${product.name} to shopping bag`}
            >
              {justAdded ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Quick Add
                </>
              )}
            </button>
          ) : (
            <button className="quick-bag-btn sold-out" disabled type="button">
              Sold Out
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="product-details">
        <span className="product-dept-label">
          {product.category}
        </span>

        <h3 className="product-card-title">
          <Link
            href={`/products/${product.slug}`}
            onClick={e => e.stopPropagation()}
          >
            {product.name}
          </Link>
        </h3>

        <div className="product-bottom-row">
          <div className="product-price-container">
            <span className="product-current-price">{money(product.price)}</span>
            {product.compareAt && product.compareAt > product.price && (
              <div className="product-compare-wrap">
                <span className="product-original-price">{money(product.compareAt)}</span>
                {discountPercent && (
                  <span className="product-discount-rate">{discountPercent}% OFF</span>
                )}
              </div>
            )}
          </div>

          {/* Compact Quick Add Button */}
          <button
            className={`compact-cart-btn ${justAdded ? "added" : ""}`}
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            type="button"
            aria-label={justAdded ? "Added to cart" : `Add ${product.name} to cart`}
          >
            {justAdded ? <Check size={13} /> : <ShoppingBag size={13} />}
          </button>
        </div>

        {/* Stock urgency */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="product-low-stock-pill">
            Only {product.stock} left
          </div>
        )}
      </div>
    </article>
  );
}
