"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product, money } from "@/lib/products";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    add(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <article className="premium-product-card">
      {/* Product Image Stage */}
      <div className="product-media-wrap">
        <Link href={`/products/${product.slug}`} className="product-media-link" aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="product-image"
          />
        </Link>

        {/* Real Badge (only when authentic data exists) */}
        {product.badge ? (
          <span className="product-tag-badge">{product.badge}</span>
        ) : product.isNew ? (
          <span className="product-tag-badge new">New In</span>
        ) : null}

        {/* Wishlist Button */}
        <button
          className={`wishlist-action-btn ${inWishlist ? "active" : ""}`}
          onClick={e => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          type="button"
        >
          <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Desktop Quick Add Bar */}
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
                  <Check size={14} /> Added to Bag
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
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <div className="product-bottom-row">
          <div className="product-price-container">
            <span className="product-current-price">{money(product.price)}</span>
            {product.compareAt && product.compareAt > product.price && (
              <>
                <span className="product-original-price">{money(product.compareAt)}</span>
                {discountPercent && (
                  <span className="product-discount-rate">{discountPercent}% OFF</span>
                )}
              </>
            )}
          </div>

          {/* Compact Mobile Add-to-Cart Button (Screens 2 & 3 in reference) */}
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

        {/* Stock urgency only when genuinely low */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="product-low-stock-pill">
            Only {product.stock} left
          </div>
        )}
      </div>
    </article>
  );
}
