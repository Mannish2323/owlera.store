"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail, MapPin, ShieldCheck, Truck, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export function Footer() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    dept: true,
    care: false,
    trust: false
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-about">
            <Link href="/" aria-label="OWLERA Homepage" style={{ display: "inline-block", marginBottom: "14px" }}>
              <img
                src="/logo-transparent.png"
                alt="OWLERA — Your Everyday Shine"
                className="footer-brand-logo-img"
                width={260}
                height={39}
                style={{ height: "36px", width: "auto", display: "block" }}
              />
            </Link>
            <p>
              Curated everyday jewellery, fashion accessories and thoughtful lifestyle finds crafted to bring quiet luxury and enduring elegance to your routine.
            </p>
            <div className="footer-contact-info">
              <a
                href={`https://wa.me/916305630468?text=${encodeURIComponent(
                  "Hello OWLERA Concierge! I have a query regarding your jewellery collections, pan-India delivery, or styling. Could you please assist me?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-item"
                aria-label="Contact OWLERA Concierge on WhatsApp"
              >
                <MessageCircle size={16} />
                <span>WhatsApp: +91 6305630468</span>
              </a>
              <a href="mailto:concierge@owlera.in" className="footer-contact-item" aria-label="Email OWLERA Concierge">
                <Mail size={16} />
                <span>concierge@owlera.in</span>
              </a>
              <div className="footer-contact-item">
                <MapPin size={16} />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>

          {/* Shop Col */}
          <div className={`footer-col ${openSections.dept ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-accordion-toggle"
              onClick={() => toggleSection("dept")}
              aria-expanded={openSections.dept}
            >
              <h4>Departments</h4>
              <span className="footer-accordion-arrow">
                {openSections.dept ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            <ul className="footer-links-list">
              <li><Link href="/fashion">Fashion & Accessories</Link></li>
              <li><Link href="/crafts-handmade">Crafts & Handmade</Link></li>
              <li><Link href="/lifestyle">Lifestyle</Link></li>
              <li><Link href="/home-decor">Home Decor</Link></li>
              <li><Link href="/pooja-spiritual">Pooja & Spiritual</Link></li>
              <li><Link href="/gifts">Gifts & Suites</Link></li>
              <li><Link href="/shop">All Catalogue</Link></li>
              <li><Link href="/track-order">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Client Care Col */}
          <div className={`footer-col ${openSections.care ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-accordion-toggle"
              onClick={() => toggleSection("care")}
              aria-expanded={openSections.care}
            >
              <h4>Client Care</h4>
              <span className="footer-accordion-arrow">
                {openSections.care ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            <ul className="footer-links-list">
              <li><Link href="/about">About OWLERA</Link></li>
              <li><Link href="/contact">Contact Concierge</Link></li>
              <li><Link href="/faq">Frequently Asked Questions</Link></li>
              <li><Link href="/policies/shipping">Shipping & Pan-India Delivery</Link></li>
              <li><Link href="/policies/returns">Returns & Exchange Policy</Link></li>
              <li><Link href="/policies/cancellation">Cancellation Terms</Link></li>
              <li><Link href="/policies/payment">Payment Information</Link></li>
            </ul>
          </div>

          {/* Legal & Trust Col */}
          <div className={`footer-col ${openSections.trust ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-accordion-toggle"
              onClick={() => toggleSection("trust")}
              aria-expanded={openSections.trust}
            >
              <h4>Integrity & Trust</h4>
              <span className="footer-accordion-arrow">
                {openSections.trust ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            <div className="footer-trust-content">
              <ul className="footer-links-list">
                <li><Link href="/policies/privacy">Privacy Policy</Link></li>
                <li><Link href="/policies/terms">Terms & Conditions</Link></li>
                <li><Link href="/admin">Store Administration</Link></li>
              </ul>
              <div className="footer-badges">
                <div className="footer-badge-item">
                  <ShieldCheck size={16} color="var(--forest-green)" />
                  <span>100% Encrypted Online Payments</span>
                </div>
                <div className="footer-badge-item">
                  <Truck size={16} color="var(--forest-green)" />
                  <span>Insured Pan-India Express Delivery</span>
                </div>
                <div className="footer-badge-item">
                  <RefreshCw size={16} color="var(--forest-green)" />
                  <span>Direct WhatsApp Customer Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} OWLERA. All rights reserved. Registered trademark.
          </div>
          <div className="footer-bottom-meta">
            <span>INR (₹) Online Store</span>
            <span className="separator">✦</span>
            <span>Crafted for Modern Elegance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
