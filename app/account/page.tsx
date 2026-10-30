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
import { useAuth } from "@/components/auth-provider";

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const displayName = profile?.name || user?.user_metadata?.full_name || (user ? "Valued Client" : "Manish");
  const displayEmail = profile?.email || user?.email || (user ? "" : "manish@example.com");

  const startEdit = () => {
    if (!user) {
      router.push("/auth/login?next=/account");
      return;
    }
    setEditName(displayName);
    setEditPhone(profile?.phone || user?.user_metadata?.phone || "");
    setIsEditing(true);
    setSaveMsg("");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await updateProfile({ name: editName.trim(), phone: editPhone.trim() });
      if (res.success) {
        setIsEditing(false);
        setSaveMsg("Profile successfully updated.");
      } else {
        setSaveMsg(res.error || "Failed to update profile.");
      }
    } catch (e: any) {
      setSaveMsg(e.message || "Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

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
            {user ? (
              <button onClick={startEdit} className="profile-edit-btn" type="button">
                Edit Profile
              </button>
            ) : (
              <Link href="/auth/login?next=/account" className="profile-edit-btn" style={{ textDecoration: "none", display: "inline-block" }}>
                Sign In / Register
              </Link>
            )}
          </div>
        </div>

        {/* Profile Edit Drawer / Form */}
        {isEditing && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "20px",
              marginBottom: "16px",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--dark-green)", marginBottom: "14px" }}>
              Edit Personal Profile
            </h3>
            {saveMsg && (
              <div style={{ fontSize: "12px", color: saveMsg.includes("success") ? "#2E7D32" : "#C0392B", marginBottom: "12px" }}>
                {saveMsg}
              </div>
            )}
            <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "4px" }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--warm-cream)",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "4px" }}>
                  MOBILE NUMBER
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--warm-cream)",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "10px", fontSize: "12px", justifyContent: "center" }}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  style={{ padding: "10px 18px", fontSize: "12px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
          {user ? (
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
          ) : (
            <Link
              href="/auth/login?next=/account"
              className="android-menu-row"
            >
              <div className="menu-row-left">
                <div className="menu-row-icon">
                  <User size={19} />
                </div>
                <span className="menu-row-label">Sign In</span>
              </div>
              <div className="menu-row-right">
                <ChevronRight size={17} className="menu-chevron" />
              </div>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
