import React from "react";
import Link from "next/link";
import { ArrowRight, Truck, RefreshCw, Shield, FileText, Ban, CreditCard } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const POLICIES = [
  {
    title: "Shipping & Delivery Policy",
    desc: "Manual inspection, courier partners (BlueDart, Delhivery, DTDC), complimentary delivery above ₹999, and pan-India timelines.",
    href: "/policies/shipping",
    icon: Truck
  },
  {
    title: "Returns & Refunds Policy",
    desc: "48-hour replacement guarantee, mandatory unboxing video guidelines, and intimate hygiene protocols.",
    href: "/policies/returns",
    icon: RefreshCw
  },
  {
    title: "Privacy Policy",
    desc: "How we collect, protect, and respect your personal contact information with zero raw card data storage.",
    href: "/policies/privacy",
    icon: Shield
  },
  {
    title: "Terms and Conditions",
    desc: "Governing terms, transparent INR pricing, organic pearl craftsmanship disclosures, and legal jurisdiction.",
    href: "/policies/terms",
    icon: FileText
  },
  {
    title: "Cancellation Policy",
    desc: "Guidelines for cancelling orders prior to courier handover and rapid refund turnaround.",
    href: "/policies/cancellation",
    icon: Ban
  },
  {
    title: "Payment Information",
    desc: "Encrypted Razorpay gateway, UPI, credit/debit cards, NetBanking, and failed transaction resolution.",
    href: "/policies/payment",
    icon: CreditCard
  }
];

export default function PoliciesDirectoryPage() {
  return (
    <>
      <Header />

      <main className="wrap policy-page" style={{ maxWidth: "880px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>CLIENT ASSURANCE</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 4vw, 48px)",
              color: "var(--dark-green)",
              margin: "6px 0 10px"
            }}
          >
            Store Policies & Legal Terms
          </h1>
          <p style={{ color: "var(--secondary-text)", fontSize: "14px" }}>
            Review our business protocols, shipping standards, payment protections and customer guarantees.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px"
          }}
        >
          {POLICIES.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Link
                key={idx}
                href={p.href}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ color: "var(--muted-gold)", marginBottom: "14px" }}>
                  <Icon size={24} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "20px",
                    margin: "0 0 8px",
                    color: "var(--dark-green)"
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ fontSize: "12.5px", color: "var(--secondary-text)", lineHeight: "1.7", margin: "0 0 16px" }}>
                  {p.desc}
                </p>
                <span
                  style={{
                    marginTop: "auto",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: "var(--forest-green)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textTransform: "uppercase"
                  }}
                >
                  Read Policy <ArrowRight size={13} />
                </span>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}
