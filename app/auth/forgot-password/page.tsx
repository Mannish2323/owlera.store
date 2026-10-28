"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, CheckCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email address.");
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

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`
      });

      if (error) {
        setErrorMsg(error.message || "Failed to send reset email.");
      } else {
        setSubmitted(true);
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

          {submitted ? (
            <div>
              <div style={{ color: "var(--forest-green)", marginBottom: "14px" }}>
                <CheckCircle size={44} style={{ margin: "0 auto" }} />
              </div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "var(--dark-green)", marginBottom: "10px" }}>
                Reset Link Sent
              </h1>
              <p style={{ color: "var(--secondary-text)", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "24px" }}>
                We have dispatched password recovery instructions to <b>{email}</b>. Please check your inbox and spam folder.
              </p>
              <Link href="/auth/login" className="btn btn-primary" style={{ width: "100%", padding: "12px", justifyContent: "center" }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <div>
              <p className="eyebrow" style={{ justifyContent: "center" }}>PASSWORD RECOVERY</p>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", margin: "6px 0 10px", color: "var(--dark-green)" }}>
                Reset Your Password
              </h1>
              <p style={{ color: "var(--secondary-text)", fontSize: "13px", marginBottom: "24px" }}>
                Enter the email address tied to your OWLERA account, and we will send you a secure link to reset your credentials.
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

              <form onSubmit={handleReset} style={{ textAlign: "left" }}>
                <div style={{ marginBottom: "20px" }}>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", justifyContent: "center" }}
                >
                  {loading ? "Sending link…" : "Send Reset Link"} <ArrowRight size={15} />
                </button>
              </form>

              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
                <Link
                  href="/auth/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12.5px",
                    color: "var(--secondary-text)"
                  }}
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
