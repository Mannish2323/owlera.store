"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, MessageCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const FAQS = [
  {
    q: "What materials are used in OWLERA jewellery?",
    a: "Our jewellery features 18k gold physical vapor deposition (PVD) vacuum plating layered over surgical-grade hypoallergenic brass or titanium. This advanced coating technique provides superior resistance against tarnishing and everyday perspiration compared to conventional electroplating."
  },
  {
    q: "How does OWLERA handle shipping across India?",
    a: "All orders are manually inspected, packaged in signature presentation boxes, and handed over to trusted insured courier partners (BlueDart Express, Delhivery, and DTDC). Orders are dispatched within 24 to 48 hours. Transit takes 3–5 business days for major cities and 5–7 days for regional pin codes."
  },
  {
    q: "What is your complimentary shipping policy?",
    a: "All orders totaling ₹999 or more qualify for 100% complimentary insured pan-India delivery. For orders below ₹999, a nominal standard shipping fee of ₹99 is added at checkout."
  },
  {
    q: "How do I track my order once placed?",
    a: "You can track your parcel live anytime by visiting our Track Order page (/orders) and entering your unique Order Reference (e.g. OWL-XXXXXXXX) along with your mobile number. Tracking credentials are also updated as soon as the courier scans the parcel at the hub."
  },
  {
    q: "What payment methods are supported?",
    a: "We accept all major online payment instruments via Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit Cards, Debit Cards, NetBanking across 50+ Indian banks, and approved wallet providers. All transactions are protected by 256-bit bank-grade encryption."
  },
  {
    q: "What is the return and replacement policy?",
    a: "We uphold a 48-hour replacement policy for any item that arrives damaged, defective, or incorrect. Because of intimate hygiene protocols for ear jewellery and accessories, worn pieces cannot be refunded for change of mind. Please film a continuous unboxing video when opening your package to expedite replacements."
  },
  {
    q: "Can I request custom gift notes or ribbon packaging?",
    a: "Yes! Every piece comes gift-ready in an OWLERA luxury presentation box and velvet pouch. If you wish to include a custom handwritten message, simply message our concierge on WhatsApp (+91 6305630468) immediately after placing your order."
  }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <Header />

      <main className="wrap" style={{ padding: "60px 0 100px", maxWidth: "840px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>HELP & ADVICE</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 4vw, 48px)",
              color: "var(--dark-green)",
              margin: "6px 0 12px"
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ color: "var(--secondary-text)", fontSize: "14px" }}>
            Everything you need to know about our pieces, pan-India delivery, craftsmanship and care.
          </p>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "24px 32px" }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} style={{ borderBottom: idx === FAQS.length - 1 ? "none" : "1px solid var(--border-light)" }}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                style={{
                  width: "100%",
                  padding: "20px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left",
                  fontFamily: "var(--font-serif)",
                  fontSize: "19px",
                  color: "var(--dark-green)",
                  fontWeight: 500
                }}
              >
                <span>{faq.q}</span>
                {openIdx === idx ? <ChevronUp size={20} color="var(--muted-gold)" /> : <ChevronDown size={20} />}
              </button>

              {openIdx === idx && (
                <div style={{ paddingBottom: "20px", fontSize: "13.5px", lineHeight: "1.8", color: "var(--secondary-text)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "40px",
            background: "var(--warm-cream)",
            border: "1px solid var(--border-color)",
            padding: "28px",
            borderRadius: "var(--radius-sm)",
            textAlign: "center"
          }}
        >
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--dark-green)", margin: "0 0 8px" }}>
            Still have an unanswered question?
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--secondary-text)", margin: "0 0 18px" }}>
            Our WhatsApp concierge is available Monday to Saturday to guide your selection.
          </p>
          <a
            href={`https://wa.me/916305630468?text=${encodeURIComponent(
              "Hello OWLERA Concierge! I have a question regarding an order or product care from the FAQ page."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: "inline-flex", gap: "8px" }}
          >
            <MessageCircle size={16} /> Chat on WhatsApp (+91 6305630468)
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
