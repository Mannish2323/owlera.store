export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count?: number;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  productIds: string[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: "Jewellery" | "Fashion" | "Lifestyle" | "Gifting" | string;
  categorySlug?: string;
  description: string;
  specifications?: Record<string, string>;
  price: number;
  compareAt?: number;
  image: string;
  gallery?: string[];
  stock: number;
  sku: string;
  badge?: string;
  featured?: boolean;
  isNew?: boolean;
};

export const demoCategories: Category[] = [
  {
    id: "cat-fashion",
    name: "Fashion & Accessories",
    slug: "fashion",
    description: "Structured evening clutches, pure silk twill scarves, and refined personal accents.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    count: 3
  },
  {
    id: "cat-crafts",
    name: "Crafts & Handmade",
    slug: "crafts-handmade",
    description: "Artisanal slow-made creations, delicate filigree metalwork, and handcrafted heritage pieces.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
    count: 4
  },
  {
    id: "cat-lifestyle",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Hand-poured amber botanical candles, brass sanctuary keepsakes, and daily rituals.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
    count: 3
  },
  {
    id: "cat-decor",
    name: "Home Decor",
    slug: "home-decor",
    description: "Sand-cast brass vessels, fluted vases, and heirloom Indian living room accents.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=85",
    count: 3
  },
  {
    id: "cat-pooja",
    name: "Pooja & Spiritual",
    slug: "pooja-spiritual",
    description: "Sacred kamal brass diyas, handcrafted puja thalis, and auspicious sanctuary essentials.",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1000&q=85",
    count: 3
  },
  {
    id: "cat-gifts",
    name: "Gifts",
    slug: "gifts",
    description: "Thoughtfully curated gift boxes, festive suites, and personalized celebration sets.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85",
    count: 4
  }
];

export const demoCollections: Collection[] = [
  {
    id: "col-1",
    name: "Celestial Gold",
    slug: "celestial-gold",
    description: "Lustrous 18k gold-toned pieces crafted for subtle daytime grace and evening glamour.",
    bannerImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85",
    productIds: ["owl-1", "owl-2", "owl-3"]
  },
  {
    id: "col-2",
    name: "Heirloom Pearls",
    slug: "heirloom-pearls",
    description: "Organic cultured baroque pearls set against sculptural warm gold metalwork.",
    bannerImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85",
    productIds: ["owl-4"]
  },
  {
    id: "col-3",
    name: "Minimalist Everyday",
    slug: "minimalist-everyday",
    description: "Featherweight silhouettes engineered to seamlessly stack and pair.",
    bannerImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85",
    productIds: ["owl-1", "owl-3", "owl-5"]
  },
  {
    id: "col-4",
    name: "Artisan Keepsakes",
    slug: "artisan-keepsakes",
    description: "Handcrafted lifestyle objects and fragrances designed to enrich your sanctuary.",
    bannerImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=85",
    productIds: ["owl-6", "owl-7"]
  }
];

export const demoProducts: Product[] = [
  {
    id: "owl-1",
    name: "Celeste Gold Hoops",
    slug: "celeste-gold-hoops",
    category: "Jewellery",
    categorySlug: "jewellery",
    price: 1499,
    compareAt: 1999,
    description: "Masterfully sculpted with an arched curvature that catches warm ambient light from every angle. Featuring premium 18k gold-tone vacuum plating over hypoallergenic brass, the Celeste Hoops offer featherlight comfort for day-long wear. Designed to elevate casual knitwear and formal gowns alike.",
    specifications: {
      "Material": "18k Gold-Tone PVD Plating on Brass",
      "Diameter": "24mm",
      "Weight": "4.2g per hoop",
      "Closure": "Hinged Huggie Post",
      "Care": "Avoid perfumes, water, and abrasive cloths. Store in your OWLERA pouch."
    },
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 14,
    sku: "OWL-JW-001",
    badge: "Bestseller",
    featured: true,
    isNew: false
  },
  {
    id: "owl-2",
    name: "Luna Pendant Necklace",
    slug: "luna-pendant-necklace",
    category: "Jewellery",
    categorySlug: "jewellery",
    price: 1899,
    compareAt: 2499,
    description: "An ethereal crescent motif suspended along an intricately diamond-cut curb chain. The pendant reflects the soft luminescence of the nocturnal sky, finished with OWLERA’s hallmark satin-polished gold tone. An exquisite solo piece or a base for layered necklines.",
    specifications: {
      "Material": "18k Gold Plated Brass & Micro Zircon",
      "Chain Length": "42cm + 5cm extender",
      "Pendant Size": "16mm x 14mm",
      "Clasp": "Lobster Claw",
      "Care": "Gently wipe with a soft microfiber cloth after wear."
    },
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 9,
    sku: "OWL-JW-002",
    badge: "New Arrival",
    featured: true,
    isNew: true
  },
  {
    id: "owl-3",
    name: "Golden Hour Paperclip Bracelet",
    slug: "golden-hour-bracelet",
    category: "Jewellery",
    categorySlug: "jewellery",
    price: 1299,
    compareAt: 1699,
    description: "Modern geometric links interlocked in balanced proportions. The Golden Hour Bracelet delivers contemporary refinement with high-reflectance faceted sides. Finished with an engraved OWLERA wing insignia charm tag.",
    specifications: {
      "Material": "18k Gold-Tone High-Polished Brass",
      "Length": "18cm adjustable with extender",
      "Link Width": "5mm",
      "Finish": "Mirror Polish",
      "Care": "Store dry in original luxury presentation case."
    },
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 18,
    sku: "OWL-JW-003",
    badge: "Classic",
    featured: true,
    isNew: false
  },
  {
    id: "owl-4",
    name: "Aura Baroque Pearl Earrings",
    slug: "aura-baroque-pearl-earrings",
    category: "Jewellery",
    categorySlug: "jewellery",
    price: 2199,
    compareAt: 2899,
    description: "Naturally formed organic baroque pearls held by sculpted molten gold studs. Because each cultured pearl possesses organic individuality, no two pairs are identical—giving you an authentic, one-of-a-kind jewel that whispers quiet luxury.",
    specifications: {
      "Material": "Cultured Baroque Pearls & 18k Gold Plate",
      "Length": "32mm approximate",
      "Pearl Type": "Organic Cultured Freshwater Pearl",
      "Hypoallergenic": "Yes, surgical grade titanium posts"
    },
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 6,
    sku: "OWL-JW-004",
    badge: "Limited Batch",
    featured: true,
    isNew: true
  },
  {
    id: "owl-5",
    name: "Verdant Structured Evening Bag",
    slug: "verdant-leather-evening-bag",
    category: "Fashion",
    categorySlug: "fashion",
    price: 3499,
    compareAt: 4500,
    description: "Crafted in deep forest green pebbled vegan leather with polished gold hardware accents. Includes a detachable fine-link curb chain strap, magnetic envelope closure, and structured interior partitions for essentials.",
    specifications: {
      "Material": "Premium Structured Vegan Leather",
      "Dimensions": "21cm x 13cm x 5cm",
      "Hardware": "Brushed Gold Alloy",
      "Strap Drop": "54cm crossbody chain"
    },
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 8,
    sku: "OWL-FS-001",
    badge: "Signature",
    featured: true,
    isNew: false
  },
  {
    id: "owl-6",
    name: "Nocturne Amber & Fig Soy Candle",
    slug: "nocturne-amber-fig-candle",
    category: "Lifestyle",
    categorySlug: "lifestyle",
    price: 1199,
    compareAt: 1499,
    description: "Hand-poured into a forest green matte glass vessel with a solid golden brass snuffer lid. Notes of sun-warmed Mediterranean fig, golden amber, smoky vetiver, and cedarwood create an intimate, calming sanctuary in any room.",
    specifications: {
      "Wax": "100% Organic Soy & Coconut Wax",
      "Burn Time": "55+ Hours",
      "Weight": "280g / 9.8 oz",
      "Wick": "Natural Unbleached Cotton Wick"
    },
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 25,
    sku: "OWL-LS-001",
    badge: "Aromatics",
    featured: false,
    isNew: true
  },
  {
    id: "owl-7",
    name: "Elysian Silk Twilight Scarf",
    slug: "elysian-silk-twilight-scarf",
    category: "Fashion",
    categorySlug: "fashion",
    price: 2499,
    compareAt: 3200,
    description: "100% pure mulberry silk twill adorned with hand-rolled edges. Featuring an intricate botanical illustration of midnight owls under celestial constellations in forest green, warm cream and muted gold pigments.",
    specifications: {
      "Fabric": "100% Mulberry Silk Twill (16mm)",
      "Dimensions": "70cm x 70cm",
      "Edge": "Hand-Rolled Hem",
      "Care": "Dry clean or delicate cold hand wash with silk detergent"
    },
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 12,
    sku: "OWL-FS-002",
    badge: "New",
    featured: true,
    isNew: true
  },
  {
    id: "owl-8",
    name: "Signature OWLERA Luxe Gift Suite",
    slug: "signature-owlera-luxe-gift-suite",
    category: "Gifting",
    categorySlug: "gifting",
    price: 4999,
    compareAt: 6499,
    description: "The quintessential OWLERA gifting experience. Unites our Celeste Gold Hoops, the Nocturne Amber Candle, and a personalized handwritten gift note nestled in our handcrafted forest-green rigid presentation box tied with a double-faced gold satin ribbon.",
    specifications: {
      "Included": "Celeste Gold Hoops, Nocturne Candle, Luxury Box, Velvet Pouch, Custom Gift Note",
      "Box Dimensions": "28cm x 22cm x 9cm",
      "Customization": "Specify recipient note during checkout or via WhatsApp concierge"
    },
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 5,
    sku: "OWL-GF-001",
    badge: "Luxury Gift",
    featured: true,
    isNew: true
  },
  {
    id: "owl-9",
    name: "Nandi Handcrafted Brass Urli Bowl",
    slug: "nandi-brass-urli-bowl",
    category: "Home Decor",
    categorySlug: "home-decor",
    price: 2899,
    compareAt: 3600,
    description: "Sand-cast by traditional metal artisans in pure heavy brass. The Nandi Urli features delicate scalloped rims engineered for floating water blooms, fresh marigolds, and tealights. Creates an authentic aura of serene luxury at your entryway or living space.",
    specifications: {
      "Material": "100% Solid Virgin Brass",
      "Diameter": "26cm / 10.2 inches",
      "Finish": "Antique Lustre Wax Sealed",
      "Weight": "1.4 kg",
      "Care": "Clean with dry cotton cloth. Periodically polish with brass cleaner or pitambari."
    },
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 10,
    sku: "OWL-HD-001",
    badge: "Artisan Heirloom",
    featured: true,
    isNew: true
  },
  {
    id: "owl-10",
    name: "Kamal Lotus Pure Brass Diya Pair",
    slug: "kamal-lotus-brass-diya-pair",
    category: "Pooja & Spiritual",
    categorySlug: "pooja-spiritual",
    price: 1699,
    compareAt: 2199,
    description: "A pair of sculpted lotus-petal brass lamps crafted for prayer sanctums and sacred festivities. Each petal is contoured to cup pure ghee or organic sesame oil, casting warm radiant shadows that elevate morning and evening aartis.",
    specifications: {
      "Material": "Solid Heavyweight Brass",
      "Set Includes": "2 Matching Lotus Diyas",
      "Dimensions": "9cm diameter x 6cm height each",
      "Weight": "520g total",
      "Packaging": "Presented in OWLERA festive rigid box"
    },
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 20,
    sku: "OWL-PJ-001",
    badge: "Sacred Edition",
    featured: true,
    isNew: true
  },
  {
    id: "owl-11",
    name: "Vedic Mysore Sandalwood Incense & Bell Suite",
    slug: "vedic-sandalwood-incense-suite",
    category: "Pooja & Spiritual",
    categorySlug: "pooja-spiritual",
    price: 1399,
    compareAt: 1799,
    description: "An authentic ritual set comprising pure Mysore sandalwood hand-rolled incense sticks, a solid brass ghanti (handbell) with Garuda finial, and an engraved brass ash catcher. Invokes tranquility and sacred mindfulness.",
    specifications: {
      "Incense": "40 Luxury Hand-Rolled Sticks (Sandalwood & Frankincense)",
      "Bell": "Cast Brass with clear resonance tone",
      "Burn Time": "45 minutes per stick",
      "Origin": "Mysuru, Karnataka"
    },
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 15,
    sku: "OWL-PJ-002",
    badge: "Mindful Ritual",
    featured: false,
    isNew: true
  },
  {
    id: "owl-12",
    name: "Jaipur Fluted Ceramic Vase in Warm Ivory",
    slug: "jaipur-fluted-ceramic-vase",
    category: "Home Decor",
    categorySlug: "home-decor",
    price: 2199,
    compareAt: 2800,
    description: "Wheel-thrown earthenware finished in a tactile matte warm ivory glaze with soft fluted ribbing. Designed to host fresh eucalyptus sprigs, dried lotus pods, or stand majestically as a sculptural centerpiece.",
    specifications: {
      "Material": "Studio Ceramic Stoneware",
      "Dimensions": "22cm height x 14cm width",
      "Glaze": "Matte Warm Ivory (Waterproof interior)",
      "Weight": "980g"
    },
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=85"
    ],
    stock: 8,
    sku: "OWL-HD-002",
    badge: "Sculptural",
    featured: false,
    isNew: true
  }
];

export function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPrice(value: number) {
  return money(value);
}

/**
 * Client-safe & server-safe product retrieval
 */
export async function getProducts(): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return demoProducts;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return demoProducts;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category_name || item.category || "Jewellery",
      categorySlug: (item.category_name || item.category || "jewellery").toLowerCase(),
      description: item.description || "",
      specifications: item.specifications || {},
      price: item.price,
      compareAt: item.compare_at,
      image: item.image_url,
      gallery: item.gallery_urls && item.gallery_urls.length > 0 ? item.gallery_urls : [item.image_url],
      stock: item.stock ?? 0,
      sku: item.sku || "OWL-000",
      badge: item.badge || (item.is_new ? "New" : undefined),
      featured: item.is_featured ?? false,
      isNew: item.is_new ?? false
    }));
  } catch (e) {
    return demoProducts;
  }
}

export async function getCategories(): Promise<Category[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return demoCategories;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return demoCategories;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      image: item.image_url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
      count: 3
    }));
  } catch (e) {
    return demoCategories;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
}

