"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setBusy(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subscription could not be completed.");
      }

      setStatus("success");
      setMessage("Welcome to The OWLERA Circle! You'll receive private previews and early access.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "480px" }}>
      {status === "success" ? (
        <div
          style={{
            background: "rgba(18, 61, 46, 0.08)",
            border: "1px solid var(--forest-green)",
            padding: "14px 18px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--forest-green)",
            fontSize: "13px",
            fontWeight: 500
          }}
        >
          <CheckCircle2 size={18} color="var(--forest-green)" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={busy}
            aria-label="Email address for OWLERA newsletter"
          />
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Joining…" : "Subscribe"} <ArrowRight size={14} />
          </button>
        </form>
      )}

      {status === "error" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#C0392B",
            fontSize: "11.5px",
            marginTop: "8px"
          }}
        >
          <AlertCircle size={14} />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
