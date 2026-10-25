"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { money } from "@/lib/products";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [contact, setContact] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (ref: string, cont?: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setError("");
    try {
      const url = `/api/orders/track?orderNumber=${encodeURIComponent(ref.trim())}${
        cont ? `&contact=${encodeURIComponent(cont.trim())}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order not found.");
      }
      setOrderData(data);
    } catch (e: any) {
      setError(e.message || "Failed to find order.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      fetchOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber, contact);
  };

  // Status step progression helper
  const steps = [
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "processing", label: "Processing & Quality Check", icon: Clock },
    { key: "packed", label: "Packed & Sealed", icon: Package },
    { key: "shipped", label: "Dispatched in Transit", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const statusHierarchy = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
    const currentIndex = statusHierarchy.indexOf(currentStatus?.toLowerCase() || "confirmed");
    const stepIndex = statusHierarchy.indexOf(stepKey);
    if (stepIndex <= currentIndex) return "completed";
    return "pending";
  };

  return (
    <>
      <Header />

      <main className="wrap" style={{ padding: "40px 0 80px", maxWidth: "860px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>CLIENT CONCIERGE</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4vw, 46px)",
              color: "var(--dark-green)",
              margin: "6px 0 10px"
            }}
          >
            Track Your Order
          </h1>
          <p style={{ color: "var(--secondary-text)", fontSize: "14px", maxWidth: "480px", margin: "0 auto" }}>
            Enter your unique order reference and contact details to inspect the live dispatch and courier tracking status.
          </p>
        </div>

        {/* Search Box */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--border-color)",
            padding: "28px",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "36px"
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr auto",
              gap: "14px",
              alignItems: "end"
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
                Order Reference *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. OWL-A1B2C3D4"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value.toUpperCase())}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--warm-cream)",
                  fontSize: "13px"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
                Email or Mobile (Optional)
              </label>
              <input
                type="text"
                placeholder="9876543210 or email"
                value={contact}
                onChange={e => setContact(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--warm-cream)",
                  fontSize: "13px"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: "14px 24px", height: "45px" }}
            >
              <Search size={16} />
              {loading ? "Searching…" : "Track"}
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: "16px",
                background: "#FCE8E6",
                color: "#C0392B",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details & Progress Display */}
        {orderData && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "36px",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            {/* Header info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "20px",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div>
                <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--muted-gold)", fontWeight: 600 }}>
                  ORDER STATUS REPORT
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "26px",
                    color: "var(--dark-green)",
                    margin: "4px 0 0"
                  }}
                >
                  {orderData.orderNumber}
                </h2>
                <small style={{ color: "var(--secondary-text)" }}>
                  Placed on {new Date(orderData.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </small>
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    background: orderData.paymentStatus === "paid" ? "#EAF5EA" : "#FFF7EB",
                    color: orderData.paymentStatus === "paid" ? "#1E5E2E" : "#8A5C1B",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "uppercase"
                  }}
                >
                  Payment: {orderData.paymentStatus}
                </span>
                <div style={{ marginTop: "6px", fontSize: "15px", fontWeight: 700, color: "var(--forest-green)" }}>
                  Total: {money(orderData.total)}
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ margin: "36px 0" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "8px",
                  position: "relative"
                }}
              >
                {steps.map((step, idx) => {
                  const isDone = getStepStatus(step.key, orderData.orderStatus) === "completed";
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.key}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: isDone ? "var(--forest-green)" : "#EFEBE1",
                          color: isDone ? "#FFFFFF" : "var(--secondary-text)",
                          display: "grid",
                          placeItems: "center",
                          marginBottom: "8px",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: isDone ? 700 : 500,
                          color: isDone ? "var(--dark-green)" : "var(--secondary-text)"
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manual Shipping Courier & Tracking Details */}
            {orderData.shipping && (
              <div
                style={{
                  background: "var(--warm-cream)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "20px",
                  marginBottom: "28px"
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "18px",
                    color: "var(--dark-green)",
                    margin: "0 0 12px"
                  }}
                >
                  Manual Shipping & Courier Fulfilment
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    fontSize: "13px"
                  }}
                >
                  <div>
                    <span style={{ color: "var(--secondary-text)", display: "block", fontSize: "11px" }}>
                      Assigned Courier Partner
                    </span>
                    <b>{orderData.shipping.courier_name || "Assigned upon dispatch"}</b>
                  </div>

                  <div>
                    <span style={{ color: "var(--secondary-text)", display: "block", fontSize: "11px" }}>
                      Tracking Number / AWB
                    </span>
                    <b>{orderData.shipping.tracking_number || "Will be updated upon dispatch"}</b>
                  </div>

                  {orderData.shipping.tracking_url && (
                    <div>
                      <span style={{ color: "var(--secondary-text)", display: "block", fontSize: "11px" }}>
                        Live Courier Portal
                      </span>
                      <a
                        href={orderData.shipping.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--forest-green)",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        Open Tracking Website <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>

                {orderData.shipping.notes && (
                  <p style={{ margin: "14px 0 0", fontSize: "12px", color: "var(--secondary-text)", fontStyle: "italic" }}>
                    Note from Atelier: {orderData.shipping.notes}
                  </p>
                )}
              </div>
            )}

            {/* Items Summary */}
            <div style={{ marginTop: "24px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "19px",
                  color: "var(--dark-green)",
                  margin: "0 0 14px"
                }}
              >
                Items in this parcel
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {orderData.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid var(--border-light)",
                      paddingBottom: "10px",
                      fontSize: "13px"
                    }}
                  >
                    <div>
                      <b>{item.product_name}</b>
                      {item.sku && (
                        <small style={{ display: "block", color: "var(--secondary-text)" }}>
                          SKU: {item.sku}
                        </small>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span>Qty: {item.quantity}</span>
                      <b style={{ display: "block", color: "var(--forest-green)" }}>
                        {money(item.line_total || item.unit_price * item.quantity)}
                      </b>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Concierge link */}
            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <a
                href={`https://wa.me/916305630468?text=${encodeURIComponent(
                  `Hello OWLERA Concierge! I am inquiring regarding order ${orderData.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ display: "inline-flex", gap: "8px" }}
              >
                <MessageCircle size={16} /> Contact WhatsApp Support (+91 6305630468)
              </a>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>Loading tracker…</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
