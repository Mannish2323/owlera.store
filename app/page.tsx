import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Package,
  Award,
  Heart,
  Gift,
  Flame,
  Star
} from "lucide-react";
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

  // Specific items matching the reference image
  const newArrivals = [
    products.find(p => p.slug === "lavender-aromatherapy-candle") || products[0],
    products.find(p => p.slug === "rudraksha-bead-bracelet") || products[1],
    products.find(p => p.slug === "mata-ne-graphic-tee") || products[2],
    products.find(p => p.slug === "botanical-crystal-prosperity-tree") || products[3]
  ].filter(Boolean);

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  // 8 primary categories for homepage 4x2 grid
  const homeCategorySlugs = [
    "fashion",
    "crafts-handmade",
    "candles",
    "room-fresheners",
    "home-decor",
    "pooja-spiritual",
    "accessories",
    "gifts"
  ];

  const homeCategories = homeCategorySlugs
    .map(slug => categories.find(c => c.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header />

      <main className="android-home-main">
        {/* ====================================================================
            1. ANDROID HERO BANNER (Matches Screen 1)
            ==================================================================== */}
        <section className="android-hero-banner" role="banner" aria-label="Welcome to OWLERA">
          <div className="hero-banner-backdrop">
            <img
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85"
              alt="Handcrafted lifestyle and spiritual collection"
              className="hero-banner-img"
            />
            <div className="hero-banner-overlay" />
          </div>

          <div className="wrap hero-banner-content">
            <h1 className="hero-banner-title">
              Handcrafted<br />for a Better<br />You
            </h1>
            <p className="hero-banner-sub">
              Fashion • Handmade • Home Decor • Pooja • Spiritual • Gifts
            </p>
            <div className="hero-banner-action">
              <Link href="/shop" className="hero-pill-btn">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>

            {/* Slider Indicator Dots */}
            <div className="hero-slider-dots" aria-hidden="true">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. TRUST FEATURES ROW (4 Columns on Android)
            ==================================================================== */}
        <section className="android-trust-features" aria-label="Trust Features">
          <div className="wrap">
            <div className="trust-features-row">
              <div className="trust-feature-col">
                <div className="trust-feature-icon-circle">
                  <Sparkles size={18} />
                </div>
                <span className="trust-feature-text">Handmade Products</span>
              </div>

              <div className="trust-feature-col">
                <div className="trust-feature-icon-circle">
                  <Award size={18} />
                </div>
                <span className="trust-feature-text">Premium Quality</span>
              </div>

              <div className="trust-feature-col">
                <div className="trust-feature-icon-circle">
                  <Package size={18} />
                </div>
                <span className="trust-feature-text">Safe Packaging</span>
              </div>

              <div className="trust-feature-col">
                <div className="trust-feature-icon-circle">
                  <Truck size={18} />
                </div>
                <span className="trust-feature-text">Pan India Delivery</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. SHOP BY CATEGORY (4 Columns x 2 Rows on Android)
            ==================================================================== */}
        <section className="section-compact wrap" id="categories">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Shop by Category</h2>
            <Link href="/categories" className="compact-section-link">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="android-category-grid">
            {homeCategories.map((cat: any) => (
              <Link href={`/${cat.slug}`} key={cat.id} className="android-category-card">
                <div className="android-category-thumb">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                </div>
                <span className="android-category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================================================================
            4. PROMOTIONAL BANNER 1: FESTIVE COLLECTION (Matches Screen 1)
            ==================================================================== */}
        <section className="android-promo-section wrap">
          <Link href="/pooja-spiritual" className="android-promo-card festive-promo">
            <div className="promo-card-content">
              <span className="promo-badge">Festive Collection</span>
              <h3 className="promo-title">For a Brighter Home</h3>
              <div className="promo-btn-wrap">
                <span className="promo-pill-btn">
                  Shop Now <ArrowRight size={13} />
                </span>
              </div>
            </div>
            <div className="promo-card-image">
              <img
                src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=85"
                alt="Glowing festive brass diya"
                loading="lazy"
              />
            </div>
          </Link>
        </section>

        {/* ====================================================================
            5. NEW ARRIVALS (4-Column Compact Grid, Matches Screen 2)
            ==================================================================== */}
        <section className="section-compact wrap" id="new-arrivals">
          <div className="compact-section-header">
            <h2 className="compact-section-title">New Arrivals</h2>
            <Link href="/shop?filter=new" className="compact-section-link">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="android-products-grid">
            {newArrivals.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ====================================================================
            6. PROMOTIONAL BANNER 2: THOUGHTFUL GIFTS (Matches Screen 2)
            ==================================================================== */}
        <section className="android-promo-section wrap">
          <Link href="/gifts" className="android-promo-card gifts-promo">
            <div className="promo-card-content">
              <span className="promo-badge">Thoughtful Gifts</span>
              <h3 className="promo-title">For Every Occasion</h3>
              <div className="promo-btn-wrap">
                <span className="promo-pill-btn">
                  Explore Gifts <ArrowRight size={13} />
                </span>
              </div>
            </div>
            <div className="promo-card-image">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=85"
                alt="Luxury curated gift box"
                loading="lazy"
              />
            </div>
          </Link>
        </section>

        {/* ====================================================================
            7. FEATURED COLLECTIONS / THE OWLERA EDIT (Multi-category)
            ==================================================================== */}
        <section className="section-compact wrap" id="featured">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Curated Collections</h2>
            <Link href="/shop" className="compact-section-link">
              Browse All ({products.length}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="android-products-grid">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ====================================================================
            8. NEWSLETTER CONCIERGE & FOOTER
            ==================================================================== */}
        <section className="section-compact wrap">
          <div className="newsletter-box">
            <div className="newsletter-copy">
              <span className="eyebrow">✦ PRIVATE CLIENT PRIVILEGES</span>
              <h3>Stay connected with the Atelier.</h3>
              <p>
                Receive seasonal collection releases, private artisan previews, and exclusive offers.
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
