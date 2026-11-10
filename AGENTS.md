# UI Design Guidelines & Rules for ProTippz

## 1. Strictly Prohibited: NO Hover Shadows
- **NEVER** use hover shadows anywhere in this website (`hover:shadow`, `hover:`, `hover:`, `hover:shadow-lg`, `hover:shadow-xl`, `hover:shadow-2xl`, or custom `hover:shadow-[...]`).
- Hover shadows are **totally prohibited** across the entire website design.
- Instead of hover shadows, use:
  - Smooth border transitions (`border border-slate-200 hover:border-slate-300` or brand color highlight)
  - Subtle background color transitions (`hover:bg-slate-50`, `hover:bg-white`)
  - Subtle micro-scale interaction (`active:scale-[0.98]`)
  - Text color transitions

## 2. Mac-Style Design Philosophy
- When "Mac style" / "Apple style" is requested, it means Apple's modern industrial design and software aesthetic:
  - **Perfect continuous curvature (Apple Squircles)**: Generous, smooth, organic rounded corners (`rounded-[24px]`, `rounded-[28px]`, `rounded-3xl`).
  - **Smooth hairline borders**: Crisp, delicate, ultra-clean borders (`border border-slate-200/80` or `border border-slate-200/90`).
  - **Materials & Clean Translucency**: Sleek, clean surfaces, frosted glass effects (`backdrop-blur-xl bg-white/95`), subtle inner highlights.
  - **Refined Typography & Micro-pills**: Clean, modern typography hierarchy, pill badges with soft rounded corners.
  - **DO NOT** add fake window controls (red/yellow/green close/minimize/maximize traffic light dots) to content cards. Focus purely on the smooth borders, refined curvature, and premium feel.
