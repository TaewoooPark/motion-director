# UIForge clone

Reconstructed from `https://github.com` — componentized.

```bash
npm install
npm run dev
```

- `src/App.tsx` composes the page from section components in order.
- `src/components/*.tsx` — one file per section (Hero, Section2, Section3) and per repeated block (Card, Item, Card2, Item2, Card3, Card4, Button). Repeated blocks are a single component mapped over data.
- `src/content.ts` — the editable content of the repeated blocks (text, image src, href) as typed arrays.
- `src/index.css` — the extracted Tailwind `@theme` plus the reference's fonts, keyframes, and hover/focus rules.

Styles are Tailwind utility classes (from the extracted theme); only what can't be a utility — gradients, transforms, transitions, filters — stays as an inline `style`.
