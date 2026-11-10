# UI Design Rules: No Hover Shadows & Mac Design Aesthetics

## 1. Zero Hover Shadows Rule
- Hover shadows (`hover:shadow-*`, custom `hover:shadow-[...]`) are **strictly prohibited** across the entire website.
- Never add or propose hover shadow effects.
- For hover feedback, use:
  - Smooth border transitions (`border border-slate-200/90 hover:border-slate-300`)
  - Background transitions (`hover:bg-slate-50`)
  - Subtle button scale feedback (`active:scale-[0.98]`)
  - Color transitions on text and icons

## 2. Mac-Style Design Philosophy
- "Mac style" refers to Apple's modern hardware and macOS UI aesthetic:
  - Perfectly curved corners (continuous squircles: `rounded-[24px]`, `rounded-[26px]`, `rounded-[28px]`, `rounded-3xl`).
  - Smooth, ultra-clean hairline borders (`border border-slate-200/80` or `border border-slate-200/90`).
  - High-end typography, clean spacing, and refined micro-pill badges.
  - Do NOT put window traffic light dots (close/minimize/expand buttons) on content cards.
