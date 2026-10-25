import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ReturnsPolicyPage() {
  return (
    <>
      <Header />

      <main className="wrap policy-page">
        <Link href="/policies" className="back-link">
          <ArrowLeft size={14} /> Back to Policies
        </Link>
        <p className="eyebrow">QUALITY GUARANTEE</p>
        <h1>Returns & Refunds Policy</h1>

        <div className="policy-content-card">
          <h2>1. 48-Hour Replacement Guarantee</h2>
          <p>
            We take immense pride in our craftsmanship. In the rare event that an item reaches you in a damaged, defective, or incorrect state, we provide a hassle-free replacement or store credit when notified within <b>48 hours of recorded delivery</b>.
          </p>

          <h2>2. Unboxing Video Requirement</h2>
          <p>
            To protect against postal tampering and authenticate transit damage, clients are kindly requested to record a <b>clear, uninterrupted video while unboxing</b> the outer courier package and product presentation box.
          </p>

          <h2>3. Hygiene & Exclusion Protocol</h2>
          <p>
            In accordance with international hygiene and sanitary regulations governing intimate fashion jewellery (earrings, studs, huggies) and personal care items (candles, skincare), items that have been worn, unsealed, or altered cannot be returned for change of mind.
          </p>

          <h2>4. Replacement Procedure</h2>
          <p>
            To initiate an authorized replacement:
          </p>
          <ul>
            <li>Message our WhatsApp Concierge at <b>+91 6305630468</b> or email <b>concierge@owlera.in</b>.</li>
            <li>Provide your Order Reference (e.g. OWL-XXXXXXXX) and attach the unboxing video with photos.</li>
            <li>Our team will arrange a reverse pickup or dispatch a brand-new replacement parcel within 48 hours of verification.</li>
          </ul>

          <h2>5. Refund Process</h2>
          <p>
            When a replacement piece is unavailable, refunds are credited back to the original source payment instrument (card, UPI, or netbanking) via Razorpay within 5–7 business days following our receipt and verification of the returned item.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
