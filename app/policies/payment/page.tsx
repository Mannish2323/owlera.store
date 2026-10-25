import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, CreditCard } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PaymentInfoPage() {
  return (
    <>
      <Header />

      <main className="wrap policy-page">
        <Link href="/policies" className="back-link">
          <ArrowLeft size={14} /> Back to Policies
        </Link>
        <p className="eyebrow">TRANSACTION SECURITY</p>
        <h1>Payment Information</h1>

        <div className="policy-content-card">
          <h2>1. Online Payment Gateway (Razorpay)</h2>
          <p>
            OWLERA partners with <b>Razorpay</b>, India's leading payment infrastructure provider, to process all online payments safely. All transactions occur over 256-bit SSL encrypted connections complying with global PCI-DSS Level 1 specifications.
          </p>

          <h2>2. Accepted Payment Instruments</h2>
          <p>
            We accept all standard domestic and international payment methods in Indian Rupees (INR ₹):
          </p>
          <ul>
            <li><b>UPI:</b> Google Pay, PhonePe, Paytm, BHIM, and any bank UPI app.</li>
            <li><b>Cards:</b> Visa, MasterCard, RuPay, Maestro, and American Express credit and debit cards.</li>
            <li><b>NetBanking:</b> 50+ Indian commercial and public sector banks.</li>
            <li><b>Wallets:</b> Mobikwik, Freecharge, Airtel Money, and others supported via Razorpay.</li>
          </ul>

          <h2>3. Zero Card Data Storage</h2>
          <p>
            OWLERA does not collect, capture, or store your sensitive card CVV, expiry dates, or banking passwords. All cryptographic validations take place directly between your browser, Razorpay and your issuing bank.
          </p>

          <h2>4. Failed or Interrupted Transactions</h2>
          <p>
            If your account was debited during an interrupted or failed checkout, banks generally reverse the held funds automatically within 24 to 48 hours. If the amount is captured but no order confirmation appears, please message WhatsApp Concierge at <b>+91 6305630468</b> with your transaction reference.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
