"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, Package, User } from "lucide-react";
import { useWishlist } from "./wishlist-provider";

export function BottomNav() {
  const pathname = usePathname();
  const { count: wishlistCount } = useWishlist();

  // Hide bottom nav on admin routes, product detail pages (where sticky Add to Cart bar resides), and checkout
  if (pathname.startsWith("/admin") || pathname.startsWith("/products/") || pathname.startsWith("/checkout")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home, exact: true },
    { label: "Categories", href: "/categories", icon: LayoutGrid, exact: false },
    { label: "Wishlist", href: "/wishlist", icon: Heart, exact: false, badge: wishlistCount },
    { label: "Orders", href: "/orders", icon: Package, exact: false },
    { label: "Account", href: "/account", icon: User, exact: false }
  ];

  return (
    <nav className="android-bottom-nav" aria-label="Mobile Navigation Bar">
      <div className="bottom-nav-inner">
        {navItems.map(item => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="bottom-nav-icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="bottom-nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

