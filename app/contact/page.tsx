"use client";

import React, { useState } from "react";
import { MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappDirectUrl = `https://wa.me/916305630468?text=${encodeURIComponent(
    "Hello OWLERA Concierge! I would like to get in touch regarding styling assistance / order enquiry."
  )}`;

  return (
    <>
      <Header />

      <main className="wrap" style={{ padding: "60px 0 100px", maxWidth: "980px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>CLIENT CARE</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 4.5vw, 50px)",
              color: "var(--dark-green)",
              margin: "6px 0 12px"
            }}
          >
            Connect with OWLERA
          </h1>
          <p style={{ color: "var(--secondary-text)", fontSize: "14.5px", maxWidth: "520px", margin: "0 auto" }}>
            Our styling and order concierge is at your service. Connect directly through WhatsApp for immediate consultation or submit your enquiry below.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px" }}>
          {/* Direct channels */}
          <div>
            {/* WhatsApp Card */}
            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid #25D366",
                borderRadius: "var(--radius-sm)",
                padding: "28px",
                marginBottom: "24px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "rgba(37, 211, 102, 0.15)",
                    display: "grid",
                    placeItems: "center",
                    color: "#25D366"
                  }}
                >
                  <MessageCircle size={22} />
                </div>
                <div>
                  <b style={{ color: "var(--dark-green)", fontSize: "15px", display: "block" }}>
                    WhatsApp Concierge
                  </b>
                  <span style={{ fontSize: "11px", color: "#1B8C43", fontWeight: 600 }}>
                    Instant Response (Fastest)
                  </span>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "var(--secondary-text)", lineHeight: "1.7", margin: "0 0 18px" }}>
                Connect directly with our Hyderabad atelier for sizing guidance, order tracking status, or bespoke gift notes.
              </p>

              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  background: "#25D366",
                  color: "#FFFFFF",
                  width: "100%",
                  padding: "14px",
                  fontSize: "12px",
                  display: "inline-flex",
                  gap: "8px"
                }}
              >
                <MessageCircle size={16} /> Open WhatsApp (+91 6305630468)
              </a>
            </div>

            {/* Other info */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                fontSize: "13px"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Mail size={18} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <b style={{ color: "var(--dark-green)" }}>Email Support:</b>
                  <p style={{ margin: "2px 0 0", color: "var(--secondary-text)" }}>concierge@owlera.in</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <Clock size={18} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <b style={{ color: "var(--dark-green)" }}>Concierge Working Hours:</b>
                  <p style={{ margin: "2px 0 0", color: "var(--secondary-text)" }}>
                    Monday to Saturday, 10:00 AM – 7:00 PM IST
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <MapPin size={18} color="var(--forest-green)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <b style={{ color: "var(--dark-green)" }}>Headquarters:</b>
                  <p style={{ margin: "2px 0 0", color: "var(--secondary-text)" }}>
                    OWLERA Luxury Goods, Hyderabad, Telangana, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "36px"
            }}
          >
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", margin: "0 0 18px", color: "var(--dark-green)" }}>
              Send an Atelier Message
            </h2>

            {submitted ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <CheckCircle2 size={42} color="var(--forest-green)" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", margin: "0 0 8px", color: "var(--dark-green)" }}>
                  Message Received
                </h3>
                <p style={{ color: "var(--secondary-text)", fontSize: "13px" }}>
                  Thank you for reaching out. Our concierge will review your enquiry and reply to {form.email} within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-field full">
                  <label>Your Name *</label>
                  <input
                    required
                    placeholder="Ananya Sharma"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="ananya@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="form-field full">
                  <label>Your Message or Order Reference *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please let us know how we can assist you…"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <div className="form-field full" style={{ marginTop: "10px" }}>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>
                    <Send size={15} /> Send Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
