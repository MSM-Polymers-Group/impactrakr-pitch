---
name: ImpacTrakr Pitch
description: Investor-facing pitch site for ImpacTrakr — independent validation layer for environmental credits
register: brand
theme: light-with-committed-dark-surfaces
fonts:
  primary: "Manrope"
  fallback: "system-ui, -apple-system, sans-serif"
colors:
  # Off-white surfaces (cool, never warm cream)
  bg: "oklch(98% 0.005 220)"          # near-white, slight cool tint, escapes the AI cream default
  surface-raised: "oklch(95% 0.008 220)"  # subtle elevation, same hue
  line: "oklch(88% 0.005 220)"        # dividers
  line-soft: "oklch(92% 0.005 220)"
  # Ink (neutral with imperceptible cool)
  ink: "oklch(15% 0.012 220)"         # body text, near-black
  ink-soft: "oklch(35% 0.012 220)"    # secondary text
  ink-faint: "oklch(50% 0.010 220)"   # tertiary text, muted
  ink-mute: "oklch(65% 0.008 220)"    # captions, disclaimers
  # Brand committed surface (deep saturated green)
  brand-surface: "oklch(28% 0.07 155)"      # deep institutional green — hero / trust band
  brand-surface-deep: "oklch(22% 0.06 155)" # darker variant for layered elements
  brand-line: "oklch(40% 0.05 155)"         # divider on dark surface
  # On-dark text
  on-dark: "oklch(96% 0.008 90)"            # off-white slightly warm for legibility on green
  on-dark-soft: "oklch(78% 0.015 90)"
  on-dark-mute: "oklch(60% 0.020 155)"      # muted but with brand hue
  # Brand accent (used sparingly — only for action, status, key terms)
  accent: "oklch(60% 0.16 150)"             # saturated brand green for moments
  accent-on-dark: "oklch(78% 0.16 145)"     # lighter variant for use over brand-surface
  # Semantic
  warning: "oklch(70% 0.16 80)"             # amber for FLAG states
  block: "oklch(58% 0.20 25)"               # red for BLOCK states
typography:
  display:
    fontFamily: "Manrope"
    fontWeight: 700
    fontSize: "clamp(2.25rem, 4.8vw, 4rem)"  # ≤6rem ceiling per impeccable
    lineHeight: 1.05
    letterSpacing: "-0.025em"               # ≥-0.04em floor
    textWrap: "balance"
  display-2:
    fontFamily: "Manrope"
    fontWeight: 600
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    textWrap: "balance"
  display-3:
    fontFamily: "Manrope"
    fontWeight: 600
    fontSize: "clamp(1.125rem, 2vw, 1.375rem)"
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope"
    fontWeight: 400
    fontSize: "0.9375rem"     # 15px
    lineHeight: 1.6
    letterSpacing: "0"
    textWrap: "pretty"        # reduce orphans in long prose
    maxWidth: "65ch"          # cap line length
  body-large:
    fontFamily: "Manrope"
    fontWeight: 400
    fontSize: "1.0625rem"
    lineHeight: 1.55
    letterSpacing: "-0.005em"
  small:
    fontFamily: "Manrope"
    fontWeight: 500
    fontSize: "0.8125rem"
    lineHeight: 1.5
    letterSpacing: "0.005em"
  label:
    fontFamily: "Manrope"
    fontWeight: 600
    fontSize: "0.75rem"       # 12px
    letterSpacing: "0.04em"   # NOT tracked-uppercase eyebrow — used sparingly, only for status/utility
    textTransform: "none"     # explicitly NOT uppercase
spacing:
  # 4pt base scale — semantic tokens, not numbered indices
  3xs: "0.25rem"   # 4px
  2xs: "0.5rem"    # 8px
  xs: "0.75rem"    # 12px
  sm: "1rem"       # 16px
  md: "1.5rem"     # 24px
  lg: "2rem"       # 32px
  xl: "3rem"       # 48px
  2xl: "4rem"      # 64px
  3xl: "6rem"      # 96px
  4xl: "9rem"      # 144px — generous section separation
  fluid-section: "clamp(4rem, 8vw, 9rem)"   # breathes on large viewports
  fluid-block: "clamp(2rem, 4vw, 4rem)"
layout:
  maxWidth-prose: "65ch"           # body text containers
  maxWidth-display: "26ch"         # display headings, force line breaks for rhythm
  maxWidth-page: "1200px"          # main container
  maxWidth-wide: "1480px"          # process map BPMN canvas
  gutter: "clamp(1rem, 4vw, 2.5rem)"
  border-radius:
    none: "0"
    small: "4px"                   # buttons, pills
    medium: "8px"                  # cards (when used)
    surface: "12px"                # large surface elements
    # explicit ban: anything ≥20px on cards
motion:
  ease-out: "cubic-bezier(0.22, 1, 0.36, 1)"  # ease-out-quart
  ease-out-deep: "cubic-bezier(0.16, 1, 0.3, 1)"  # ease-out-expo
  duration-instant: "120ms"
  duration-quick: "200ms"
  duration-considered: "400ms"
  duration-deliberate: "700ms"  # for page-load reveals; never longer
  # All animations honor prefers-reduced-motion: reduce
---

## Theme — light with committed dark surfaces

Light foundation. The brand voice carries through a **single committed dark green surface per page** (hero, trust band, or one decisive callout). Everything else is restrained off-white with high-contrast neutral ink. No cream, no warmth-by-default, no decorative shadows.

The dark surface is not a section variant — it is a **moment**. One per page. Used to anchor authority, never to break up monotony.

## Color philosophy

**Strategy: Committed.** Per impeccable's color strategy scale, this is committed (one saturated color carries 30–40% of identity-defining surfaces), not restrained or full-palette.

Anti-defaults applied:
- Body bg is `oklch(98% 0.005 220)` — chroma 0.005 toward 220° (cool / slate hue), **not** toward 60–80° (the warm cream AI default). The deviation is intentional and small enough that it reads as "white," not "blue."
- No token names like `--paper`, `--cream`, `--sand`, `--bone`. Semantic names only: `--bg`, `--surface-raised`, `--brand-surface`.
- Accent green used **sparingly** — only for: status pills (ACTIVE, VALIDATED), interactive states, 1–2 key terms in display headings, links on light surfaces.
- The brand-surface green is the **only place where color carries identity**. It is not decoration; it is the institution showing up.

## Typography philosophy

**One family: Manrope.** Geometric sans, fora da reflex-reject list. Hierarchy through weight (400 / 500 / 600 / 700) and modular scale (1.25 ratio).

Why one family: per impeccable, "A single well-chosen family with committed weight/size contrast is stronger than a timid display+body pair." Two families risk landing in editorial-typographic lane (saturated). Manrope alone, committed, signals confidence.

Anti-defaults applied:
- Display letter-spacing `-0.025em` (floor is `-0.04em`; we sit safely above).
- Display heading ceiling: clamp max `4rem` (well below the 6rem ceiling).
- `text-wrap: balance` on display, `text-wrap: pretty` on body.
- Line length capped at `65ch` on prose.
- No mono. No italic display serif. No tracked-uppercase eyebrows above every section.

The single allowed `.label` token uses `letter-spacing: 0.04em` and `text-transform: none` — explicitly not the tracked-uppercase eyebrow that impeccable bans. It exists for utility labels (status, type indicators), not for section scaffolding.

## Layout philosophy

- **Rhythm through contrast.** Tight groupings (8–12px) inside content blocks; generous separations (clamp(4rem, 8vw, 9rem)) between sections. Equal padding is a tell of indecision.
- **Asymmetric where it earns it.** Hero, trust band, and methodology overview should not feel like 3-column grids by default. Breaking the grid is a brand permission, used deliberately.
- **No identical card grids.** Each section finds its own structure. The modular section, the configs section, and the FAQ each use a different layout pattern — not 3 cards each.
- **Flex for 1D, Grid for 2D.** Don't default to Grid for what `flex-wrap` does cleanly.
- **Container queries** for components that live in multiple contexts (e.g., trust badges in hero vs in CTA).

## Components — to be ported during distill / typeset / colorize

Inventory present in the existing pages (to be refactored, not preserved as-is):

| Component | Current state | Refactor direction |
|---|---|---|
| Top header (logo + lang toggle + meta) | Working, neutral | Keep structure, retypeset, swap colors |
| Top nav (4 chapter tabs) | Has numbered markers (01/02/03/04) and tracked uppercase | **Remove numbers and uppercase tracking.** Use lowercase, weight 600, simple underline-on-active. |
| Hero (h1 + subtitle) | OK structure | Retypeset with Manrope, drop Source Serif Pro, drop `.micro` eyebrow |
| Tese band (3 bullets on Visão) | Currently a 3-column dark grid | Keep dark surface (this is *the* committed brand moment) but rework grid into asymmetric or stepped layout |
| Numbers strip (hero-metric) | 6-item identical layout | **Remove or rework entirely.** If we keep big numbers, they go inline in narrative, with defense in the same view. |
| Context bar (Procedure · Material · Notifier ...) | Dark green strip with 5 cells | Keep one dark moment per page; this might absorb into the hero instead of being a second strip |
| Trust band ("Conectado a · Registries · Methodologies · ...") | Currently 4 identical chips | Rework into a single sentence with inline emphasis OR a ruled horizontal list. Not 4 chips. |
| Modular section (3 module cards) | Identical 3-card grid | Rework: maybe a stepped layout (95 / 27 / 17 as visual weight), or a ruled list. Not 3 identical cards. |
| Configs section (3 customer cards) | Identical 3-card grid | Same — rework into a comparison structure |
| Process map BPMN | Working, the page's hero piece | Mostly keep. This is the one piece of "imagery" we earn. May need color/type token swap. |
| Drawer (task detail) | Working interactive layer | Keep functionality; restyle to match new tokens |
| View toggle (Investor / Technical) | Functional | Keep; restyle |
| Demo mode (▶ play) | Functional | Keep; restyle |
| FAQ grid | Identical 2x2 card grid | Rework into stacked questions with subtle dividers, not card grid |
| Reg timeline | 4-node horizontal track | Keep concept; restyle to match new tokens |
| CTA band | Dark green block with 2 buttons | Keep; this is one of the committed moments |

## Motion philosophy

- **One orchestrated first-load moment per page.** A subtle text reveal on the hero h1 (opacity + 8px translate-y, 700ms ease-out-expo). Nothing else animates on first scroll.
- **No scroll-triggered fades.** Reveal animations must enhance an already-visible default. Content ships visible.
- **Hover micro:** opacity 1 → 0.7 on links, underline-emerge on nav. No transforms decorativos. No scale on images.
- **Demo mode** is interaction motion — the only place where animation carries information (sequenced task highlights). Pulse-demo animation stays.
- `@media (prefers-reduced-motion: reduce)` forces all transitions to `0ms` and replaces reveals with instant.

## Absolute bans for this project

Locked in (do not reintroduce regardless of pressure):

- `--paper`, `--cream`, `--sand`, `--bone`, `--ivory`, `--flour`, `--linen`, `--parchment`, `--wheat`, `--biscuit` (token names AND values within OKLCH L 0.84-0.97, C < 0.06, hue 40-100).
- Inter, Fraunces, Newsreader, Lora, Crimson*, Cormorant*, Playfair, Syne, IBM Plex*, Space*, DM Sans, DM Serif*, Outfit, Plus Jakarta Sans, Instrument Sans, Instrument Serif, Source Serif Pro (acceptable: Source Serif 4, but we don't need a second family).
- Numbered section markers as scaffolding (`01 · About`, `02 · Process`).
- Tracked uppercase eyebrows above every heading (`ABOUT`, `PROCESS`, `PRICING`).
- Hero-metric template (big number + small label, 4+ items in a strip).
- Identical card grids (icon + heading + paragraph, repeated 3+ times per section).
- Border-radius ≥20px on cards (cap at 12px on surfaces, full-pill on tags/buttons).
- `border: 1px solid X` + `box-shadow: ≥16px blur` on the same element.
- Gradient text. Glassmorphism as default. Side-stripe borders. Repeating-linear-gradient stripes.
- Image hover transforms (no `:hover` on `<img>`, no `.group:hover .group-hover\:scale`).
- Hand-drawn / sketchy SVG illustrations. Smiling-plant graphics. Stock photos of recycling bins or factories.

## What this DESIGN.md governs

Every CSS token in `/pitch/assets/shared.css` and every inline style in the 4 pitch pages must derive from this file. Visual choices that contradict the tokens, the typography rules, or the absolute bans must either change the choice or change this file (with explicit reason). Drift between DESIGN.md and the shipped pages is a bug.
