"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, ArrowLeft, Check, User, Truck } from "lucide-react";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";

export function Header() {
  const pathname = usePathname();
  const { count: cartCount, setOpen: setCartOpen, applyCoupon } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [mobilePromoIndex, setMobilePromoIndex] = useState(0);

  // Rotate mobile promotional messages gracefully without taking up excessive screen space
  useEffect(() => {
    const timer = setInterval(() => {
      setMobilePromoIndex(prev => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Handle ESC key to dismiss mobile drawer or search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = "/search";
    }
  };

  const handleCopyCoupon = () => {
    applyCoupon("OWLFIRST10");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("OWLFIRST10").catch(() => {});
    }
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const navLinks = [
    { label: "Fashion & Accessories", href: "/fashion" },
    { label: "Crafts & Handmade", href: "/crafts-handmade" },
    { label: "Lifestyle", href: "/lifestyle" },
    { label: "Home Decor", href: "/home-decor" },
    { label: "Pooja & Spiritual", href: "/pooja-spiritual" },
    { label: "Gifts", href: "/gifts" },
    { label: "New Arrivals", href: "/shop?filter=new" }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar" role="region" aria-label="Store Announcements">
        <div className="wrap announcement-inner">
          {/* Desktop full announcement */}
          <div
            className="announcement-text announcement-desktop-view"
            onClick={handleCopyCoupon}
            role="button"
            tabIndex={0}
            aria-label="Complimentary shipping and 10% coupon promo. Click to copy coupon."
          >
            <span>Complimentary Pan-India Insured Shipping on orders above ₹999</span>
            <span className="announcement-separator">•</span>
            <span className="announcement-promo">
              {copiedCoupon ? (
                <span className="coupon-copied">
                  <Check size={12} /> OWLFIRST10 Applied (10% Off)
                </span>
              ) : (
                <span>Use code <strong>OWLFIRST10</strong> for 10% off</span>
              )}
            </span>
          </div>

          {/* Mobile rotating compact ticker (single clean line, zero awkward wrapping) */}
          <div
            className="announcement-text announcement-mobile-view"
            onClick={handleCopyCoupon}
            role="button"
            tabIndex={0}
            aria-live="polite"
            aria-label="Click to copy 10% discount code OWLFIRST10"
          >
            {copiedCoupon ? (
              <span className="coupon-copied">
                <Check size={12} /> OWLFIRST10 Applied (10% Off)
              </span>
            ) : mobilePromoIndex === 0 ? (
              <span>Complimentary Pan-India Shipping over ₹999</span>
            ) : (
              <span>
                Use code <strong>OWLFIRST10</strong> for 10% off ✦ Tap to copy
              </span>
            )}
          </div>

          <div className="announcement-help">
            <Link href="/track-order">Track Order</Link>
            <span className="announcement-separator">•</span>
            <a href="https://wa.me/916305630468" target="_blank" rel="noopener noreferrer">
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="wrap nav-container">
          {/* Mobile menu trigger on the left */}
          {pathname === "/" ? (
            <button
              className="mobile-menu-btn"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          ) : (
            <button
              className="mobile-menu-btn"
              aria-label="Navigate back"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = "/";
                }
              }}
            >
              <ArrowLeft size={22} />
            </button>
          )}

          {/* Official Brand Logo Asset centered */}
          <Link href="/" className="brand-logo" aria-label="OWLERA Homepage">
            <img
              src="/logo-transparent.png"
              alt="OWLERA — Your Everyday Shine"
              className="brand-logo-img"
              width={240}
              height={36}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search, Account, Wishlist, Cart evenly aligned on the right */}
          <div className="header-actions" aria-label="Quick Actions">
            {/* Search Toggle */}
            <button
              className="action-btn"
              aria-label="Search catalogue"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} />
            </button>

            {/* Customer Account */}
            <Link href="/account" className="action-btn header-desktop-action" aria-label="Customer Account">
              <User size={18} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="action-btn header-desktop-action" aria-label="View Wishlist">
              <Heart size={18} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            {/* Shopping Bag */}
            <button
              className="action-btn cart-btn"
              aria-label="Open Shopping Bag"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="search-dropdown" role="search">
            <div className="wrap">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search across all categories (e.g. gold hoops, brass urli, silk scarf, candles)…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  className="search-input"
                  aria-label="Search products"
                />
                <button type="submit" className="search-submit">
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="search-close"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
            onClick={e => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)} aria-label="OWLERA Homepage">
                <img
                  src="/logo-transparent.png"
                  alt="OWLERA"
                  className="brand-logo-img"
                  style={{ height: "26px", width: "auto" }}
                />
              </Link>
              <button
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mobile-search-form" role="search">
              <input
                type="text"
                placeholder="Search products & categories…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search store"
              />
              <button type="submit" aria-label="Submit search">
                <Search size={16} />
              </button>
            </form>

            <nav className="mobile-nav-list" aria-label="Mobile categories and services">
              <div className="mobile-nav-section-title">Departments</div>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} />
                </Link>
              ))}

              <div className="mobile-nav-section-title" style={{ marginTop: "16px" }}>Services & Care</div>
              <Link href="/wishlist" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span>My Wishlist ({wishlistCount})</span>
                <Heart size={14} />
              </Link>
              <Link href="/track-order" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span>Track Order</span>
                <Truck size={14} />
              </Link>
              <Link href="/account" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span>My Account</span>
                <User size={14} />
              </Link>
              <Link href="/about" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span>Our Heritage</span>
              </Link>
              <Link href="/contact" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <span>Contact Concierge</span>
              </Link>
            </nav>

            <div className="mobile-drawer-footer">
              <a
                href="https://wa.me/916305630468"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-concierge-link"
              >
                WhatsApp Concierge: +91 63056 30468
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
