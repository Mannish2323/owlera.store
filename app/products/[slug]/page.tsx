import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductDetailClient } from "@/components/product-detail-client";
import { getProductBySlug, getProducts } from "@/lib/products";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Piece Not Found | OWLERA",
      description: "The requested piece is not available in our current atelier edit."
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://owlerastore.vercel.app";
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;

  return {
    title: `${product.name} | OWLERA — Your Everyday Shine`,
    description: product.description.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} — OWLERA`,
      description: product.description.slice(0, 160),
      url: canonicalUrl,
      siteName: "OWLERA",
      images: [
        {
          url: product.image,
          width: 1000,
          height: 1000,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — OWLERA`,
      description: product.description.slice(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  // Schema.org Product structured data for Google Rich Results
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery && product.gallery.length > 0 ? product.gallery : [product.image],
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "OWLERA"
    },
    offers: {
      "@type": "Offer",
      url: `https://owlerastore.vercel.app/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "OWLERA"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      <Footer />
    </>
  );
}
