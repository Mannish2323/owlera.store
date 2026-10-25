import { MetadataRoute } from "next";
import { demoProducts, demoCollections } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://owlera.in";

  const staticPages = [
    "",
    "/shop",
    "/jewellery",
    "/fashion",
    "/lifestyle",
    "/search",
    "/about",
    "/contact",
    "/faq",
    "/orders",
    "/track-order",
    "/wishlist",
    "/cart",
    "/policies",
    "/policies/shipping",
    "/policies/returns",
    "/policies/privacy",
    "/policies/terms",
    "/policies/cancellation",
    "/policies/payment",
    "/policies/refunds"
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8
  }));

  const productPages = demoProducts.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9
  }));

  const collectionPages = demoCollections.map(col => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85
  }));

  return [...staticPages, ...productPages, ...collectionPages];
}
