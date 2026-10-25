import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="wrap policy-page">
        <Link href="/policies" className="back-link">
          <ArrowLeft size={14} /> Back to Policies
        </Link>
        <p className="eyebrow">CUSTOMER PRIVACY</p>
        <h1>Privacy Policy</h1>

        <div className="policy-content-card">
          <h2>1. Information We Collect</h2>
          <p>
            OWLERA collects minimal personal information necessary to fulfil your orders and provide attentive customer service. This includes your name, email address, shipping address, 10-digit mobile phone number, and IP address for fraud detection.
          </p>

          <h2>2. Payment Information Security</h2>
          <p>
            <b>We never store, see, or transmit raw credit card details, debit card PINs, or netbanking passwords on our servers.</b> All transactions are tokenised and encrypted by our PCI-DSS Level 1 certified payment gateway partner, Razorpay.
          </p>

          <h2>3. How We Use Your Data</h2>
          <p>
            Your information is used solely to:
          </p>
          <ul>
            <li>Process, authenticate and deliver your orders.</li>
            <li>Send dispatch, delivery and courier tracking notifications.</li>
            <li>Respond to styling and client care inquiries via WhatsApp or email.</li>
            <li>Send infrequent collection announcements (only with your voluntary subscription).</li>
          </ul>

          <h2>4. Data Sharing & Third Parties</h2>
          <p>
            We strictly do not sell, rent, or trade your personal information. Relevant details are shared exclusively with trusted service providers necessary for business operations: logistics couriers (BlueDart, Delhivery, DTDC) to deliver your parcel and Razorpay to process payments.
          </p>

          <h2>5. Your Rights & Data Deletion</h2>
          <p>
            You have the right to request access to, correction of, or permanent deletion of your customer record. To exercise these rights, please email <b>concierge@owlera.in</b>.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
