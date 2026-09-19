/**
 * Kabod Crest Foods - Product Catalog Data
 * Central source of truth for shop, product detail, and cart/checkout pages.
 *
 * STATUS TIERS:
 * - LIVE Items: Ready for immediate order/dispatch allocation
 *   (Dehydrated Ugwu: 250g @ ₦10,000; Dehydrated Ginger: 250g @ [TBC]; Jollof Rice Spice: 100g @ [TBC])
 * - COMING SOON Items: Displayed with subtle blur, non-clickable, and locked badge in Quiet Authority styling
 *   (Kulikuli, Stockfish, Iru, Cassava Flakes, Shea Butter, African Nutmeg, Ashanti Pepper, Egusi, Ogbono, Ponmo, Zobo)
 */

const KABOD_PRODUCTS = [
  // ==========================================
  // LIVE PRODUCTS (Orderable Now)
  // ==========================================
  {
    id: "dehydrated-ugwu",
    name: "Dehydrated Ugwu",
    subtitle: "Fluted Pumpkin Leaves",
    category: "Dehydrated Vegetables",
    weight: "250g",
    price: 10000,
    priceDisplay: "₦10,000",
    isLive: true,
    isComingSoon: false,
    isPreOrder: false,
    image: "assets/images/products/ugwu.png",
    gallery: [
      {
        src: "assets/images/products/ugwu.png",
        alt: "Dehydrated Ugwu standup pouch front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-dehydrated-veg.png",
        alt: "Fresh harvest fluted pumpkin leaves in traditional stone bowl",
        label: "Ingredient Harvest"
      }
    ],
    origin: "Enugu State, Nigeria",
    shortDescription: "Fluted pumpkin leaves carefully dehydrated at controlled temperatures for easy storage and prolonged shelf stability without sacrificing culinary flavor.",
    description: "Tender, hand-selected fluted pumpkin leaves carefully dehydrated at controlled temperatures to lock in chlorophyll, vital minerals, and natural aroma. Ideal for rich Nigerian soups including Edikang Ikong, Ogbono, and Egusi.",
    features: [
      "100% natural, zero preservatives or additives",
      "Retains natural chlorophyll & vibrant green color",
      "Rehydrates cleanly in warm water within 3 to 5 minutes",
      "Sealed in multi-layer moisture-barrier standup pouch"
    ],
    howToUse: "Soak leaves in clean lukewarm water for 3 to 5 minutes to gently rehydrate before adding directly to your cooking pot. Alternatively, add directly to simmered soups (such as Ogbono or Egusi) during the final 3 minutes of cooking to preserve chlorophyll and freshness.",
    howToStore: "Store in a cool, dry pantry away from moisture and direct sunlight. Keep pouch zipper securely sealed after every opening.",
    faqs: [
      {
        question: "How is the dehydration carried out?",
        answer: "Leaves are sorted, washed, and dried in clean, temperature-regulated dehydration tunnels to preserve cellular structure, aroma, and color."
      },
      {
        question: "What is the dispatch timeline?",
        answer: "Dehydrated Ugwu is live and currently in active fulfillment. Orders are dispatched directly from our Lagos fulfillment center nationwide and worldwide."
      }
    ]
  },
  {
    id: "dehydrated-ginger",
    name: "Dehydrated Ginger Powder",
    subtitle: "Pure Aromatic Nigerian Ginger",
    category: "Spices & Seasonings",
    weight: "250g",
    price: null,
    priceDisplay: "Price: [TBC]",
    isLive: true,
    isComingSoon: false,
    isPreOrder: true,
    image: "assets/images/products/ginger-powder.jpg",
    gallery: [
      {
        src: "assets/images/products/ginger-powder.jpg",
        alt: "Dehydrated Ginger Powder standup pouch front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-spices.png",
        alt: "Fresh and sun-dried ginger roots and botanical spices",
        label: "Spice Harvest"
      }
    ],
    origin: "Kaduna State, Nigeria",
    shortDescription: "Sun-dried and finely stone-milled Nigerian ginger root prized for its high gingerol content, pungent warmth, and clean spicy aroma.",
    description: "Sourced from the renowned ginger-growing belts of southern Kaduna State, our dehydrated ginger powder delivers intense pungent aroma and therapeutic warmth. Hand-peeled, solar-dehydrated, and stone-milled into a fine, versatile spice.",
    features: [
      "Pure Zingiber officinale — zero starch fillers",
      "High natural pungency and volatile oil retention",
      "Stone-milled for silky culinary integration",
      "Resealable freshness barrier pouch"
    ],
    howToUse: "Use 1/4 to 1/2 teaspoon as a fragrant seasoning foundation for stews, broths, marinades, or brew directly into soothing hot ginger tea.",
    howToStore: "Keep pouch sealed tightly in a dark, dry spice cabinet away from humidity.",
    faqs: [
      {
        question: "Is this ginger pure or blended with other roots?",
        answer: "100% single-origin Nigerian ginger root with zero additives, flour, or coloring."
      }
    ]
  },
  {
    id: "jollof-rice-spice",
    name: "Jollof Rice Spice",
    subtitle: "Signature Heritage Blend",
    category: "Spices & Seasonings",
    weight: "100g",
    price: null,
    priceDisplay: "Price: [TBC]",
    isLive: true,
    isComingSoon: false,
    isPreOrder: true,
    image: "assets/images/products/jollof-spice.jpg",
    gallery: [
      {
        src: "assets/images/products/jollof-spice.jpg",
        alt: "Jollof Rice Spice pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-spices.png",
        alt: "Heritage spice assembly and smoky seasoning blend",
        label: "Heritage Blend"
      }
    ],
    origin: "Heritage Formulation, Nigeria",
    shortDescription: "Authentic Nigerian party Jollof spice blend crafted with roasted botanical herbs, bay, dry ginger, and natural savory aromatics.",
    description: "An authentic Nigerian celebration spice blend formulated to recreate the smoky, deeply savory character of party Jollof rice without artificial enhancers. Hand-blended using heritage botanical spices.",
    features: [
      "Authentic smoky notes without chemical liquid smoke",
      "Balanced savory depth with bay, thyme, ginger, and peppers",
      "Zero MSG or artificial fillers",
      "Sealed in gold-accented standup barrier pouch"
    ],
    howToUse: "Add 1 to 2 tablespoons into your simmering tomato-pepper paste base to bloom the oils before pouring in parboiled long grain rice.",
    howToStore: "Store in a cool, dry pantry away from ambient stove heat.",
    faqs: [
      {
        question: "Does this blend contain salt?",
        answer: "It contains only pure botanical spices and minimal natural sea salt, allowing you full control over salt seasoning."
      }
    ]
  },

  // ==========================================
  // LOCKED PRODUCTS (Coming Soon — 11 Items)
  // ==========================================
  {
    id: "kulikuli-snack",
    name: "Kulikuli",
    subtitle: "Groundnut Crunch",
    category: "Seeds & Nuts",
    weight: "1.5kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/kulikuli.jpg",
    gallery: [
      {
        src: "assets/images/products/kulikuli.jpg",
        alt: "Kulikuli standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Kano State, Nigeria",
    shortDescription: "Traditional northern Nigerian groundnut crunch prepared from defatted roasted peanut paste, lightly spiced with dry ginger and pepper.",
    description: "Classic northern Nigerian crunchy spiced groundnut press-cakes. Prepared from defatted roasted groundnut paste seasoned with dry ginger, chili, and sea salt.",
    features: [
      "Crisp, dense traditional texture",
      "High natural plant protein snack",
      "Perfect accompaniment for chilled soaked garri",
      "Resealable freshness pack"
    ]
  },
  {
    id: "stockfish-cod",
    name: "Stockfish",
    subtitle: "Cleaned Atlantic Cod Cutlets",
    category: "Traditional Foods",
    weight: "1kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/stockfish.png",
    gallery: [
      {
        src: "assets/images/products/stockfish.png",
        alt: "Stockfish standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Imported Norwegian Cod, Processed in Nigeria",
    shortDescription: "Cleaned, thoroughly dried Atlantic cod cutlets, prepared to deliver deep savory flavor to traditional soups and ceremonial dishes.",
    description: "Thoroughly dried and cleaned Atlantic cod cutlets. Delivers deep, savory umami depth to ceremonial soups, sauces, and traditional Nigerian family stews.",
    features: [
      "Thoroughly dried and free from sand or grit",
      "Deep, authentic savoriness",
      "Uniform premium cutlets",
      "Long shelf-life stability"
    ]
  },
  {
    id: "iru-locust-beans",
    name: "Iru",
    subtitle: "Fermented Locust Beans",
    category: "Spices & Seasonings",
    weight: "1.2kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/iru.jpg",
    gallery: [
      {
        src: "assets/images/products/iru.jpg",
        alt: "Iru locust beans standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Oyo State, Nigeria",
    shortDescription: "Naturally fermented and sun-dried African locust beans (Parkia biglobosa) offering intense savory depth for Nigerian stews and vegetable pots.",
    description: "Naturally fermented African locust beans (Parkia biglobosa). A cornerstone seasoning providing intense savory depth, essential probiotics, and traditional heritage flavor.",
    features: [
      "Traditional slow batch fermentation",
      "Sun-dried for pantry stability",
      "Unmatched savory foundation for soups and stews",
      "No artificial flavor enhancers"
    ]
  },
  {
    id: "cassava-flakes-garri",
    name: "Cassava Flakes",
    subtitle: "Premium Garri",
    category: "Traditional Foods",
    weight: "5kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/cassava-flakes.jpg",
    gallery: [
      {
        src: "assets/images/products/cassava-flakes.jpg",
        alt: "Cassava Flakes garri standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Delta State, Nigeria",
    shortDescription: "Finely processed, sun-dried cassava flakes prepared through careful peeling, grating, natural fermentation, and roasting.",
    description: "Fine-grained, well-fermented sun-dried cassava flakes. Crispy and clean with a mild tart finish; exceptional for swallow or chilled soaking with groundnuts.",
    features: [
      "Evenly roasted golden grains",
      "Thoroughly sieved and stone-free",
      "Clean sour balance from natural fermentation",
      "Bulk 5kg household pack"
    ]
  },
  {
    id: "shea-butter-unrefined",
    name: "Shea Butter",
    subtitle: "Pure Unrefined Grade",
    category: "Traditional Foods",
    weight: "2kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/shea-butter.png",
    gallery: [
      {
        src: "assets/images/products/shea-butter.png",
        alt: "Pure Unrefined Shea Butter pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Niger State, Nigeria",
    shortDescription: "Unrefined cold-pressed shea butter extracted from wild-harvested Vitellaria paradoxa nuts without chemical bleaching.",
    description: "100% pure unrefined cold-pressed shea butter from wild-harvested Vitellaria paradoxa nuts. Nutrient-dense, versatile culinary and wellness staple.",
    features: [
      "First cold press, raw & unbleached",
      "Rich in natural vitamins A, E, and essential fatty acids",
      "Subtle nutty aroma with velvety texture",
      "Multi-purpose cosmetic & cooking grade"
    ]
  },
  {
    id: "african-nutmeg-ehuru",
    name: "African Nutmeg",
    subtitle: "Uda / Ehuru Pods",
    category: "Spices & Seasonings",
    weight: "500g",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/african-nutmeg.png",
    gallery: [
      {
        src: "assets/images/products/african-nutmeg.png",
        alt: "African Nutmeg standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Edo State, Nigeria",
    shortDescription: "Whole Monodora myristica pods, delivering an aromatic, peppery warmth characteristic of traditional Nigerian broths.",
    description: "Aromatic Monodora myristica seed pods. Known for warm, peppery, woody notes essential for authentic pepper soup, Banga soup, and Nkwobi.",
    features: [
      "Intact pods preserving aromatic volatile oils",
      "Roasts easily for pestle milling",
      "Hand-graded for uniform seed quality",
      "Aromatically sealed packaging"
    ]
  },
  {
    id: "ashanti-pepper-uziza",
    name: "Ashanti Pepper",
    subtitle: "Uziza Seeds",
    category: "Spices & Seasonings",
    weight: "250g",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/ashanti-pepper.png",
    gallery: [
      {
        src: "assets/images/products/ashanti-pepper.png",
        alt: "Ashanti Pepper Uziza Seeds standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Cross River State, Nigeria",
    shortDescription: "Dried Piper guineense peppercorns providing sharp heat with herbal, pine-like undertones for restorative soups.",
    description: "Dried Piper guineense berries featuring a fragrant pungent heat with piney, herbaceous undertones. Enhances restorative broths and native delicacies.",
    features: [
      "Whole dried peppercorns",
      "Distinct herbaceous peppery bouquet",
      "Cleaned and sorted",
      "Aroma-protective packaging"
    ]
  },
  {
    id: "melon-seed-egusi",
    name: "Melon Seed / Egusi",
    subtitle: "Shelled Premium Seeds",
    category: "Seeds & Nuts",
    weight: "3kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/egusi.png",
    gallery: [
      {
        src: "assets/images/products/egusi.png",
        alt: "Egusi Melon Seeds standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Benue State, Nigeria",
    shortDescription: "Plump, carefully shelled Nigerian melon seeds, cleaned and ready for traditional grinding into rich egusi soups.",
    description: "Premium hand-shelled Nigerian melon seeds, uniformly plump and clean. Rich in natural plant proteins and lipids, ready for stone-milling into classic Egusi soup.",
    features: [
      "Uniform seed caliber, machine and hand sorted",
      "Zero bitter shells or chaff",
      "High natural oil content for superior soup thickening",
      "Double moisture-barrier sack"
    ]
  },
  {
    id: "ogbono-dika-nut",
    name: "Ogbono",
    subtitle: "Dika Nut Kernels",
    category: "Seeds & Nuts",
    weight: "1.2kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/ogbono.png",
    gallery: [
      {
        src: "assets/images/products/ogbono.png",
        alt: "Ogbono Dika Nut standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Cross River State, Nigeria",
    shortDescription: "Wild-harvested, sun-dried Irvingia gabonensis kernels prized for traditional draw consistency in Nigerian soups.",
    description: "Wild-harvested Irvingia gabonensis kernels. Sun-dried to perfection to yield superior viscosity, golden richness, and comforting traditional draw soup texture.",
    features: [
      "Exceptional elasticity and draw power",
      "Naturally dried without smoke contamination",
      "Milled fresh or whole kernel delivery",
      "Preserves savory aroma"
    ]
  },
  {
    id: "ponmo-dried-cowskin",
    name: "Ponmo",
    subtitle: "Hygienic Dried Cow Skin",
    category: "Traditional Foods",
    weight: "1.5kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/ponmo.jpg",
    gallery: [
      {
        src: "assets/images/products/ponmo.jpg",
        alt: "Ponmo dried cow skin pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Oyo State, Nigeria",
    shortDescription: "Thoroughly washed, clean dried cow skin curls prepared without chemical agents or accelerants.",
    description: "Hygienically prepared, chemical-free dried brown cow skin curls. Rehydrates cleanly to absorb cooking juices and savory broth spices.",
    features: [
      "Completely free from chemical accelerants or tire burning",
      "Hygienically singed and scrubbed clean",
      "Rehydrates into soft, gelatinous savory pieces",
      "Substantial 1.5kg pack"
    ]
  },
  {
    id: "zobo-hibiscus-calyces",
    name: "Zobo Calyces",
    subtitle: "Dried Hibiscus Flower",
    category: "Dehydrated Vegetables",
    weight: "1kg",
    price: null,
    priceDisplay: "Coming Soon",
    isLive: false,
    isComingSoon: true,
    image: "assets/images/products/zobo.jpg",
    gallery: [
      {
        src: "assets/images/products/zobo.jpg",
        alt: "Zobo Calyces standup pouch front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Kano State, Nigeria",
    shortDescription: "Sun-dried dark crimson Hibiscus sabdariffa petals for authentic zobo drinks, refreshing botanical infusions, and rich tea concentrates.",
    description: "Whole, sun-dried dark crimson Hibiscus sabdariffa calyces harvested in northern Nigeria. Rich in antioxidants and vitamin C, delivering a clean tart profile for refreshing beverages and culinary syrups.",
    features: [
      "Intact deep crimson whole calyces",
      "Zero artificial food colorants",
      "High natural anthocyanin content",
      "Aromatically sealed standup pouch"
    ]
  }
];

// Export for module or browser window use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KABOD_PRODUCTS };
}
