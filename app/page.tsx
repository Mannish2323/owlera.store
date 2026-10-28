import Link from "next/link";
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw, MessageCircle, Star } from "lucide-react";
import { getProducts, getCategories, demoCollections } from "@/lib/products";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <>
      <Header />

      <main>
        {/* ====================================================================
            1. EDITORIAL SPLIT HERO SECTION
            ==================================================================== */}
        <section className="editorial-hero wrap">
          <div className="hero-split-grid">
            <div className="hero-editorial-copy">
              <span className="hero-eyebrow">
                <Sparkles size={14} /> THOUGHTFULLY CURATED FOR EVERYDAY LIVING
              </span>
              <h1 className="hero-headline">
                Little things. A more <em>beautiful everyday.</em>
              </h1>
              <p className="hero-description">
                Discover thoughtfully selected accessories, handmade creations, meaningful gifts and lifestyle finds, curated for your everyday moments.
              </p>

              <div className="hero-cta-group">
                <Link className="btn btn-primary" href="#categories">
                  Explore Collections <ArrowRight size={14} />
                </Link>
                <Link className="btn btn-outline" href="/about">
                  Discover Our Story
                </Link>
              </div>

              <div className="hero-trust-badges">
                <span>✦ 18k Gold-Tone PVD Plating</span>
                <span>✦ Insured Pan-India Dispatch</span>
                <span>✦ WhatsApp Concierge</span>
              </div>
            </div>

            <div className="hero-media-stage">
              <img
                src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=90"
                alt="OWLERA Lifestyle & Accessories — Thoughtfully Curated for Modern Living"
              />
              <div className="hero-editorial-pill">
                <b>THE LIFESTYLE ATELIER</b>
                <small>CURATED IN INDIA ✦ EVERYDAY ELEGANCE</small>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. TRUST PILLARS BAR (THE 4 PILLARS)
            ==================================================================== */}
        <section className="trust-pillars-section">
          <div className="wrap">
            <div className="trust-pillars-grid">
              <div className="trust-pillar-card">
                <div className="trust-pillar-icon">
                  <Truck size={20} />
                </div>
                <div className="trust-pillar-content">
                  <b>Complimentary Pan-India Delivery</b>
                  <p>On orders above ₹999 via BlueDart & Express</p>
                </div>
              </div>

              <div className="trust-pillar-card">
                <div className="trust-pillar-icon">
                  <RefreshCw size={20} />
                </div>
                <div className="trust-pillar-content">
                  <b>7-Day Seamless Exchanges</b>
                  <p>Hassle-free replacement & doorstep pickup assistance</p>
                </div>
              </div>

              <div className="trust-pillar-card">
                <div className="trust-pillar-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="trust-pillar-content">
                  <b>100% Encrypted Checkout</b>
                  <p>Razorpay verified — UPI, Cards, NetBanking</p>
                </div>
              </div>

              <div className="trust-pillar-card">
                <div className="trust-pillar-icon">
                  <MessageCircle size={20} />
                </div>
                <div className="trust-pillar-content">
                  <b>Direct WhatsApp Concierge</b>
                  <p>Instant styling advice at +91 6305630468</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. SHOP BY CATEGORY (6 DISTINCT DEPARTMENTS)
            ==================================================================== */}
        <section className="section wrap" id="categories">
          <div className="section-head">
            <div>
              <span className="category-tag">CURATED DEPARTMENTS</span>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link href="/shop" className="section-link">
              View All Catalogue ({products.length}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="category-grid">
            {categories.slice(0, 6).map(cat => (
              <Link href={`/${cat.slug}`} key={cat.id} className="category-card">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="category-overlay">
                  <span className="category-tag">Department</span>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <span className="category-action">
                    Explore Department <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================================================================
            4. FEATURED PRODUCTS (THE OWLERA EDIT)
            ==================================================================== */}
        <section className="section wrap" id="featured">
          <div className="section-head">
            <div>
              <span className="category-tag">THE OWLERA EDIT</span>
              <h2 className="section-title">Most Coveted Pieces</h2>
            </div>
            <Link href="/shop" className="section-link">
              Browse All Pieces <ArrowRight size={13} />
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ====================================================================
            5. CRAFTSMANSHIP & BRAND STORY SECTION
            ==================================================================== */}
        <section className="craftsmanship-section">
          <div className="wrap craftsmanship-grid">
            <div className="craftsmanship-copy">
              <span className="eyebrow">
                <Sparkles size={14} /> HANDCRAFTED WITH INTENTION
              </span>
              <h2 className="craftsmanship-title">
                Handcrafted with intention. Made to be <em>lived in everyday.</em>
              </h2>
              <p className="craftsmanship-desc">
                Founded on the quiet philosophy of everyday refinement, OWLERA curates fine accessories, artisanal crafts, and serene home objects. From anti-tarnish 18k gold-tone vacuum plating to slow-poured botanical candles and sand-cast brass sacred artifacts, every creation is designed to elevate your daily rituals.
              </p>

              <div className="craftsmanship-pillars">
                <div className="craftsmanship-pillar">
                  <b>18K Gold PVD</b>
                  <span>Hypoallergenic, water-resistant & tarnish-free durability</span>
                </div>
                <div className="craftsmanship-pillar">
                  <b>Artisanal Touch</b>
                  <span>Crafted with Indian regional artisan studios</span>
                </div>
                <div className="craftsmanship-pillar">
                  <b>Quiet Luxury</b>
                  <span>Timeless proportions for day-to-night elegance</span>
                </div>
              </div>

              <Link href="/about" className="btn btn-gold">
                Discover Our Story <ArrowRight size={14} />
              </Link>
            </div>

            <div className="craftsmanship-media">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
                alt="OWLERA Atelier Craftsmanship — Fine Accessories and Lifestyle Accents"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ====================================================================
            6. EDITORIAL LIFESTYLE SANCTUARY FEATURE
            ==================================================================== */}
        <section className="editorial-feature-section wrap">
          <div className="editorial-feature-card">
            <div className="editorial-feature-img">
              <img
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85"
                alt="OWLERA Sanctuary Living — Contemporary Indian Lifestyle & Home Accents"
                loading="lazy"
              />
            </div>
            <div className="editorial-feature-content">
              <span className="eyebrow">THE LIVING SANCTUARY</span>
              <h3>Living with intentional aesthetics.</h3>
              <p>
                Your personal space and daily adornment should be a reflection of calm intention. Discover our handpicked objects that bring harmony, natural scents, and warm metallic light to modern Indian homes.
              </p>
              <div>
                <Link href="/lifestyle" className="btn btn-primary">
                  Explore Lifestyle Finds <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            7. CURATED SUITES & COLLECTIONS
            ==================================================================== */}
        <section className="section wrap" id="collections">
          <div className="section-head">
            <div>
              <span className="category-tag">CURATED SUITES</span>
              <h2 className="section-title">Explore by Collection</h2>
            </div>
            <Link href="/shop" className="section-link">
              View All Collections <ArrowRight size={13} />
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
                    Explore Suite <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================================================================
            8. NEW ARRIVALS SPOTLIGHT
            ==================================================================== */}
        {newArrivals.length > 0 && (
          <section className="section wrap">
            <div className="section-head">
              <div>
                <span className="category-tag">FRESH OFF THE ATELIER</span>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <Link href="/shop?filter=new" className="section-link">
                View New Season <ArrowRight size={13} />
              </Link>
            </div>

            <div className="product-grid">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* ====================================================================
            9. CLIENT TESTIMONIALS / REVIEWS
            ==================================================================== */}
        <section className="section wrap" style={{ paddingTop: "20px" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
            <span className="category-tag" style={{ justifyContent: "center" }}>CLIENT VOICES</span>
            <h2 className="section-title">Loved Across India</h2>
            <p style={{ fontSize: "13px", color: "var(--secondary-text)", marginTop: "6px" }}>
              Verified testimonials shared by our customers via WhatsApp and direct order feedback.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-quote">
                “The Celeste hoops and the brass urli were both packaged so elegantly. The gold tone is warm without being gaudy, and the weight is completely comfortable for 10-hour workdays.”
              </p>
              <b className="testimonial-author">Ananya S.</b>
              <span className="testimonial-meta">Mumbai, Maharashtra • Verified Buyer</span>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-quote">
                “Ordered the artisan gift suite for our family celebration. Incredible craftsmanship and the WhatsApp support team answered my questions about express delivery in less than 5 minutes!”
              </p>
              <b className="testimonial-author">Rohan M.</b>
              <span className="testimonial-meta">Bengaluru, Karnataka • Verified Buyer</span>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-quote">
                “The botanical amber candle fills my living room with the most subtle, calming fragrance. Truly quiet luxury. Fast, insured delivery arrived in 3 days.”
              </p>
              <b className="testimonial-author">Kavita N.</b>
              <span className="testimonial-meta">New Delhi • Verified Buyer</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            10. NEWSLETTER SECTION
            ==================================================================== */}
        <section className="newsletter-section wrap">
          <div className="newsletter-box">
            <div>
              <span className="category-tag">THE OWLERA CIRCLE</span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "30px",
                  color: "var(--forest-green)",
                  margin: "8px 0 10px"
                }}
              >
                Join our intimate circle.
              </h2>
              <p style={{ fontSize: "13px", color: "var(--secondary-text)", margin: 0, lineHeight: 1.6 }}>
                Receive private access to new limited batches, seasonal previews, and interior styling journals.
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
