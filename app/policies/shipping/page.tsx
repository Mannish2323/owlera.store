import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />

      <main className="wrap policy-page">
        <Link href="/policies" className="back-link">
          <ArrowLeft size={14} /> Back to Policies
        </Link>
        <p className="eyebrow">FULFILMENT STANDARDS</p>
        <h1>Shipping & Delivery Policy</h1>

        <div className="policy-content-card">
          <h2>1. Manual Fulfilment & Inspection</h2>
          <p>
            At OWLERA, every order is treated with personal consideration. Our atelier team manually inspects each jewellery piece, handbag and candle for surface purity, clasp resilience and presentation integrity before sealing it in signature velvet packaging.
          </p>

          <h2>2. Processing & Dispatch Timelines</h2>
          <p>
            Orders are prepared and packed within 24 to 48 hours following payment confirmation. Dispatches take place Monday through Saturday, excluding gazetted Indian national holidays.
          </p>

          <h2>3. Domestic Delivery Timelines (India)</h2>
          <p>
            We partner with premier insured logistics providers including <b>BlueDart Express</b>, <b>Delhivery</b>, and <b>DTDC</b>:
          </p>
          <ul>
            <li><b>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</b> 3 to 5 business days from dispatch.</li>
            <li><b>Tier 2 & Tier 3 Cities:</b> 4 to 6 business days from dispatch.</li>
            <li><b>North-East, J&K, & Regional Pin Codes:</b> 5 to 7 business days from dispatch.</li>
          </ul>

          <h2>4. Shipping Charges & Complimentary Delivery</h2>
          <p>
            Orders totaling <b>₹999 or more</b> receive 100% complimentary insured pan-India delivery. For orders below ₹999, a flat shipping fee of <b>₹99</b> is applied and shown transparently before payment.
          </p>

          <h2>5. Live Tracking Credentials</h2>
          <p>
            Upon courier collection from our Hyderabad facility, your Air Waybill (AWB) and courier tracking portal URL are updated. You can monitor progress anytime at <Link href="/orders" style={{ color: "var(--forest-green)", textDecoration: "underline" }}>owlera.in/orders</Link>.
          </p>

          <h2>6. Undelivered Parcels & Delivery Inquiries</h2>
          <p>
            Couriers will attempt delivery up to three times. If you require assistance regarding an in-transit parcel, please contact our WhatsApp Concierge at <b>+91 6305630468</b> with your Order Reference.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
