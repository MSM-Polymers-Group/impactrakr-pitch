# PRODUCT — ImpacTrakr Pitch

## Register

**Brand.** Design IS the product. The deliverable is the impression a visitor gets in the first 12 seconds. The four pages (Visão · Processo · Metodologia · Mercado) are a pitch artifact for investors and strategic prospects, not an app shell.

Scope of this PRODUCT.md: the `/pitch/` directory only. The Registry app (root `PRODUCT.md`) is a separate context with register=product.

## Users & Purpose

**Primary reader:** climate-tech investor (European or Americas) sophisticated enough to recognize regulatory moats and arbitral-layer plays. Reads the site between meetings, scrolling fast, expecting authority within 12 seconds.

**Secondary readers:** methodology authors (EcoCircle Global and future), technical certifiers (Bureau Veritas, Kiwa, SGS), CRDC operators (Malta, Guatemala, future), regulators / customs auditors familiar with the EU Waste Shipment Regulation 2024/1157.

**Job to be done:** decide whether ImpacTrakr is *the* clearinghouse layer for environmental credit validation worth backing — independent of any methodology author, any registry, any jurisdiction. The site has to make that proposition feel **inevitable, not aspirational**.

## Brand personality — 3 physical-object words

**Independent · Precise · Uncompromising.**

Concrete shape: the way a published auditor's report reads. The voice of an institution that exists to **judge what others build**, not to celebrate what it built itself. Closer to an S&P rating note than to a SaaS landing page. Closer to a regulator's whitepaper than to a climate-tech pitch deck.

If the page had a smell it would be ink on cotton-rag paper, not freshly printed marketing collateral.

## Aesthetic reference (lane)

**Stripe-minimal restraint** with an institutional weight underneath. Generous white space, confident typography, type does most of the work. Color used as accent and as one committed brand surface — not as decoration sprinkled throughout. No imagery as filler.

The differentiator: ImpacTrakr is a *clearinghouse*, not a payments primitive. The visual moment that makes us specific is **a single committed brand surface** (deep saturated green) carrying institutional gravitas, used decisively in heroes and trust moments. Everything around it is restraint; the surface is the commitment.

Named anchors: Stripe-minimal · early Linear-investor-page restraint · the visual weight of a Bank for International Settlements working paper, without the navy.

## Anti-references (explicit reject)

- **Climate-tech amigável** — grass-green palette + smiling-plant illustration + "we're saving the planet" copy. Vira commodity emocional, queima a tese de plataforma independente.
- **SaaS-cream landing** — cream bg (`--paper`/`--sand`/`--bone`), italic display serif (Fraunces/Cormorant/Newsreader), numbered section markers (01/02/03), tiny tracked-uppercase eyebrows above every heading, hero-metric template. **Where the current implementation sits.** Refactor away from all of it.
- **Editorial-typographic lane** — three rule-separated columns, italic display serif headline, lowercase track-spaced metadata, no imagery. The trap one tier deeper than SaaS-cream.
- **Finance-corporate classic** — navy institutional + Times + justified grids + annual-report feel. Old-world authority, but reads as legacy infrastructure, not as the next layer.
- **Crypto-tech futurista** — neon + dark + grids holográficos + "web3 vibes." Any association repels serious investors post-2023.
- **Dev-tool noir** — pure-black + monospaced everywhere + green terminal aesthetic. We are validation infrastructure, not a CLI.

## Accessibility

- **WCAG 2.1 AA non-negotiable.** Body text ≥4.5:1, large text ≥3:1, including placeholders. Reader is an executive on a laptop in a cab; if they squint, the page already failed.
- Keyboard navigation works for the entire reading experience (tabs, drawer, demo, language toggle).
- `prefers-reduced-motion: reduce` honored end-to-end. No animation gating content visibility.
- All imagery (when used) has descriptive alt text in PT and EN carrying voice, not boilerplate.
- Language toggle persists across pages via `localStorage` — no mid-reading language reset.

## Strategic design principles

In order of priority. When in doubt, the lower-numbered principle wins.

1. **Voice through restraint, not through volume.** Less is more. The page that reads as *quiet* in 2026 reads as *expensive*.
2. **One committed brand surface per page.** A single deep-green block carries the gravitas; the rest of the page is off-white restraint. Don't sprinkle the brand color; commit a moment to it.
3. **Type system carries the page.** Manrope across the board, 3-4 weights with deliberate size contrast. No second family. No display serif. Hierarchy IS the design.
4. **Numbers earn their place.** Big numerical claims (139 rules, 3 days, 4.2s) only when ground-truth-defended in the same view. No hero-metric strip for decoration.
5. **Eyebrows are voice, not scaffolding.** At most one named kicker per page, used deliberately. Never an `.micro` over every section.
6. **No identical card grids.** Modular section, configs section, FAQ — each finds its own structure (asymmetric, listed, ruled) rather than 3-card grid by default.
7. **Imagery is bug, not feature, for this surface.** No stock photos, no smiling-engineer illustrations, no plant graphics. The credibility is the type and the silence around it. The process map BPMN is *imagery* in this context — it is the one decisive piece of visual content the site earns.
8. **Motion only when it teaches.** Entrance reveals are forgivable on first paint; scroll-triggered fades on every section are not. The process map demo is *interaction*, not decoration.

## Voice in prose (sample register)

❌ "Our innovative platform empowers stakeholders to seamlessly validate environmental credits."
❌ "We're on a mission to make the planet greener."
❌ "Revolutionary dMRV technology for the next generation of recycling."

✅ "We validate. We do not author."
✅ "139 rules. 36 documents. 4.2 seconds. The audit your buyer used to run once a year — now runs continuously."
✅ "Whoever operates with spreadsheets today operates illegally tomorrow."
✅ "Malta is our founding pilot. The architecture is global."

The sentence ends. No qualifier. No softening. No "we believe."

## What this PRODUCT.md governs

Every page under `/pitch/` reads from this file before any design decision. Visual choices that contradict the personality, references, anti-references, or principles above must either change the choice or change this file (with explicit reason). Drift between PRODUCT.md and the shipped pages is a bug, not an evolution.
