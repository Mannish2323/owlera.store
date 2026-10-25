"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
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

  const discountPercent =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  return (
    <div className="product-card">
      {/* Product Image Box */}
      <div className="product-image-box">
        <Link href={`/products/${product.slug}`} tabIndex={-1}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {/* Badge */}
        {product.badge && <span className="product-badge">{product.badge}</span>}

        {/* Wishlist Button */}
        <button
          className={`wishlist-toggle ${inWishlist ? "active" : ""}`}
          onClick={e => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Quick Add Button */}
        {product.stock > 0 ? (
          <button
            className="quick-add-btn"
            onClick={e => {
              e.preventDefault();
              add(product, 1);
            }}
          >
            <ShoppingBag size={14} /> Add to Bag
          </button>
        ) : (
          <div
            className="quick-add-btn"
            style={{
              background: "rgba(100, 100, 100, 0.9)",
              color: "#FFF",
              cursor: "not-allowed"
            }}
          >
            Out of Stock
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="product-meta">
        <span className="product-category-tag">{product.category}</span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-price-row">
          <span className="current-price">{money(product.price)}</span>
          {product.compareAt && (
            <span className="compare-price">{money(product.compareAt)}</span>
          )}
          {discountPercent && (
            <span className="discount-tag">({discountPercent}% OFF)</span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="stock-status">
          {product.stock <= 0 ? (
            <span className="stock-status out-of-stock">Sold Out</span>
          ) : product.stock <= 5 ? (
            <span className="stock-status low-stock">Only {product.stock} left in stock</span>
          ) : (
            <span className="stock-status in-stock">In Stock & Ready to Dispatch</span>
          )}
        </div>
      </div>
    </div>
  );
}
