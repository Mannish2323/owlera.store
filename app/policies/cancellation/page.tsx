import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CancellationPolicyPage() {
  return (
    <>
      <Header />

      <main className="wrap policy-page">
        <Link href="/policies" className="back-link">
          <ArrowLeft size={14} /> Back to Policies
        </Link>
        <p className="eyebrow">ORDER MODIFICATIONS</p>
        <h1>Cancellation Policy</h1>

        <div className="policy-content-card">
          <h2>1. Cancellation Before Dispatch</h2>
          <p>
            You may request cancellation of an order free of charge within <b>12 hours of placing it</b> or prior to courier handover. Once an order is processed, packaged, and assigned an active courier AWB, cancellation is no longer possible as the parcel has entered the logistics stream.
          </p>

          <h2>2. How to Request Cancellation</h2>
          <p>
            To cancel an eligible pending order:
          </p>
          <ul>
            <li>Message our WhatsApp Concierge at <b>+91 6305630468</b> immediately with your Order Reference.</li>
            <li>Alternatively, email <b>concierge@owlera.in</b> with "URGENT: Order Cancellation - [Order Reference]".</li>
          </ul>

          <h2>3. Refund on Cancellation</h2>
          <p>
            Approved cancellations are processed back to the source bank account or UPI handle via Razorpay within 24 to 48 hours. Depending on your bank, funds typically appear in your account within 3–5 working days.
          </p>

          <h2>4. Cancellation by OWLERA</h2>
          <p>
            OWLERA reserves the right to cancel an order if items fail pre-dispatch quality inspection and no alternative is available, or if the delivery address is unserviceable by our courier network. In such cases, 100% of the paid amount is refunded immediately.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
