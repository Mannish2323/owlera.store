"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, Check, User, Truck } from "lucide-react";
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
      <div className="announcement-bar">
        <div className="wrap announcement-inner">
          <div className="announcement-text" onClick={handleCopyCoupon} role="button" tabIndex={0}>
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
          {/* Mobile menu trigger */}
          <button
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Official Brand Logo Asset */}
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

          {/* Actions: Search, Account, Wishlist, Cart */}
          <div className="header-actions">
            {/* Search Toggle */}
            <button
              className="action-btn"
              aria-label="Search catalogue"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={19} />
            </button>

            {/* Account */}
            <Link href="/account" className="action-btn" aria-label="Customer Account">
              <User size={19} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="action-btn" aria-label="View Wishlist">
              <Heart size={19} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            {/* Shopping Bag */}
            <button
              className="action-btn cart-btn"
              aria-label="Open Shopping Bag"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="search-dropdown">
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
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)} aria-label="OWLERA Homepage">
                <img
                  src="/logo-transparent.png"
                  alt="OWLERA"
                  className="brand-logo-img"
                  style={{ height: "30px", width: "auto" }}
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
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <input
                type="text"
                placeholder="Search products & categories…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <Search size={16} />
              </button>
            </form>

            <nav className="mobile-nav-list">
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
