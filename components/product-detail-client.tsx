"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { Product, money } from "@/lib/products";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>("specs");

  const { add } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const discountPercent =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  // WhatsApp Enquiry Link
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://owlerastore.vercel.app/products/${product.slug}`;

  const whatsappEnquiryUrl = `https://wa.me/916305630468?text=${encodeURIComponent(
    `Hello OWLERA Concierge! I am interested in purchasing:\n\n• ${product.name} (${money(product.price)})\n• SKU: ${product.sku}\n• Link: ${currentUrl}\n\nCould you please assist me with availability, delivery timelines, or styling guidance?`
  )}`;

  const handleBuyNow = () => {
    add(product, quantity);
    window.location.href = "/checkout";
  };

  return (
    <main className="wrap">
      {/* Breadcrumb */}
      <div style={{ paddingTop: "28px", paddingBottom: "16px" }}>
        <Link
          href="/shop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--secondary-text)"
          }}
        >
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="product-detail-grid">
        {/* Gallery View */}
        <div>
          <div className="main-gallery-view">
            <img src={selectedImage} alt={product.name} />
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`gallery-thumb ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div className="product-detail-info">
          <div>
            <span className="product-category-tag">{product.category}</span>
            <h1 className="pdp-title">{product.name}</h1>
            <small style={{ color: "var(--secondary-text)", fontSize: "11px" }}>
              SKU: {product.sku}
            </small>
          </div>

          {/* Price Row */}
          <div className="pdp-price-row">
            <span className="pdp-price">{money(product.price)}</span>
            {product.compareAt && (
              <span className="pdp-compare">{money(product.compareAt)}</span>
            )}
            {discountPercent && (
              <span className="pdp-discount-badge">{discountPercent}% OFF</span>
            )}
          </div>

          <p style={{ fontSize: "11px", color: "var(--secondary-text)", margin: 0 }}>
            Inclusive of all taxes. Free insured delivery across India on orders above ₹999.
          </p>

          {/* Description Preview */}
          <p style={{ fontSize: "13.5px", lineHeight: "1.8", color: "var(--primary-text)", margin: "4px 0" }}>
            {product.description}
          </p>

          {/* Stock status */}
          <div>
            {product.stock <= 0 ? (
              <span style={{ color: "#C0392B", fontWeight: 600, fontSize: "13px" }}>
                Currently Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span style={{ color: "#D35400", fontWeight: 600, fontSize: "13px" }}>
                Limited batch — only {product.stock} units remaining
              </span>
            ) : (
              <span style={{ color: "#2E7D32", fontWeight: 600, fontSize: "13px" }}>
                ✓ In Stock & Dispatched within 24–48 hours
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--dark-green)" }}>
                Quantity:
              </span>
              <div className="qty-control" style={{ margin: 0 }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: "24px", textAlign: "center" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pdp-actions">
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: "16px", fontSize: "12px" }}
              disabled={product.stock <= 0}
              onClick={() => add(product, quantity)}
            >
              <ShoppingBag size={16} />
              {product.stock <= 0 ? "Out of Stock" : "Add to Shopping Bag"}
            </button>

            {product.stock > 0 && (
              <button
                className="btn btn-gold"
                style={{ padding: "16px 24px", fontSize: "12px" }}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            )}

            <button
              className={`icon-btn ${inWishlist ? "active" : ""}`}
              style={{
                border: "1px solid var(--border-color)",
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                color: inWishlist ? "#C0392B" : "var(--forest-green)"
              }}
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
            >
              <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* WhatsApp Direct Enquiry */}
          <a
            href={whatsappEnquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              border: "1px solid #25D366",
              color: "#1B8C43",
              background: "rgba(37, 211, 102, 0.06)",
              padding: "12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "12px",
              fontWeight: 600
            }}
          >
            <MessageCircle size={16} />
            Enquire on WhatsApp (+91 6305630468)
          </a>

          {/* Specifications & Policy Accordions */}
          <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)" }}>
            {/* Specs Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setOpenAccordion(openAccordion === "specs" ? "" : "specs")}
              >
                <span>Materials & Specifications</span>
                {openAccordion === "specs" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openAccordion === "specs" && product.specifications && (
                <div className="accordion-content">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "8px 0", fontWeight: 600, width: "35%", color: "var(--dark-green)" }}>
                            {key}
                          </td>
                          <td style={{ padding: "8px 0", color: "var(--secondary-text)" }}>
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Delivery Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
              >
                <span>Insured Shipping & Delivery</span>
                {openAccordion === "shipping" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openAccordion === "shipping" && (
                <div className="accordion-content">
                  <p style={{ margin: "0 0 10px" }}>
                    ✦ <b>Pan-India Delivery:</b> Estimated 3–5 business days for major metropolitan centres; 5–7 business days for regional pin codes.
                  </p>
                  <p style={{ margin: "0 0 10px" }}>
                    ✦ <b>Courier Partners:</b> Dispatched manually through BlueDart, Delhivery, or DTDC with authentic tracking credentials shared via SMS/Email.
                  </p>
                  <p style={{ margin: 0 }}>
                    ✦ <b>Packaging:</b> Signature velvet pouch and rigid gift-ready presentation box.
                  </p>
                </div>
              )}
            </div>

            {/* Returns Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setOpenAccordion(openAccordion === "returns" ? "" : "returns")}
              >
                <span>Returns & Replacements</span>
                {openAccordion === "returns" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openAccordion === "returns" && (
                <div className="accordion-content">
                  <p style={{ margin: 0 }}>
                    We offer a 48-hour replacement guarantee for damaged, defective, or incorrect items reported with an unboxing video. Because of hygiene protocols for fashion jewellery, worn pieces are non-returnable. Please inspect your items upon delivery.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section" style={{ borderTop: "1px solid var(--border-color)", marginTop: "40px" }}>
          <div className="section-head">
            <div>
              <p className="eyebrow">CURATED PAIRINGS</p>
              <h2 className="section-title">You May Also Admire</h2>
            </div>
            <Link href="/shop" className="section-link">
              View Complete Edit
            </Link>
          </div>

          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
