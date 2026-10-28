"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, AlertTriangle, MessageCircle, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("OWLERA application error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--warm-ivory)",
        textAlign: "center"
      }}
    >
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div style={{ display: "grid", placeItems: "center", marginBottom: "20px" }}>
          <img
            src="/logo-transparent.png"
            alt="OWLERA"
            style={{ height: "46px", width: "auto", display: "block" }}
          />
        </div>

        <p className="eyebrow" style={{ justifyContent: "center", color: "#C0392B" }}>
          <AlertTriangle size={14} style={{ display: "inline", marginRight: "6px" }} />
          TEMPORARY INTERRUPT
        </p>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "32px",
            color: "var(--dark-green)",
            margin: "8px 0 16px"
          }}
        >
          Something Needs Recalibrating
        </h1>

        <p
          style={{
            color: "var(--secondary-text)",
            fontSize: "14px",
            lineHeight: "1.7",
            marginBottom: "32px"
          }}
        >
          We encountered an unexpected technical hesitation while curating this screen. Your shopping bag and preferences remain completely intact.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ padding: "14px 24px", fontSize: "12.5px" }}
          >
            <RotateCcw size={15} /> Try Again
          </button>
          <Link href="/" className="btn btn-outline" style={{ padding: "14px 24px", fontSize: "12.5px" }}>
            <ArrowLeft size={15} /> Back to Homepage
          </Link>
          <a
            href="https://wa.me/916305630468?text=Hello%20OWLERA%20Concierge!%20I%20noticed%20an%20application%20interruption%20and%20would%20like%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ padding: "14px 20px", fontSize: "12.5px", color: "#1B8C43", borderColor: "rgba(27, 140, 67, 0.3)" }}
          >
            <MessageCircle size={15} /> WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
