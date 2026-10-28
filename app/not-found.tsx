import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, MessageCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ padding: "100px 0", textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ display: "grid", placeItems: "center", marginBottom: "20px" }}>
          <img src="/logo-transparent.png" alt="OWLERA" style={{ height: "42px", width: "auto", display: "block" }} />
        </div>

        <p className="eyebrow" style={{ justifyContent: "center" }}>ARCHIVE NOTICE • 404</p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "36px",
            color: "var(--dark-green)",
            margin: "8px 0 16px"
          }}
        >
          This Edition Cannot Be Found
        </h1>

        <p
          style={{
            color: "var(--secondary-text)",
            fontSize: "14px",
            lineHeight: "1.7",
            marginBottom: "32px"
          }}
        >
          The piece, category, or archival edit you are seeking may have been completed, renamed, or temporarily moved. Let our curators assist you in discovering the ideal alternative.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "12.5px" }}>
            <Compass size={16} /> Explore Catalogue
          </Link>
          <Link href="/" className="btn btn-outline" style={{ padding: "14px 24px", fontSize: "12.5px" }}>
            <ArrowLeft size={16} /> Return Home
          </Link>
          <a
            href="https://wa.me/916305630468?text=Hello%20OWLERA%20Concierge!%20I%20encountered%20a%20missing%20page%20and%20would%20appreciate%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ padding: "14px 20px", fontSize: "12.5px", color: "#1B8C43", borderColor: "rgba(27, 140, 67, 0.3)" }}
          >
            <MessageCircle size={16} /> WhatsApp Concierge
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
