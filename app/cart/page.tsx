"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Tag, MessageCircle } from "lucide-react";
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

  const whatsappCartUrl = React.useMemo(() => {
    if (items.length === 0) {
      return `https://wa.me/916305630468?text=${encodeURIComponent(
        "Hello OWLERA Concierge! I am browsing your jewellery collection and would love styling suggestions."
      )}`;
    }
    const lines = items
      .map(i => `• ${i.product.name} (Qty: ${i.quantity}) - ${money(i.product.price * i.quantity)}`)
      .join("\n");
    const text = encodeURIComponent(
      `Hello OWLERA Concierge! I am reviewing my shopping bag:\n\n${lines}\n\nSubtotal: ${money(subtotal)}\n\nCould you please assist me with ordering?`
    );
    return `https://wa.me/916305630468?text=${text}`;
  }, [items, subtotal]);

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
          <p className="eyebrow">YOUR SELECTION</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4vw, 44px)",
              color: "var(--dark-green)",
              margin: "6px 0 0"
            }}
          >
            Shopping Bag ({count})
          </h1>
        </div>

        {items.length === 0 ? (
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
              <ShoppingBag size={28} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "26px",
                color: "var(--dark-green)",
                margin: "0 0 10px"
              }}
            >
              Your bag is currently empty
            </h2>
            <p style={{ color: "var(--secondary-text)", fontSize: "13.5px", maxWidth: "340px", margin: "0 auto 24px" }}>
              Discover timeless gold-tone jewellery and refined accessories to elevate your day.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Explore The Edit <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: "48px"
            }}
            className="checkout-grid"
          >
            {/* Items List */}
            <div>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "24px"
                }}
              >
                {items.map(item => (
                  <div
                    key={`${item.product.id}-${item.variant || ""}`}
                    className="cart-item-row-responsive"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{
                        width: "80px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                        background: "#EFEBE1"
                      }}
                    />
                    <div>
                      <span style={{ fontSize: "10px", color: "var(--muted-gold)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                        {item.product.category}
                      </span>
                      <Link href={`/products/${item.product.slug}`}>
                        <h3
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "18px",
                            margin: "2px 0 4px",
                            color: "var(--dark-green)"
                          }}
                        >
                          {item.product.name}
                        </h3>
                      </Link>
                      <small style={{ color: "var(--secondary-text)", display: "block" }}>
                        Unit: {money(item.product.price)}
                      </small>

                      <div className="qty-control" style={{ marginTop: "12px" }}>
                        <button
                          onClick={() => changeQty(item.product.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => changeQty(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <b style={{ color: "var(--forest-green)", fontSize: "15px" }}>
                        {money(item.product.price * item.quantity)}
                      </b>
                      <button
                        onClick={() => remove(item.product.id)}
                        style={{
                          marginTop: "16px",
                          marginLeft: "auto",
                          color: "#C0392B",
                          fontSize: "11px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Shipping Reassurance Bar */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px 20px",
                  background: subtotal >= 999 ? "#EAF5EA" : "#FFF7EB",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "12.5px",
                  color: subtotal >= 999 ? "#1E5E2E" : "#8A5C1B"
                }}
              >
                <ShieldCheck size={20} />
                <span>
                  {subtotal >= 999 ? (
                    <b>✦ Complimentary Insured Delivery unlocked!</b>
                  ) : (
                    <span>
                      Add <b>{money(999 - subtotal)}</b> more to unlock Complimentary Delivery.
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Order Summary & Checkout Card */}
            <div>
              <aside
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "28px"
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "22px",
                    color: "var(--dark-green)",
                    margin: "0 0 20px",
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "14px"
                  }}
                >
                  Order Summary
                </h2>

                {/* Calculation Rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--secondary-text)" }}>Bag Subtotal</span>
                    <b>{money(subtotal)}</b>
                  </div>

                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#1E5E2E" }}>
                      <span>Discount ({appliedCoupon})</span>
                      <b>- {money(discount)}</b>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--secondary-text)" }}>Estimated Delivery</span>
                    <span>{shippingFee === 0 ? "Complimentary" : money(shippingFee)}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid var(--border-color)",
                      paddingTop: "14px",
                      marginTop: "4px",
                      fontSize: "16px"
                    }}
                  >
                    <span style={{ color: "var(--dark-green)", fontWeight: 600 }}>Estimated Total</span>
                    <b style={{ color: "var(--forest-green)", fontSize: "18px" }}>{money(total)}</b>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-light)" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "8px" }}>
                    Promotional Code
                  </label>
                  {appliedCoupon ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#F4EFE6",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px"
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Tag size={14} color="var(--forest-green)" />
                        Code <b>{appliedCoupon}</b> applied
                      </span>
                      <button
                        onClick={removeCoupon}
                        style={{ color: "#C0392B", fontSize: "11px", fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="OWLFIRST10"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px",
                          background: "var(--warm-cream)"
                        }}
                      />
                      <button type="submit" className="btn btn-outline" style={{ padding: "10px 16px", fontSize: "11px" }}>
                        Apply
                      </button>
                    </form>
                  )}
                  {couponMsg && (
                    <small
                      style={{
                        display: "block",
                        marginTop: "6px",
                        color: couponMsg.isError ? "#C0392B" : "#1E5E2E",
                        fontSize: "11.5px"
                      }}
                    >
                      {couponMsg.text}
                    </small>
                  )}
                </div>

                {/* Proceed to Checkout CTA */}
                <div style={{ marginTop: "24px" }}>
                  <Link
                    href="/checkout"
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "16px", fontSize: "12px" }}
                  >
                    Proceed to Checkout <ArrowRight size={15} />
                  </Link>

                  <a
                    href={whatsappCartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-cart-btn"
                    style={{ marginTop: "12px", width: "100%" }}
                  >
                    <MessageCircle size={16} /> Consult Stylist on WhatsApp
                  </a>
                </div>

                <small
                  style={{
                    display: "block",
                    marginTop: "16px",
                    color: "var(--secondary-text)",
                    fontSize: "11px",
                    textAlign: "center",
                    lineHeight: "1.6"
                  }}
                >
                  Prices, taxes and real-time inventory are verified securely on our server during checkout.
                </small>
              </aside>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
