/**
 * Kabod Crest Foods - Product Catalog Data
 * Central source of truth for shop, product detail, and cart/checkout pages.
 *
 * STATUS TIERS:
 * - LIVE Items: Ready for immediate order/dispatch allocation
 *   (Dehydrated Ugwu: 250g @ ₦2,850; Dehydrated Ginger: 250g @ ₦2,400; Jollof Rice Spice: 100g @ ₦2,200)
 * - COMING SOON Items: Displayed with subtle blur, non-clickable, and locked badge in Quiet Authority styling
 *   (Kulikuli, Stockfish, Iru, Cassava Flakes, Shea Butter, African Nutmeg, Ashanti Pepper, Egusi, Ogbono, Ponmo, Zobo)
 */

const KABOD_PRODUCTS = [
  // ==========================================
  // LIVE PRODUCTS (Ready to Order)
  // ==========================================
  {
    id: "dehydrated-ugwu",
    name: "Dehydrated Ugwu",
    subtitle: "Fluted Pumpkin Leaves",
    category: "Dehydrated Vegetables",
    weight: "250g",
    price: 2850,
    priceDisplay: "₦2,850",
    isLive: true,
    isComingSoon: false,
    isPreOrder: false,
    keywords: ["ugwu", "fluted pumpkin", "vegetable", "leaves", "soup", "edikang ikong", "ogbono", "egusi", "enugu"],
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
        label: "Harvest Leaves"
      }
    ],
    origin: "Enugu State, Nigeria",
    shortDescription: "Tender fluted pumpkin leaves from Enugu, dried gently with warm air so they keep their deep green color, delicate crunch, and honest flavor.",
    description: "Tender, hand-selected fluted pumpkin leaves carefully dried at mild temperatures to hold onto their natural chlorophyll, vitamins, and gentle aroma. Perfect for whenever you want to cook a comforting pot of Edikang Ikong, Egusi, or Ogbono.",
    features: [
      "100% natural with zero additives or preservatives",
      "Retains its natural vibrant green color and tender crunch",
      "Rehydrates cleanly in warm water within 3 to 5 minutes",
      "Sealed fresh in an airtight moisture-barrier pouch"
    ],
    howToUse: "Let the leaves sit in a bowl of warm water for 3 to 5 minutes to gently wake them up before cooking. Or, simply drop them straight into your soup during the final 3 minutes on the stove so they stay bright and fresh.",
    howToStore: "Keep your pouch zipped tight and store it in a cool, dry cupboard away from direct sunlight.",
    faqs: [
      {
        question: "How do you dry the leaves?",
        answer: "We wash fresh leaves thoroughly and dry them with warm, gentle air. That protects the color, nutrients, and aroma without ever needing chemical preservatives."
      },
      {
        question: "When will my order arrive?",
        answer: "We pack and seal your order right here in Lagos and send it straight to you, whether you are across the street or across the world."
      }
    ]
  },
  {
    id: "dehydrated-ginger",
    name: "Dehydrated Ginger Powder",
    subtitle: "Pure Aromatic Nigerian Ginger",
    category: "Spices & Seasonings",
    weight: "250g",
    price: 2400,
    priceDisplay: "₦2,400",
    isLive: true,
    isComingSoon: false,
    isPreOrder: false,
    keywords: ["ginger", "spice", "seasoning", "tea", "kaduna", "aromatic", "powder"],
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
    shortDescription: "Sun-dried and stone-ground ginger root from Kaduna. Gives a lively, fragrant warmth with nothing else added.",
    description: "Grown in the ginger heartland of southern Kaduna, our ginger is peeled, naturally dried, and finely stone-ground. It brings a clean, fragrant warmth that lifts everything from comforting stews to a steaming morning brew.",
    features: [
      "100% pure Nigerian ginger root with zero starch fillers",
      "Rich in natural warmth and essential aroma oils",
      "Stone-milled fine for effortless blending",
      "Resealable pouch keeps the spice lively and punchy"
    ],
    howToUse: "A small pinch does wonders. Stir a quarter teaspoon into your stews and marinades, or steep in hot water with a spoonful of raw honey for a soothing drink.",
    howToStore: "Zip tightly after every use and keep in a cool, dry spice rack away from stove steam.",
    faqs: [
      {
        question: "Is this pure ginger or blended with flour?",
        answer: "It is 100% pure ginger root. We never add starch, flour, or artificial flavorings."
      }
    ]
  },
  {
    id: "jollof-rice-spice",
    aliases: ["jollof-spice"],
    name: "Jollof Rice Spice",
    subtitle: "Signature Heritage Blend",
    category: "Spices & Seasonings",
    weight: "100g",
    price: 2200,
    priceDisplay: "₦2,200",
    isLive: true,
    isComingSoon: false,
    isPreOrder: false,
    keywords: ["jollof", "rice", "spice", "seasoning", "party jollof", "blend", "pepper", "tomatoes"],
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
    shortDescription: "Our signature blend of slow-roasted herbs, bay leaf, ginger, and native spices for that unmistakable smoky party Jollof flavor.",
    description: "An authentic Nigerian celebration spice blend formulated to bring out the smoky, savory depth of party Jollof rice without artificial enhancers. Carefully blended using roasted botanical herbs and heritage spices.",
    features: [
      "Natural savory aroma with zero chemical liquid smoke",
      "Balanced with bay leaf, thyme, ginger, and peppers",
      "Zero MSG, artificial colorants, or fillers",
      "Airtight barrier pouch seals in the fresh roasted aroma"
    ],
    howToUse: "Stir one to two spoonfuls directly into your simmering tomato and pepper paste. Let the natural oils bloom in the oil for a minute before adding your parboiled rice.",
    howToStore: "Keep in a cool, dark cupboard away from direct stove heat.",
    faqs: [
      {
        question: "Does this spice blend contain salt?",
        answer: "Only pure spices and a touch of natural sea salt, so you stay completely in control of your seasoning."
      }
    ]
  },

  // ==========================================
  // IN PREPARATION (Coming Soon | 11 Items)
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
    keywords: ["kulikuli", "groundnut", "peanut", "crunch", "snack", "garri", "kano"],
    image: "assets/images/products/kulikuli.jpg",
    gallery: [
      {
        src: "assets/images/products/kulikuli.jpg",
        alt: "Kulikuli standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Kano State, Nigeria",
    shortDescription: "Crispy northern groundnut crunch made from roasted peanut paste, gently spiced with dry ginger and pepper.",
    description: "Classic northern Nigerian crunchy spiced groundnut press-cakes. Made from defatted roasted groundnut paste seasoned with ginger and a touch of chili.",
    features: [
      "Crisp, dense, satisfying crunch",
      "Wholesome natural plant-protein snack",
      "A timeless companion for chilled soaked garri",
      "Packaged in a resealable freshness pack"
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
    keywords: ["stockfish", "cod", "fish", "soup", "stew", "cutlets", "traditional"],
    image: "assets/images/products/stockfish.png",
    gallery: [
      {
        src: "assets/images/products/stockfish.png",
        alt: "Stockfish standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Imported Norwegian Cod, Processed in Nigeria",
    shortDescription: "Cleaned, thoroughly dried Atlantic cod cutlets that bring rich, savory depth to soups and ceremonial dishes.",
    description: "Thoroughly dried and cleaned Atlantic cod cutlets. Delivers deep, savory umami depth to ceremonial soups, sauces, and traditional family stews.",
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
    keywords: ["iru", "locust beans", "dawadawa", "fermented", "soup", "stew", "oyo"],
    image: "assets/images/products/iru.jpg",
    gallery: [
      {
        src: "assets/images/products/iru.jpg",
        alt: "Iru locust beans standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Oyo State, Nigeria",
    shortDescription: "Naturally fermented and sun-dried African locust beans that lend deep savory umami to stews and vegetable pots.",
    description: "Naturally fermented African locust beans (Parkia biglobosa). A cornerstone seasoning providing intense savory depth and traditional heritage flavor.",
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
    keywords: ["garri", "cassava", "flakes", "swallow", "soaking", "delta"],
    image: "assets/images/products/cassava-flakes.jpg",
    gallery: [
      {
        src: "assets/images/products/cassava-flakes.jpg",
        alt: "Cassava Flakes garri standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Delta State, Nigeria",
    shortDescription: "Finely roasted, well-fermented cassava flakes with a crisp crunch and mild, clean tart finish.",
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
    keywords: ["shea butter", "ori", "unrefined", "raw", "butter", "niger"],
    image: "assets/images/products/shea-butter.png",
    gallery: [
      {
        src: "assets/images/products/shea-butter.png",
        alt: "Pure Unrefined Shea Butter pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Niger State, Nigeria",
    shortDescription: "Raw cold-pressed shea butter from wild-harvested shea nuts, completely unbleached and chemical-free.",
    description: "100% pure unrefined cold-pressed shea butter from wild-harvested shea nuts. Nutrient-dense, versatile culinary and wellness staple.",
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
    keywords: ["ehuru", "uda", "african nutmeg", "peppersoup", "spice", "edo"],
    image: "assets/images/products/african-nutmeg.png",
    gallery: [
      {
        src: "assets/images/products/african-nutmeg.png",
        alt: "African Nutmeg standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Edo State, Nigeria",
    shortDescription: "Aromatic Monodora myristica pods with the warm, woody, peppery scent essential to traditional pepper soups.",
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
    keywords: ["uziza", "ashanti pepper", "peppercorns", "spice", "peppersoup", "cross river"],
    image: "assets/images/products/ashanti-pepper.png",
    gallery: [
      {
        src: "assets/images/products/ashanti-pepper.png",
        alt: "Ashanti Pepper Uziza Seeds standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Cross River State, Nigeria",
    shortDescription: "Whole dried uziza berries that bring a lively piney heat and herbaceous lift to restorative broths.",
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
    keywords: ["egusi", "melon seeds", "soup", "swallow", "shelled", "benue"],
    image: "assets/images/products/egusi.png",
    gallery: [
      {
        src: "assets/images/products/egusi.png",
        alt: "Egusi Melon Seeds standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Benue State, Nigeria",
    shortDescription: "Plump, clean hand-shelled melon seeds ready for stone-milling into a rich, velvety egusi soup.",
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
    keywords: ["ogbono", "dika nut", "draw soup", "kernels", "cross river"],
    image: "assets/images/products/ogbono.png",
    gallery: [
      {
        src: "assets/images/products/ogbono.png",
        alt: "Ogbono Dika Nut standup pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Cross River State, Nigeria",
    shortDescription: "Sun-dried dika nut kernels that give that comforting, silky draw and deep richness to your soup pot.",
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
    keywords: ["ponmo", "kanda", "cow skin", "dried", "soup", "stew", "oyo"],
    image: "assets/images/products/ponmo.jpg",
    gallery: [
      {
        src: "assets/images/products/ponmo.jpg",
        alt: "Ponmo dried cow skin pouch packaging front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Oyo State, Nigeria",
    shortDescription: "Thoroughly washed, clean dried cow skin curls prepared hygienically without chemicals or tire smoke.",
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
    keywords: ["zobo", "hibiscus", "calyces", "tea", "drink", "botanical", "kano"],
    image: "assets/images/products/zobo.jpg",
    gallery: [
      {
        src: "assets/images/products/zobo.jpg",
        alt: "Zobo Calyces standup pouch front view",
        label: "Pouch Packaging"
      }
    ],
    origin: "Kano State, Nigeria",
    shortDescription: "Deep crimson dried hibiscus calyces from Kano. Delivers a clean, tart, antioxidant-rich infusion for zobo drink or hot tea.",
    description: "Whole, sun-dried dark crimson Hibiscus sabdariffa calyces harvested in northern Nigeria. Rich in antioxidants and vitamin C, delivering a clean tart profile for refreshing beverages and culinary syrups.",
    features: [
      "Intact deep crimson whole calyces",
      "Zero artificial food colorants",
      "High natural anthocyanin content",
      "Aromatically sealed standup pouch"
    ]
  }
];

// Helper to resolve product by id or alias (e.g. 'jollof-spice' -> 'jollof-rice-spice')
function getProductById(productId) {
  if (!productId || typeof productId !== 'string') return null;
  const normalized = productId.trim().toLowerCase();
  return KABOD_PRODUCTS.find(p =>
    p.id.toLowerCase() === normalized ||
    (Array.isArray(p.aliases) && p.aliases.some(a => a.toLowerCase() === normalized))
  ) || null;
}

// Enhance KABOD_PRODUCTS.find to support alias fallback
const _origFind = KABOD_PRODUCTS.find;
KABOD_PRODUCTS.find = function(predicate, thisArg) {
  const directMatch = _origFind.call(this, predicate, thisArg);
  if (directMatch) return directMatch;
  return _origFind.call(this, (p, idx, arr) => {
    if (predicate.call(thisArg, p, idx, arr)) return true;
    if (Array.isArray(p.aliases)) {
      for (const alias of p.aliases) {
        if (predicate.call(thisArg, { ...p, id: alias }, idx, arr)) return true;
      }
    }
    return false;
  }, thisArg);
};

// Export for module or browser window use
if (typeof window !== 'undefined') {
  window.KABOD_PRODUCTS = KABOD_PRODUCTS;
  window.getProductById = getProductById;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KABOD_PRODUCTS, getProductById };
}
