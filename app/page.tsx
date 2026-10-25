import Link from "next/link";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Gift, MessageCircle, Star } from "lucide-react";
import { getProducts, demoCollections } from "@/lib/products";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { HangingLogo } from "@/components/hanging-logo";
import { NewsletterForm } from "@/components/newsletter-form";

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <>
      <Header />

      <main>
        {/* HERO SECTION WITH SUSPENDED SWINGING OWLERA WORDMARK */}
        <section className="hero-section wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              {/* The suspended swinging OWLERA wordmark connected by fine chains */}
              <HangingLogo />

              <div style={{ marginTop: "16px" }}>
                <p className="eyebrow">
                  <Sparkles size={15} /> LITTLE DETAILS. ENDURING LUXURY.
                </p>
                <h2 className="hero-title">
                  Quiet elegance, crafted for your <em>everyday moments.</em>
                </h2>
                <p className="hero-description">
                  Discover thoughtfully sculpted 18k gold-tone jewellery, refined fashion accessories and artisanal lifestyle finds. Mastered for effortless day-to-night styling.
                </p>

                <div className="hero-actions">
                  <Link className="btn btn-primary" href="/shop">
                    Shop The Edit <ArrowRight size={15} />
                  </Link>
                  <Link className="btn btn-outline" href="/about">
                    Our Heritage
                  </Link>
                </div>

                <div className="hero-proof">
                  <span>✦ 18k Gold-Tone PVD Plating</span>
                  <span>✦ Insured Pan-India Dispatch</span>
                  <span>✦ WhatsApp Concierge</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Campaign Asset */}
            <div className="hero-visual">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=95"
                alt="OWLERA Haute Joaillerie — Layered 18k Gold-Tone Pendants and Baroque Pearl"
              />
              <div className="hero-stamp">
                <b>THE HERITAGE EDIT</b>
                <small>18K GOLD-TONE FINISH ✦ HYDERABAD</small>
              </div>
            </div>
          </div>
        </section>

        {/* GENUINE BRAND BENEFITS BAR */}
        <section className="benefits-banner">
          <div className="wrap">
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Truck size={20} />
                </div>
                <div className="benefit-text">
                  <b>Complimentary Pan-India Delivery</b>
                  <small>On orders above ₹999 via BlueDart & Express</small>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Sparkles size={20} />
                </div>
                <div className="benefit-text">
                  <b>18K Gold-Tone Finish & PVD Coating</b>
                  <small>Anti-tarnish, water-resistant & hypoallergenic</small>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="benefit-text">
                  <b>100% Encrypted Checkout</b>
                  <small>Razorpay verified — UPI, Cards, NetBanking</small>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <MessageCircle size={20} />
                </div>
                <div className="benefit-text">
                  <b>WhatsApp Concierge</b>
                  <small>Direct stylist care at +91 6305630468</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED COLLECTIONS BENTO */}
        <section className="section wrap" id="collections">
          <div className="section-head">
            <div>
              <p className="eyebrow">CURATED SUITES</p>
              <h2 className="section-title">Explore by Collection</h2>
            </div>
            <Link href="/shop" className="section-link">
              View All Catalogue <ArrowRight size={14} />
            </Link>
          </div>

          <div className="collections-grid">
            {demoCollections.map(col => (
              <Link
                href={`/collections/${col.slug}`}
                key={col.id}
                className="collection-card"
              >
                <img src={col.bannerImage} alt={col.name} loading="lazy" />
                <div className="collection-overlay">
                  <h3>{col.name}</h3>
                  <p>{col.description}</p>
                  <span className="collection-cta">
                    Explore Collection <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS (THE OWLERA EDIT) */}
        <section className="section wrap" id="shop">
          <div className="section-head">
            <div>
              <p className="eyebrow">THE OWLERA EDIT</p>
              <h2 className="section-title">Most Coveted Pieces</h2>
            </div>
            <Link href="/shop" className="section-link">
              Browse All ({products.length}) <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* BRAND STORY */}
        <section className="story-section">
          <div className="wrap story-grid">
            <div className="story-copy">
              <p className="eyebrow">THE OWLERA PHILOSOPHY</p>
              <h2 className="story-title">
                Beauty lives in the <em>unspoken details.</em>
              </h2>
              <p className="story-p">
                Named after the visionary wisdom and graceful poise of the nocturnal owl, OWLERA was born out of an appreciation for everyday indulgence. We believe luxury should never be preserved merely for rare calendar dates.
              </p>
              <p className="story-p">
                Each piece—from our featherlight paperclip chains to hand-poured amber botanical candles—is curated with tactile intention, timeless proportion and lasting comfort.
              </p>
              <Link href="/about" className="btn btn-gold">
                Read Our Story <ArrowRight size={14} />
              </Link>
            </div>

            <div className="story-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
                alt="Crafting fine jewellery and lifestyle finds at OWLERA"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* CAMPAIGN / NEW ARRIVALS SPOTLIGHT */}
        {newArrivals.length > 0 && (
          <section className="section wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">FRESH OFF THE ATELIER</p>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <Link href="/shop?filter=new" className="section-link">
                View New Season <ArrowRight size={14} />
              </Link>
            </div>

            <div className="product-grid">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* CUSTOMER REVIEWS / SOCIAL PROOF */}
        <section className="section wrap" style={{ paddingTop: "20px" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
            <p className="eyebrow" style={{ justifyContent: "center" }}>CLIENT VOICES</p>
            <h2 className="section-title">Loved Across India</h2>
            <p style={{ fontSize: "12.5px", color: "var(--secondary-text)", marginTop: "6px" }}>Testimonials shared by our customers via WhatsApp and email.</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px"
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                padding: "28px",
                borderRadius: "var(--radius-sm)"
              }}
            >
              <div style={{ display: "flex", gap: "4px", color: "var(--bronze-gold)", marginBottom: "12px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p style={{ fontStyle: "italic", fontSize: "13px", lineHeight: "1.7", color: "var(--primary-text)" }}>
                “The gold hoops are simply stunning! They are so lightweight I forget I have them on, yet they instantly elevate every work outfit. The packaging was immaculate.”
              </p>
              <b style={{ display: "block", marginTop: "14px", fontSize: "12px", color: "var(--deep-charcoal)" }}>
                Ananya S. — Mumbai
              </b>
              <small style={{ color: "var(--secondary-text)", fontSize: "11px" }}>Customer Testimonial</small>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                padding: "28px",
                borderRadius: "var(--radius-sm)"
              }}
            >
              <div style={{ display: "flex", gap: "4px", color: "var(--bronze-gold)", marginBottom: "12px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p style={{ fontStyle: "italic", fontSize: "13px", lineHeight: "1.7", color: "var(--primary-text)" }}>
                “Ordered for my sister’s anniversary. She was amazed by the quality and the WhatsApp customer support answered all my queries within minutes!”
              </p>
              <b style={{ display: "block", marginTop: "14px", fontSize: "12px", color: "var(--deep-charcoal)" }}>
                Rohan M. — Bengaluru
              </b>
              <small style={{ color: "var(--secondary-text)", fontSize: "11px" }}>Customer Testimonial</small>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                padding: "28px",
                borderRadius: "var(--radius-sm)"
              }}
            >
              <div style={{ display: "flex", gap: "4px", color: "var(--bronze-gold)", marginBottom: "12px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p style={{ fontStyle: "italic", fontSize: "13px", lineHeight: "1.7", color: "var(--primary-text)" }}>
                “The pendant has the most radiant gold tone I’ve seen in fashion jewellery. Truly feels like an heirloom piece. Arrived in Delhi in just 3 days.”
              </p>
              <b style={{ display: "block", marginTop: "14px", fontSize: "12px", color: "var(--deep-charcoal)" }}>
                Kavita N. — New Delhi
              </b>
              <small style={{ color: "var(--secondary-text)", fontSize: "11px" }}>Customer Testimonial</small>
            </div>
          </div>
        </section>

        {/* NEWSLETTER SECTION */}
        <section className="newsletter-section wrap">
          <div className="newsletter-box">
            <div>
              <p className="eyebrow">THE OWLERA CIRCLE</p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "30px",
                  color: "var(--dark-green)",
                  margin: "8px 0 10px"
                }}
              >
                Join our intimate circle.
              </h2>
              <p style={{ fontSize: "13px", color: "var(--secondary-text)", margin: 0 }}>
                Receive private access to new limited batches, seasonal previews and styling journals.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
