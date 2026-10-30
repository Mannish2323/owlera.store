import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "OWLERA — Luxury Jewellery, Fashion & Everyday Shine",
  description:
    "Discover meticulously curated gold-tone jewellery, evening accessories and lifestyle finds at OWLERA. Pan-India complimentary shipping on qualifying orders.",
  keywords: [
    "Owlera",
    "Luxury Jewellery India",
    "Gold Hoops",
    "Pendant Necklaces",
    "Everyday Luxury",
    "Handcrafted Gifting",
    "Fine Fashion Accessories"
  ],
  openGraph: {
    title: "OWLERA — Your Everyday Shine",
    description: "Curated fine everyday jewellery, evening bags and mindful lifestyle finds.",
    url: "https://owlera.in",
    siteName: "OWLERA",
    locale: "en_IN",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://owlera.in/#organization",
                  "name": "OWLERA",
                  "url": "https://owlera.in",
                  "logo": "https://owlera.in/logo.png",
                  "sameAs": ["https://instagram.com/owlerashop"],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-6305630468",
                    "contactType": "Customer Support",
                    "areaServed": "IN",
                    "availableLanguage": ["English", "Hindi", "Telugu"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://owlera.in/#website",
                  "url": "https://owlera.in",
                  "name": "OWLERA",
                  "description": "Premium jewellery, fashion accessories and everyday luxury.",
                  "publisher": { "@id": "https://owlera.in/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://owlera.in/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            {children}
            <WhatsAppFloat />
            <BottomNav />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
