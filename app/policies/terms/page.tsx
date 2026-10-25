import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="wrap policy-page">
        <Link href="/policies" className="back-link">
          <ArrowLeft size={14} /> Back to Policies
        </Link>
        <p className="eyebrow">LEGAL AGREEMENT</p>
        <h1>Terms and Conditions</h1>

        <div className="policy-content-card">
          <h2>1. Introduction</h2>
          <p>
            Welcome to OWLERA (owlera.in). By accessing our website, browsing our catalogues, or placing orders, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2>2. Pricing & Currency</h2>
          <p>
            All prices on this website are listed in Indian Rupees (INR ₹) and are inclusive of applicable goods and services taxes (GST). We reserve the right to modify prices without prior notice; however, orders already placed and paid for will not be impacted.
          </p>

          <h2>3. Product Accuracy & Craftsmanship</h2>
          <p>
            We strive to display colors, textures, and dimensions as accurately as possible. Because natural freshwater and baroque pearls, natural soy wax, and hand-rolled silks possess organic individuality, slight organic variations in finish or grain are celebrated hallmarks of genuine craft.
          </p>

          <h2>4. Order Acceptance & Verification</h2>
          <p>
            Placement of an order constitutes an offer to purchase. An order is confirmed only upon successful cryptographic payment verification or verified server confirmation. We reserve the right to cancel orders arising from technical errors, stock depletion, or fraudulent payment indicators.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The OWLERA name, abstract owl wings logo emblem, custom graphics, typography and website code are the exclusive intellectual property of OWLERA. Unauthorized reproduction or imitation is prohibited.
          </p>

          <h2>6. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising in connection with transactions on this site shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
