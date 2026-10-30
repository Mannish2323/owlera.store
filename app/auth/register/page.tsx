"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, User, Phone, CheckCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/components/auth-provider";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone.trim())) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await register(fullName.trim(), email.trim(), phone.trim(), password);

      if (!res.success) {
        setErrorMsg(res.error || "Failed to create account.");
      } else if (res.message) {
        setSuccessMsg(res.message);
      } else {
        router.push(next);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-sm)",
          padding: "40px",
          boxShadow: "var(--shadow-sm)",
          textAlign: "center"
        }}
      >
        <div style={{ display: "grid", placeItems: "center", marginBottom: "16px", color: "var(--forest-green)" }}>
          <CheckCircle size={48} />
        </div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "var(--dark-green)", marginBottom: "12px" }}>
          Welcome to OWLERA
        </h2>
        <p style={{ color: "var(--secondary-text)", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "24px" }}>
          {successMsg}
        </p>
        <Link href="/auth/login" className="btn btn-primary" style={{ padding: "12px 24px" }}>
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        padding: "40px",
        boxShadow: "var(--shadow-sm)",
        textAlign: "center"
      }}
    >
      <div style={{ display: "grid", placeItems: "center", marginBottom: "16px" }}>
        <img src="/logo-transparent.png" alt="OWLERA" style={{ height: "46px", width: "auto", display: "block" }} />
      </div>

      <p className="eyebrow" style={{ justifyContent: "center" }}>JOIN OUR ATELIER</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", margin: "6px 0 10px", color: "var(--dark-green)" }}>
        Create an Account
      </h1>
      <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginBottom: "28px" }}>
        Enjoy seamless checkouts, private sale invitations, and tracked deliveries.
      </p>

      {errorMsg && (
        <div
          style={{
            background: "#FDF2F2",
            border: "1px solid #F8B4B4",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            marginBottom: "20px",
            color: "#9B1C1C",
            fontSize: "12.5px",
            textAlign: "left"
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister} style={{ textAlign: "left" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
            FULL NAME *
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ananya Sharma"
              required
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: "var(--warm-cream)",
                fontSize: "13px"
              }}
            />
            <User size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--secondary-text)" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
            EMAIL ADDRESS *
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ananya@example.com"
              required
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: "var(--warm-cream)",
                fontSize: "13px"
              }}
            />
            <Mail size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--secondary-text)" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
            MOBILE NUMBER (FOR COURIER UPDATES)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210"
              maxLength={10}
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: "var(--warm-cream)",
                fontSize: "13px"
              }}
            />
            <Phone size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--secondary-text)" }} />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
            PASSWORD (MIN. 8 CHARACTERS) *
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              minLength={8}
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: "var(--warm-cream)",
                fontSize: "13px"
              }}
            />
            <Lock size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--secondary-text)" }} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", justifyContent: "center" }}
        >
          {loading ? "Creating Account…" : "Create Account"} <ArrowRight size={15} />
        </button>
      </form>

      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)", fontSize: "12.5px" }}>
        <span style={{ color: "var(--secondary-text)" }}>Already registered? </span>
        <Link
          href={`/auth/login?next=${encodeURIComponent(next)}`}
          style={{ color: "var(--forest-green)", fontWeight: 600 }}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ padding: "80px 0", maxWidth: "460px", margin: "0 auto" }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}>Loading…</div>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
