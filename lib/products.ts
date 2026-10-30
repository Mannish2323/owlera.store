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
    id: "cat-clothing",
    name: "Clothing",
    slug: "fashion",
    description: "Everyday tees, oversized fits, hoodies, sweatshirts, and graphic apparel.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=85",
    count: 120
  },
  {
    id: "cat-crafts",
    name: "Handmade Crafts",
    slug: "crafts-handmade",
    description: "Artisanal slow-made creations, delicate filigree metalwork, and handcrafted heritage pieces.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=85",
    count: 85
  },
  {
    id: "cat-candles",
    name: "Candles",
    slug: "candles",
    description: "Hand-poured amber botanical soy candles, scented wax melts, and aromatics.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=85",
    count: 60
  },
  {
    id: "cat-room-fresheners",
    name: "Room Fresheners",
    slug: "room-fresheners",
    description: "Reed diffusers, pure essential oil room mists, and luxury sanctuary aromas.",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=85",
    count: 45
  },
  {
    id: "cat-car-fresheners",
    name: "Car Fresheners",
    slug: "car-fresheners",
    description: "Wood-capped hanging diffuser bottles, vent clips, and natural car aromas.",
    image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=85",
    count: 35
  },
  {
    id: "cat-bathroom-fresheners",
    name: "Bathroom Fresheners",
    slug: "bathroom-fresheners",
    description: "Crisp citrus, eucalyptus and floral deodorizing blocks and botanical sprays.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=85",
    count: 25
  },
  {
    id: "cat-decor",
    name: "Home Decor",
    slug: "home-decor",
    description: "Sand-cast brass vessels, fluted vases, and heirloom Indian living room accents.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=85",
    count: 90
  },
  {
    id: "cat-pooja",
    name: "Pooja & Spiritual",
    slug: "pooja-spiritual",
    description: "Sacred kamal brass diyas, handcrafted puja thalis, and auspicious sanctuary essentials.",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=85",
    count: 110
  },
  {
    id: "cat-jewellery",
    name: "Jewellery & Bracelets",
    slug: "jewellery",
    description: "18k gold-tone hoops, gemstone chains, and spiritual rudraksha bracelets.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=85",
    count: 95
  },
  {
    id: "cat-lifestyle",
    name: "Lifestyle Products",
    slug: "lifestyle",
    description: "Mindful daily essentials, desktop sanctuary finds, and holistic lifestyle wares.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=85",
    count: 80
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Structured vegan leather clutches, silk twill scarves, and refined personal accents.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=85",
    count: 150
  },
  {
    id: "cat-gifts",
    name: "Gifts",
    slug: "gifts",
    description: "Thoughtfully curated gift boxes, festive suites, and personalized celebration sets.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=85",
    count: 70
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
  },
{
    id: "owl-candle-lavender",
    name: "Lavender Aromatherapy Candle",
    slug: "lavender-aromatherapy-candle",
    category: "Candles",
    categorySlug: "candles",
    price: 249,
    compareAt: 349,
    description: "Hand-poured scented candle with natural essential oils. Perfect for relaxation, meditation and home décor.",
    specifications: {
      "Wax": "Pure Soy Wax & Lavender Essential Oil",
      "Burn Time": "35+ Hours",
      "Weight": "180g",
      "Features": "Natural Ingredients, Long Lasting, Handmade, Premium Fragrance"
    },
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 45,
    sku: "OWL-CD-001",
    badge: "Bestseller",
    featured: true,
    isNew: true
  },
  {
    id: "owl-bracelet-rudraksha",
    name: "Rudraksha Bead Bracelet",
    slug: "rudraksha-bead-bracelet",
    category: "Jewellery & Bracelets",
    categorySlug: "jewellery",
    price: 299,
    compareAt: 399,
    description: "Hand-knotted 5-Mukhi authentic Himalayan Rudraksha beads complemented by warm 18k gold-toned spacer rondelles.",
    specifications: {
      "Bead Type": "Authentic 5-Mukhi Rudraksha (8mm)",
      "Metal": "18k Gold Plated Brass Spacers",
      "Fit": "Stretch Comfort Fit (18cm - 20cm)"
    },
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 30,
    sku: "OWL-JW-005",
    badge: "Sacred",
    featured: true,
    isNew: true
  },
  {
    id: "owl-tee-matane",
    name: "Mata Ne Graphic Tee",
    slug: "mata-ne-graphic-tee",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 499,
    compareAt: 699,
    description: "Heavyweight 240 GSM combed cotton featuring exclusive Japanese cyberpunk floral typography screen-print.",
    specifications: {
      "Fabric": "100% Super-Combed Cotton (240 GSM)",
      "Fit": "Relaxed Streetwear Silhouette",
      "Print": "High-Density Screen Print"
    },
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 50,
    sku: "OWL-AP-001",
    badge: "Hot",
    featured: true,
    isNew: true
  },
  {
    id: "owl-tree-crystal",
    name: "Botanical Crystal Prosperity Tree",
    slug: "botanical-crystal-prosperity-tree",
    category: "Handmade Crafts",
    categorySlug: "crafts-handmade",
    price: 699,
    compareAt: 999,
    description: "Handcrafted golden brass wire sculpture with natural polished crystal quartz and citrine leaves resting on raw agate base.",
    specifications: {
      "Crystals": "Natural Citrine & Clear Quartz",
      "Base": "Natural Brazilian Agate Slice",
      "Dimensions": "15cm height x 10cm width"
    },
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 22,
    sku: "OWL-CR-002",
    badge: "Handcrafted",
    featured: true,
    isNew: true
  },
  {
    id: "owl-tee-tenshi",
    name: "Tenshi Graphic Tee",
    slug: "tenshi-graphic-tee",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 499,
    compareAt: 699,
    description: "Minimal anime illustration in radiant electric blue screen-printed on obsidian black combed cotton.",
    specifications: {
      "Fabric": "100% Combed Cotton (240 GSM)",
      "Fit": "Drop-Shoulder Oversized"
    },
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 35,
    sku: "OWL-AP-002",
    badge: "Popular",
    featured: true,
    isNew: false
  },
  {
    id: "owl-tee-dragon",
    name: "Dragon Graphic Tee",
    slug: "dragon-graphic-tee",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 499,
    compareAt: 699,
    description: "Oriental dragon aesthetic back print with vintage wash texture and reinforced ribbed collar.",
    specifications: {
      "Fabric": "100% Bio-Washed Cotton",
      "Fit": "Regular Unisex Fit"
    },
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 40,
    sku: "OWL-AP-003",
    badge: "Trending",
    featured: true,
    isNew: false
  },
  {
    id: "owl-tee-kanji",
    name: "Kanji Graphic Tee",
    slug: "kanji-graphic-tee",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 499,
    compareAt: 699,
    description: "Tokyo calligraphy backprint rendered in high-density crimson and white puff pigments on snow-white tee.",
    specifications: {
      "Fabric": "100% Ring-Spun Cotton (220 GSM)",
      "Fit": "Clean Boxy Cut"
    },
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 28,
    sku: "OWL-AP-004",
    badge: "Classic",
    featured: true,
    isNew: false
  },
  {
    id: "owl-tee-minimal",
    name: "Minimal Everyday Tee",
    slug: "minimal-everyday-tee",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 449,
    compareAt: 549,
    description: "Sand-ivory organic cotton crewneck tee with discreet tonal OWLERA owl embroidery on chest.",
    specifications: {
      "Fabric": "100% Organic Pima Cotton (200 GSM)",
      "Fit": "Tailored Minimalist Fit"
    },
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 60,
    sku: "OWL-AP-005",
    badge: "Core",
    featured: false,
    isNew: false
  },
  {
    id: "owl-tee-oversized",
    name: "Oversized Vintage Tee",
    slug: "oversized-vintage-tee",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 549,
    compareAt: 749,
    description: "Mineral-washed charcoal oversized tee with vintage sunburst motif and distressed double-stitch hem.",
    specifications: {
      "Fabric": "100% Acid-Washed Cotton (260 GSM)",
      "Fit": "Oversized Streetwear Silhouette"
    },
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 25,
    sku: "OWL-AP-006",
    badge: "Vintage",
    featured: false,
    isNew: false
  },
  {
    id: "owl-hoodie-forest",
    name: "Forest Green Heavy Hoodie",
    slug: "forest-green-heavy-hoodie",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 799,
    compareAt: 1199,
    description: "Ultra-plush fleece hoodie in signature OWLERA forest green with antique brass eyelets and kangaroo pouch.",
    specifications: {
      "Fabric": "380 GSM Cotton-Fleece Blend",
      "Fit": "Comfort Boxy Cut",
      "Lining": "Thermal Brushed Fleece"
    },
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 18,
    sku: "OWL-AP-007",
    badge: "Cozy",
    featured: false,
    isNew: true
  },
  {
    id: "owl-jacket-bomber",
    name: "Heritage Artisan Jacket",
    slug: "heritage-artisan-jacket",
    category: "Fashion & Clothing",
    categorySlug: "fashion",
    price: 999,
    compareAt: 1499,
    description: "Structured utility bomber jacket with gold YKK hardware and satin lining, designed for modern transitions.",
    specifications: {
      "Fabric": "Water-Repellent Cotton Canvas",
      "Hardware": "Brushed Gold Alloy Zipper",
      "Pockets": "4 Functional Enclosed Compartments"
    },
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 12,
    sku: "OWL-AP-008",
    badge: "Exclusive",
    featured: false,
    isNew: true
  },
  {
    id: "owl-freshener-amber",
    name: "Amber Woods Luxury Room Reed Diffuser",
    slug: "amber-woods-room-diffuser",
    category: "Room Fresheners",
    categorySlug: "room-fresheners",
    price: 349,
    compareAt: 499,
    description: "Botanical reed diffuser with natural rattan sticks, diffusing warm cedar, amber resin, and wild bergamot.",
    specifications: {
      "Volume": "100ml / 3.4 fl oz",
      "Lifespan": "60+ Days Continual Diffusion",
      "Includes": "Amber Glass Bottle + 8 Natural Reeds"
    },
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 40,
    sku: "OWL-RF-001",
    badge: "Aromatic",
    featured: false,
    isNew: true
  },
  {
    id: "owl-freshener-car-oud",
    name: "Royal Oud Wood-Cap Car Freshener",
    slug: "royal-oud-car-freshener",
    category: "Car Fresheners",
    categorySlug: "car-fresheners",
    price: 199,
    compareAt: 299,
    description: "Hand-finished beechwood cap hanging bottle with concentrated Cambodian oud and saffron oil essence.",
    specifications: {
      "Volume": "10ml Concentrated Oil",
      "Lifespan": "45 Days",
      "Attachment": "Braided Cord for Rear-View Mirror"
    },
    image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 50,
    sku: "OWL-CF-001",
    badge: "Auto Luxe",
    featured: false,
    isNew: true
  },
  {
    id: "owl-freshener-bath-citrus",
    name: "Citrus Bergamot Bathroom Freshener Mist",
    slug: "citrus-bergamot-bathroom-freshener",
    category: "Bathroom Fresheners",
    categorySlug: "bathroom-fresheners",
    price: 229,
    compareAt: 329,
    description: "Rapid odor-neutralizing mist powered by pure Italian bergamot, lemongrass, and tea tree natural extracts.",
    specifications: {
      "Volume": "120ml Spray Bottle",
      "Formula": "100% Plant-Derived Odor Neutralizer"
    },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85"
    ],
    stock: 35,
    sku: "OWL-BF-001",
    badge: "Fresh",
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

    const mapped = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      image: item.image_url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
      count: item.count || 50
    }));
    const existingSlugs = new Set(mapped.map((c: any) => c.slug));
    const merged: Category[] = [...mapped];
    for (const cat of demoCategories) {
      if (!existingSlugs.has(cat.slug)) {
        merged.push(cat);
      }
    }
    return merged;
  } catch (e) {
    return demoCategories;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
}

