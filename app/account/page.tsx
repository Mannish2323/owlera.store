"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ExternalLink,
  Clock,
  CheckCircle,
  Truck,
  Heart,
  ShoppingBag
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!isMounted) return;
      if (!authUser) {
        router.push("/auth/login?next=/account");
        return;
      }

      setUser(authUser);

      // Fetch profile
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        if (isMounted && prof) setProfile(prof);

        // Fetch user orders by email or phone
        const userEmail = authUser.email;
        const userPhone = authUser.user_metadata?.phone || prof?.phone;

        let query = supabase.from("orders").select("*, order_items(*), shipping_fulfilment(*)");
        if (userEmail && userPhone) {
          query = query.or(`customer_email.eq.${userEmail},customer_phone.eq.${userPhone}`);
        } else if (userEmail) {
          query = query.eq("customer_email", userEmail);
        } else if (userPhone) {
          query = query.eq("customer_phone", userPhone);
        }

        const { data: userOrders } = await query.order("created_at", { ascending: false });
        if (isMounted && userOrders) {
          setOrders(userOrders);
        }
      } catch (err) {
        console.error("Account data fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="wrap" style={{ padding: "120px 0", textAlign: "center" }}>
          <p style={{ color: "var(--secondary-text)" }}>Opening your personal atelier suite…</p>
        </main>
        <Footer />
      </>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Valued Client";

  return (
    <>
      <Header />

      <main className="wrap" style={{ padding: "48px 0 80px" }}>
        {/* Welcome Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "24px",
            marginBottom: "36px"
          }}
        >
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>CLIENT SUITE</p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", margin: "4px 0", color: "var(--dark-green)" }}>
              Welcome, {displayName}
            </h1>
            <p style={{ color: "var(--secondary-text)", fontSize: "13px", margin: 0 }}>
              {user?.email} {profile?.phone && `• +91 ${profile.phone}`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link href="/wishlist" className="btn btn-outline" style={{ fontSize: "11.5px", padding: "10px 16px" }}>
              <Heart size={14} /> Wishlist
            </Link>
            <button
              onClick={handleSignOut}
              className="btn btn-outline"
              style={{ fontSize: "11.5px", padding: "10px 16px", color: "#C0392B", borderColor: "#F8B4B4" }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Account Content Grid */}
        <div className="account-grid">
          {/* Navigation Sidebar */}
          <aside
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <button
              onClick={() => setActiveTab("orders")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: activeTab === "orders" ? "var(--warm-cream)" : "transparent",
                color: activeTab === "orders" ? "var(--forest-green)" : "var(--primary-text)",
                fontWeight: activeTab === "orders" ? 600 : 400,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <Package size={16} />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: activeTab === "profile" ? "var(--warm-cream)" : "transparent",
                color: activeTab === "profile" ? "var(--forest-green)" : "var(--primary-text)",
                fontWeight: activeTab === "profile" ? 600 : 400,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <User size={16} />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: activeTab === "addresses" ? "var(--warm-cream)" : "transparent",
                color: activeTab === "addresses" ? "var(--forest-green)" : "var(--primary-text)",
                fontWeight: activeTab === "addresses" ? 600 : 400,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <MapPin size={16} />
              <span>Saved Addresses</span>
            </button>
          </aside>

          {/* Active Tab Panel */}
          <div>
            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--dark-green)", marginBottom: "20px" }}>
                  Order History & Real-Time Tracking
                </h2>

                {orders.length === 0 ? (
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      padding: "48px 24px",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ color: "var(--muted-gold)", marginBottom: "16px" }}>
                      <ShoppingBag size={40} style={{ margin: "0 auto" }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--dark-green)", marginBottom: "8px" }}>
                      No orders placed yet
                    </h3>
                    <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginBottom: "20px", maxWidth: "300px", margin: "0 auto 20px" }}>
                      Discover our handcrafted jewellery and lifestyle selections tailored for everyday shine.
                    </p>
                    <Link href="/shop" className="btn btn-primary" style={{ padding: "12px 24px" }}>
                      Explore Collections
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {orders.map(order => {
                      const fulfilment = Array.isArray(order.shipping_fulfilment)
                        ? order.shipping_fulfilment[0]
                        : order.shipping_fulfilment;
                      const items = order.order_items || [];

                      return (
                        <div
                          key={order.id}
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-sm)",
                            padding: "24px",
                            boxShadow: "var(--shadow-sm)"
                          }}
                        >
                          {/* Order Header */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "12px",
                              borderBottom: "1px solid var(--border-color)",
                              paddingBottom: "16px",
                              marginBottom: "16px"
                            }}
                          >
                            <div>
                              <b style={{ color: "var(--dark-green)", fontSize: "15px" }}>
                                Order {order.order_number}
                              </b>
                              <small style={{ display: "block", color: "var(--secondary-text)", marginTop: "2px" }}>
                                Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                              </small>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  padding: "4px 10px",
                                  borderRadius: "12px",
                                  background: order.payment_status === "paid" ? "#EAF5EA" : "#FFF7EB",
                                  color: order.payment_status === "paid" ? "#1E5E2E" : "#8A5C1B"
                                }}
                              >
                                Payment: {order.payment_status.toUpperCase()}
                              </span>

                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  padding: "4px 10px",
                                  borderRadius: "12px",
                                  background:
                                    order.order_status === "delivered"
                                      ? "#EAF5EA"
                                      : order.order_status === "shipped"
                                      ? "#E8F0FE"
                                      : "#F4EFE6",
                                  color:
                                    order.order_status === "delivered"
                                      ? "#1E5E2E"
                                      : order.order_status === "shipped"
                                      ? "#1A73E8"
                                      : "var(--forest-green)"
                                }}
                              >
                                Status: {order.order_status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                            {items.map((item: any) => (
                              <div
                                key={item.id || item.product_name}
                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}
                              >
                                <div>
                                  <b style={{ color: "var(--primary-text)" }}>{item.product_name}</b>
                                  <small style={{ color: "var(--secondary-text)", marginLeft: "8px" }}>
                                    Qty: {item.quantity} × {money(item.unit_price)}
                                  </small>
                                </div>
                                <span style={{ fontWeight: 600, color: "var(--forest-green)" }}>
                                  {money(item.line_total)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Fulfilment & Tracking Info */}
                          {fulfilment?.tracking_number && (
                            <div
                              style={{
                                background: "var(--warm-cream)",
                                borderRadius: "var(--radius-sm)",
                                padding: "12px 16px",
                                marginBottom: "16px",
                                fontSize: "12.5px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "8px"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Truck size={16} color="var(--forest-green)" />
                                <span>
                                  Dispatched via <b>{fulfilment.courier_name || "Express Courier"}</b> (AWB: <code>{fulfilment.tracking_number}</code>)
                                </span>
                              </div>

                              {fulfilment.tracking_url && (
                                <a
                                  href={fulfilment.tracking_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px",
                                    color: "var(--forest-green)",
                                    fontWeight: 600
                                  }}
                                >
                                  Track Package <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Footer Total */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderTop: "1px solid var(--border-color)",
                              paddingTop: "14px",
                              fontSize: "13px"
                            }}
                          >
                            <span style={{ color: "var(--secondary-text)" }}>Total Paid (Taxes Included)</span>
                            <b style={{ color: "var(--forest-green)", fontSize: "16px" }}>{money(order.total)}</b>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "32px",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--dark-green)", marginBottom: "20px" }}>
                  Account Profile
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "4px" }}>
                      FULL NAME
                    </label>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--primary-text)" }}>{displayName}</p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "4px" }}>
                      EMAIL ADDRESS
                    </label>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--primary-text)" }}>{user?.email}</p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "4px" }}>
                      MOBILE NUMBER
                    </label>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--primary-text)" }}>
                      {profile?.phone ? `+91 ${profile.phone}` : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "32px",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--dark-green)", marginBottom: "16px" }}>
                  Saved Delivery Addresses
                </h2>
                <p style={{ color: "var(--secondary-text)", fontSize: "13px", lineHeight: "1.6" }}>
                  Addresses used during your checkout are automatically saved for your convenience and verified against authentic Indian PIN code registries.
                </p>
                {orders.length > 0 && orders[0].shipping_address ? (
                  <div
                    style={{
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      padding: "16px 20px",
                      marginTop: "20px",
                      background: "var(--warm-cream)"
                    }}
                  >
                    <p className="eyebrow" style={{ fontSize: "10px", margin: "0 0 6px" }}>PRIMARY RESIDENCE</p>
                    <b>{orders[0].shipping_address.name}</b>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--secondary-text)" }}>
                      {orders[0].shipping_address.address}, {orders[0].shipping_address.city}, {orders[0].shipping_address.state} - {orders[0].shipping_address.pincode}
                    </p>
                    <small style={{ color: "var(--forest-green)", fontWeight: 600 }}>
                      Phone: +91 {orders[0].shipping_address.phone}
                    </small>
                  </div>
                ) : (
                  <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginTop: "16px" }}>
                    No saved addresses found. Place an order to register your primary shipping address.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
