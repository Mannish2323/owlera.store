"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Save,
  X,
  Search,
  Lock
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { money } from "@/lib/products";

export default function AdminPage() {
  // Simple administrative authorization barrier
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [newProductModal, setNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Jewellery",
    price: "",
    compareAt: "",
    stock: "10",
    sku: "",
    badge: "",
    image: "",
    description: "",
    featured: false
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [shippingForm, setShippingForm] = useState({
    orderStatus: "confirmed",
    courierName: "BlueDart Express",
    trackingNumber: "",
    trackingUrl: "https://www.bluedart.com",
    notes: ""
  });
  const [orderSaveMsg, setOrderSaveMsg] = useState("");

  // Check saved admin session
  useEffect(() => {
    const saved = sessionStorage.getItem("owlera_admin_auth");
    if (saved === "1") {
      setAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default administrative passcode for initial configuration
    if (passcode === "owlera2026" || passcode === "admin123") {
      setAuthorized(true);
      sessionStorage.setItem("owlera_admin_auth", "1");
      setAuthError("");
    } else {
      setAuthError("Incorrect admin access code. Enter 'owlera2026'.");
    }
  };

  const loadData = async () => {
    setProductsLoading(true);
    setOrdersLoading(true);
    try {
      const pRes = await fetch("/api/admin/products");
      const pData = await pRes.json();
      if (pData.products) setProducts(pData.products);

      const oRes = await fetch("/api/admin/orders");
      const oData = await oRes.json();
      if (oData.orders) setOrders(oData.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setProductsLoading(false);
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadData();
    }
  }, [authorized]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success) {
        setNewProductModal(false);
        setNewProduct({
          name: "",
          category: "Jewellery",
          price: "",
          compareAt: "",
          stock: "10",
          sku: "",
          badge: "",
          image: "",
          description: "",
          featured: false
        });
        loadData();
      } else {
        alert(data.error || "Failed to create product");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this catalogue item?")) return;
    try {
      await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setOrderSaveMsg("Saving fulfilment updates…");
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          ...shippingForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderSaveMsg("Fulfilment & courier details updated successfully!");
        setTimeout(() => setOrderSaveMsg(""), 3000);
        loadData();
      }
    } catch (err: any) {
      setOrderSaveMsg(`Error: ${err.message}`);
    }
  };

  // KPI calculations
  const totalVerifiedRevenue = orders
    .filter(o => o.payment_status === "paid")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const paidOrdersCount = orders.filter(o => o.payment_status === "paid").length;
  const pendingOrdersCount = orders.filter(o => o.payment_status !== "paid").length;
  const lowStockCount = products.filter(p => (p.stock ?? p.stock_quantity ?? 0) <= 5).length;

  if (!authorized) {
    return (
      <>
        <Header />
        <main className="wrap" style={{ padding: "80px 0", maxWidth: "460px", margin: "0 auto" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-color)",
              padding: "40px",
              borderRadius: "var(--radius-sm)",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(18, 61, 46, 0.1)",
                display: "grid",
                placeItems: "center",
                color: "var(--forest-green)",
                margin: "0 auto 16px"
              }}
            >
              <Lock size={24} />
            </div>
            <p className="eyebrow" style={{ justifyContent: "center" }}>RESTRICTED ACCESS</p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", margin: "6px 0 10px" }}>
              OWLERA Administration
            </h1>
            <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginBottom: "24px" }}>
              Enter administrative passkey to manage catalogue, stock, orders, manual shipping and online payment reconciliation.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter admin passcode (e.g. owlera2026)"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--warm-cream)",
                  fontSize: "13px",
                  marginBottom: "14px",
                  textAlign: "center"
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>
                Unlock Dashboard
              </button>
            </form>

            {authError && (
              <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "12px" }}>
                {authError}
              </p>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main style={{ paddingBottom: "80px" }}>
        {/* Admin Header Bar */}
        <div className="admin-header">
          <div className="wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--gold-light)", margin: 0 }}>
                  SECURE CONTROL PANEL
                </p>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", margin: "4px 0 0", color: "#FFFFFF" }}>
                  OWLERA Atelier Management
                </h1>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                  Admin Authenticated
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    sessionStorage.removeItem("owlera_admin_auth");
                    setAuthorized(false);
                  }}
                  style={{ color: "#FFFFFF", borderColor: "rgba(255,255,255,0.4)", padding: "8px 14px", fontSize: "11px" }}
                >
                  Lock
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-tabs">
              <button
                className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Products ({products.length})
              </button>
              <button
                className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders & Fulfilment ({orders.length})
              </button>
              <button
                className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                Site Settings & Checklist
              </button>
            </div>
          </div>
        </div>

        <div className="wrap" style={{ paddingTop: "30px" }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              {/* Stat Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <small>Verified Sales (Excl. Failed)</small>
                  <b>{money(totalVerifiedRevenue)}</b>
                </div>
                <div className="admin-stat-card">
                  <small>Verified Paid Orders</small>
                  <b>{paidOrdersCount}</b>
                </div>
                <div className="admin-stat-card">
                  <small>Pending Orders</small>
                  <b>{pendingOrdersCount}</b>
                </div>
                <div className="admin-stat-card">
                  <small>Low / Zero Stock Alerts</small>
                  <b style={{ color: lowStockCount > 0 ? "#C0392B" : "inherit" }}>{lowStockCount}</b>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "var(--radius-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: 0, color: "var(--dark-green)" }}>
                    Recent Orders
                  </h3>
                  <button onClick={() => setActiveTab("orders")} className="section-link" style={{ fontSize: "11.5px" }}>
                    Manage All Orders →
                  </button>
                </div>

                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Fulfilment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td><b>{o.order_number}</b></td>
                        <td>{o.customer_name}</td>
                        <td>{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                        <td><b>{money(o.total)}</b></td>
                        <td>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "2px",
                              fontSize: "10.5px",
                              fontWeight: 700,
                              background: o.payment_status === "paid" ? "#EAF5EA" : "#FFF7EB",
                              color: o.payment_status === "paid" ? "#1E5E2E" : "#8A5C1B"
                            }}
                          >
                            {o.payment_status}
                          </span>
                        </td>
                        <td>
                          <span style={{ textTransform: "capitalize", fontWeight: 600 }}>
                            {o.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS INVENTORY */}
          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", margin: "0 0 4px", color: "var(--dark-green)" }}>
                    Catalogue Inventory
                  </h2>
                  <p style={{ color: "var(--secondary-text)", fontSize: "13px", margin: 0 }}>
                    Manage products, retail prices, compare prices, stock counts and category placement.
                  </p>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => setNewProductModal(true)}
                  style={{ display: "inline-flex", gap: "8px" }}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              {/* Products Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflowX: "auto" }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Compare</th>
                      <th>Stock Level</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={p.image_url || p.image}
                              alt=""
                              style={{ width: "38px", height: "38px", objectFit: "cover", borderRadius: "2px" }}
                            />
                            <div>
                              <b>{p.name}</b>
                              {p.badge && (
                                <span style={{ display: "block", fontSize: "9px", color: "var(--muted-gold)", fontWeight: 700 }}>
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{p.category_name || p.category}</td>
                        <td><code>{p.sku || "—"}</code></td>
                        <td><b>{money(p.price)}</b></td>
                        <td>{p.compare_at || p.compareAt ? money(p.compare_at || p.compareAt) : "—"}</td>
                        <td>
                          <span
                            style={{
                              fontWeight: 700,
                              color: (p.stock ?? 0) <= 5 ? "#C0392B" : "#1E5E2E"
                            }}
                          >
                            {p.stock ?? 0} units
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{ color: "#C0392B", padding: "6px" }}
                            title="Delete item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Product Modal */}
              {newProductModal && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 100,
                    display: "grid",
                    placeItems: "center",
                    padding: "20px"
                  }}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      width: "min(640px, 100%)",
                      maxHeight: "90vh",
                      overflowY: "auto",
                      padding: "32px",
                      borderRadius: "var(--radius-sm)",
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", margin: 0, color: "var(--dark-green)" }}>
                        Add Product to Catalogue
                      </h3>
                      <button onClick={() => setNewProductModal(false)}>
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleCreateProduct} className="form-grid">
                      <div className="form-field full">
                        <label>Product Title *</label>
                        <input
                          required
                          value={newProduct.name}
                          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g. Aurelia Diamond Solitaire Studs"
                        />
                      </div>

                      <div className="form-field">
                        <label>Category *</label>
                        <select
                          value={newProduct.category}
                          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                          style={{
                            padding: "12px",
                            border: "1px solid var(--border-color)",
                            background: "var(--warm-cream)"
                          }}
                        >
                          <option value="Jewellery">Jewellery</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Lifestyle">Lifestyle</option>
                          <option value="Gifting">Gifting</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>SKU Code</label>
                        <input
                          value={newProduct.sku}
                          onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                          placeholder="OWL-JW-005"
                        />
                      </div>

                      <div className="form-field">
                        <label>Retail Price (INR ₹) *</label>
                        <input
                          type="number"
                          required
                          value={newProduct.price}
                          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="1899"
                        />
                      </div>

                      <div className="form-field">
                        <label>Compare-at Price (INR ₹)</label>
                        <input
                          type="number"
                          value={newProduct.compareAt}
                          onChange={e => setNewProduct({ ...newProduct, compareAt: e.target.value })}
                          placeholder="2499"
                        />
                      </div>

                      <div className="form-field">
                        <label>Available Stock Count *</label>
                        <input
                          type="number"
                          required
                          value={newProduct.stock}
                          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                          placeholder="15"
                        />
                      </div>

                      <div className="form-field">
                        <label>Marketing Badge</label>
                        <input
                          value={newProduct.badge}
                          onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })}
                          placeholder="Bestseller / New Arrival"
                        />
                      </div>

                      <div className="form-field full">
                        <label>Image URL *</label>
                        <input
                          required
                          value={newProduct.image}
                          onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>

                      <div className="form-field full">
                        <label>Product Narrative Description</label>
                        <textarea
                          rows={3}
                          value={newProduct.description}
                          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Describe materials, finish, and styling details…"
                        />
                      </div>

                      <div className="form-field full" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          id="feat"
                          checked={newProduct.featured}
                          onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                        />
                        <label htmlFor="feat" style={{ margin: 0 }}>Feature on Homepage Showcase</label>
                      </div>

                      <div className="form-field full" style={{ marginTop: "14px" }}>
                        <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>
                          Save & Publish Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS & MANUAL SHIPPING */}
          {activeTab === "orders" && (
            <div style={{ display: "grid", gridTemplateColumns: selectedOrder ? "1fr 1fr" : "1fr", gap: "24px" }}>
              {/* Orders List */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "var(--radius-sm)" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "0 0 16px", color: "var(--dark-green)" }}>
                  Customer Orders
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        const sh = order.shipping_fulfilment?.[0] || order.shipping_fulfilment;
                        setShippingForm({
                          orderStatus: order.order_status || "confirmed",
                          courierName: sh?.courier_name || "BlueDart Express",
                          trackingNumber: sh?.tracking_number || "",
                          trackingUrl: sh?.tracking_url || "https://www.bluedart.com",
                          notes: sh?.notes || ""
                        });
                      }}
                      style={{
                        padding: "16px",
                        border: selectedOrder?.id === order.id ? "2px solid var(--forest-green)" : "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        background: selectedOrder?.id === order.id ? "rgba(18, 61, 46, 0.03)" : "#FFFFFF"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <b style={{ color: "var(--dark-green)", fontSize: "14px" }}>{order.order_number}</b>
                        <b style={{ color: "var(--forest-green)" }}>{money(order.total)}</b>
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--secondary-text)", marginTop: "4px" }}>
                        {order.customer_name} • {order.customer_phone}
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px", fontSize: "11px" }}>
                        <span style={{ padding: "2px 6px", background: order.payment_status === "paid" ? "#EAF5EA" : "#FFF7EB", color: order.payment_status === "paid" ? "#1E5E2E" : "#8A5C1B", borderRadius: "2px", fontWeight: 700 }}>
                          Pay: {order.payment_status}
                        </span>
                        <span style={{ padding: "2px 6px", background: "#EFEBE1", borderRadius: "2px", textTransform: "capitalize", fontWeight: 600 }}>
                          Status: {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Detail & Fulfilment Editor */}
              {selectedOrder && (
                <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "28px", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px", marginBottom: "18px" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--muted-gold)", textTransform: "uppercase", fontWeight: 700 }}>
                        MANUAL SHIPPING FULFILMENT
                      </span>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", margin: "2px 0 0", color: "var(--dark-green)" }}>
                        {selectedOrder.order_number}
                      </h3>
                    </div>
                    <button onClick={() => setSelectedOrder(null)}><X size={18} /></button>
                  </div>

                  {/* Customer Info */}
                  <div style={{ fontSize: "12.5px", background: "var(--warm-cream)", padding: "14px", borderRadius: "var(--radius-sm)", marginBottom: "18px" }}>
                    <b>Recipient:</b> {selectedOrder.customer_name} ({selectedOrder.customer_phone})<br />
                    <b>Email:</b> {selectedOrder.customer_email}<br />
                    <b>Address:</b> {selectedOrder.shipping_address?.address || selectedOrder.shipping_address}, {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}
                  </div>

                  {/* Shipping Form */}
                  <form onSubmit={handleUpdateShipping} className="form-grid">
                    <div className="form-field full">
                      <label>Fulfilment Status</label>
                      <select
                        value={shippingForm.orderStatus}
                        onChange={e => setShippingForm({ ...shippingForm, orderStatus: e.target.value })}
                        style={{ padding: "10px", border: "1px solid var(--border-color)", background: "var(--warm-cream)" }}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing & Quality Check</option>
                        <option value="packed">Packed & Sealed</option>
                        <option value="shipped">Dispatched / In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Courier Partner</label>
                      <select
                        value={shippingForm.courierName}
                        onChange={e => setShippingForm({ ...shippingForm, courierName: e.target.value })}
                        style={{ padding: "10px", border: "1px solid var(--border-color)", background: "var(--warm-cream)" }}
                      >
                        <option value="BlueDart Express">BlueDart Express</option>
                        <option value="Delhivery Surface / Air">Delhivery Surface / Air</option>
                        <option value="DTDC Express">DTDC Express</option>
                        <option value="India Post Speed Post">India Post Speed Post</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Tracking Number / AWB</label>
                      <input
                        value={shippingForm.trackingNumber}
                        onChange={e => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                        placeholder="e.g. BD-84920491"
                      />
                    </div>

                    <div className="form-field full">
                      <label>Tracking URL</label>
                      <input
                        value={shippingForm.trackingUrl}
                        onChange={e => setShippingForm({ ...shippingForm, trackingUrl: e.target.value })}
                        placeholder="https://www.bluedart.com"
                      />
                    </div>

                    <div className="form-field full">
                      <label>Internal Fulfilment Notes</label>
                      <textarea
                        rows={2}
                        value={shippingForm.notes}
                        onChange={e => setShippingForm({ ...shippingForm, notes: e.target.value })}
                        placeholder="e.g. Gift wrap requested. Verified seal applied."
                      />
                    </div>

                    <div className="form-field full">
                      <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
                        <Save size={15} /> Save & Broadcast Fulfilment Update
                      </button>
                    </div>
                  </form>

                  {orderSaveMsg && (
                    <p style={{ marginTop: "12px", color: "var(--forest-green)", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                      {orderSaveMsg}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS & LAUNCH CHECKLIST */}
          {activeTab === "settings" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "28px", borderRadius: "var(--radius-sm)" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "0 0 16px", color: "var(--dark-green)" }}>
                  Store Configuration
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
                  <div>
                    <b>Primary Market:</b> India (INR ₹)
                  </div>
                  <div>
                    <b>WhatsApp Concierge:</b> +91 6305630468
                  </div>
                  <div>
                    <b>Complimentary Shipping Threshold:</b> ₹999
                  </div>
                  <div>
                    <b>Standard Shipping Fee:</b> ₹99
                  </div>
                  <div>
                    <b>Active Promotional Codes:</b> <code>OWLFIRST10</code> (10% off), <code>SHINE200</code> (₹200 off)
                  </div>
                </div>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "28px", borderRadius: "var(--radius-sm)" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "0 0 16px", color: "var(--dark-green)" }}>
                  Launch Verification Checklist
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "12.5px" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--forest-green)" />
                    <span><b>Visual Identity & Suspended Wordmark:</b> Exact Forest Green, Cream & Gold</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--forest-green)" />
                    <span><b>Database Schema & RLS Policies:</b> Ready in <code>supabase/schema.sql</code></span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--forest-green)" />
                    <span><b>Server-side Checkout & Stock Validation:</b> <code>/api/checkout</code> implemented</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--forest-green)" />
                    <span><b>Razorpay Order Creation & HMAC Verification:</b> <code>lib/razorpay.ts</code> active</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--forest-green)" />
                    <span><b>Manual Shipping Fulfilment & Live Order Tracking:</b> <code>/orders</code> active</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--forest-green)" />
                    <span><b>Direct WhatsApp Click-to-Chat:</b> Connected to +91 6305630468</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
