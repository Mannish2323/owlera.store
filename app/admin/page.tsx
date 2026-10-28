"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  LayoutTemplate,
  Settings,
  Activity,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Lock,
  Upload,
  Download,
  RefreshCw,
  FileText,
  X,
  Save,
  Filter,
  Check,
  Copy,
  Printer
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { money } from "@/lib/products";

type AdminTab =
  | "overview"
  | "products"
  | "categories"
  | "inventory"
  | "orders"
  | "customers"
  | "coupons"
  | "media"
  | "homepage"
  | "settings";

export default function AdminPage() {
  // Authorization state
  const [authorized, setAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Data states
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Filter states
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStockFilter, setProductStockFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    category: "Fashion & Accessories",
    price: "",
    compareAt: "",
    stock: "10",
    sku: "",
    badge: "",
    image: "",
    description: "",
    material: "",
    dimensions: "",
    weight: "",
    careInstructions: "",
    seoTitle: "",
    seoDescription: "",
    featured: false,
    isActive: true
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    display_order: "0",
    is_active: true
  });

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAdjustmentTarget, setStockAdjustmentTarget] = useState<any | null>(null);
  const [stockForm, setStockForm] = useState({
    adjustment: "+5",
    reason: "Restock Shipment",
    referenceNumber: "",
    notes: ""
  });

  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderFulfilmentForm, setOrderFulfilmentForm] = useState({
    orderStatus: "confirmed",
    courierName: "BlueDart Express",
    trackingNumber: "",
    trackingUrl: "",
    notes: ""
  });

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "10",
    min_order_value: "0",
    max_discount: "500",
    usage_limit: "500",
    expires_at: "",
    is_active: true
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Check auth on mount
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/auth")
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          setAuthorized(true);
          setAdminUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setAuthChecking(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Please provide both email and password.");
      return;
    }
    setLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthorized(true);
        setAdminUser(data.user);
        setPassword("");
      } else {
        setAuthError(data.error || "Authentication failed. Access denied.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Network error during authentication.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {}
    setAuthorized(false);
    setAdminUser(null);
  };

  // Load Admin Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, iRes, oRes, custRes, coupRes, mRes, sRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/inventory"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/customers"),
        fetch("/api/admin/coupons"),
        fetch("/api/admin/media"),
        fetch("/api/admin/settings")
      ]);

      const [pData, cData, iData, oData, custData, coupData, mData, sData] = await Promise.all([
        pRes.json(),
        cRes.json(),
        iRes.json(),
        oRes.json(),
        custRes.json(),
        coupRes.json(),
        mRes.json(),
        sRes.json()
      ]);

      if (pData.products) setProducts(pData.products);
      if (cData.categories) setCategories(cData.categories);
      if (iData.inventory) {
        setInventory(iData.inventory);
        setInventoryLogs(iData.movements || []);
      }
      if (oData.orders) setOrders(oData.orders);
      if (custData.customers) setCustomers(custData.customers);
      if (coupData.coupons) setCoupons(coupData.coupons);
      if (mData.media) setMediaList(mData.media);
      if (sData.settings) setSiteSettings(sData.settings);
      if (sData.health) setSystemHealth(sData.health);
    } catch (err: any) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadAllData();
    }
  }, [authorized]);

  // Product Operations
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      slug: "",
      category: categories.length > 0 ? categories[0].name : "Fashion & Accessories",
      price: "",
      compareAt: "",
      stock: "10",
      sku: `OWL-${Date.now().toString().slice(-4)}`,
      badge: "",
      image: "",
      description: "",
      material: "",
      dimensions: "",
      weight: "",
      careInstructions: "",
      seoTitle: "",
      seoDescription: "",
      featured: false,
      isActive: true
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      slug: product.slug || "",
      category: product.category_name || product.category || "Fashion & Accessories",
      price: String(product.price || ""),
      compareAt: product.compare_at ? String(product.compare_at) : "",
      stock: String(product.stock ?? product.stock_quantity ?? "0"),
      sku: product.sku || "",
      badge: product.badge || "",
      image: product.image_url || product.image || "",
      description: product.description || "",
      material: product.specifications?.material || "",
      dimensions: product.specifications?.dimensions || "",
      weight: product.specifications?.weight || "",
      careInstructions: product.specifications?.care || "",
      seoTitle: product.seo_title || "",
      seoDescription: product.seo_description || "",
      featured: Boolean(product.is_featured || product.featured),
      isActive: product.is_active !== undefined ? Boolean(product.is_active) : true
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast("Product name and price are mandatory.", "error");
      return;
    }

    const payload = {
      name: productForm.name,
      slug: productForm.slug,
      category: productForm.category,
      price: productForm.price,
      compareAt: productForm.compareAt,
      stock: productForm.stock,
      sku: productForm.sku,
      badge: productForm.badge,
      image: productForm.image,
      description: productForm.description,
      featured: productForm.featured,
      isActive: productForm.isActive,
      seoTitle: productForm.seoTitle,
      seoDescription: productForm.seoDescription,
      specifications: {
        material: productForm.material,
        dimensions: productForm.dimensions,
        weight: productForm.weight,
        care: productForm.careInstructions
      }
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...payload })
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (res.ok && (data.success || data.product)) {
        showToast(editingProduct ? "Product updated & storefront revalidated!" : "Product published to catalogue!");
        setProductModalOpen(false);
        loadAllData();
      } else {
        showToast(data.error || "Failed to save product", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from the catalogue?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showToast("Product permanently removed.");
        loadAllData();
      } else {
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Stock Adjustment
  const openStockModal = (item: any) => {
    setStockAdjustmentTarget(item);
    setStockForm({
      adjustment: "+5",
      reason: "Restock Shipment",
      referenceNumber: `PO-${Date.now().toString().slice(-4)}`,
      notes: ""
    });
    setStockModalOpen(true);
  };

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustmentTarget) return;

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: stockAdjustmentTarget.id,
          adjustment: stockForm.adjustment,
          reason: stockForm.reason,
          referenceNumber: stockForm.referenceNumber,
          notes: stockForm.notes
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Stock adjusted successfully!");
        setStockModalOpen(false);
        loadAllData();
      } else {
        showToast(data.error || "Stock adjustment failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Category Operations
  const openCategoryModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        image_url: cat.image_url || cat.image || "",
        display_order: String(cat.display_order || 0),
        is_active: cat.is_active !== undefined ? Boolean(cat.is_active) : true
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        display_order: String(categories.length + 1),
        is_active: true
      });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      showToast("Category name is required.", "error");
      return;
    }

    try {
      let res;
      if (editingCategory) {
        res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...categoryForm })
        });
      } else {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm)
        });
      }

      const data = await res.json();
      if (res.ok && (data.success || data.category)) {
        showToast(editingCategory ? "Category updated!" : "Category created successfully!");
        setCategoryModalOpen(false);
        loadAllData();
      } else {
        showToast(data.error || "Failed to save category", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Order Details & Fulfilment
  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    const fulfilment = Array.isArray(order.shipping_fulfilment)
      ? order.shipping_fulfilment[0]
      : order.shipping_fulfilment;

    setOrderFulfilmentForm({
      orderStatus: order.order_status || "confirmed",
      courierName: fulfilment?.courier_name || "BlueDart Express",
      trackingNumber: fulfilment?.tracking_number || "",
      trackingUrl: fulfilment?.tracking_url || "",
      notes: fulfilment?.notes || order.internal_notes || ""
    });
    setOrderDetailModalOpen(true);
  };

  const handleUpdateFulfilment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          ...orderFulfilmentForm
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Fulfilment & courier details updated!");
        loadAllData();
      } else {
        showToast(data.error || "Failed to update order", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Coupon Operations
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discount_value) {
      showToast("Coupon code and discount value are required.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponForm)
      });
      const data = await res.json();
      if (res.ok && (data.success || data.coupon)) {
        showToast(`Coupon ${couponForm.code} created & activated!`);
        setCouponModalOpen(false);
        setCouponForm({
          code: "",
          discount_type: "percentage",
          discount_value: "10",
          min_order_value: "0",
          max_discount: "500",
          usage_limit: "500",
          expires_at: "",
          is_active: true
        });
        loadAllData();
      } else {
        showToast(data.error || "Failed to create coupon", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleToggleCoupon = async (coupon: any) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, is_active: !coupon.is_active })
      });
      if (res.ok) {
        showToast(`Coupon ${coupon.code} ${coupon.is_active ? "paused" : "activated"}.`);
        loadAllData();
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProductForm(prev => ({ ...prev, image: data.url }));
        showToast("Image uploaded to Supabase Storage!");
        loadAllData();
      } else {
        showToast(data.error || "Image upload failed. Ensure bucket exists.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to upload image.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Site Settings Save
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: siteSettings })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Homepage & storefront configuration synchronized!");
      } else {
        showToast(data.error || "Failed to save settings.", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // CSV Export for Customers
  const handleExportCustomersCSV = () => {
    if (customers.length === 0) {
      showToast("No customer records to export.", "error");
      return;
    }
    const headers = ["Name", "Email", "Phone", "Total Orders", "Total Spend (INR)", "Registered At"];
    const rows = customers.map(c => [
      `"${c.name || ""}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      c.totalOrders || 0,
      c.totalSpend || 0,
      `"${c.registeredAt || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `owlera_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Customer directory exported to CSV.");
  };

  // Computed Dashboard Metrics
  const paidOrders = orders.filter(o => o.payment_status === "paid");
  const totalVerifiedGrossSales = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const aov = paidOrders.length > 0 ? Math.round(totalVerifiedGrossSales / paidOrders.length) : 0;
  const pendingFulfilmentOrders = orders.filter(
    o => o.order_status !== "delivered" && o.order_status !== "cancelled"
  );
  const lowStockCount = products.filter(p => (p.stock ?? p.stock_quantity ?? 0) <= 5).length;
  const outOfStockCount = products.filter(p => (p.stock ?? p.stock_quantity ?? 0) === 0).length;

  if (authChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF9F5" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid #123D2E", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#123D2E", fontFamily: "var(--font-serif)", fontSize: "16px" }}>Authenticating OWLERA Administrator…</p>
        </div>
      </div>
    );
  }

  // Login Gate
  if (!authorized) {
    return (
      <>
        <Header />
        <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF9F5", padding: "40px 20px" }}>
          <div style={{ width: "100%", maxWidth: "440px", background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "40px 32px", borderRadius: "2px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ width: "48px", height: "48px", background: "#123D2E", color: "#C6A45B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Lock size={22} />
              </div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 6px" }}>OWLERA Admin Portal</h1>
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>Restricted portal for authorized store operators</p>
            </div>

            {authError && (
              <div style={{ background: "#FDF2F2", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "12px", fontSize: "13px", borderRadius: "2px", marginBottom: "20px" }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#1A1A1A", fontWeight: 600, marginBottom: "6px" }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@owlera.store"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "14px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#1A1A1A", fontWeight: 600, marginBottom: "6px" }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "14px", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                style={{
                  background: "#123D2E",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "12px",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  cursor: loggingIn ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  transition: "background 0.2s"
                }}
              >
                {loggingIn ? "Verifying Credentials…" : "Sign In to Admin"}
              </button>
            </form>

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #EFEFEF", textAlign: "center" }}>
              <Link href="/" style={{ fontSize: "12px", color: "#123D2E", textDecoration: "none" }}>
                ← Return to Public Storefront
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FBF9F5" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            background: toastMsg.type === "success" ? "#123D2E" : "#9B1C1C",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "4px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {toastMsg.type === "success" ? <CheckCircle size={16} color="#C6A45B" /> : <AlertTriangle size={16} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header
        style={{
          background: "#123D2E",
          color: "#FFFFFF",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/logo-gold.png"
              alt="OWLERA Control Panel"
              style={{ height: "26px", width: "auto", display: "block" }}
            />
            <span
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "#C6A45B",
                color: "#123D2E",
                padding: "2px 6px",
                borderRadius: "2px",
                fontWeight: 700
              }}
            >
              Control Panel
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.08)",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              color: "#C6A45B"
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#48BB78" }} />
            <span>Database Live (Supabase)</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#FFFFFF",
              fontSize: "12px",
              textDecoration: "none",
              padding: "6px 12px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px"
            }}
          >
            <span>Live Storefront</span>
            <ExternalLink size={12} />
          </Link>

          <button
            onClick={loadAllData}
            title="Refresh All Records"
            style={{
              background: "none",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "6px"
            }}
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", textAlign: "right" }}>
              <div style={{ fontWeight: 600, color: "#FFFFFF" }}>{adminUser?.email || "Admin User"}</div>
              <div style={{ fontSize: "10px", color: "#C6A45B" }}>Super Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                border: "none",
                padding: "6px 12px",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer",
                borderRadius: "2px"
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Workspace Container) */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Navigation Sidebar */}
        <aside
          style={{
            width: "240px",
            background: "#FFFFFF",
            borderRight: "1px solid #E8E6DF",
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <div style={{ padding: "0 16px 12px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 700 }}>
            Core Modules
          </div>

          <button
            onClick={() => setActiveTab("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "overview" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "overview" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "overview" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "overview" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <LayoutDashboard size={16} color={activeTab === "overview" ? "#123D2E" : "#718096"} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "products" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "products" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "products" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "products" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <Package size={16} color={activeTab === "products" ? "#123D2E" : "#718096"} />
            <span>Products</span>
            <span style={{ marginLeft: "auto", fontSize: "11px", background: "#E2E8F0", padding: "1px 6px", borderRadius: "10px" }}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "categories" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "categories" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "categories" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "categories" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <Layers size={16} color={activeTab === "categories" ? "#123D2E" : "#718096"} />
            <span>Categories</span>
            <span style={{ marginLeft: "auto", fontSize: "11px", background: "#E2E8F0", padding: "1px 6px", borderRadius: "10px" }}>
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "inventory" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "inventory" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "inventory" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "inventory" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <Boxes size={16} color={activeTab === "inventory" ? "#123D2E" : "#718096"} />
            <span>Inventory</span>
            {lowStockCount > 0 && (
              <span style={{ marginLeft: "auto", fontSize: "10px", background: "#FED7D7", color: "#C53030", padding: "1px 6px", borderRadius: "10px", fontWeight: 700 }}>
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "orders" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "orders" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "orders" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "orders" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <ShoppingCart size={16} color={activeTab === "orders" ? "#123D2E" : "#718096"} />
            <span>Orders</span>
            <span style={{ marginLeft: "auto", fontSize: "11px", background: "#E2E8F0", padding: "1px 6px", borderRadius: "10px" }}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "customers" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "customers" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "customers" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "customers" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <Users size={16} color={activeTab === "customers" ? "#123D2E" : "#718096"} />
            <span>Customers</span>
          </button>

          <div style={{ padding: "16px 16px 8px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 700 }}>
            Marketing & Storefront
          </div>

          <button
            onClick={() => setActiveTab("coupons")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "coupons" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "coupons" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "coupons" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "coupons" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <Tag size={16} color={activeTab === "coupons" ? "#123D2E" : "#718096"} />
            <span>Discounts & Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "media" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "media" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "media" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "media" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <ImageIcon size={16} color={activeTab === "media" ? "#123D2E" : "#718096"} />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => setActiveTab("homepage")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "homepage" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "homepage" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "homepage" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "homepage" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <LayoutTemplate size={16} color={activeTab === "homepage" ? "#123D2E" : "#718096"} />
            <span>Homepage & Hero</span>
          </button>

          <div style={{ padding: "16px 16px 8px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", fontWeight: 700 }}>
            System
          </div>

          <button
            onClick={() => setActiveTab("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              border: "none",
              background: activeTab === "settings" ? "rgba(18, 61, 46, 0.08)" : "transparent",
              color: activeTab === "settings" ? "#123D2E" : "#4A5568",
              fontWeight: activeTab === "settings" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: activeTab === "settings" ? "3px solid #123D2E" : "3px solid transparent"
            }}
          >
            <Settings size={16} color={activeTab === "settings" ? "#123D2E" : "#718096"} />
            <span>Store Settings & Health</span>
          </button>
        </aside>

        {/* Content Workspace */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxWidth: "1280px" }}>
          {/* TAB 1: OVERVIEW / DASHBOARD */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Executive Overview
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Authoritative database metrics & live store operations
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={openNewProductModal}
                    style={{
                      background: "#123D2E",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "8px 16px",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      borderRadius: "2px"
                    }}
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "20px", borderRadius: "2px" }}>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "8px" }}>
                    Gross Verified Revenue
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#123D2E" }}>
                    {money(totalVerifiedGrossSales)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#2B6CB0", marginTop: "4px" }}>
                    From {paidOrders.length} verified paid orders
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "20px", borderRadius: "2px" }}>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "8px" }}>
                    Total Orders Placed
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#1A1A1A" }}>
                    {orders.length}
                  </div>
                  <div style={{ fontSize: "11px", color: pendingFulfilmentOrders.length > 0 ? "#C53030" : "#48BB78", marginTop: "4px" }}>
                    {pendingFulfilmentOrders.length} awaiting fulfilment
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "20px", borderRadius: "2px" }}>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "8px" }}>
                    Average Order Value
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#1A1A1A" }}>
                    {money(aov)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
                    Pan-India ecommerce basket
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "20px", borderRadius: "2px" }}>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "8px" }}>
                    Catalogue Inventory
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#1A1A1A" }}>
                    {products.length} Products
                  </div>
                  <div style={{ fontSize: "11px", color: lowStockCount > 0 ? "#D69E2E" : "#48BB78", marginTop: "4px" }}>
                    {lowStockCount} items below threshold
                  </div>
                </div>
              </div>

              {/* Operational Overview Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "28px" }}>
                {/* Recent Orders Overview */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "20px", borderRadius: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ fontSize: "15px", margin: 0, color: "#123D2E", fontWeight: 600 }}>Recent Orders</h2>
                    <button onClick={() => setActiveTab("orders")} style={{ background: "none", border: "none", color: "#123D2E", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
                      View All →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "#888", textAlign: "center", padding: "24px 0" }}>
                      No customer orders recorded yet. Place an order on the storefront to test.
                    </p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #EFEFEF", textAlign: "left", color: "#888" }}>
                            <th style={{ padding: "8px 4px" }}>Order #</th>
                            <th style={{ padding: "8px 4px" }}>Customer</th>
                            <th style={{ padding: "8px 4px" }}>Total</th>
                            <th style={{ padding: "8px 4px" }}>Payment</th>
                            <th style={{ padding: "8px 4px" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(o => (
                            <tr
                              key={o.id}
                              onClick={() => openOrderDetail(o)}
                              style={{ borderBottom: "1px solid #F5F5F5", cursor: "pointer" }}
                            >
                              <td style={{ padding: "10px 4px", fontWeight: 600, color: "#123D2E" }}>
                                {o.order_number}
                              </td>
                              <td style={{ padding: "10px 4px" }}>{o.customer_name}</td>
                              <td style={{ padding: "10px 4px", fontWeight: 600 }}>{money(o.total)}</td>
                              <td style={{ padding: "10px 4px" }}>
                                <span
                                  style={{
                                    padding: "2px 6px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    background: o.payment_status === "paid" ? "#DEF7EC" : "#FDE8E8",
                                    color: o.payment_status === "paid" ? "#03543F" : "#9B1C1C"
                                  }}
                                >
                                  {o.payment_status}
                                </span>
                              </td>
                              <td style={{ padding: "10px 4px", textTransform: "capitalize" }}>
                                {o.order_status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Stock & Inventory Attention */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "20px", borderRadius: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ fontSize: "15px", margin: 0, color: "#123D2E", fontWeight: 600 }}>Inventory Alerts</h2>
                    <button onClick={() => setActiveTab("inventory")} style={{ background: "none", border: "none", color: "#123D2E", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
                      Manage →
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {products
                      .filter(p => (p.stock ?? p.stock_quantity ?? 0) <= 5)
                      .slice(0, 4)
                      .map(p => (
                        <div
                          key={p.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            background: "#FFFDF5",
                            border: "1px solid #FEEBC8",
                            borderRadius: "2px"
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: "#744210" }}>{p.name}</div>
                            <div style={{ fontSize: "11px", color: "#975A16" }}>SKU: {p.sku || "—"}</div>
                          </div>
                          <span
                            style={{
                              background: (p.stock ?? 0) === 0 ? "#C53030" : "#DD6B20",
                              color: "#FFFFFF",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontSize: "11px",
                              fontWeight: 700
                            }}
                          >
                            {p.stock ?? 0} Left
                          </span>
                        </div>
                      ))}

                    {products.filter(p => (p.stock ?? p.stock_quantity ?? 0) <= 5).length === 0 && (
                      <p style={{ fontSize: "12px", color: "#48BB78", margin: 0, textAlign: "center", padding: "16px 0" }}>
                        ✓ All products healthy & above alert threshold.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Product Catalogue
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Manage products, pricing, specifications, and storefront publication
                  </p>
                </div>
                <button
                  onClick={openNewProductModal}
                  style={{
                    background: "#123D2E",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "2px"
                  }}
                >
                  <Plus size={15} /> Create Product
                </button>
              </div>

              {/* Filters Bar */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E6DF",
                  padding: "14px 18px",
                  borderRadius: "2px",
                  display: "flex",
                  gap: "14px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "220px" }}>
                  <Search size={15} color="#888" />
                  <input
                    type="text"
                    placeholder="Search by title, SKU, or category…"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    style={{ border: "none", outline: "none", fontSize: "13px", width: "100%" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#666" }}>Category:</span>
                  <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                    style={{ padding: "6px 10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px", outline: "none" }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#666" }}>Stock:</span>
                  <select
                    value={productStockFilter}
                    onChange={e => setProductStockFilter(e.target.value)}
                    style={{ padding: "6px 10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px", outline: "none" }}
                  >
                    <option value="all">All Levels</option>
                    <option value="low">Low Stock (≤5)</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: "2px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBF9F5", borderBottom: "1px solid #E8E6DF", textAlign: "left", color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "12px 16px" }}>Product</th>
                      <th style={{ padding: "12px 16px" }}>SKU</th>
                      <th style={{ padding: "12px 16px" }}>Category</th>
                      <th style={{ padding: "12px 16px" }}>Price</th>
                      <th style={{ padding: "12px 16px" }}>Stock</th>
                      <th style={{ padding: "12px 16px" }}>Status</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => {
                        const matchQuery =
                          !productSearch ||
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(productSearch.toLowerCase());
                        const matchCat =
                          productCategoryFilter === "all" ||
                          (p.category_name || p.category) === productCategoryFilter;
                        const stockVal = p.stock ?? p.stock_quantity ?? 0;
                        const matchStock =
                          productStockFilter === "all" ||
                          (productStockFilter === "low" && stockVal > 0 && stockVal <= 5) ||
                          (productStockFilter === "out" && stockVal === 0);
                        return matchQuery && matchCat && matchStock;
                      })
                      .map(p => {
                        const stockVal = p.stock ?? p.stock_quantity ?? 0;
                        const isLive = p.is_active !== false;
                        return (
                          <tr key={p.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <img
                                  src={p.image_url || p.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"}
                                  alt={p.name}
                                  style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "2px", background: "#EEE" }}
                                />
                                <div>
                                  <div style={{ fontWeight: 600, color: "#123D2E" }}>{p.name}</div>
                                  <div style={{ fontSize: "11px", color: "#888" }}>/{p.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#666", fontSize: "12px" }}>{p.sku || "—"}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ background: "rgba(18, 61, 46, 0.08)", color: "#123D2E", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 600 }}>
                                {p.category_name || p.category}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>{money(p.price)}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  background: stockVal === 0 ? "#FDE8E8" : stockVal <= 5 ? "#FEF08A" : "#DEF7EC",
                                  color: stockVal === 0 ? "#9B1C1C" : stockVal <= 5 ? "#854D0E" : "#03543F"
                                }}
                              >
                                {stockVal} in stock
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: isLive ? "#22543D" : "#742A2A"
                                }}
                              >
                                {isLive ? "● Published" : "○ Draft"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  style={{ background: "none", border: "none", color: "#123D2E", cursor: "pointer", padding: "4px" }}
                                  title="Edit Product"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  style={{ background: "none", border: "none", color: "#C53030", cursor: "pointer", padding: "4px" }}
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === "categories" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Category Architecture
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Manage the 6 core OWLERA brand departments & navigation taxonomy
                  </p>
                </div>
                <button
                  onClick={() => openCategoryModal()}
                  style={{
                    background: "#123D2E",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "2px"
                  }}
                >
                  <Plus size={15} /> Add Category
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E6DF",
                      borderRadius: "2px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                    }}
                  >
                    <div style={{ height: "140px", position: "relative", overflow: "hidden" }}>
                      <img
                        src={cat.image_url || cat.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"}
                        alt={cat.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: cat.is_active ? "#123D2E" : "#718096",
                          color: "#FFFFFF",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px"
                        }}
                      >
                        {cat.is_active ? "Active" : "Archived"}
                      </div>
                    </div>

                    <div style={{ padding: "18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <h3 style={{ margin: "0 0 2px", fontSize: "16px", color: "#123D2E", fontWeight: 600 }}>{cat.name}</h3>
                          <span style={{ fontSize: "11px", color: "#888" }}>Slug: /{cat.slug}</span>
                        </div>
                        <span style={{ fontSize: "11px", background: "#EDF2F7", color: "#4A5568", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                          Order #{cat.display_order || 0}
                        </span>
                      </div>

                      <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.5, margin: "0 0 16px", minHeight: "36px" }}>
                        {cat.description || "No description provided."}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F0F0F0", paddingTop: "12px" }}>
                        <Link
                          href={`/${cat.slug}`}
                          target="_blank"
                          style={{ fontSize: "12px", color: "#123D2E", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          <span>Preview on Site</span>
                          <ExternalLink size={12} />
                        </Link>

                        <button
                          onClick={() => openCategoryModal(cat)}
                          style={{
                            background: "none",
                            border: "1px solid #DDD",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer",
                            borderRadius: "2px",
                            color: "#123D2E"
                          }}
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === "inventory" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Inventory & Stock Control
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Auditable stock reconciliation, movements ledger, and shortage alerts
                  </p>
                </div>
              </div>

              {/* Inventory Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: "2px", overflow: "hidden", marginBottom: "32px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBF9F5", borderBottom: "1px solid #E8E6DF", textAlign: "left", color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "12px 16px" }}>Product Item</th>
                      <th style={{ padding: "12px 16px" }}>SKU</th>
                      <th style={{ padding: "12px 16px" }}>Current Stock</th>
                      <th style={{ padding: "12px 16px" }}>Stock Health</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>Adjustment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#123D2E" }}>{item.name}</td>
                        <td style={{ padding: "12px 16px", color: "#666" }}>{item.sku || "—"}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: "14px" }}>{item.stock} Units</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: item.stock === 0 ? "#FDE8E8" : item.stock <= 5 ? "#FEF08A" : "#DEF7EC",
                              color: item.stock === 0 ? "#9B1C1C" : item.stock <= 5 ? "#854D0E" : "#03543F"
                            }}
                          >
                            {item.stock === 0 ? "Out of Stock" : item.stock <= 5 ? "Low Stock" : "Healthy"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button
                            onClick={() => openStockModal(item)}
                            style={{
                              background: "#123D2E",
                              color: "#FFFFFF",
                              border: "none",
                              padding: "6px 12px",
                              fontSize: "11px",
                              borderRadius: "2px",
                              cursor: "pointer",
                              fontWeight: 600
                            }}
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Audit Log Table */}
              <div>
                <h2 style={{ fontSize: "16px", color: "#123D2E", margin: "0 0 12px", fontWeight: 600 }}>
                  Stock Movement Audit Ledger (Last 50 Events)
                </h2>
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: "2px", overflow: "hidden" }}>
                  {inventoryLogs.length === 0 ? (
                    <p style={{ padding: "20px", fontSize: "12px", color: "#888", textAlign: "center", margin: 0 }}>
                      No stock movement audit records yet. Make an adjustment above to record an audit entry.
                    </p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ background: "#FBF9F5", borderBottom: "1px solid #E8E6DF", textAlign: "left", color: "#666" }}>
                          <th style={{ padding: "10px 14px" }}>Date & Time</th>
                          <th style={{ padding: "10px 14px" }}>User</th>
                          <th style={{ padding: "10px 14px" }}>Product</th>
                          <th style={{ padding: "10px 14px" }}>Delta</th>
                          <th style={{ padding: "10px 14px" }}>Resulting Stock</th>
                          <th style={{ padding: "10px 14px" }}>Reason & Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryLogs.map(log => {
                          const delta = log.changes?.adjustment;
                          return (
                            <tr key={log.id} style={{ borderBottom: "1px solid #F5F5F5" }}>
                              <td style={{ padding: "10px 14px", color: "#888" }}>
                                {new Date(log.created_at).toLocaleString("en-IN")}
                              </td>
                              <td style={{ padding: "10px 14px", fontWeight: 500 }}>{log.actor_email}</td>
                              <td style={{ padding: "10px 14px", color: "#123D2E", fontWeight: 600 }}>
                                {log.changes?.product_name || log.resource_id}
                              </td>
                              <td style={{ padding: "10px 14px", fontWeight: 700, color: delta > 0 ? "#2B6CB0" : "#C53030" }}>
                                {delta > 0 ? `+${delta}` : delta}
                              </td>
                              <td style={{ padding: "10px 14px" }}>{log.changes?.new_stock} Units</td>
                              <td style={{ padding: "10px 14px", color: "#666" }}>
                                {log.changes?.reason} {log.changes?.reference_number ? `(${log.changes.reference_number})` : ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === "orders" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Order Operations & Fulfilment
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Searchable customer orders, BlueDart tracking dispatch, and invoice generation
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E6DF",
                  padding: "14px 18px",
                  borderRadius: "2px",
                  display: "flex",
                  gap: "14px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "220px" }}>
                  <Search size={15} color="#888" />
                  <input
                    type="text"
                    placeholder="Search by Order #, customer name, email, or phone…"
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    style={{ border: "none", outline: "none", fontSize: "13px", width: "100%" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#666" }}>Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    style={{ padding: "6px 10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px", outline: "none" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: "2px", overflow: "hidden" }}>
                {orders.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                    <ShoppingCart size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: "14px" }}>No orders placed in the store yet.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "#FBF9F5", borderBottom: "1px solid #E8E6DF", textAlign: "left", color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        <th style={{ padding: "12px 16px" }}>Order Reference</th>
                        <th style={{ padding: "12px 16px" }}>Date</th>
                        <th style={{ padding: "12px 16px" }}>Customer</th>
                        <th style={{ padding: "12px 16px" }}>Items</th>
                        <th style={{ padding: "12px 16px" }}>Total</th>
                        <th style={{ padding: "12px 16px" }}>Payment</th>
                        <th style={{ padding: "12px 16px" }}>Order Status</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(o => {
                          const matchSearch =
                            !orderSearch ||
                            o.order_number?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customer_email?.toLowerCase().includes(orderSearch.toLowerCase());
                          const matchStatus =
                            orderStatusFilter === "all" || o.order_status === orderStatusFilter;
                          return matchSearch && matchStatus;
                        })
                        .map(o => (
                          <tr key={o.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                            <td style={{ padding: "12px 16px", fontWeight: 700, color: "#123D2E" }}>
                              {o.order_number}
                            </td>
                            <td style={{ padding: "12px 16px", color: "#888", fontSize: "12px" }}>
                              {new Date(o.created_at).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric"
                              })}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                              <div style={{ fontSize: "11px", color: "#888" }}>{o.customer_phone}</div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              {o.order_items?.length || 1} Item(s)
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 700 }}>{money(o.total)}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  background: o.payment_status === "paid" ? "#DEF7EC" : "#FDE8E8",
                                  color: o.payment_status === "paid" ? "#03543F" : "#9B1C1C"
                                }}
                              >
                                {o.payment_status}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  background:
                                    o.order_status === "delivered"
                                      ? "#DEF7EC"
                                      : o.order_status === "shipped"
                                      ? "#EBF8FF"
                                      : o.order_status === "cancelled"
                                      ? "#FDE8E8"
                                      : "#FEF3C7",
                                  color:
                                    o.order_status === "delivered"
                                      ? "#03543F"
                                      : o.order_status === "shipped"
                                      ? "#2B6CB0"
                                      : o.order_status === "cancelled"
                                      ? "#9B1C1C"
                                      : "#92400E",
                                  textTransform: "capitalize"
                                }}
                              >
                                {o.order_status}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                              <button
                                onClick={() => openOrderDetail(o)}
                                style={{
                                  background: "#123D2E",
                                  color: "#FFFFFF",
                                  border: "none",
                                  padding: "6px 12px",
                                  fontSize: "11px",
                                  borderRadius: "2px",
                                  cursor: "pointer",
                                  fontWeight: 600
                                }}
                              >
                                Inspect & Dispatch
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMERS */}
          {activeTab === "customers" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Customer Directory
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Privacy-compliant patron profiles, verified lifetime value, and order metrics
                  </p>
                </div>

                <button
                  onClick={handleExportCustomersCSV}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #123D2E",
                    color: "#123D2E",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "2px"
                  }}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>

              {/* Customers Search */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E6DF",
                  padding: "12px 18px",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px"
                }}
              >
                <Search size={15} color="#888" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or telephone number…"
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  style={{ border: "none", outline: "none", fontSize: "13px", width: "100%" }}
                />
              </div>

              {/* Customers Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: "2px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBF9F5", borderBottom: "1px solid #E8E6DF", textAlign: "left", color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "12px 16px" }}>Customer Name</th>
                      <th style={{ padding: "12px 16px" }}>Email Address</th>
                      <th style={{ padding: "12px 16px" }}>Phone</th>
                      <th style={{ padding: "12px 16px" }}>Total Orders</th>
                      <th style={{ padding: "12px 16px" }}>Verified Spend</th>
                      <th style={{ padding: "12px 16px" }}>Last Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(c => {
                        if (!customerSearch) return true;
                        const q = customerSearch.toLowerCase();
                        return (
                          c.name?.toLowerCase().includes(q) ||
                          c.email?.toLowerCase().includes(q) ||
                          c.phone?.includes(q)
                        );
                      })
                      .map(c => (
                        <tr key={c.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: "#123D2E" }}>{c.name}</td>
                          <td style={{ padding: "12px 16px", color: "#666" }}>{c.email || "—"}</td>
                          <td style={{ padding: "12px 16px", color: "#666" }}>{c.phone || "—"}</td>
                          <td style={{ padding: "12px 16px" }}>{c.totalOrders} order(s)</td>
                          <td style={{ padding: "12px 16px", fontWeight: 700 }}>{money(c.totalSpend)}</td>
                          <td style={{ padding: "12px 16px", color: "#888", fontSize: "12px" }}>
                            {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString("en-IN") : "Never"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS */}
          {activeTab === "coupons" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Discounts & Coupon Engine
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Manage promotional codes, percentage discounts, minimum thresholds, and usage caps
                  </p>
                </div>

                <button
                  onClick={() => setCouponModalOpen(true)}
                  style={{
                    background: "#123D2E",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "2px"
                  }}
                >
                  <Plus size={15} /> Create Coupon
                </button>
              </div>

              {/* Coupons Table */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: "2px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#FBF9F5", borderBottom: "1px solid #E8E6DF", textAlign: "left", color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "12px 16px" }}>Coupon Code</th>
                      <th style={{ padding: "12px 16px" }}>Type & Value</th>
                      <th style={{ padding: "12px 16px" }}>Min Cart Value</th>
                      <th style={{ padding: "12px 16px" }}>Max Cap</th>
                      <th style={{ padding: "12px 16px" }}>Times Used</th>
                      <th style={{ padding: "12px 16px" }}>Status</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(coupon => (
                      <tr key={coupon.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "14px", color: "#123D2E", background: "#F0FDF4", padding: "3px 8px", border: "1px dashed #48BB78", borderRadius: "2px" }}>
                            {coupon.code}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                          {coupon.discount_type === "percentage" ? `${coupon.discount_value}% Off` : `₹${coupon.discount_value} Off`}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {coupon.min_order_value > 0 ? money(coupon.min_order_value) : "No minimum"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {coupon.max_discount ? money(coupon.max_discount) : "Uncapped"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {coupon.times_used || 0} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : "redemptions"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: coupon.is_active ? "#DEF7EC" : "#FDE8E8",
                              color: coupon.is_active ? "#03543F" : "#9B1C1C"
                            }}
                          >
                            {coupon.is_active ? "Active" : "Paused"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button
                            onClick={() => handleToggleCoupon(coupon)}
                            style={{
                              background: "none",
                              border: "1px solid #DDD",
                              padding: "4px 10px",
                              fontSize: "11px",
                              cursor: "pointer",
                              borderRadius: "2px"
                            }}
                          >
                            {coupon.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Media Storage & Product Assets
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Connected to Supabase Storage bucket <code style={{ background: "#EEE", padding: "1px 4px" }}>product-images</code>
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    style={{
                      background: "#123D2E",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "10px 18px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: uploadingImage ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "2px"
                    }}
                  >
                    <Upload size={15} /> {uploadingImage ? "Uploading to Storage…" : "Upload New Asset"}
                  </button>
                </div>
              </div>

              {/* Upload Dropzone Preview */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #CBD5E0",
                  padding: "36px 20px",
                  borderRadius: "4px",
                  textAlign: "center",
                  background: "#FFFFFF",
                  cursor: "pointer",
                  marginBottom: "24px"
                }}
              >
                <ImageIcon size={36} color="#718096" style={{ margin: "0 auto 10px" }} />
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#123D2E" }}>
                  Click to select high-resolution product photographs
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#718096" }}>
                  Supports JPEG, PNG, WebP, AVIF up to 5 MB per image
                </p>
              </div>

              {/* Media Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                {mediaList.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E6DF",
                      borderRadius: "2px",
                      overflow: "hidden"
                    }}
                  >
                    <div style={{ height: "140px", background: "#F5F5F5", position: "relative" }}>
                      <img
                        src={m.url}
                        alt={m.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "10px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "4px" }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888", marginBottom: "10px" }}>
                        {(m.size / 1024).toFixed(0)} KB • {m.mimetype || "image/jpeg"}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.url);
                          showToast("Public image URL copied to clipboard!");
                        }}
                        style={{
                          width: "100%",
                          background: "#F0F0F0",
                          border: "none",
                          padding: "6px",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px"
                        }}
                      >
                        <Copy size={12} /> Copy URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: HOMEPAGE & STOREFRONT CONTENT */}
          {activeTab === "homepage" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Storefront & Hero Configuration
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Synchronize homepage banners, announcements, and featured calls to action
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSiteSettings} style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "28px", borderRadius: "2px", maxWidth: "800px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#123D2E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Top Announcement Bar Message
                    </label>
                    <input
                      type="text"
                      value={siteSettings.announcement_bar || ""}
                      onChange={e => setSiteSettings({ ...siteSettings, announcement_bar: e.target.value })}
                      style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#123D2E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Hero Banner Headline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.hero_headline || ""}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_headline: e.target.value })}
                      style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#123D2E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Hero Banner Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings.hero_subtitle || ""}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                      style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#123D2E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                      Hero Background Image URL
                    </label>
                    <input
                      type="text"
                      value={siteSettings.hero_image || ""}
                      onChange={e => setSiteSettings({ ...siteSettings, hero_image: e.target.value })}
                      style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#123D2E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                        Call-to-Action Text
                      </label>
                      <input
                        type="text"
                        value={siteSettings.hero_cta_text || ""}
                        onChange={e => setSiteSettings({ ...siteSettings, hero_cta_text: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#123D2E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                        Call-to-Action Link
                      </label>
                      <input
                        type="text"
                        value={siteSettings.hero_cta_link || ""}
                        onChange={e => setSiteSettings({ ...siteSettings, hero_cta_link: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ paddingTop: "12px", borderTop: "1px solid #EFEFEF" }}>
                    <button
                      type="submit"
                      style={{
                        background: "#123D2E",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "12px 24px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        borderRadius: "2px"
                      }}
                    >
                      Save & Invalidate Storefront Cache
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 10: STORE SETTINGS & INTEGRATIONS HEALTH */}
          {activeTab === "settings" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#123D2E", margin: "0 0 4px" }}>
                    Store Settings & Integration Health
                  </h1>
                  <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                    Live infrastructure telemetry, payment gateways, and security credentials status
                  </p>
                </div>
              </div>

              {/* System Diagnostics Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "18px", borderRadius: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#123D2E" }}>Supabase Database</span>
                    <span style={{ background: "#DEF7EC", color: "#03543F", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                      {systemHealth?.database?.status === "healthy" ? "CONNECTED" : "FALLBACK"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Query Latency: {systemHealth?.database?.latencyMs || 0} ms
                  </div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                    PostgreSQL 15 • Row Level Security Enforced
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "18px", borderRadius: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#123D2E" }}>Razorpay Gateway</span>
                    <span style={{ background: systemHealth?.payment?.configured ? "#DEF7EC" : "#FEF3C7", color: systemHealth?.payment?.configured ? "#03543F" : "#92400E", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                      {systemHealth?.payment?.configured ? "ACTIVE" : "SANDBOX"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Key ID: {systemHealth?.payment?.keyIdMasked || "Configured via ENV"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                    Currency: INR • Webhooks: {systemHealth?.payment?.webhookConfigured ? "Verified" : "Pending"}
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "18px", borderRadius: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#123D2E" }}>Supabase Storage</span>
                    <span style={{ background: "#DEF7EC", color: "#03543F", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                      BUCKET LIVE
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Target: <code style={{ background: "#EEE", padding: "1px 4px" }}>product-images</code>
                  </div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                    Public Media CDN • SSL Encrypted
                  </div>
                </div>
              </div>

              {/* Store Global Settings */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", padding: "24px", borderRadius: "2px", maxWidth: "680px" }}>
                <h3 style={{ fontSize: "15px", color: "#123D2E", margin: "0 0 16px", fontWeight: 600 }}>
                  Indian Business Localization
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "#888", display: "block", fontSize: "11px", textTransform: "uppercase" }}>Base Currency</span>
                    <strong style={{ color: "#123D2E" }}>INR (₹) Indian Rupee</strong>
                  </div>
                  <div>
                    <span style={{ color: "#888", display: "block", fontSize: "11px", textTransform: "uppercase" }}>Timezone</span>
                    <strong style={{ color: "#123D2E" }}>Asia/Kolkata (IST +05:30)</strong>
                  </div>
                  <div>
                    <span style={{ color: "#888", display: "block", fontSize: "11px", textTransform: "uppercase" }}>Free Shipping Rule</span>
                    <strong style={{ color: "#123D2E" }}>Orders ≥ ₹999 Pan-India</strong>
                  </div>
                  <div>
                    <span style={{ color: "#888", display: "block", fontSize: "11px", textTransform: "uppercase" }}>Concierge Support</span>
                    <strong style={{ color: "#123D2E" }}>+91 63056 30468 (WhatsApp)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: CREATE / EDIT PRODUCT */}
      {productModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "720px", maxHeight: "90vh", overflowY: "auto", borderRadius: "2px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #EEE", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "18px", color: "#123D2E", margin: 0, fontWeight: 600 }}>
                {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Catalogue Product"}
              </h2>
              <button onClick={() => setProductModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={e => {
                      const name = e.target.value;
                      setProductForm(prev => ({
                        ...prev,
                        name,
                        slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                      }));
                    }}
                    placeholder="e.g. Celestial Gold Hoops"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={e => setProductForm({ ...productForm, slug: e.target.value })}
                    placeholder="celestial-gold-hoops"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Department Category *</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="1499"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Compare At Price (INR ₹)</label>
                  <input
                    type="number"
                    value={productForm.compareAt}
                    onChange={e => setProductForm({ ...productForm, compareAt: e.target.value })}
                    placeholder="1999"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Badging</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={e => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller / Heirloom / New"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Primary Image URL</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    style={{ flex: 1, padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: "#F0F0F0", border: "1px solid #DDD", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Product Story & Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detail the materials, inspiration, and styling advice…"
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Material Spec</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={e => setProductForm({ ...productForm, material: e.target.value })}
                    placeholder="e.g. 18k Gold Plated Brass, Baroque Pearl"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Dimensions & Weight</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={e => setProductForm({ ...productForm, dimensions: e.target.value })}
                    placeholder="e.g. 24mm diameter • 12g"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "center", paddingTop: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={e => setProductForm({ ...productForm, isActive: e.target.checked })}
                  />
                  <span>Published on Storefront</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={e => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Featured Collection Placement</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px", borderTop: "1px solid #EEE", paddingTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  style={{ background: "#F5F5F5", border: "none", padding: "10px 16px", fontSize: "12px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#123D2E", color: "#FFFFFF", border: "none", padding: "10px 20px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {stockModalOpen && stockAdjustmentTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "480px", borderRadius: "2px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", color: "#123D2E", margin: 0, fontWeight: 600 }}>
                Adjust Stock: {stockAdjustmentTarget.name}
              </h2>
              <button onClick={() => setStockModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "#FBF9F5", padding: "12px", borderRadius: "2px", marginBottom: "16px", fontSize: "13px" }}>
              Current Level: <strong>{stockAdjustmentTarget.stock} units</strong>
            </div>

            <form onSubmit={handleStockAdjustment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Stock Delta (+/- units) *
                </label>
                <input
                  type="text"
                  required
                  value={stockForm.adjustment}
                  onChange={e => setStockForm({ ...stockForm, adjustment: e.target.value })}
                  placeholder="+10 or -3"
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Adjustment Reason *
                </label>
                <select
                  value={stockForm.reason}
                  onChange={e => setStockForm({ ...stockForm, reason: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                >
                  <option value="Restock Shipment">Restock Shipment</option>
                  <option value="Physical Inventory Audit">Physical Inventory Audit</option>
                  <option value="Customer Return Restock">Customer Return Restock</option>
                  <option value="Damaged / Scratched Item">Damaged / Scratched Item</option>
                  <option value="Manual Offline Sale">Manual Offline Sale</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  PO # / Reference Code
                </label>
                <input
                  type="text"
                  value={stockForm.referenceNumber}
                  onChange={e => setStockForm({ ...stockForm, referenceNumber: e.target.value })}
                  placeholder="PO-2026-081"
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setStockModalOpen(false)}
                  style={{ background: "#F5F5F5", border: "none", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#123D2E", color: "#FFFFFF", border: "none", padding: "8px 18px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS & FULFILMENT */}
      {orderDetailModalOpen && selectedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", borderRadius: "2px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #EEE", paddingBottom: "12px" }}>
              <div>
                <h2 style={{ fontSize: "18px", color: "#123D2E", margin: "0 0 2px", fontWeight: 600 }}>
                  Order #{selectedOrder.order_number}
                </h2>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  Placed on {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => window.print()}
                  style={{ background: "#F0F0F0", border: "none", padding: "6px 12px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                >
                  <Printer size={13} /> Print Invoice
                </button>
                <button onClick={() => setOrderDetailModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px", background: "#FBF9F5", padding: "16px", borderRadius: "2px" }}>
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Customer
                </span>
                <div style={{ fontWeight: 600 }}>{selectedOrder.customer_name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{selectedOrder.customer_email}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{selectedOrder.customer_phone}</div>
              </div>

              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#888", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Delivery Address
                </span>
                <div style={{ fontSize: "12px", color: "#444" }}>
                  {selectedOrder.shipping_address?.address || selectedOrder.shipping_address?.street || "—"}
                </div>
                <div style={{ fontSize: "12px", color: "#444" }}>
                  {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div style={{ marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #DDD", textAlign: "left", color: "#888" }}>
                    <th style={{ padding: "6px 0" }}>Product</th>
                    <th style={{ padding: "6px 0" }}>Unit Price</th>
                    <th style={{ padding: "6px 0" }}>Qty</th>
                    <th style={{ padding: "6px 0", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.order_items || []).map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid #EEE" }}>
                      <td style={{ padding: "10px 0", fontWeight: 600 }}>{item.product_name}</td>
                      <td style={{ padding: "10px 0" }}>{money(item.unit_price)}</td>
                      <td style={{ padding: "10px 0" }}>× {item.quantity}</td>
                      <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 600 }}>{money(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: "right", marginTop: "12px", fontSize: "13px" }}>
                <div style={{ color: "#666" }}>Subtotal: {money(selectedOrder.subtotal || selectedOrder.total)}</div>
                {selectedOrder.discount > 0 && <div style={{ color: "#2B6CB0" }}>Discount: -{money(selectedOrder.discount)}</div>}
                <div style={{ fontWeight: 700, fontSize: "15px", color: "#123D2E", marginTop: "4px" }}>
                  Grand Total: {money(selectedOrder.total)}
                </div>
              </div>
            </div>

            {/* Fulfilment Update Form */}
            <form onSubmit={handleUpdateFulfilment} style={{ borderTop: "1px solid #EEE", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "14px", color: "#123D2E", margin: "0 0 12px", fontWeight: 600 }}>
                Shipping Carrier & Fulfilment Status
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                    Order Status
                  </label>
                  <select
                    value={orderFulfilmentForm.orderStatus}
                    onChange={e => setOrderFulfilmentForm({ ...orderFulfilmentForm, orderStatus: e.target.value })}
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px" }}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled (Restocks Units)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                    Courier Service
                  </label>
                  <input
                    type="text"
                    value={orderFulfilmentForm.courierName}
                    onChange={e => setOrderFulfilmentForm({ ...orderFulfilmentForm, courierName: e.target.value })}
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                    Tracking AWB Number
                  </label>
                  <input
                    type="text"
                    value={orderFulfilmentForm.trackingNumber}
                    onChange={e => {
                      const trk = e.target.value;
                      setOrderFulfilmentForm({
                        ...orderFulfilmentForm,
                        trackingNumber: trk,
                        trackingUrl: trk ? `https://www.bluedart.com/tracking?track=${trk}` : ""
                      });
                    }}
                    placeholder="e.g. BD789123456"
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
                    Tracking URL
                  </label>
                  <input
                    type="text"
                    value={orderFulfilmentForm.trackingUrl}
                    onChange={e => setOrderFulfilmentForm({ ...orderFulfilmentForm, trackingUrl: e.target.value })}
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="submit"
                  style={{ background: "#123D2E", color: "#FFFFFF", border: "none", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Save Fulfilment Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATEGORY EDIT */}
      {categoryModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "520px", borderRadius: "2px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", color: "#123D2E", margin: 0, fontWeight: 600 }}>
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add Category"}
              </h2>
              <button onClick={() => setCategoryModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={e => {
                    const name = e.target.value;
                    setCategoryForm(prev => ({
                      ...prev,
                      name,
                      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    }));
                  }}
                  style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Slug *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.slug}
                  onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Header Image URL</label>
                <input
                  type="text"
                  value={categoryForm.image_url}
                  onChange={e => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                  style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  style={{ background: "#F5F5F5", border: "none", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#123D2E", color: "#FFFFFF", border: "none", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {couponModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "480px", borderRadius: "2px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", color: "#123D2E", margin: 0, fontWeight: 600 }}>Create New Discount Coupon</h2>
              <button onClick={() => setCouponModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. DIWALI20"
                  style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px", fontFamily: "monospace", textTransform: "uppercase" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Discount Type</label>
                  <select
                    value={couponForm.discount_type}
                    onChange={e => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "12px" }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discount_value}
                    onChange={e => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                    placeholder="10"
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Min Cart Value (INR)</label>
                  <input
                    type="number"
                    value={couponForm.min_order_value}
                    onChange={e => setCouponForm({ ...couponForm, min_order_value: e.target.value })}
                    placeholder="0"
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Max Cap (INR)</label>
                  <input
                    type="number"
                    value={couponForm.max_discount}
                    onChange={e => setCouponForm({ ...couponForm, max_discount: e.target.value })}
                    placeholder="500"
                    style={{ width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "2px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  style={{ background: "#F5F5F5", border: "none", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#123D2E", color: "#FFFFFF", border: "none", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Create & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
