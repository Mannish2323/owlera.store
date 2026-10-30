"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Heart,
  Tag,
  Check
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";

export default function CartPage() {
  const {
    items,
    count,
    subtotal,
    shippingFee,
    discount,
    appliedCoupon,
    total,
    changeQty,
    remove,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput.trim());
    setCouponMsg({ text: res.message, isError: !res.success });
  };

  return (
    <>
      <Header />

      <main className="wrap android-cart-main" style={{ paddingTop: "20px", paddingBottom: "80px" }}>
        {/* Cart Header (Matches Screen 5) */}
        <div className="android-cart-header">
          <h1 className="android-cart-title">Your Cart ({count})</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="android-cart-delete-all"
              type="button"
            >
              Delete All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="android-cart-empty">
            <div className="empty-cart-icon">
              <ShoppingBag size={32} />
            </div>
            <h2>Your cart is currently empty</h2>
            <p>Explore our handcrafted collections and discover your everyday shine.</p>
            <Link href="/shop" className="btn btn-primary" style={{ marginTop: "16px" }}>
              Explore Catalogue
            </Link>
          </div>
        ) : (
          <div className="android-cart-content-grid">
            {/* Cart Items List */}
            <div className="android-cart-items-list">
              {items.map(item => (
                <div key={item.product.id} className="android-cart-item-card">
                  <div className="cart-item-thumb-box">
                    <img src={item.product.image} alt={item.product.name} />
                    <button className="cart-item-heart-btn" aria-label="Save to wishlist" type="button">
                      <Heart size={12} />
                    </button>
                  </div>

                  <div className="cart-item-details-box">
                    <div className="cart-item-top-row">
                      <Link href={`/products/${item.product.slug}`} className="cart-item-name">
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => remove(item.product.id)}
                        className="cart-item-trash-btn"
                        aria-label={`Remove ${item.product.name}`}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-price-row">
                      <span className="cart-item-price">{money(item.product.price)}</span>
                      {item.product.compareAt && (
                        <span className="cart-item-compare">{money(item.product.compareAt)}</span>
                      )}
                    </div>

                    {item.variant && (
                      <span className="cart-item-variant-label">
                        Size: {item.variant}
                      </span>
                    )}

                    <div className="cart-item-stepper-row">
                      <div className="android-cart-stepper">
                        <button
                          onClick={() => changeQty(item.product.id, -1)}
                          aria-label="Decrease quantity"
                          type="button"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => changeQty(item.product.id, 1)}
                          aria-label="Increase quantity"
                          type="button"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary & Coupon (Matches Screen 5) */}
            <div className="android-cart-summary-box">
              {/* Coupon Row */}
              <form onSubmit={handleApplyCoupon} className="android-coupon-form">
                <div className="coupon-input-wrap">
                  <Tag size={15} className="coupon-tag-icon" />
                  <input
                    type="text"
                    placeholder="Apply Coupon"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    className="android-coupon-input"
                  />
                </div>
                <button type="submit" className="android-coupon-apply-btn">
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="coupon-active-badge">
                  <span>Code <b>{appliedCoupon}</b> Applied</span>
                  <button onClick={removeCoupon} className="coupon-remove-btn" type="button">
                    Remove
                  </button>
                </div>
              )}

              {couponMsg && (
                <div className={`coupon-feedback-msg ${couponMsg.isError ? "error" : "success"}`}>
                  {couponMsg.text}
                </div>
              )}

              {/* Breakdown Table */}
              <div className="android-breakdown-list">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : money(shippingFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="breakdown-row discount">
                    <span>Coupon Discount</span>
                    <span>- {money(discount)}</span>
                  </div>
                )}
                <div className="breakdown-row total">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link href="/checkout" className="android-checkout-btn">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
