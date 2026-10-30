"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useWishlist } from "@/components/wishlist-provider";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { add } = useCart();

  const handleMoveToCart = (product: any) => {
    add(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <>
      <Header />

      <main className="wrap" style={{ padding: "40px 0 80px" }}>
        <Link
          href="/shop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "var(--secondary-text)",
            marginBottom: "20px"
          }}
        >
          <ArrowLeft size={14} /> Continue Shopping
        </Link>

        <div style={{ marginBottom: "32px" }}>
          <p className="eyebrow">SAVED TREASURES</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4vw, 44px)",
              color: "var(--dark-green)",
              margin: "6px 0 0"
            }}
          >
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-color)",
              padding: "70px 24px",
              textAlign: "center",
              borderRadius: "var(--radius-sm)"
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(198, 164, 91, 0.12)",
                display: "grid",
                placeItems: "center",
                color: "var(--muted-gold)",
                margin: "0 auto 16px"
              }}
            >
              <Heart size={28} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "26px",
                color: "var(--dark-green)",
                margin: "0 0 10px"
              }}
            >
              Your wishlist is empty
            </h2>
            <p style={{ color: "var(--secondary-text)", fontSize: "13.5px", maxWidth: "340px", margin: "0 auto 24px" }}>
              Bookmark your favourite earrings, chains and lifestyle pieces to admire or acquire later.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Explore The Edit <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="product-grid" style={{ marginTop: "24px" }}>
            {wishlist.map(product => (
              <div
                key={product.id}
                className="premium-product-card"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden"
                }}
              >
                <div className="product-media-wrap">
                  <Link href={`/products/${product.slug}`} className="product-media-link" aria-label={`View ${product.name}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="wishlist-action-btn"
                    style={{ color: "#C0392B" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="product-details" style={{ padding: "12px 14px 16px" }}>
                  <span className="product-dept-label">
                    {product.category}
                  </span>
                  <h3 className="product-card-title">
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <div className="product-price-container">
                    <span className="product-current-price">{money(product.price)}</span>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", padding: "10px", fontSize: "10.5px" }}
                      disabled={product.stock <= 0}
                      onClick={() => handleMoveToCart(product)}
                    >
                      <ShoppingBag size={13} />
                      {product.stock <= 0 ? "Out of Stock" : "Move to Bag"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
