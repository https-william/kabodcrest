---
name: awesome-design-md
description: Curated DESIGN.md system guidelines inspired by VoltAgent/awesome-design-md. Provides standardized markdown-based design token architectures, layout archetypes, color palettes, typographic hierarchies, component states, and motion specs for AI coding agents. Use when establishing, auditing, or refactoring design consistency, design tokens, or visual language across the project.
---

# Awesome DESIGN.md System Guide

`DESIGN.md` is a plain-text markdown standard (introduced by Google Stitch and popularized by VoltAgent) acting as the single source of truth for AI coding agents. Instead of interpreting fragmented design files or guessing aesthetic decisions, AI agents read `DESIGN.md` to produce consistent, brand-aligned interfaces.

## 1. Core Principles of DESIGN.md

1. **Deterministic Design Tokens**:
   - Palette definitions with exact hex values, functional semantic roles (e.g., grounding, surface, brand primary, scarce accent, interactive), and WCAG-tested contrast pairs.
   - Fixed typographic scale with distinct functional duties (Editorial / Storytelling vs. Structural / Navigation vs. Body / Utility).
   - Strict spacing scales (multiples of 4px / 8px).

2. **Archetype Alignment**:
   - High-craft corporate & editorial systems draw from patterns established by leading design standards:
     - **Stripe**: Precision grids, subtle border hairlines (`rgba(0,0,0,0.08)`), micro-elevation, clean typographic rhythm.
     - **Linear**: High-contrast dark backgrounds, razor-sharp focus states, keyboard-first navigability, restrained accent colors.
     - **Apple**: Generous whitespace, deliberate content hierarchy, fluid responsive typography, tactile rounded boundaries.
     - **Aesop / Editorial Purveyors**: Warm ivory paper tones, high-contrast serif headlines, botanical and earth-grounded palettes, calm authoritative motion.

3. **Anti-Slop Guardrails**:
   - No gratuitous drop shadows or generic floating rounded card kits.
   - No overuse of accent colors (e.g. Gold must remain scarce — max 15-20% usage).
   - Avoid generic AI-generated templates (centered generic icons with colored circles, gradient pills, unmotivated numbered badges).

## 2. Kabod Crest DESIGN.md Implementation

For Kabod Crest Limited, the `DESIGN.md` specification enforces the **Quiet Authority** brand territory:
- **Palette**:
  - Obsidian (`#0B0B0B`): Grounding, structure, hero & footer depth.
  - Royal Plum (`#321A4A`): Primary identity & elegance.
  - Warm Ivory (`#F4F0E8`): Primary background surface for editorial clarity.
  - Champagne Gold (`#C8A45D`): Scarce accent ONLY (dividers, active markers, icons, CTA highlights).
  - Stone (`#B8B1A5`): Muted borders and structural dividers.
- **Typography**:
  - *Montserrat*: Structural navigation, badges, uppercase metadata labels.
  - *Cormorant Garamond*: Editorial storytelling, pull quotes, refined brand headlines.
  - *Inter*: High-legibility UI body, spec sheets, cart/checkout flows, forms.

## 3. Best Practices for Agents

- Read `DESIGN.md` and `.agent/skills/kabod-crest-brand/SKILL.md` before generating any new page or UI element.
- Test all color combinations against WCAG AA standards before shipping.
- Use CSS variables mapped directly from the tokens.
