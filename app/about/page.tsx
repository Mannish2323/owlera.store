import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Award } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="about-page-main">
        {/* Editorial Brand Hero */}
        <section className="about-hero">
          <div className="wrap about-hero-container">
            <p className="eyebrow about-eyebrow">
              <Sparkles size={14} /> THE OWLERA HERITAGE
            </p>
            <h1 className="about-headline">
              Elegance that whispers.
            </h1>
            <p className="about-lead">
              Founded on the belief that everyday moments deserve an aura of quiet luxury, OWLERA creates timeless jewellery, accessories and tactile treasures that seamlessly fit your rhythm.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section wrap about-story-section">
          <div className="about-story-body">
            <h2 className="about-section-heading">
              The Inspiration Behind the Name
            </h2>
            <p>
              In classical mythology, the nocturnal owl symbolises perceptive intuition, serene poise and quiet wisdom. OWLERA pairs this emblem with modern geometric silhouettes and radiant warm 18k gold tones.
            </p>
            <p>
              We wanted to counter the culture of disposable fast-fashion jewellery that tarnishes after two wears. By deploying physical vapor deposition (PVD) vacuum gold plating over skin-friendly hypoallergenic bases, our pieces resist everyday moisture, perfumes and atmospheric exposure.
            </p>
          </div>

          {/* Core Brand Pillars */}
          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <Sparkles size={24} />
              </div>
              <h3 className="about-pillar-title">
                Enduring Craft
              </h3>
              <p className="about-pillar-desc">
                18k gold vacuum plating engineered to retain warmth, high reflectance and luster across years of routine wear.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <Heart size={24} />
              </div>
              <h3 className="about-pillar-title">
                Hypoallergenic Comfort
              </h3>
              <p className="about-pillar-desc">
                Zero nickel, zero lead. Designed specifically for sensitive skin with featherlight balance and smooth rounded posts.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <Award size={24} />
              </div>
              <h3 className="about-pillar-title">
                Gifting Rituals
              </h3>
              <p className="about-pillar-desc">
                Presented in signature rigid warm ivory and dark charcoal presentation boxes with hot-stamped gold foil and custom microfiber travel pouches.
              </p>
            </div>
          </div>

          <div className="about-cta-wrap">
            <Link href="/shop" className="btn btn-primary about-cta-btn">
              Discover The Collection <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
