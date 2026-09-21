# DESIGN.md — Kabod Crest Limited Design System

> **Archetype**: Quiet Authority — Refined Modern Afro-Botanical Purveyor  
> **Brand Line**: "Building with Purpose. Creating with Distinction."  
> **Tagline**: "Excellence with Integrity."  
> **Source of Truth**: `.agent/skills/kabod-crest-brand/SKILL.md` & `.agent/skills/awesome-design-md/SKILL.md`  
> **Standard Compliance**: VoltAgent `DESIGN.md` Open Protocol  

---

## 1. Brand Philosophy & Aesthetic Identity

Kabod Crest Limited is a newly registered Nigerian diversified enterprise. Food production and agro-processing are the current commercial priority; Events & Experiences, Hospitality & Food Services, and Business Services represent future growth verticals.

* **Aesthetic Direction**: **Quiet Authority**. Refined, credible, purposeful, premium, modern African, and trustworthy.
* **Tone of Voice**: Friendly-professional, clear, human, confident, warm, and restrained.
* **Anti-Slop Posture**: Reject generic AI-generated aesthetics — no floating drop-shadow SaaS cards, no unmotivated gradient pills, no centered icon discs in colored circles, no fake scarcity tickers, and no em-dashes.

---

## 2. Color Palette & Token Architecture

```
Obsidian [40%]            Royal Plum [25%]         Champagne Gold [20%]   Warm Ivory [10%]   Stone [5%]
#0B0B0B                  #321A4A                  #C8A45D                #F4F0E8            #B8B1A5
[Grounding / Dark Depth]  [Primary Identity Color] [Scarce Accent Only]   [Light Surfaces]   [Hairlines]
```

### 2.1 Core Palette Tokens

| Token Name | CSS Variable | Hex Code | RGB Equivalent | Target Weight | Semantic Role & Surface Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Obsidian** | `--color-obsidian` | `#0B0B0B` | `rgb(11, 11, 11)` | **40%** | Structural grounding, high-contrast hero sections, dark footer, dominant deep typography. |
| **Royal Plum** | `--color-plum` | `#321A4A` | `rgb(50, 26, 74)` | **25%** | Primary brand identity hue. Used for primary CTA buttons, hero highlights, editorial accents, brand framing. |
| **Deep Plum** | `--color-plum-deep` | `#1E0F2D` | `rgb(30, 15, 45)` | — | Dark mode / high-contrast containers and rich header accents. |
| **Champagne Gold** | `--color-gold` | `#C8A45D` | `rgb(200, 164, 93)` | **20% max** | **Scarce Accent ONLY**. Structural dividers, active navigation indicators, badge borders, icon highlights. |
| **Gold Hover** | `--color-gold-hover`| `#D8B775` | `rgb(216, 183, 117)`| — | Interactive hover and active focus states. |
| **Warm Ivory** | `--color-ivory` | `#F4F0E8` | `rgb(244, 240, 232)`| **10%** | Primary light surface background. Creates a warm, natural paper-like canvas. |
| **Ivory Surface**| `--color-ivory-surface`| `#FCFAF6`| `rgb(252, 250, 246)`| — | Card surfaces, container elevation, input background. |
| **Stone** | `--color-stone` | `#B8B1A5` | `rgb(184, 177, 165)`| **5%** | Secondary neutral. Precision 1px borders, subtle divider rules, muted metadata tags. |

### 2.2 Semantic Functional Colors

| Role | Hex | Token | Usage |
| :--- | :--- | :--- | :--- |
| **Success / Live** | `#1E6B43` | `--color-success` | Active catalog items ("LIVE / In Stock"), confirmation checks. |
| **Pending / Pre-Order**| `#C8A45D` | `--color-gold` | Pre-order allocation tags, shipping step badges. |
| **Danger / Error** | `#B32D2E` | `--color-danger` | Form validation errors, stock depletion alerts, remove item action. |
| **Text Dark** | `#121013` | `--color-text-dark` | Primary headlines and high-contrast titles on ivory. |
| **Text Muted** | `#3D3730` | `--color-text-muted` | Body text, card descriptions, catalog spec copy. |
| **Text Light** | `#FAF7F2` | `--color-text-light` | Headlines and text on obsidian or royal plum backgrounds. |
| **Text Light Muted** | `#D6CFBF` | `--color-text-light-muted`| Secondary copy and metadata on dark surfaces. |

### 2.3 Contrast & WCAG AA/AAA Rules

* **AAA Pairings**:
  * `Royal Plum (#321A4A)` on `Warm Ivory (#F4F0E8)` = **8.6:1** (Passes AAA for all text).
  * `Obsidian (#0B0B0B)` on `Warm Ivory (#F4F0E8)` = **16.5:1** (Passes AAA for all text).
  * `Text Light (#FAF7F2)` on `Obsidian (#0B0B0B)` = **18.1:1** (Passes AAA for all text).
* **Strict Prohibition**:
  * **NEVER use Champagne Gold (`#C8A45D`) for small body copy on light backgrounds.** Contrast ratio against Ivory is only ~2.1:1 (fails WCAG AA). Reserve Gold text strictly for dark obsidian surfaces or large decorative numerals.

---

## 3. Typography Triad

```
[STRUCTURAL]           [EDITORIAL]                    [WORKHORSE BODY]
Montserrat             Cormorant Garamond             Inter
Navigation, Headings,  Pull-Quotes, Brand Narrative,  Product Specs, UI Copy,
Labels, Badges         Editorial Display Passages     Forms, Cart & Checkout
```

### 3.1 Typeface Allocation Matrix

| Typeface | Classification | Optical Duty | Weights Used | Tracking / Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Montserrat** | Geometric Sans-Serif | Structural authority, brand navigation, section headers, badges | 500, 600, 700 | `letter-spacing: -0.01em` to `+0.04em` (caps) |
| **Cormorant Garamond** | Editorial Serif | Brand voice, hero narrative, pull-quotes, italicized philosophy | 400, 600, Italic | `letter-spacing: -0.02em`, `line-height: 1.15–1.3` |
| **Inter** | Neo-Grotesque Sans | Body copy, technical specs, price displays, cart, checkout | 400, 500, 600 | `letter-spacing: -0.01em`, `line-height: 1.5–1.65` |

### 3.2 Type Scale

| Scale Step | Font | Size (rem / px) | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Cormorant Garamond | `3.75rem / 60px` | 600 | `1.1` | Hero lead titles, editorial pull quotes |
| **H1** | Montserrat | `2.5rem / 40px` | 700 | `1.2` | Primary page headers, major section anchors |
| **H2** | Montserrat | `1.875rem / 30px`| 600 | `1.25` | Section titles, bento grid header cards |
| **H3** | Montserrat | `1.375rem / 22px`| 600 | `1.3` | Product card titles, modal headings |
| **H4** | Montserrat | `1.125rem / 18px`| 600 | `1.35` | Sub-features, accordion triggers |
| **Body Large** | Inter | `1.0625rem / 17px`| 400 | `1.6` | Narrative introduction paragraphs |
| **Body Base** | Inter | `0.9375rem / 15px`| 400 | `1.55` | Standard product specs, catalog copy, forms |
| **Body Small** | Inter | `0.8125rem / 13px`| 500 | `1.45` | Secondary metadata, cart line items |
| **Caption / Eyebrow**| Montserrat | `0.6875rem / 11px`| 700 | `1.2` | All-caps category tags, status badges (`letter-spacing: 0.08em`) |

---

## 4. Spacing Scale & Layout Grid

### 4.1 Spacing Scale (4px/8px Incremental Scale)

| Token | Size | Application |
| :--- | :--- | :--- |
| `--space-2xs` | `4px` | Micro gaps, icon-to-label spacing |
| `--space-xs` | `8px` | Badge padding, inline item separation |
| `--space-sm` | `12px` | Input internal padding, card sub-headers |
| `--space-md` | `16px` | Standard button padding, grid gutters |
| `--space-lg` | `24px` | Card internal padding, form row spacing |
| `--space-xl` | `32px` | Section sub-group separation |
| `--space-2xl` | `48px` | Major component padding |
| `--space-3xl` | `64px` | Standard section vertical padding |
| `--space-4xl` | `96px` | Hero and landmark section vertical padding |

### 4.2 Layout & Breakpoints

* **Container Max Width**: `1240px` (`--container-max-width`)
* **Header Height**: `72px` (`--header-height`)
* **Breakpoints**:
  * **Mobile**: `< 640px` (Single column, 16px page margins, full-width drawers)
  * **Tablet**: `640px – 1024px` (2-column bento grids, 24px margins)
  * **Desktop**: `1024px – 1280px` (3/4-column grids, 32px margins)
  * **Wide**: `> 1280px` (Centered container with 1240px content boundary)

---

## 5. Surfaces, Radii & Hairline Boundaries

### 5.1 Border Radius System

To prevent harsh industrial points while avoiding overly rounded bubble aesthetics:

| Token | Value | Applied To |
| :--- | :--- | :--- |
| `--radius-xs` | `4px` | Micro markers, scrollbars |
| `--radius-badge` | `6px` | Status indicators ("LIVE", "PRE-ORDER") |
| `--radius-subtle`| `8px` | Form inputs, select dropdowns, textareas |
| `--radius-btn` | `10px` | Action buttons, cart toggles |
| `--radius-card-sm` | `12px` | Product thumbnail containers, accordion panels |
| `--radius-card` | `16px` | Standard bento grid cards, catalog item tiles |
| `--radius-card-lg` | `20px` | Featured showcase panels, hero visual frames |
| `--radius-modal` | `22px` | Cart drawer, confirmation popups |
| `--radius-pill` | `9999px` | Category filter tags, quantity stepper buttons |

### 5.2 Precision Hairlines & Depth

* **Light Surface Hairline**: `1px solid rgba(50, 26, 74, 0.12)` (`--border-hairline`)
* **Dark Surface Hairline**: `1px solid rgba(255, 255, 255, 0.08)` (`--border-hairline-dark`)
* **Gold Framing**: `1px solid rgba(200, 164, 93, 0.28)` (`--border-gold-subtle`)
* **Elevation Shadows**:
  * `sm`: `0 2px 8px rgba(11, 11, 11, 0.03)`
  * `card`: `0 4px 16px rgba(11, 11, 11, 0.04)`
  * `hover`: `0 8px 24px rgba(50, 26, 74, 0.08)`

---

## 6. Motion & Interaction System (Quiet Authority)

Motion in Kabod Crest is **deliberate, calm, and purposeful**. It must never feel frantic, bouncy, or gratuitous.

* **Default Timing Curves**:
  * Fast micro-interactions: `160ms cubic-bezier(0.16, 1, 0.3, 1)` (`--transition-fast`)
  * Smooth surface reveals: `240ms cubic-bezier(0.16, 1, 0.3, 1)` (`--transition-smooth`)
* **Scroll & Animation Engines**:
  * **Lenis**: Smooth inertial scrolling on desktop viewports.
  * **GSAP Core + ScrollTrigger**: Orchestrated hero entrance and gentle parallax on botanical photography.
* **Reduced Motion Compliance**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 7. Multi-Vertical Architectural Framing

Kabod Crest spans four corporate pillars. Each is framed with clarity regarding its operational stage:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           KABOD CREST LIMITED                           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
┌────────▼────────┐         ┌────────▼────────┐         ┌────────▼────────┐
│ FOOD & AGRO     │         │ EVENTS &        │         │ HOSPITALITY &   │
│ PRODUCE         │         │ EXPERIENCES     │         │ BUSINESS SVCS   │
│ (Active / Live) │         │ (Aspirational)  │         │ (Aspirational)  │
│                 │         │                 │         │                 │
│ • Dehydrated    │         │ • Corporate     │         │ • Institutional │
│   Ugwu (Live)   │         │   Summits       │         │   Catering      │
│ • Ginger &      │         │ • Bespoke       │         │ • Agro-Export   │
│   Spices        │         │   Cultural      │         │   Advisory      │
│   (Pre-Order)   │         │   Venues        │         │   & Logistics   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

1. **Food & Consumer Products** (*Active Priority*):
   - Full e-commerce UX: live catalog pricing, pouch packaging renders, currency conversion, cart drawer, and checkout allocation.
2. **Events & Experiences** (*Future Expansion*):
   - Editorial showcase framing; clear inquiry routing via contact desk rather than ticket sales.
3. **Hospitality & Food Services** (*Future Expansion*):
   - Institutional catering and culinary sourcing partnerships.
4. **Business Services** (*Future Expansion*):
   - Trade facilitation, export brokerage, and agricultural supply chain consultancy.

---

## 8. Anti-Pattern Guardrails for Developers & AI Agents

> [!CAUTION]
> **Check these 5 rules before modifying or creating any page or component:**

1. **The Gold Scarcity Rule**: Gold (`#C8A45D`) must never exceed 20% visual weight. Plum (`#321A4A`) and Ivory (`#F4F0E8`) carry surfaces; Obsidian (`#0B0B0B`) anchors depth.
2. **The Logo Caveat**: Do not treat AI-generated "KC" crest images as final production SVG logos. The reference files show multiple geometry variations from mood-board exploration. Use the inline SVG crest mark (`brand-crest-mark`) with clean geometric strokes.
3. **No Typography Role Blurring**: Do not use Cormorant Garamond for buttons, form labels, or tabular data. Do not use Montserrat for multi-paragraph body text.
4. **No Generic SaaS Card Soup**: Avoid rounded floating white boxes with generic colored circular icons and harsh drop shadows. Use Bento grid architecture with 1px stone hairlines.
5. **Accurate Commercial Framing**: Never mark aspirational verticals (Events/Hospitality/Consulting) as live e-commerce shops. Only food produce is in active commercial operation.
