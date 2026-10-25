"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent(
    "Hello OWLERA! I would like to enquire about your products and services."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Chat with OWLERA on WhatsApp"
      title="Chat with OWLERA on WhatsApp (+91 6305630468)"
    >
      <MessageCircle />
    </a>
  );
}
