---
name: elite-layouts
description: |
  Modern CSS layout patterns for premium web experiences. Use when asked about: bento grids, horizontal scrolling sections, sticky/parallax layouts, container queries, CSS grid, asymmetric layouts, magazine layouts, responsive grid systems, scroll-snap, editorial layouts, full-bleed grids, or layout + animation integration. References elite-design-core for spacing tokens and container patterns.
---

# Elite Layouts

Premium layout patterns that define modern award-winning websites.

## Quick Reference

| Topic              | Reference File                                            |
| ------------------ | --------------------------------------------------------- |
| Bento Grids        | [bento-grids.md](references/bento-grids.md)               |
| Horizontal Scroll  | [horizontal-scroll.md](references/horizontal-scroll.md)   |
| Sticky & Parallax  | [sticky-parallax.md](references/sticky-parallax.md)       |
| Container Queries  | [container-queries.md](references/container-queries.md)   |
| Editorial patterns | [editorial-patterns.md](references/editorial-patterns.md) |

---

## Layout Decision Framework

### By Project Type

| Project       | Primary Layout     | Key Patterns                     |
| ------------- | ------------------ | -------------------------------- |
| Portfolio     | Bento + Horizontal | Feature work, case studies       |
| E-commerce    | Container queries  | Product grids, responsive cards  |
| Landing page  | Sticky parallax    | Hero → Features → CTA flow       |
| Dashboard     | Bento + Container  | Resizable panels, widgets        |
| Blog/Magazine | Asymmetric grid    | Editorial feel, visual hierarchy |
| Agency        | Horizontal + Bento | Immersive, exploratory           |

### Pattern Selection

```
Need adaptive components? → Container Queries
Need visual interest/variety? → Bento Grids
Need immersive storytelling? → Horizontal Scroll
Need depth/layering? → Sticky Parallax
Need all of the above? → Combine strategically
```

---

## Core Grid System

### 12-Column Foundation

```css
.container {
  --columns: 12;
  --gutter: clamp(1rem, 2vw, 2rem);
  --margin: clamp(1rem, 5vw, 6rem);

  display: grid;
  grid-template-columns:
    [full-start] var(--margin)
    [content-start] repeat(var(--columns), 1fr)
    [content-end] var(--margin)
    [full-end];
  gap: var(--gutter);
}

/* Full-bleed items */
.full-bleed {
  grid-column: full-start / full-end;
}

/* Content-width items */
.content {
  grid-column: content-start / content-end;
}

/* Responsive columns */
@media (max-width: 768px) {
  .container {
    --columns: 4;
    --margin: 1rem;
  }
}
```

### Span Utilities

```css
/* Column spans */
.col-span-1 {
  grid-column: span 1;
}
.col-span-2 {
  grid-column: span 2;
}
.col-span-3 {
  grid-column: span 3;
}
.col-span-4 {
  grid-column: span 4;
}
.col-span-6 {
  grid-column: span 6;
}
.col-span-8 {
  grid-column: span 8;
}
.col-span-12 {
  grid-column: span 12;
}

/* Row spans */
.row-span-2 {
  grid-row: span 2;
}
.row-span-3 {
  grid-row: span 3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .col-span-6,
  .col-span-4 {
    grid-column: span 4; /* Full width on mobile */
  }
}
```

---

## Bento Grid Quick Start

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 1rem;
}

/* Feature item - large */
.bento-item.featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* Tall item */
.bento-item.tall {
  grid-row: span 2;
}

/* Wide item */
.bento-item.wide {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bento-item.featured,
  .bento-item.wide {
    grid-column: span 2;
  }
}
```

See [bento-grids.md](references/bento-grids.md) for advanced patterns.

---

## Horizontal Scroll Quick Start

### CSS-Only (scroll-snap)

```css
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.horizontal-scroll::-webkit-scrollbar {
  display: none;
}

.horizontal-section {
  flex: 0 0 100vw;
  min-width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
}
```

### GSAP ScrollTrigger (pinned)

```javascript
gsap.to(".horizontal-track", {
  x: () =>
    -(
      document.querySelector(".horizontal-track").scrollWidth -
      window.innerWidth
    ),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: 1,
    end: () => `+=${document.querySelector(".horizontal-track").scrollWidth}`,
  },
});
```

See [horizontal-scroll.md](references/horizontal-scroll.md) for complete patterns.

---

## Sticky Parallax Quick Start

### CSS Sticky Sections

```css
.sticky-container {
  position: relative;
}

.sticky-section {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Stack sections with z-index */
.sticky-section:nth-child(1) {
  z-index: 1;
  background: var(--color-bg-1);
}
.sticky-section:nth-child(2) {
  z-index: 2;
  background: var(--color-bg-2);
}
.sticky-section:nth-child(3) {
  z-index: 3;
  background: var(--color-bg-3);
}
```

### GSAP Pin with Animation

```javascript
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".pinned-section",
      pin: true,
      scrub: 1,
      start: "top top",
      end: "+=200%",
    },
  })
  .from(".content-1", { opacity: 0, y: 50 })
  .from(".content-2", { opacity: 0, y: 50 })
  .from(".content-3", { opacity: 0, y: 50 });
```

See [sticky-parallax.md](references/sticky-parallax.md) for layered effects.

---

## Container Queries Quick Start

```css
/* Define containment */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Base styles */
.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

/* Respond to container width */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
    gap: 1.5rem;
  }

  .card-image {
    flex: 0 0 40%;
  }
}

@container card (min-width: 600px) {
  .card {
    padding: 2rem;
  }

  .card-title {
    font-size: 1.5rem;
  }
}
```

See [container-queries.md](references/container-queries.md) for advanced patterns.

---

## Layout + Animation Integration

### Animating Grid Items

```css
/* Hide items ONLY when scroll-driven animation is supported AND motion is
   allowed. If either is false, items render visible by default — so Firefox
   (still flag-gated in 2026) and reduced-motion users are never stranded at
   opacity: 0 with no timeline to reveal them. Feature-detect view()
   specifically because it's the timeline this reveal uses. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .grid-item {
      opacity: 0;
      transform: translateY(30px);
      animation: revealItem linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}

@keyframes revealItem {
  to {
    opacity: 1;
    transform: none;
  }
}
```

### GSAP Grid Animation

```javascript
gsap.from(".grid-item", {
  opacity: 0,
  y: 50,
  stagger: {
    amount: 0.8,
    grid: "auto",
    from: "start",
  },
  scrollTrigger: {
    trigger: ".grid-container",
    start: "top 80%",
  },
});
```

### FLIP for Layout Changes

```javascript
// Before layout change
const state = Flip.getState(".grid-item");

// Change layout (filter, sort, resize)
filterItems();

// Animate the change
Flip.from(state, {
  duration: 0.6,
  ease: "power2.inOut",
  stagger: 0.05,
  absolute: true,
});
```

---

## Responsive Strategy

### Mobile-First Breakpoints

```css
/* Mobile: 1 column */
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 640px) {
  .layout {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 2rem;
  }
}

/* Desktop: 3+ columns */
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 3rem;
  }
}

/* Large: 4 columns */
@media (min-width: 1280px) {
  .layout {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Fluid Layouts (No Breakpoints)

```css
/* Auto-fit columns */
.fluid-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

/* Fluid spacing */
.section {
  padding-block: clamp(3rem, 10vh, 8rem);
  padding-inline: clamp(1rem, 5vw, 6rem);
}
```

---

## Content-Aware Layouts with `:has()`

Layouts that respond to their _content_, not just the viewport. `:has()` is
Baseline across all major browsers (since late 2023) — no fallback needed.

```css
/* Quantity queries: the grid restructures as items are added */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
.card-grid:has(> :nth-child(2)) {
  grid-template-columns: repeat(2, 1fr);
}
.card-grid:has(> :nth-child(4)) {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

/* Give an article a sidebar only when it actually contains a figure */
.article:has(> figure) {
  grid-template-columns: 1fr 320px;
}

/* Collapse a section's chrome when it has no items (empty state) */
.gallery:not(:has(.gallery-item)) {
  display: none;
}
```

Prefer this over JavaScript that counts children and toggles classes — it's
declarative, reflows with the DOM automatically, and has zero runtime cost.

---

## Common Layout Patterns

### Hero + Content Grid

```css
.hero-layout {
  display: grid;
  grid-template-rows: 100vh auto;
}

.hero {
  display: grid;
  place-items: center;
  position: relative;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: clamp(2rem, 5vw, 4rem);
}
```

### Sidebar + Main

```css
.sidebar-layout {
  display: grid;
  grid-template-columns: minmax(250px, 300px) 1fr;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .sidebar-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    inset: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
```

### Masonry

Native masonry is arriving — Safari 26.4 shipped it first (2026); Chrome and
Firefox are behind flags, stabilizing through 2026. The syntax is still settling
(`grid-template-rows: masonry` vs. the newer `display: grid-lanes` / Item Flow
proposal), so **feature-detect, never version-sniff**, and keep the JS fallback
below for production.

```css
/* Enhancement: native masonry where supported */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

@supports (grid-template-rows: masonry) {
  .masonry {
    grid-template-rows: masonry; /* rows pack tightly up each column */
  }
}
```

#### Fallback (production-safe today)

Grid with fixed-height rows and JS-computed spans works everywhere now:

```css
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  /* Set via JS based on content height */
  grid-row-end: span var(--row-span, 20);
}
```

```javascript
// Calculate row spans based on content
function setMasonrySpans() {
  const grid = document.querySelector(".masonry-grid");
  const rowHeight = 10;
  const gap = 16;

  grid.querySelectorAll(".masonry-item").forEach((item) => {
    const content = item.querySelector(".content");
    const span = Math.ceil((content.offsetHeight + gap) / (rowHeight + gap));
    item.style.setProperty("--row-span", span);
  });
}
```

---

## Performance Considerations

### Layout Containment

```css
/* Isolate layout calculations */
.grid-item {
  contain: layout style;
}

/* Full containment for complex items */
.complex-card {
  contain: strict;
  content-visibility: auto;
  contain-intrinsic-size: 300px;
}
```

### Avoid Layout Thrashing

```javascript
// BAD: Forces layout per item
items.forEach((item) => {
  item.style.width = item.offsetWidth + 10 + "px";
});

// GOOD: Batch reads, then writes
const widths = items.map((item) => item.offsetWidth);
items.forEach((item, i) => {
  item.style.width = widths[i] + 10 + "px";
});
```

### CSS Grid vs Flexbox

| Use Grid          | Use Flexbox          |
| ----------------- | -------------------- |
| 2D layouts        | 1D layouts           |
| Known structure   | Unknown item count   |
| Overlapping items | Content distribution |
| Magazine/bento    | Navigation, cards    |
| Complex alignment | Simple alignment     |

---

## Accessibility

### Skip Horizontal Sections

```html
<a href="#after-horizontal" class="skip-link">
  Skip horizontal scroll section
</a>

<section class="horizontal-scroll" aria-label="Project gallery">
  <!-- Content -->
</section>

<div id="after-horizontal"></div>
```

### Keyboard Navigation

```javascript
// Allow arrow key navigation in horizontal scroll
horizontalContainer.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    horizontalContainer.scrollBy({
      left: window.innerWidth,
      behavior: "smooth",
    });
  }
  if (e.key === "ArrowLeft") {
    horizontalContainer.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth",
    });
  }
});
```

### Announce Layout Changes

```javascript
// For dynamic layout changes (filtering)
const liveRegion = document.getElementById("live-region");
liveRegion.textContent = `Showing ${visibleItems.length} of ${totalItems} items`;
```

### Keep Reading Order in Sync

When grid placement (named areas, `order`, or `grid-row`/`grid-column`) moves
items away from their DOM order, keyboard and screen-reader users still follow
source order — a WCAG 2.4.3 (Focus Order) failure. The durable fix is to keep
DOM order matching the primary visual order. As a progressive enhancement,
`reading-flow` (Chrome 137+, Chromium-only in 2026) can realign focus/reading
order to the visual flow:

```css
.bento-grid {
  display: grid;
  reading-flow: grid-order; /* focus follows visual grid order where supported */
}
```

Treat it as an enhancement, not a substitute for sensible source order.

---

## Resources

- [MDN: CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: Creating CSS carousels](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Overflow/Carousels)
- [MDN: Scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [MDN: Native masonry layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout)
- [MDN: `:has()` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [Chrome: `reading-flow` for focus order](https://developer.chrome.com/blog/reading-flow)
- [CSS Tricks: Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
