/**
 * Kabod Crest Foods - Product Catalog Data
 * Central source of truth for shop, product detail, and cart/checkout pages.
 *
 * NOTE: All active items are available for PRE-ORDER while commercial production concludes.
 * Prices are flagged clearly as 'Price: [TBC]' until finalized by the commercial desk.
 * No nutritional values, certifications, shelf life, or reviews are invented.
 */

const KABOD_PRODUCTS = [
  {
    id: "dehydrated-ugwu",
    name: "Dehydrated Ugwu",
    subtitle: "Fluted Pumpkin Leaves",
    category: "Dehydrated Vegetables",
    weight: "500g",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
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
      "100% natural, no additives",
      "Retains natural nutrients & vibrant green color",
      "Rehydrates cleanly in warm water within 3 to 5 minutes",
      "Sealed in moisture-barrier standup pouch"
    ],
    howToUse: "Soak leaves in clean lukewarm water for 3 to 5 minutes to gently rehydrate before adding directly to your cooking pot. Alternatively, add directly to simmered soups (such as Ogbono or Egusi) during the final 3 minutes of cooking to preserve chlorophyll and freshness.",
    howToStore: "Store in a cool, dry pantry away from moisture and direct sunlight. Keep pouch zipper securely sealed after every opening.",
    faqs: [
      {
        question: "Why is this product currently listed as a pre-order?",
        answer: "Kabod Crest Foods is concluding initial commercial processing runs. Taking pre-orders allows us to schedule precise dispatch allocations directly from the completed production batch."
      },
      {
        question: "How will I be billed for this item?",
        answer: "Prices are marked as [TBC] while packaging and freight parameters are finalized. Our trade desk will confirm official unit rates and invoice you prior to delivery."
      },
      {
        question: "How is the dehydration carried out?",
        answer: "Leaves are sorted, washed, and dried in clean, temperature-regulated dehydration tunnels to preserve structure, aroma, and color."
      }
    ]
  },
  {
    id: "kulikuli-snack",
    name: "Kulikuli",
    subtitle: "Groundnut Crunch",
    category: "Seeds & Nuts",
    weight: "1.5kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/kulikuli.jpg",
    gallery: [
      {
        src: "assets/images/products/kulikuli.jpg",
        alt: "Kulikuli standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-seeds-nuts.png",
        alt: "Selected roasted groundnut seeds in rustic ceramic bowl",
        label: "Harvest Ingredients"
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
    ],
    howToUse: "Ready to eat immediately as a savory snack. Commonly enjoyed paired with chilled soaked cassava flakes (garri) or crushed as a flavorful crust for roasted meats.",
    howToStore: "Store in an airtight container in a dry environment to maintain crispness and protect against ambient humidity.",
    faqs: [
      {
        question: "What is the pre-order dispatch timeline?",
        answer: "Commercial batch production is currently underway. Pre-orders ensure first-in-line dispatch as soon as the current batch completes quality checks."
      },
      {
        question: "When is the price confirmed?",
        answer: "Commercial unit pricing will be confirmed and communicated by our sales desk prior to invoice generation."
      }
    ]
  },
  {
    id: "stockfish-cod",
    name: "Stockfish",
    subtitle: "Cleaned Atlantic Cod Cutlets",
    category: "Traditional Foods",
    weight: "1kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/stockfish.png",
    gallery: [
      {
        src: "assets/images/products/stockfish.png",
        alt: "Stockfish standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-traditional.png",
        alt: "Traditional cured ingredients in artisanal clay bowl",
        label: "Artisanal Preparation"
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
    ],
    howToUse: "Rinse cutlets under clean cold water. Pre-boil or soak in warm water with a pinch of sea salt for 20 to 30 minutes until tender before incorporating into long-simmered soups and native stews.",
    howToStore: "Store in a well-ventilated, dry place. For extended storage, keep sealed in a moisture-barrier container.",
    faqs: [
      {
        question: "Are these whole fish or pre-cut pieces?",
        answer: "These are cleaned, graded cutlets sized for straightforward kitchen preparation."
      },
      {
        question: "How does pre-ordering work for stockfish?",
        answer: "Stockfish is portioned and packed per batch. Your pre-order reserves allocation from our initial commercial packing run."
      }
    ]
  },
  {
    id: "iru-locust-beans",
    name: "Iru",
    subtitle: "Fermented Locust Beans",
    category: "Spices & Seasonings",
    weight: "1.2kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/iru.jpg",
    gallery: [
      {
        src: "assets/images/products/iru.jpg",
        alt: "Iru locust beans standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-spices.png",
        alt: "Selected African spices and seasonings in traditional bowls",
        label: "Spice Blend"
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
    ],
    howToUse: "Rinse lightly and mash or add whole directly into hot palm oil or simmering stew base to unlock rich savory aroma.",
    howToStore: "Store in a cool, dry cupboard or refrigerate in a tightly sealed container to preserve natural aroma.",
    faqs: [
      {
        question: "Is this dry or wet iru?",
        answer: "This is sun-dried iru, processed for prolonged ambient shelf stability and ease of transit."
      },
      {
        question: "When will price and dispatch date be finalized?",
        answer: "Pricing is currently [TBC]. Dispatch schedules and rates will be provided upon batch completion."
      }
    ]
  },
  {
    id: "cassava-flakes-garri",
    name: "Cassava Flakes",
    subtitle: "Premium Garri",
    category: "Traditional Foods",
    weight: "5kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/cassava-flakes.jpg",
    gallery: [
      {
        src: "assets/images/products/cassava-flakes.jpg",
        alt: "Cassava Flakes garri standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-traditional.png",
        alt: "Clean sun-dried cassava flour and flakes in wooden bowl",
        label: "Milling Preparation"
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
    ],
    howToUse: "To prepare swallow (eba): add flakes steadily into freshly boiled water and turn vigorously until cohesive and firm. For chilled drinking: soak in cold water with milk, sugar, and groundnuts or kulikuli.",
    howToStore: "Keep in a dry container with a tight-fitting lid away from humidity and heat.",
    faqs: [
      {
        question: "How is the garri sieved?",
        answer: "Our garri undergoes multi-stage mechanical and hand sieving to guarantee a fine, grit-free grain."
      },
      {
        question: "Why is the price marked [TBC]?",
        answer: "Commercial agricultural prices vary with harvest batches. Confirmed rates will be shared upon invoice release."
      }
    ]
  },
  {
    id: "shea-butter-unrefined",
    name: "Shea Butter",
    subtitle: "Pure Unrefined Grade",
    category: "Traditional Foods",
    weight: "2kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/shea-butter.png",
    gallery: [
      {
        src: "assets/images/products/shea-butter.png",
        alt: "Pure Unrefined Shea Butter pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-traditional.png",
        alt: "Traditional cold extraction from wild shea nuts",
        label: "Extraction Process"
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
    ],
    howToUse: "For culinary use: melt gently over low heat as an authentic traditional cooking fat. For topical care: warm between hands and apply to skin or hair.",
    howToStore: "Store below 30°C away from direct sunlight or heat sources to avoid melting. Keep sealed.",
    faqs: [
      {
        question: "Is this scented or deodorized?",
        answer: "No. This is raw, unrefined shea butter retaining its natural characteristic mild nutty scent and golden ivory tone."
      }
    ]
  },
  {
    id: "african-nutmeg-ehuru",
    name: "African Nutmeg",
    subtitle: "Uda / Ehuru Pods",
    category: "Spices & Seasonings",
    weight: "500g",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/african-nutmeg.png",
    gallery: [
      {
        src: "assets/images/products/african-nutmeg.png",
        alt: "African Nutmeg standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-spices.png",
        alt: "Fragrant whole African spices in rustic ceramic display",
        label: "Spice Botanicals"
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
    ],
    howToUse: "Information coming soon",
    howToStore: "Store whole pods in an airtight glass or tin container in a dry pantry away from light.",
    faqs: [
      {
        question: "Are these pods cracked or whole?",
        answer: "Shipped whole in pods to safeguard the delicate volatile oils until you crack and grind them at home."
      }
    ]
  },
  {
    id: "ashanti-pepper-uziza",
    name: "Ashanti Pepper",
    subtitle: "Uziza Seeds",
    category: "Spices & Seasonings",
    weight: "Size TBC",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/ashanti-pepper.png",
    gallery: [
      {
        src: "assets/images/products/ashanti-pepper.png",
        alt: "Ashanti Pepper Uziza Seeds standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-spices.png",
        alt: "Ground and whole Nigerian pepper varieties",
        label: "Aromatic Harvest"
      }
    ],
    origin: "Cross River State, Nigeria",
    shortDescription: "Dried Piper guineense peppercorns providing sharp heat with herbal, pine-like undertones for restorative soups.",
    description: "Dried Piper guineense berries featuring a fragrant pungent heat with piney, herbaceous undertones. Enhances restorative broths and native delicacies.",
    features: [
      "Whole dried peppercorns",
      "Distinct herbaceous peppery bouquet",
      "Cleaned and sorted",
      "Packaging size will be confirmed prior to shipment"
    ],
    howToUse: "Information coming soon",
    howToStore: "Store in a tightly sealed spice container in a dark, dry cabinet.",
    faqs: [
      {
        question: "Why is the weight listed as Size TBC?",
        answer: "Packaging unit sizes for Ashanti Pepper are being finalized for our commercial pouch line. The exact net weight will be specified prior to dispatch."
      }
    ]
  },
  {
    id: "melon-seed-egusi",
    name: "Melon Seed / Egusi",
    subtitle: "Shelled Premium Seeds",
    category: "Seeds & Nuts",
    weight: "3kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/egusi.png",
    gallery: [
      {
        src: "assets/images/products/egusi.png",
        alt: "Egusi Melon Seeds standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-seeds-nuts.png",
        alt: "Clean shelled melon seeds in traditional wooden bowl",
        label: "Shelled Harvest"
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
    ],
    howToUse: "Information coming soon",
    howToStore: "Information coming soon",
    faqs: [
      {
        question: "Is this product pre-ground or whole seeds?",
        answer: "This product is supplied as whole shelled seeds, ensuring maximum freshness and oil preservation until milled in your kitchen."
      }
    ]
  },
  {
    id: "ogbono-dika-nut",
    name: "Ogbono",
    subtitle: "Dika Nut Kernels",
    category: "Seeds & Nuts",
    weight: "1.2kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/ogbono.png",
    gallery: [
      {
        src: "assets/images/products/ogbono.png",
        alt: "Ogbono Dika Nut standup pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-seeds-nuts.png",
        alt: "Dried wild dika nuts in clay bowl",
        label: "Wild Harvest"
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
    ],
    howToUse: "Information coming soon",
    howToStore: "Information coming soon",
    faqs: [
      {
        question: "What guarantees the draw elasticity of this ogbono?",
        answer: "We source exclusively mature dika kernels sun-dried under monitored atmospheric conditions without high-heat smoking."
      }
    ]
  },
  {
    id: "ponmo-dried-cowskin",
    name: "Ponmo",
    subtitle: "Hygienic Dried Cow Skin",
    category: "Traditional Foods",
    weight: "1.5kg",
    price: null,
    priceDisplay: "Price: [TBC]",
    isPreOrder: true,
    image: "assets/images/products/ponmo.jpg",
    gallery: [
      {
        src: "assets/images/products/ponmo.jpg",
        alt: "Ponmo dried cow skin pouch packaging front view",
        label: "Pouch Packaging"
      },
      {
        src: "assets/images/reference/cat-traditional.png",
        alt: "Hygienically cured traditional meats in ceramic vessel",
        label: "Curing Standards"
      }
    ],
    origin: "Oyo State, Nigeria",
    shortDescription: "Thoroughly washed, clean dried cow skin curls prepared without chemical agents or accelerants.",
    description: "Hygienically prepared, chemical-free dried brown cow skin curls. Rehydrates cleanly to absorb cooking juices and savory broth spices.",
    features: [
      "Completely free from chemical accelerants or tire burning",
      "Hygienically singed and scrubbed clean",
      "Rehydrates into soft, gelatinous savory pieces",
      "Substantial 1.5kg pre-order volume"
    ],
    howToUse: "Information coming soon",
    howToStore: "Information coming soon",
    faqs: [
      {
        question: "How is this ponmo prepared?",
        answer: "Prepared using clean hot water scraping and regulated hot-air drying, completely avoiding hazardous industrial accelerants."
      }
    ]
  }
];

/*
 * NOTE ON FUTURE PRODUCTS:
 * ------------------------
 * Zobo (Hibiscus Sabdariffa Leaves / Dried Calyces):
 * Still in conceptual / formulation review per client specifications.
 * Not confirmed for initial catalog launch.
 *
 * UNCOMMENT WHEN CONFIRMED BY CLIENT:
 * {
 *   id: "zobo-hibiscus-calyces",
 *   name: "Zobo Calyces",
 *   subtitle: "Dried Hibiscus Flower",
 *   category: "Dehydrated Vegetables",
 *   weight: "1kg",
 *   price: null,
 *   priceDisplay: "Price: [TBC]",
 *   isPreOrder: true,
 *   image: "assets/images/products/zobo.png",
 *   description: "Sun-dried dark crimson Hibiscus sabdariffa petals for authentic zobo drinks and botanical infusions."
 * }
 */

// Export for module or browser window use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KABOD_PRODUCTS };
}
