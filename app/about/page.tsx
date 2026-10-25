import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Shield, Award } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section
          style={{
            background: "var(--deep-charcoal)",
            color: "var(--warm-cream)",
            padding: "80px 0 60px",
            textAlign: "center"
          }}
        >
          <div className="wrap" style={{ maxWidth: "720px", margin: "0 auto" }}>
            <p className="eyebrow" style={{ color: "var(--bronze-gold)", justifyContent: "center" }}>
              <Sparkles size={14} /> THE OWLERA HERITAGE
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(42px, 5vw, 60px)",
                fontWeight: 400,
                margin: "12px 0 18px",
                color: "var(--warm-cream)"
              }}
            >
              Elegance that whispers.
            </h1>
            <p style={{ fontSize: "16px", lineHeight: "1.9", color: "rgba(247, 243, 233, 0.85)" }}>
              Founded on the belief that everyday moments deserve an aura of quiet luxury, OWLERA creates timeless jewellery, accessories and tactile treasures that seamlessly fit your rhythm.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section wrap" style={{ maxWidth: "860px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", fontSize: "15px", lineHeight: "1.9", color: "var(--primary-text)" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--deep-charcoal)", margin: 0 }}>
              The Inspiration Behind the Name
            </h2>
            <p>
              In classical mythology, the nocturnal owl symbolises perceptive intuition, serene poise and quiet wisdom. OWLERA pairs this emblem with modern geometric silhouettes and radiant warm 18k gold tones.
            </p>
            <p>
              We wanted to counter the culture of disposable fast-fashion jewellery that tarnishes after two wears. By deploying physical vapor deposition (PVD) vacuum gold plating over skin-friendly hypoallergenic bases, our pieces resist everyday moisture, perfumes and atmospheric exposure.
            </p>
          </div>

          {/* Pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              marginTop: "50px"
            }}
          >
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "28px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ color: "var(--bronze-gold)", marginBottom: "12px" }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: "0 0 8px", color: "var(--deep-charcoal)" }}>
                Enduring Craft
              </h3>
              <p style={{ fontSize: "13px", color: "var(--secondary-text)", margin: 0 }}>
                18k gold vacuum plating engineered to retain warmth, high reflectance and luster across years of routine wear.
              </p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "28px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ color: "var(--bronze-gold)", marginBottom: "12px" }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: "0 0 8px", color: "var(--deep-charcoal)" }}>
                Hypoallergenic Comfort
              </h3>
              <p style={{ fontSize: "13px", color: "var(--secondary-text)", margin: 0 }}>
                Zero nickel, zero lead. Designed specifically for sensitive skin with featherlight balance and smooth rounded posts.
              </p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "28px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ color: "var(--bronze-gold)", marginBottom: "12px" }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: "0 0 8px", color: "var(--deep-charcoal)" }}>
                Gifting Rituals
              </h3>
              <p style={{ fontSize: "13px", color: "var(--secondary-text)", margin: 0 }}>
                Presented in signature rigid warm ivory and dark charcoal presentation boxes with hot-stamped gold foil and custom microfiber travel pouches.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Link href="/shop" className="btn btn-primary">
              Discover The Collection <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
