"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, Check } from "lucide-react";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";
import { OwlEmblem } from "./owl-emblem";

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

  const handleApplyHeaderCoupon = () => {
    applyCoupon("OWLFIRST10");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("OWLFIRST10").catch(() => {});
    }
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <>
      {/* Top Announcement Bar with Actionable Verified Coupon */}
      <div className="announcement" style={{ cursor: "pointer" }} onClick={handleApplyHeaderCoupon}>
        <span>COMPLIMENTARY INSURED PAN-INDIA DELIVERY ON ORDERS ABOVE ₹999</span>
        <span style={{ margin: "0 8px" }}>✦</span>
        <span
          style={{
            textDecoration: "underline",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          {copiedCoupon ? (
            <>
              <Check size={12} /> APPLIED: OWLFIRST10 (10% OFF COPIED)
            </>
          ) : (
            "USE CODE: OWLFIRST10 (CLICK TO APPLY 10% OFF)"
          )}
        </span>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="nav wrap">
          {/* Mobile menu trigger */}
          <button
            className="icon-btn mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* OWLERA Logo with Approved Monoline Diamond Owl Emblem */}
          <Link href="/" className="brand">
            <div className="brand-emblem">
              <OwlEmblem size={32} color="#AD8048" secondaryColor="#1E211E" />
            </div>
            <div>
              <span>OWLERA</span>
              <small>YOUR EVERYDAY SHINE</small>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <Link
              href="/"
              className={pathname === "/" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={pathname === "/shop" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/jewellery"
              className={pathname === "/jewellery" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Jewellery
            </Link>
            <Link
              href="/fashion"
              className={pathname === "/fashion" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Fashion
            </Link>
            <Link
              href="/lifestyle"
              className={pathname === "/lifestyle" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Lifestyle
            </Link>
            <Link
              href="/about"
              className={pathname === "/about" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={pathname === "/contact" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/orders"
              className={pathname.startsWith("/orders") ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "var(--muted-gold)", fontWeight: 600 }}
            >
              Track Order
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="nav-actions">
            {/* Search Trigger */}
            <button
              className="icon-btn"
              aria-label="Search catalogue"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search />
            </button>

            {/* Wishlist Link */}
            <Link href="/wishlist" className="icon-btn" aria-label="View Wishlist">
              <Heart />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              className="icon-btn cart-trigger"
              aria-label="Open Shopping Bag"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              background: "#FFFFFF",
              padding: "16px 0"
            }}
          >
            <div className="wrap">
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  maxWidth: "600px",
                  margin: "0 auto"
                }}
              >
                <div style={{ position: "relative", flex: 1 }}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--secondary-text)"
                    }}
                  />
                  <input
                    type="search"
                    placeholder="Search gold hoops, necklaces, silk scarves, candles…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 42px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "13px",
                      background: "var(--warm-cream)",
                      outlineColor: "var(--forest-green)"
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: "12px 20px" }}>
                  Search <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
