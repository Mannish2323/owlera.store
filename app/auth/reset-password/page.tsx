"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setErrorMsg("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      if (!supabase) {
        setErrorMsg("Authentication service is currently offline. Please try again shortly.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setErrorMsg(error.message || "Failed to update password.");
      } else {
        setSuccessMsg("Password successfully reset! You are now logged in.");
        setTimeout(() => {
          router.push("/account");
          router.refresh();
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="wrap" style={{ padding: "80px 0", maxWidth: "460px", margin: "0 auto" }}>
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

          <p className="eyebrow" style={{ justifyContent: "center" }}>ACCOUNT SECURITY</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", margin: "6px 0 10px", color: "var(--dark-green)" }}>
            Choose New Password
          </h1>
          <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginBottom: "28px" }}>
            Please enter and confirm your new secure password.
          </p>

          {successMsg && (
            <div
              style={{
                background: "#E8F5E9",
                border: "1px solid #A5D6A7",
                borderRadius: "var(--radius-sm)",
                padding: "14px",
                marginBottom: "20px",
                color: "#1B5E20",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

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
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleUpdatePassword} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
                  NEW PASSWORD
                </label>
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

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--dark-green)", marginBottom: "6px" }}>
                  CONFIRM NEW PASSWORD
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
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
                style={{ width: "100%", padding: "14px", justifyContent: "center" }}
              >
                {loading ? "Updating Password…" : "Update Password"} <ArrowRight size={15} />
              </button>
            </form>
          )}

          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)", fontSize: "12.5px" }}>
            <Link href="/auth/login" style={{ color: "var(--forest-green)", fontWeight: 600 }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
