import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Refund Policy — OWLERA",
  description: "Official Refund and Dispute Policy for OWLERA e-commerce purchases."
};

export default function RefundsPolicyPage() {
  return (
    <>
      <Header />
      <main className="wrap policy-container" style={{ padding: "48px 0 80px", maxWidth: "800px" }}>
        <Link
          href="/policies"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--bronze-gold)",
            marginBottom: "24px"
          }}
        >
          <ArrowLeft size={14} /> Back to Policies
        </Link>

        <p className="eyebrow">OWLERA CUSTOMER CARE</p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(32px, 4vw, 44px)",
            color: "var(--deep-charcoal)",
            margin: "8px 0 24px"
          }}
        >
          Refund &amp; Settlement Policy
        </h1>
        <small style={{ color: "var(--secondary-text)", display: "block", marginBottom: "32px" }}>
          Last updated: October 2026 | Compliant with Consumer Protection (E-Commerce) Rules, India
        </small>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.85", color: "var(--primary-text)", fontSize: "14.5px" }}>
          <section>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--deep-charcoal)", margin: "0 0 10px" }}>
              1. Scope &amp; Eligibility
            </h2>
            <p>
              At OWLERA, we are committed to exceptional craftsmanship and pristine order fulfillment. Refunds are issued in the following eligible cases:
            </p>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <b>Damaged or Defective Items:</b> If an item arrives broken, defective, or with missing elements, and is reported within 48 hours of recorded delivery accompanied by photographic/video documentation.
              </li>
              <li>
                <b>Incorrect Item Shipped:</b> If you receive a product different from your confirmed order specification.
              </li>
              <li>
                <b>Order Cancellation Before Dispatch:</b> If an order is cancelled prior to courier handover.
              </li>
              <li>
                <b>Unfulfilled Orders / Inventory Shortage:</b> If an item becomes unavailable post-payment due to physical inventory reconciliation.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--deep-charcoal)", margin: "0 0 10px" }}>
              2. Refund Processing Timelines
            </h2>
            <p>
              Once your refund request is inspected and approved by our concierge team:
            </p>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <b>Online Payments (UPI, Net Banking, Debit/Credit Cards via Razorpay):</b> The refund will be initiated through the original payment gateway within 2 business days. The funds will reflect in your bank account or card statement within <b>5 to 7 business days</b> depending on your bank&apos;s settlement schedule.
              </li>
              <li>
                <b>Store Credit / Gift Cards:</b> Issued within 24 hours of approval with a 1-year validity period.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--deep-charcoal)", margin: "0 0 10px" }}>
              3. Non-Refundable Items
            </h2>
            <p>
              In adherence to strict personal hygiene protocols for jewellery and bespoke apparel:
            </p>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Earrings and pierced jewellery that have been opened and worn.</li>
              <li>Personalised, engraved, or customized orders.</li>
              <li>Items returned without original brand packaging, certificate cards, or microfiber pouches.</li>
              <li>Items returned past the 48-hour post-delivery reporting window.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--deep-charcoal)", margin: "0 0 10px" }}>
              4. How to Request a Refund
            </h2>
            <p>
              To initiate a refund, please reach out to our dedicated support channels with your Order Number and unboxing photographs/video:
            </p>
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                padding: "20px",
                borderRadius: "var(--radius-sm)",
                marginTop: "12px"
              }}
            >
              <p style={{ margin: "0 0 8px" }}>
                ✦ <b>WhatsApp Support:</b>{" "}
                <a href="https://wa.me/916305630468" style={{ color: "var(--bronze-gold)", fontWeight: 600 }}>
                  +91 6305630468
                </a>
              </p>
              <p style={{ margin: "0 0 8px" }}>
                ✦ <b>Email Concierge:</b>{" "}
                <a href="mailto:concierge@owlera.in" style={{ color: "var(--bronze-gold)", fontWeight: 600 }}>
                  concierge@owlera.in
                </a>
              </p>
              <p style={{ margin: 0 }}>
                ✦ <b>Operating Hours:</b> Monday through Saturday, 10:00 AM – 7:00 PM IST
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
