"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Truck,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { money } from "@/lib/products";
import { createClient } from "@/lib/supabase-browser";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) return;
      setUser(authUser);

      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        if (prof) setProfile(prof);

        const { data: userOrders } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("customer_email", authUser.email)
          .order("created_at", { ascending: false });
        if (userOrders) setOrders(userOrders);
      } catch (e) {
        // Fallback gracefully
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Manish";
  const displayEmail = profile?.email || user?.email || "manish@example.com";

  const menuItems = [
    { label: "My Orders", href: "/orders", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Addresses", href: "/checkout", icon: MapPin },
    { label: "Payment Methods", href: "/policies/payment", icon: CreditCard },
    { label: "Track Order", href: "/track-order", icon: Truck },
    { label: "Notifications", href: "/account", icon: Bell, hasBadge: true },
    { label: "Settings", href: "/account", icon: Settings },
    { label: "Help & Support", href: "/contact", icon: HelpCircle }
  ];

  return (
    <>
      <Header />

      <main className="wrap android-account-main" style={{ paddingTop: "20px", paddingBottom: "80px" }}>
        {/* Profile Card (Matches Screen 6) */}
        <div className="android-profile-card">
          <div className="profile-avatar-box">
            <div className="profile-avatar-circle">
              <User size={36} color="#FFFFFF" />
            </div>
          </div>
          <div className="profile-meta-box">
            <h1 className="profile-user-name">{displayName}</h1>
            <span className="profile-user-email">{displayEmail}</span>
            <button className="profile-edit-btn" type="button">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Menu Options List (Matches Screen 6) */}
        <div className="android-account-menu-list">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className="android-menu-row">
                <div className="menu-row-left">
                  <div className="menu-row-icon">
                    <Icon size={19} />
                  </div>
                  <span className="menu-row-label">{item.label}</span>
                </div>
                <div className="menu-row-right">
                  {item.hasBadge && <span className="menu-unread-dot" />}
                  <ChevronRight size={17} className="menu-chevron" />
                </div>
              </Link>
            );
          })}

          {/* Logout Action */}
          <button
            onClick={handleSignOut}
            className="android-menu-row logout-row"
            type="button"
          >
            <div className="menu-row-left">
              <div className="menu-row-icon">
                <LogOut size={19} />
              </div>
              <span className="menu-row-label">Logout</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={17} className="menu-chevron" />
            </div>
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
