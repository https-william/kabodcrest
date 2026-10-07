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
        culinaryPairings: [
      "Edikang Ikong",
      "Egusi Soup",
      "Ofe Owerri",
      "Yam Pottage"
],
    sensoryProfile: {
      "aroma": "Fresh Green Botanical",
      "flavor": "Earthy, delicate and mildly sweet",
      "finish": "Tender crisp texture with natural bite"
},
    rehydrationSteps: [
      {
            "step": "01",
            "title": "Warm Water Bath",
            "desc": "Submerge leaves in lukewarm water for 3 to 5 minutes to awaken the chlorophyll."
      },
      {
            "step": "02",
            "title": "Gentle Drain",
            "desc": "Press lightly between your palms to release excess moisture while keeping leaves whole."
      },
      {
            "step": "03",
            "title": "Final Simmer",
            "desc": "Fold into your soup during the last 3 minutes of cooking to retain peak green vibrancy."
      }
],
    culinaryTip: "For maximum vitality and crunch, never overboil fluted pumpkin leaves on high heat.",
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
        culinaryPairings: [
      "Goat Meat Pepper Soup",
      "Zobo Infusions",
      "Suya Marinades",
      "Steaming Morning Brew"
],
    sensoryProfile: {
      "aroma": "Sharp Zesty Citrus Spice",
      "flavor": "Fiery, clean and invigorating",
      "finish": "Lingering comforting warmth"
},
    culinaryTip: "Southern Kaduna ginger is celebrated worldwide for its high gingerol concentration. A gentle quarter teaspoon equals two fresh thumbs of grated ginger root.",
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
        culinaryPairings: [
      "Authentic Party Jollof",
      "Fried Rice Base",
      "Roasted Chicken Rub",
      "Peppered Fish Sauce"
],
    sensoryProfile: {
      "aroma": "Smoky Tomato, Thyme & Nutmeg",
      "flavor": "Deep savory umami with gentle heat",
      "finish": "Rich firewood party-pot aroma"
},
    culinaryTip: "Bloom one tablespoon in warm cooking oil for 60 seconds before pouring in your blended pepper base to release the roasted spice aromatics.",
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
        culinaryPairings: [
      "Chilled Soaked Garri",
      "Roasted Groundnut Mix",
      "Midday Crunch Snack",
      "Spiced Suya Topping"
],
    sensoryProfile: {
      "aroma": "Deep Roasted Peanuts",
      "flavor": "Nutty, savory with subtle ginger heat",
      "finish": "Dense, satisfying clean crunch"
},
    culinaryTip: "Crush coarsely over leafy garden salads or grilled meats for an instant authentic northern peanut crunch.",
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
        culinaryPairings: [
      "Ofe Owerri",
      "Egusi Soup",
      "Banga Soup",
      "Bitterleaf Stew"
],
    sensoryProfile: {
      "aroma": "Rich Savory Oceanic",
      "flavor": "Intense umami broth infusion",
      "finish": "Firm, succulent flaked texture"
},
    rehydrationSteps: [
      {
            "step": "01",
            "title": "Salted Soak",
            "desc": "Soak cutlets in warm, lightly salted water for 2 to 3 hours to soften the fibers."
      },
      {
            "step": "02",
            "title": "First Parboil",
            "desc": "Simmer in aromatics (onions and peppers) for 15 minutes to release the deep savory broth."
      },
      {
            "step": "03",
            "title": "Soup Integration",
            "desc": "Add the softened cutlets along with their reserved cooking broth directly into your soup pot."
      }
],
    culinaryTip: "Never discard the soaking and parboil broth; it contains the most concentrated natural savory essence.",
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
        culinaryPairings: [
      "Efo Riro",
      "Ayamase (Designer Stew)",
      "Native Jollof Rice",
      "Okro Soup"
],
    sensoryProfile: {
      "aroma": "Deep Pungent Earthy Ferment",
      "flavor": "Intense umami foundation",
      "finish": "Rich savory undertone"
},
    culinaryTip: "Saute whole iru in hot palm oil alongside chopped onions as the opening step of your soup to anchor the entire pot.",
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
        culinaryPairings: [
      "Chilled Water Soaking with Peanuts",
      "Smooth Hot Swallow (Eba)",
      "Crispy Batter Coating",
      "Evaporated Milk Infusion"
],
    sensoryProfile: {
      "aroma": "Clean Roasted Cassava",
      "flavor": "Crisp and pleasantly tangy",
      "finish": "Smooth velvety swallow or floating crunch"
},
    culinaryTip: "For swallow (Eba), pour boiling water into a bowl first, then sprinkle the garri gently across the surface without stirring for 60 seconds to avoid lumps.",
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
        culinaryPairings: [
      "Traditional Cooking Fat",
      "Raw Shea Skin Nourishment",
      "Culinary Oil Replacement",
      "Natural Whipped Balm"
],
    sensoryProfile: {
      "aroma": "Mild Earthy Nutty",
      "flavor": "Creamy, buttery and neutral",
      "finish": "Velvety melting texture"
},
    culinaryTip: "Store in a cool pantry away from direct heat to maintain its smooth whipped consistency.",
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
        culinaryPairings: [
      "Goat Meat Pepper Soup",
      "Nkwobi",
      "Abacha (African Salad)",
      "Banga Soup"
],
    sensoryProfile: {
      "aroma": "Woodsy Resinous Clove",
      "flavor": "Warm, sweet aromatic spice",
      "finish": "Delicate fragrant lift"
},
    culinaryTip: "Roast whole pods over a dry skillet or open flame for 2 minutes before cracking to unlock the essential volatile spice oils.",
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
        culinaryPairings: [
      "Ofe Nsala (White Soup)",
      "Fisherman Soup",
      "Catfish Pepper Soup",
      "Yam Pottage"
],
    sensoryProfile: {
      "aroma": "Piney Herbaceous Peppercorn",
      "flavor": "Pungent heat with subtle numbing warmth",
      "finish": "Bright restorative freshness"
},
    culinaryTip: "Lightly crush the peppercorns in a mortar just before cooking; adding them in the final 10 minutes keeps the volatile pine notes intact.",
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
        culinaryPairings: [
      "Pounded Yam Feast",
      "Ofe Egusi with Ugwu",
      "Bitterleaf Egusi",
      "Fried Egusi Stew"
],
    sensoryProfile: {
      "aroma": "Fresh Shelled Melon Nut",
      "flavor": "Creamy, rich and velvety",
      "finish": "Satisfying traditional curd texture"
},
    rehydrationSteps: [
      {
            "step": "01",
            "title": "Fine Milling",
            "desc": "Grind shelled seeds with a touch of onion and lukewarm water into a thick, uniform paste."
      },
      {
            "step": "02",
            "title": "Oil Searing",
            "desc": "Scoop tablespoon-sized portions into hot palm oil to form firm, golden protein curds."
      },
      {
            "step": "03",
            "title": "Slow Simmer",
            "desc": "Stir in rich meat stock and dried leafy greens, simmering until the oil floats cleanly to the top."
      }
],
    culinaryTip: "Adding a splash of warm onion puree to your ground egusi paste creates firm, luxurious soup curds that never break down.",
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
        culinaryPairings: [
      "Ofe Ogbono with Bitterleaf",
      "Pounded Yam Companion",
      "Starch & Fufu",
      "Assorted Meat Pot"
],
    sensoryProfile: {
      "aroma": "Deep Nutty Earthy",
      "flavor": "Rich savory viscosity",
      "finish": "Long silky elasticity and draw"
},
    rehydrationSteps: [
      {
            "step": "01",
            "title": "Oil Dissolution",
            "desc": "Stir finely ground ogbono into warm palm oil away from direct flame until completely dissolved without lumps."
      },
      {
            "step": "02",
            "title": "Stock Tempering",
            "desc": "Gradually whisk in simmering meat broth in small additions; watch the draw thicken immediately."
      },
      {
            "step": "03",
            "title": "Leafy Finish",
            "desc": "Fold in dried vegetables in the final 2 minutes and remove from heat to preserve the silky draw."
      }
],
    culinaryTip: "Never cover an ogbono pot with a tight lid while boiling on the stove; steam buildup reduces the elasticity and draw.",
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
        culinaryPairings: [
      "Ata Dindin (Pepper Sauce)",
      "Efo Riro",
      "Edikang Ikong",
      "Buka Stew"
],
    sensoryProfile: {
      "aroma": "Clean Savory Broth",
      "flavor": "Richly absorbs spices and pepper",
      "finish": "Tender, soft gelatinous bite"
},
    rehydrationSteps: [
      {
            "step": "01",
            "title": "Overnight Soak",
            "desc": "Immerse dry curls in warm water for 4 to 6 hours or overnight until pliable."
      },
      {
            "step": "02",
            "title": "Seasoned Boil",
            "desc": "Simmer with onions, bouillon, and chili for 30 minutes until fork-tender."
      },
      {
            "step": "03",
            "title": "Sauce Absorption",
            "desc": "Toss into your simmering palm oil stew so the honeycombed edges soak up rich savory flavor."
      }
],
    culinaryTip: "Our ponmo is 100% hygienically prepared without tire burning or chemicals; rinse once and boil with total peace of mind.",
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
        culinaryPairings: [
      "Chilled Spiced Hibiscus Cooler",
      "Hot Calyces Tea",
      "Pineapple Ginger Brew",
      "Citrus Mocktails"
],
    sensoryProfile: {
      "aroma": "Fruity Floral Berry",
      "flavor": "Bold, tart and cranberry-like",
      "finish": "Refreshing, crisp cleansing acidity"
},
    rehydrationSteps: [
      {
            "step": "01",
            "title": "Quick Cold Rinse",
            "desc": "Rinse dried calyces in a colander under cold water for 15 seconds to remove field dust."
      },
      {
            "step": "02",
            "title": "Spiced Boil",
            "desc": "Simmer with crushed ginger, cloves, and pineapple rind in boiling water for 15 minutes."
      },
      {
            "step": "03",
            "title": "Strain & Chill",
            "desc": "Pass through a fine muslin sieve, allow to cool completely, and sweeten with raw honey or fruit juice."
      }
],
    culinaryTip: "Add a bruised piece of fresh ginger and cinnamon stick while boiling for the signature street-style northern spice kick.",
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

// ============================================================================
// Option 3: Frequently Cooked Together Pantry Bundles
// Strictly maps items from the 14 products in this catalog only.
// ============================================================================
const KABOD_PANTRY_BUNDLES = {
  "dehydrated-ugwu": {
    bundleId: "bundle-ugwu-egusi",
    title: "The Heritage Egusi & Ugwu Soup Pot",
    subtitle: "Fluted Pumpkin Leaves + Melon Seed + Fermented Locust Beans",
    description: "Tender dehydrated fluted pumpkin leaves paired with stone-milled melon seeds and savory fermented locust beans for a classic Nigerian soup pot.",
    itemIds: ["dehydrated-ugwu", "melon-seed-egusi", "iru-locust-beans"],
    heritageTip: "Soak the Ugwu leaves in warm water for 5 minutes, then fold into your Egusi and Iru broth in the final 3 minutes for garden-fresh crunch."
  },
  "dehydrated-ginger": {
    bundleId: "bundle-ginger-staples",
    title: "The Everyday Kitchen Staples Trio",
    subtitle: "Ginger Powder + Jollof Rice Spice + Dehydrated Ugwu",
    description: "Our complete live pantry collection. Pure aromatic ginger powder paired with stone-ground festive jollof seasoning and crisp fluted pumpkin leaves.",
    itemIds: ["dehydrated-ginger", "jollof-rice-spice", "dehydrated-ugwu"],
    heritageTip: "All three items are packed fresh in Lagos and ready for immediate dispatch to your kitchen."
  },
  "jollof-rice-spice": {
    bundleId: "bundle-jollof-feast",
    title: "The Festive Party Jollof Trio",
    subtitle: "Jollof Rice Spice + Ginger Powder + African Nutmeg",
    description: "The secret to authentic Nigerian party jollof. Stone-ground peppers and herbs paired with pungent Kaduna ginger and toasted ehuru.",
    itemIds: ["jollof-rice-spice", "dehydrated-ginger", "african-nutmeg-ehuru"],
    heritageTip: "Bloom the ginger powder and jollof spice in hot cooking oil before adding your blended tomato reduction."
  },
  "melon-seed-egusi": {
    bundleId: "bundle-egusi-pot",
    title: "The Classic Egusi Dinner Pot",
    subtitle: "Melon Seed + Dehydrated Ugwu + Stockfish",
    description: "The quintessential Nigerian celebratory meal. Pure hand-shelled melon seeds simmered with wild Atlantic stockfish and finished with crisp Ugwu leaves.",
    itemIds: ["melon-seed-egusi", "dehydrated-ugwu", "stockfish-cod"],
    heritageTip: "Simmer the stockfish until tender to create a deep savory stock before stirring in your egusi lumps."
  },
  "ogbono-dika-nut": {
    bundleId: "bundle-ogbono-uziza",
    title: "The Traditional Draw Soup Pot",
    subtitle: "Ogbono Kernels + Ashanti Pepper + Dehydrated Ugwu",
    description: "Rich, velvety draw soup made with high-viscosity dika nuts, seasoned with peppery camphor uziza, and finished with tender greens.",
    itemIds: ["ogbono-dika-nut", "ashanti-pepper-uziza", "dehydrated-ugwu"],
    heritageTip: "Whisk the ground ogbono with lukewarm oil or broth off the direct flame before simmering to prevent curdling and maximize draw."
  },
  "zobo-hibiscus-calyces": {
    bundleId: "bundle-zobo-refresh",
    title: "Spiced Zobo & Crunchy Snack Pairing",
    subtitle: "Zobo Calyces + Ginger Powder + Kulikuli",
    description: "Brew a vibrant, ruby-red hibiscus beverage spiced with fiery Kaduna ginger, served alongside traditional savory groundnut crunch.",
    itemIds: ["zobo-hibiscus-calyces", "dehydrated-ginger", "kulikuli-snack"],
    heritageTip: "Simmer zobo leaves with 1 tablespoon of ginger powder for 15 minutes, chill thoroughly, and serve with crispy kulikuli."
  },
  "kulikuli-snack": {
    bundleId: "bundle-kulikuli-garri",
    title: "Traditional Garri & Crunchy Snack Pairing",
    subtitle: "Kulikuli Produce + Cassava Flakes + Zobo Calyces",
    description: "Crispy roasted groundnut kulikuli paired with fine-grained cassava flakes and refreshing zobo calyces for the ultimate Nigerian comfort pause.",
    itemIds: ["kulikuli-snack", "cassava-flakes-garri", "zobo-hibiscus-calyces"],
    heritageTip: "Enjoy crisp kulikuli straight from the pouch alongside chilled garri."
  },
  "stockfish-cod": {
    bundleId: "bundle-stockfish-soup",
    title: "The Rich Savory Broth Foundation",
    subtitle: "Stockfish Cod + Dried Ponmo + Dehydrated Ugwu",
    description: "Traditional sun-dried Atlantic stockfish and tender ponmo simmered slowly to create a rich, mineral-dense soup broth, finished with fresh Ugwu greens.",
    itemIds: ["stockfish-cod", "ponmo-dried-cowskin", "dehydrated-ugwu"],
    heritageTip: "Slow-simmer stockfish and ponmo together to draw out deep natural gelatin and savory flavor."
  },
  "iru-locust-beans": {
    bundleId: "bundle-iru-umami",
    title: "Native Umami Soup Base",
    subtitle: "Fermented Iru + Melon Seed + Dehydrated Ugwu",
    description: "Traditional fermented locust beans providing an earthy umami foundation for egusi soup, paired with fresh fluted pumpkin leaves.",
    itemIds: ["iru-locust-beans", "melon-seed-egusi", "dehydrated-ugwu"],
    heritageTip: "Fry the locust beans lightly in warm palm oil at the start of cooking to bloom their rich, savory aroma."
  },
  "cassava-flakes-garri": {
    bundleId: "bundle-garri-refresh",
    title: "Traditional Garri & Snack Pairing",
    subtitle: "Cassava Flakes + Kulikuli + Zobo Calyces",
    description: "Crisp, tart cassava flakes paired with handmade savory kulikuli crunch and spiced hibiscus zobo.",
    itemIds: ["cassava-flakes-garri", "kulikuli-snack", "zobo-hibiscus-calyces"],
    heritageTip: "Serve cold with iced water or prepare as a firm, smooth swallow for egusi or ogbono soup."
  },
  "shea-butter-unrefined": {
    bundleId: "bundle-shea-botanical",
    title: "Traditional Wholesome Pantry Trio",
    subtitle: "Unrefined Shea Butter + Ginger Powder + Zobo Calyces",
    description: "Ethically hand-churned shea butter paired with single-origin botanical ginger and rich hibiscus calyces.",
    itemIds: ["shea-butter-unrefined", "dehydrated-ginger", "zobo-hibiscus-calyces"],
    heritageTip: "Pure unadulterated Nigerian harvests prepared with zero chemicals."
  },
  "african-nutmeg-ehuru": {
    bundleId: "bundle-ehuru-spice",
    title: "Aromatic Hearth Spice Duo",
    subtitle: "African Nutmeg + Ashanti Pepper + Jollof Rice Spice",
    description: "Woody, toasted ehuru paired with aromatic camphor uziza and stone-ground jollof seasoning for deep hearth warmth.",
    itemIds: ["african-nutmeg-ehuru", "ashanti-pepper-uziza", "jollof-rice-spice"],
    heritageTip: "Lightly crush the ehuru seeds before adding to hot broth to unlock their signature nutty aroma."
  },
  "ashanti-pepper-uziza": {
    bundleId: "bundle-uziza-draw",
    title: "Peppery Draw Soup Pot",
    subtitle: "Ashanti Pepper + Ogbono Kernels + Dehydrated Ugwu",
    description: "Spicy aromatic uziza seeds paired with viscous ogbono kernels and fluted pumpkin leaves.",
    itemIds: ["ashanti-pepper-uziza", "ogbono-dika-nut", "dehydrated-ugwu"],
    heritageTip: "Crush the uziza coarsely to release its essential oils in the final 5 minutes of cooking."
  },
  "ponmo-dried-cowskin": {
    bundleId: "bundle-ponmo-stew",
    title: "Traditional Slow-Cooked Stew Essentials",
    subtitle: "Dried Ponmo + Stockfish Cod + Melon Seed",
    description: "Clean, sand-free dried ponmo paired with savory stockfish and golden melon seeds for hearty home cooking.",
    itemIds: ["ponmo-dried-cowskin", "stockfish-cod", "melon-seed-egusi"],
    heritageTip: "Rehydrate dried ponmo in warm water for 20 minutes before simmering in rich pepper broth."
  }
};

function getBundleForProduct(productId) {
  if (!productId) return null;
  const normalized = String(productId).toLowerCase().trim();
  const bundle = KABOD_PANTRY_BUNDLES[normalized];
  if (!bundle) return null;
  const products = bundle.itemIds.map(id => getProductById(id)).filter(Boolean);
  return {
    ...bundle,
    products
  };
}

// Export for module or browser window use
if (typeof window !== 'undefined') {
  window.KABOD_PRODUCTS = KABOD_PRODUCTS;
  window.getProductById = getProductById;
  window.KABOD_PANTRY_BUNDLES = KABOD_PANTRY_BUNDLES;
  window.getBundleForProduct = getBundleForProduct;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KABOD_PRODUCTS, getProductById, KABOD_PANTRY_BUNDLES, getBundleForProduct };
}
