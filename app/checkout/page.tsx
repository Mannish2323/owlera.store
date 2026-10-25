"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Lock, Truck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import { lookupPincode, validateAddressDetails } from "@/lib/pincode-validator";

// Declare Razorpay window global
declare global {
  interface Window {
    Razorpay: any;
  }
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi (NCT)",
  "Chandigarh", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Telangana",
    pincode: "",
    landmark: ""
  });

  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addressMismatchWarning, setAddressMismatchWarning] = useState<string | null>(null);
  const [detectedStateSuggestion, setDetectedStateSuggestion] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Load Razorpay checkout.js script asynchronously
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayReady(true);
      document.body.appendChild(script);
    } else {
      setRazorpayReady(true);
    }
  }, []);

  const handlePincodeChange = (value: string) => {
    const cleanPin = value.replace(/\D/g, "").slice(0, 6);
    const updatedForm = { ...form, pincode: cleanPin };

    if (cleanPin.length === 6) {
      const pinInfo = lookupPincode(cleanPin);
      if (pinInfo) {
        // Automatically sync state to detected state
        updatedForm.state = pinInfo.state;
        if (!form.city.trim() && pinInfo.defaultCity) {
          updatedForm.city = pinInfo.defaultCity;
        }
        setAddressMismatchWarning(null);
        setDetectedStateSuggestion(null);
      } else {
        setAddressMismatchWarning(`PIN code "${cleanPin}" is not a recognized Indian postal PIN code.`);
      }
    } else {
      setAddressMismatchWarning(null);
      setDetectedStateSuggestion(null);
    }

    setForm(updatedForm);
  };

  const handleStateChange = (newState: string) => {
    const updated = { ...form, state: newState };
    setForm(updated);

    if (form.pincode.length === 6) {
      const check = validateAddressDetails(form.pincode, newState, form.city);
      if (!check.isValid) {
        setAddressMismatchWarning(check.errorMessage || null);
        setDetectedStateSuggestion(check.detectedState || null);
      } else {
        setAddressMismatchWarning(null);
        setDetectedStateSuggestion(null);
      }
    }
  };

  const handleCityChange = (newCity: string) => {
    const updated = { ...form, city: newCity };
    setForm(updated);

    if (form.pincode.length === 6) {
      const check = validateAddressDetails(form.pincode, form.state, newCity);
      if (!check.isValid) {
        setAddressMismatchWarning(check.errorMessage || null);
        setDetectedStateSuggestion(check.detectedState || null);
      } else {
        setAddressMismatchWarning(null);
        setDetectedStateSuggestion(null);
      }
    }
  };

  const acceptStateSuggestion = () => {
    if (detectedStateSuggestion) {
      setForm(prev => ({ ...prev, state: detectedStateSuggestion }));
      setAddressMismatchWarning(null);
      setDetectedStateSuggestion(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("Your shopping bag is empty. Please add items before checking out.");
      return;
    }

    // Comprehensive client-side validations
    if (!form.name.trim() || form.name.trim().length < 2) {
      setErrorMessage("Please enter your full recipient name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErrorMessage("Please provide a valid email address for delivery updates.");
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).");
      return;
    }

    if (!form.address.trim() || form.address.trim().length < 8) {
      setErrorMessage("Please enter a complete street address including house / flat number.");
      return;
    }

    if (!form.city.trim() || form.city.trim().length < 2) {
      setErrorMessage("Please enter your city / district.");
      return;
    }

    // Verify PIN code & state consistency (e.g. Hyderabad, PIN 500034 must be in Telangana, not Assam)
    const addrValidation = validateAddressDetails(form.pincode, form.state, form.city);
    if (!addrValidation.isValid) {
      setErrorMessage(addrValidation.errorMessage || "Please fix address conflicts before proceeding.");
      setAddressMismatchWarning(addrValidation.errorMessage || null);
      setDetectedStateSuggestion(addrValidation.detectedState || null);
      return;
    }

    setBusy(true);
    setErrorMessage("");

    try {
      // 1. Submit checkout request to server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map(i => ({
            id: i.product.id,
            quantity: i.quantity,
            variant: i.variant
          })),
          couponCode: appliedCoupon
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize checkout session.");
      }

      // 2. Handle Razorpay Gateway Flow
      if (data.mode === "razorpay") {
        if (!window.Razorpay) {
          throw new Error("Razorpay checkout is still initializing. Please wait a moment and retry.");
        }

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "OWLERA",
          description: `Order ${data.orderNumber} — Everyday Shine`,
          order_id: data.razorpayOrderId,
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone
          },
          theme: {
            color: "#123D2E"
          },
          handler: async function (response: any) {
            try {
              // 3. Verify Razorpay cryptographic signature on server
              const verifyRes = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  orderNumber: data.orderNumber,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                })
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) {
                throw new Error(verifyData.error || "Payment signature verification failed.");
              }

              clearCart();
              router.push(`/order-success?orderNumber=${encodeURIComponent(data.orderNumber)}`);
            } catch (vErr: any) {
              setErrorMessage(vErr.message || "Payment verification error. Please contact concierge.");
              setBusy(false);
            }
          },
          modal: {
            ondismiss: function () {
              setBusy(false);
              setErrorMessage("Payment window closed. Your items remain safely in your bag.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setBusy(false);
          setErrorMessage(
            response.error?.description || "Payment was declined by your bank or card issuer. Please retry."
          );
        });
        rzp.open();
        return;
      }

      // 3. Handle Demo / Test Mode Flow (when Razorpay credentials are not yet set)
      if (data.mode === "demo") {
        clearCart();
        router.push(
          `/order-success?orderNumber=${encodeURIComponent(data.orderNumber)}&demo=1`
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while processing checkout.");
      setBusy(false);
    }
  };

  return (
    <>
      <Header />

      <main className="wrap" style={{ padding: "40px 0 80px" }}>
        <Link
          href="/cart"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--secondary-text)",
            marginBottom: "24px"
          }}
        >
          <ArrowLeft size={14} /> Return to Shopping Bag
        </Link>

        <div style={{ marginBottom: "28px" }}>
          <p className="eyebrow">FINAL CONFIRMATION</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4.5vw, 46px)",
              color: "var(--dark-green)",
              margin: "6px 0 0"
            }}
          >
            Secure Checkout
          </h1>
        </div>

        <div className="checkout-grid">
          {/* Left Column: Customer & Delivery Address Form */}
          <section>
            <div className="checkout-box">
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  color: "var(--dark-green)",
                  margin: "0 0 20px",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "12px"
                }}
              >
                1. Delivery & Contact Details
              </h2>

              <form onSubmit={handleSubmit} className="form-grid">
                {/* Full Name */}
                <div className="form-field full">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="form-field">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="ananya@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>

                {/* Mobile Phone */}
                <div className="form-field">
                  <label htmlFor="phone">10-Digit Mobile Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    pattern="[6-9][0-9]{9}"
                    title="Enter 10-digit Indian mobile number"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    autoComplete="tel"
                  />
                </div>

                {/* Street Address */}
                <div className="form-field full">
                  <label htmlFor="address">Flat / House No. & Street Address *</label>
                  <textarea
                    id="address"
                    rows={3}
                    required
                    placeholder="Flat 402, Royal Palms, Banjara Hills Road No. 12"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    autoComplete="street-address"
                  />
                </div>

                {/* Landmark */}
                <div className="form-field full">
                  <label htmlFor="landmark">Landmark (Optional)</label>
                  <input
                    id="landmark"
                    type="text"
                    placeholder="Near City Centre Mall"
                    value={form.landmark}
                    onChange={e => setForm({ ...form, landmark: e.target.value })}
                  />
                </div>

                {/* 6-Digit PIN Code */}
                <div className="form-field">
                  <label htmlFor="pincode">
                    6-Digit PIN Code *
                    {form.pincode.length === 6 && !addressMismatchWarning && (
                      <span style={{ color: "var(--forest-green)", marginLeft: "6px", fontSize: "11px", fontWeight: 600 }}>
                        ✓ Verified ({form.state})
                      </span>
                    )}
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    title="Enter 6-digit Indian PIN code"
                    placeholder="e.g. 500034"
                    value={form.pincode}
                    onChange={e => handlePincodeChange(e.target.value)}
                    autoComplete="postal-code"
                  />
                  <small style={{ fontSize: "10.5px", color: "var(--secondary-text)", marginTop: "4px" }}>
                    Entering PIN auto-detects State & City
                  </small>
                </div>

                {/* City */}
                <div className="form-field">
                  <label htmlFor="city">City / District *</label>
                  <input
                    id="city"
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={form.city}
                    onChange={e => handleCityChange(e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>

                {/* State */}
                <div className="form-field full">
                  <label htmlFor="state">State / Union Territory *</label>
                  <select
                    id="state"
                    required
                    value={form.state}
                    onChange={e => handleStateChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: addressMismatchWarning ? "1.5px solid #C0392B" : "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--warm-cream)",
                      fontSize: "13px"
                    }}
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address Mismatch Alert with 1-Click State Fix */}
                {addressMismatchWarning && (
                  <div
                    className="form-field full"
                    style={{
                      background: "#FDF4E7",
                      border: "1px solid #F5C6CB",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      color: "#A94442",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}
                  >
                    <AlertCircle size={17} style={{ flexShrink: 0, marginTop: "2px", color: "#C0392B" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{addressMismatchWarning}</p>
                      {detectedStateSuggestion && (
                        <button
                          type="button"
                          onClick={acceptStateSuggestion}
                          style={{
                            background: "var(--forest-green)",
                            color: "#FFFFFF",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <CheckCircle2 size={13} /> Fix: Set State to {detectedStateSuggestion}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Security Reassurance */}
                <div
                  className="form-field full"
                  style={{
                    background: "rgba(18, 61, 46, 0.05)",
                    padding: "14px",
                    borderRadius: "var(--radius-sm)",
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "var(--primary-text)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <Lock size={18} color="var(--forest-green)" />
                  <span>
                    <b>Payment is collected securely on the next step.</b> Never enter sensitive credit card numbers or banking passwords on ordinary forms.
                  </span>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    className="form-field full"
                    style={{
                      background: "#FCE8E6",
                      color: "#C0392B",
                      border: "1px solid #F5C6CB",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <AlertCircle size={18} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="form-field full" style={{ marginTop: "14px" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={busy || items.length === 0 || Boolean(addressMismatchWarning)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      fontSize: "13px",
                      opacity: addressMismatchWarning ? 0.6 : 1,
                      cursor: addressMismatchWarning ? "not-allowed" : "pointer"
                    }}
                  >
                    <ShieldCheck size={18} />
                    {busy ? "Securing Order…" : `Pay Securely — ${money(total)}`}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Right Column: Order Summary Sidebar */}
          <aside>
            <div className="checkout-box" style={{ position: "sticky", top: "100px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  color: "var(--dark-green)",
                  margin: "0 0 18px",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "12px"
                }}
              >
                Order Summary
              </h2>

              {items.length === 0 ? (
                <p style={{ color: "var(--secondary-text)", fontSize: "13px" }}>
                  No items in bag. <Link href="/shop" style={{ color: "var(--forest-green)", textDecoration: "underline" }}>Shop collection</Link>.
                </p>
              ) : (
                <>
                  <div
                    style={{
                      maxHeight: "280px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      paddingRight: "6px",
                      marginBottom: "18px"
                    }}
                  >
                    {items.map(item => (
                      <div
                        key={`${item.product.id}-${item.variant || ""}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "55px 1fr auto",
                          gap: "12px",
                          alignItems: "center",
                          fontSize: "12px"
                        }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{
                            width: "55px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "var(--radius-sm)",
                            background: "#EFEBE1"
                          }}
                        />
                        <div>
                          <b style={{ color: "var(--dark-green)", display: "block" }}>{item.product.name}</b>
                          <small style={{ color: "var(--secondary-text)" }}>Qty: {item.quantity}</small>
                        </div>
                        <span style={{ fontWeight: 600, color: "var(--forest-green)" }}>
                          {money(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div
                    style={{
                      borderTop: "1px solid var(--border-color)",
                      paddingTop: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      fontSize: "13px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--secondary-text)" }}>Subtotal</span>
                      <b>{money(subtotal)}</b>
                    </div>

                    {discount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#1E5E2E" }}>
                        <span>Discount ({appliedCoupon})</span>
                        <b>- {money(discount)}</b>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--secondary-text)" }}>Insured Pan-India Shipping</span>
                      <span>{shippingFee === 0 ? "Complimentary" : money(shippingFee)}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid var(--border-color)",
                        paddingTop: "12px",
                        marginTop: "4px",
                        fontSize: "16px"
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "var(--dark-green)" }}>Total Payable</span>
                      <b style={{ color: "var(--forest-green)", fontSize: "19px" }}>{money(total)}</b>
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px", color: "var(--secondary-text)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Truck size={15} color="var(--forest-green)" />
                      <span>Estimated delivery: 3–5 business days</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle2 size={15} color="var(--forest-green)" />
                      <span>Signature presentation packaging included</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
