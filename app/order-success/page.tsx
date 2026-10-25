"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Truck, MessageCircle, ArrowRight, ShieldCheck, Package } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "OWL-ORDER";
  const isDemo = searchParams.get("demo") === "1";

  const whatsappSupportUrl = `https://wa.me/916305630468?text=${encodeURIComponent(
    `Hello OWLERA Concierge! I just placed order ${orderNumber}. Could you please confirm estimated dispatch time?`
  )}`;

  return (
    <>
      <Header />

      <main className="wrap" style={{ padding: "60px 0 100px", maxWidth: "760px", margin: "0 auto" }}>
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-sm)",
            padding: "48px 36px",
            boxShadow: "var(--shadow-sm)",
            textAlign: "center"
          }}
        >
          {/* Success Check Icon */}
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(18, 61, 46, 0.1)",
              display: "grid",
              placeItems: "center",
              color: "var(--forest-green)",
              margin: "0 auto 20px"
            }}
          >
            <CheckCircle size={36} />
          </div>

          <p className="eyebrow" style={{ justifyContent: "center" }}>
            THANK YOU FOR CHOOSING OWLERA
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4vw, 46px)",
              color: "var(--dark-green)",
              margin: "8px 0 16px"
            }}
          >
            Your order is confirmed.
          </h1>

          <div
            style={{
              display: "inline-block",
              background: "var(--warm-cream)",
              border: "1px solid var(--border-color)",
              padding: "10px 24px",
              borderRadius: "var(--radius-sm)",
              margin: "8px 0 24px",
              fontSize: "14px"
            }}
          >
            Order Reference: <b style={{ color: "var(--forest-green)", letterSpacing: "1px" }}>{orderNumber}</b>
          </div>

          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.8",
              color: "var(--secondary-text)",
              maxWidth: "520px",
              margin: "0 auto 28px"
            }}
          >
            {isDemo
              ? "Your order has been recorded in test mode. When live Razorpay credentials are configured, customer payments are collected securely through encrypted bank authorization."
              : "We have received your payment and order confirmation. Our team is preparing your selection with our signature presentation packaging."}
          </p>

          {/* Next Steps Timeline Card */}
          <div
            style={{
              background: "var(--warm-cream)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "24px",
              textAlign: "left",
              marginBottom: "32px"
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "19px",
                color: "var(--dark-green)",
                margin: "0 0 16px"
              }}
            >
              What happens next?
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Package size={18} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <b style={{ color: "var(--dark-green)" }}>Handcrafted Inspection & Packing:</b>
                  <p style={{ margin: "2px 0 0", color: "var(--secondary-text)" }}>
                    Every jewel and lifestyle piece undergoes rigorous quality assessment and is wrapped in our signature velvet pouch and rigid gift box.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Truck size={18} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <b style={{ color: "var(--dark-green)" }}>Manual Courier Dispatch (24–48 Hours):</b>
                  <p style={{ margin: "2px 0 0", color: "var(--secondary-text)" }}>
                    Once dispatched via BlueDart or Delhivery, your tracking number and live status will be available on our Track Order portal.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <ShieldCheck size={18} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <b style={{ color: "var(--dark-green)" }}>Insured Pan-India Transit:</b>
                  <p style={{ margin: "2px 0 0", color: "var(--secondary-text)" }}>
                    All shipments are fully insured until handed to you in person.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center"
            }}
          >
            <Link
              href={`/orders?orderNumber=${encodeURIComponent(orderNumber)}`}
              className="btn btn-primary"
              style={{ width: "min(340px, 100%)", padding: "14px" }}
            >
              Track Order Progress <ArrowRight size={15} />
            </Link>

            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#1B8C43",
                fontSize: "12.5px",
                fontWeight: 600,
                marginTop: "6px"
              }}
            >
              <MessageCircle size={16} /> Need help? Chat with Concierge on WhatsApp
            </a>

            <Link
              href="/shop"
              style={{
                fontSize: "12px",
                color: "var(--secondary-text)",
                marginTop: "14px",
                textDecoration: "underline"
              }}
            >
              Continue exploring OWLERA
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>Loading confirmation…</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
