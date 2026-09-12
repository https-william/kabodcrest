---
name: kabod-crest-brand
description: Apply Kabod Crest Limited's brand system to any web page, component, packaging mockup, or marketing asset. Use this whenever building, styling, or reviewing anything for the Kabod Crest website or brand materials. Pairs with the frontend-design and brand-guidelines skills.
---

# Kabod Crest Brand System

Kabod Crest Limited is a newly registered Nigerian diversified enterprise (food production is the current commercial priority; events, hospitality, and business services are future expansion areas). Brand territory: **Quiet Authority** — refined, credible, purposeful, premium, modern, African, trustworthy. Not loud, gimmicky, over-luxurious, generic-corporate, or trend-dependent.

## Locked — treat these as fixed constraints

**Palette**
| Name | Hex | Role | Usage weight |
|---|---|---|---|
| Obsidian | `#0B0B0B` | Structure, grounding, high-contrast sections | 40% |
| Royal Plum | `#321A4A` | Primary identity colour — dominant, not gold | 25% |
| Champagne Gold | `#C8A45D` | Accent ONLY — dividers, icons, CTA highlights, small typographic emphasis | 20% |
| Warm Ivory | `#F4F0E8` | Primary light background | 10% |
| Stone | `#B8B1A5` | Secondary neutral — borders, muted text, card backgrounds | 5% |

Gold is a scarce resource. If gold appears on every section, it has stopped being an accent. Plum + Ivory should carry most surfaces; Obsidian anchors hero/footer; gold shows up in small, deliberate doses only. Check gold-on-light-background text combinations against WCAG AA before using gold for body text — it is likely to fail at normal sizes and should be reserved for large text, icons, or high-contrast placements.

**Typography — three roles, don't blur them**
- **Montserrat** — structural/corporate: navigation, section labels, headings where authority matters.
- **Cormorant Garamond** — editorial voice: the brand line, storytelling passages, pull quotes. Use sparingly so it stays special — this is not a body font.
- **Inter** — workhorse: body copy, product specs, forms, UI labels, anything read quickly for information.

**Verbal identity**
- Brand line: "Building with Purpose. Creating with Distinction."
- Tagline: "Excellence with Integrity."
- Core concepts: Purpose, Distinction, Integrity.
- Tone: friendly-professional, clear, human, confident, warm, refined. No jargon, no empty corporate buzzwords, no exaggerated claims, no fake scarcity, minimal exclamation marks, no em-dashes.
- Business verticals to represent (food is currently active; others are future/aspirational and should be framed lightly, not as active operations unless confirmed): Food & Consumer Products, Events & Experiences, Hospitality & Food Services, Business Services.

## Not locked — flag before treating as final

**The logo is not actually finalized.** The reference images show at least two visibly different "KC" crest geometries (a cleaner interlocking shield-notch version in some renders, a bulkier rounded version in others) because they came from AI image generation, not a vector design tool — each generation reinterpreted the mark slightly differently. Do not hardcode any single one of these renders as *the* logo in production code, favicon, or packaging templates. Treat every logo image supplied as mood-board reference for style (geometric, gold-on-obsidian primary, monochrome variants, plum/ivory secondary) rather than a final asset. Flag clearly when a build step needs the real vector logo file, and don't silently pick one AI render to stand in for it.

Similarly, the Vision/Mission/Values copy, the specific homepage layouts, and any "years of experience," certifications, or production-capacity claims visible in the reference images are ChatGPT-drafted placeholder content from the brand-strategy session — not confirmed final copy. Use them as a starting structure, not as text to ship verbatim without a copy pass.

## How to apply this with frontend-design

1. Load this skill alongside `frontend-design` and `brand-guidelines` for any UI, page, or asset work.
2. Let `frontend-design` drive layout quality, composition, and avoiding generic AI aesthetics.
3. Let `brand-guidelines` drive consistency mechanics (how to keep tokens applied uniformly across pages/components).
4. Let this skill supply the actual tokens, tone, and the "don't finalize the logo yet" guardrail.
5. When in doubt between "what the reference images show" and "what's in this file's Locked section," the Locked section wins — the images are a moving brand-strategy draft, this file is the checked-and-confirmed subset of it.
