"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/components/auth-provider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const urlError = searchParams.get("error");
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(urlError || "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Invalid email or password.");
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

      <p className="eyebrow" style={{ justifyContent: "center" }}>WELCOME BACK</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", margin: "6px 0 10px", color: "var(--dark-green)" }}>
        Sign In to OWLERA
      </h1>
      <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginBottom: "28px" }}>
        Access your orders, saved pieces, and delivery addresses.
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

      <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
            EMAIL ADDRESS
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

        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--dark-green)" }}>
              PASSWORD
            </label>
            <Link
              href="/auth/forgot-password"
              style={{ fontSize: "11px", color: "var(--muted-gold)", textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
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
            <Lock size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--secondary-text)" }} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", justifyContent: "center", marginTop: "16px" }}
        >
          {loading ? "Signing in…" : "Sign In"} <ArrowRight size={15} />
        </button>
      </form>

      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)", fontSize: "12.5px" }}>
        <span style={{ color: "var(--secondary-text)" }}>New to OWLERA? </span>
        <Link
          href={`/auth/register?next=${encodeURIComponent(next)}`}
          style={{ color: "var(--forest-green)", fontWeight: 600 }}
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ padding: "80px 0", maxWidth: "460px", margin: "0 auto" }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}>Loading…</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
