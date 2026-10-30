"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const pathname = usePathname();

  // Hide on admin portal to prevent covering admin tables and analytics
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl = `https://wa.me/916305630468?text=${encodeURIComponent(
    "Hello OWLERA Concierge! I would like to enquire about your jewellery, gifting collections, or pan-India delivery."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Chat with OWLERA Concierge on WhatsApp (+91 6305630468)"
      title="Chat with OWLERA Concierge on WhatsApp (+91 6305630468)"
    >
      <MessageCircle size={22} />
      <span className="sr-only">Chat with OWLERA Concierge on WhatsApp</span>
    </a>
  );
}
