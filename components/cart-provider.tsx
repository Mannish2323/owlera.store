"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { Product, money } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  appliedCoupon: string | null;
  total: number;
  add: (product: Product, quantity?: number, variant?: string) => void;
  remove: (productId: string) => void;
  changeQty: (productId: string, delta: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("owlera-cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("owlera-coupon");
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("owlera-cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem("owlera-coupon", appliedCoupon);
      } else {
        localStorage.removeItem("owlera-coupon");
      }
    } catch (e) {}
  }, [appliedCoupon]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  // Shipping policy: Free shipping on orders >= ₹999, else ₹99
  const shippingFee = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= 999 ? 0 : 99;
  }, [subtotal, items.length]);

  // Discount calculation based on valid coupons
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === "OWLFIRST10") {
      // 10% off up to ₹500
      return Math.min(Math.round(subtotal * 0.1), 500);
    }
    if (appliedCoupon === "SHINE200") {
      return subtotal >= 1999 ? 200 : 0;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shippingFee);
  }, [subtotal, discount, shippingFee]);

  const add = (product: Product, quantity = 1, variant?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.variant === variant);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(i =>
          i.product.id === product.id && i.variant === variant
            ? { ...i, quantity: newQty }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock), variant }];
    });
    setOpen(true);
  };

  const remove = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const changeQty = (productId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => {
          if (i.product.id === productId) {
            const nextQty = i.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > i.product.stock) return i; // Cap at available stock
            return { ...i, quantity: nextQty };
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "OWLFIRST10") {
      setAppliedCoupon("OWLFIRST10");
      setCouponMessage({ text: "Coupon OWLFIRST10 applied (10% Off)!", isError: false });
      return { success: true, message: "10% off applied!" };
    }
    if (clean === "SHINE200") {
      if (subtotal < 1999) {
        setCouponMessage({ text: "Code SHINE200 requires a minimum order of ₹1,999.", isError: true });
        return { success: false, message: "Minimum order ₹1,999 required." };
      }
      setAppliedCoupon("SHINE200");
      setCouponMessage({ text: "Coupon SHINE200 applied (₹200 Off)!", isError: false });
      return { success: true, message: "₹200 off applied!" };
    }
    setCouponMessage({ text: "Invalid or expired coupon code.", isError: true });
    return { success: false, message: "Invalid code" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage(null);
    setCouponInput("");
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // WhatsApp cart share link
  const whatsappCartUrl = useMemo(() => {
    if (items.length === 0) {
      return `https://wa.me/916305630468?text=${encodeURIComponent(
        "Hello OWLERA Concierge! I am browsing your jewellery collection and would love some assistance with recommendations and delivery timelines."
      )}`;
    }
    const lines = items
      .map(i => `• ${i.product.name} (Qty: ${i.quantity}) - ${money(i.product.price * i.quantity)}`)
      .join("\n");
    const text = encodeURIComponent(
      `Hello OWLERA Concierge! I am reviewing my shopping bag:\n\n${lines}\n\nEstimated Subtotal: ${money(subtotal)}\n\nCould you please assist me with sizing / delivery availability?`
    );
    return `https://wa.me/916305630468?text=${text}`;
  }, [items, subtotal]);

  const value: CartContextType = {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shippingFee,
    discount,
    appliedCoupon,
    total,
    add,
    remove,
    changeQty,
    applyCoupon,
    removeCoupon,
    clearCart,
    isOpen,
    setOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Slide-over Cart Drawer */}
      {isOpen && (
        <div
          className="cart-backdrop"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="cart-head">
              <div>
                <p className="eyebrow" style={{ fontSize: "10px", margin: 0 }}>
                  YOUR SELECTION
                </p>
                <h2>Shopping Bag ({value.count})</h2>
              </div>
              <button
                className="icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close Shopping Bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Threshold progress indicator */}
            {items.length > 0 && (
              <div
                style={{
                  padding: "10px 24px",
                  background: subtotal >= 999 ? "#EAF5EA" : "#FFF7EB",
                  borderBottom: "1px solid var(--border-color)",
                  fontSize: "11.5px",
                  color: subtotal >= 999 ? "#1E5E2E" : "#8A5C1B"
                }}
              >
                {subtotal >= 999 ? (
                  <span>✦ Congratulations! You have unlocked <b>Complimentary Pan-India Delivery</b>.</span>
                ) : (
                  <span>
                    Add <b>{money(999 - subtotal)}</b> more for <b>Complimentary Delivery</b>!
                  </span>
                )}
              </div>
            )}

            {/* Items */}
            {items.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 24px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(198, 164, 91, 0.15)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--muted-gold)",
                    marginBottom: "16px"
                  }}
                >
                  <ShoppingBag size={28} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "24px",
                    margin: "0 0 8px",
                    color: "var(--dark-green)"
                  }}
                >
                  Your bag is waiting.
                </h3>
                <p
                  style={{
                    color: "var(--secondary-text)",
                    fontSize: "13px",
                    maxWidth: "260px",
                    margin: "0 0 24px"
                  }}
                >
                  Discover everyday shine with our handcrafted jewellery and lifestyle finds.
                </p>
                <Link
                  href="/shop"
                  className="btn btn-primary"
                  onClick={() => setOpen(false)}
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map(item => (
                    <div className="cart-item-row" key={`${item.product.id}-${item.variant || ""}`}>
                      <img
                        className="cart-item-img"
                        src={item.product.image}
                        alt={item.product.name}
                      />
                      <div className="cart-item-details">
                        <b>{item.product.name}</b>
                        {item.variant && <small>Variant: {item.variant}</small>}
                        <small>{money(item.product.price)} each</small>
                        <div className="qty-control">
                          <button
                            onClick={() => changeQty(item.product.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => changeQty(item.product.id, 1)}
                            disabled={item.quantity >= item.product.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <b style={{ color: "var(--forest-green)", fontSize: "13px" }}>
                          {money(item.product.price * item.quantity)}
                        </b>
                        <button
                          onClick={() => remove(item.product.id)}
                          style={{
                            display: "block",
                            fontSize: "10.5px",
                            color: "var(--secondary-text)",
                            marginTop: "8px",
                            marginLeft: "auto"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Coupon section in drawer */}
                  <div style={{ marginTop: "12px" }}>
                    {appliedCoupon ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "#F4EFE6",
                          padding: "8px 12px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px"
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Tag size={14} color="var(--forest-green)" />
                          Code <b>{appliedCoupon}</b> applied (-{money(discount)})
                        </span>
                        <button
                          onClick={removeCoupon}
                          style={{ color: "#C0392B", fontSize: "11px", fontWeight: 600 }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          placeholder="Coupon (e.g. OWLFIRST10)"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          style={{
                            flex: 1,
                            padding: "8px 10px",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "12px",
                            background: "#FFFFFF"
                          }}
                        />
                        <button
                          className="btn btn-outline"
                          style={{ padding: "8px 14px", fontSize: "10px" }}
                          onClick={() => applyCoupon(couponInput)}
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {couponMessage && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "4px",
                          color: couponMessage.isError ? "#C0392B" : "#1E5E2E",
                          fontSize: "11px"
                        }}
                      >
                        {couponMessage.text}
                      </small>
                    )}
                  </div>
                </div>

                {/* Footer calculation */}
                <div className="cart-footer">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--secondary-text)" }}>Subtotal</span>
                    <b>{money(subtotal)}</b>
                  </div>
                  {discount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        color: "#1E5E2E"
                      }}
                    >
                      <span>Discount</span>
                      <b>- {money(discount)}</b>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--secondary-text)" }}>Estimated Shipping</span>
                    <span>{shippingFee === 0 ? "Complimentary" : money(shippingFee)}</span>
                  </div>
                  <div className="cart-subtotal-row" style={{ paddingTop: "8px", borderTop: "1px solid var(--border-color)" }}>
                    <span>Estimated Total</span>
                    <b style={{ color: "var(--forest-green)", fontSize: "17px" }}>{money(total)}</b>
                  </div>

                  <p className="cart-shipping-notice">
                    <ShieldCheck size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px", color: "var(--forest-green)" }} />
                    Taxes included. Order totals and stock availability are strictly verified on our secure server before payment.
                  </p>

                  <Link
                    href="/checkout"
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px", fontSize: "12px" }}
                    onClick={() => setOpen(false)}
                  >
                    Proceed to Checkout <ArrowRight size={15} />
                  </Link>

                  <a
                    href={whatsappCartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-cart-btn"
                  >
                    Share Cart on WhatsApp (+91 6305630468)
                  </a>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
