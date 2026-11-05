# Portfolio Website

A personal portfolio built with Next.js, Tailwind CSS, and Shadcn UI.

## Tech Stack & Features

- **Next.js 16 (App Router)** with TypeScript & Turbopack
- **Tailwind CSS v4**: Modern utility-first CSS styling
- **Typography**: Libre Baskerville serif font loaded via `next/font/google`
- **Shadcn UI (`@base-ui/react`)**: Accessible, unstyled primitives and design system components (buttons, dialogs, sheets, tooltips, cards)
- **Lucide Icons (`lucide-react`)**: Clean, minimalist UI icons
- **Playwright E2E Testing**: Browser test suite supporting Safari (WebKit) and Chrome (Chromium) across desktop and mobile viewports

---

## Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
npm start
```

### 3. Run Browser Tests (Safari & Chrome)
```bash
npm run test:e2e
```
Or target WebKit (Safari) specifically:
```bash
npx playwright test --project=webkit
```

---

## Installed Agent Skills

The project is configured with Antigravity agent skills in `.agents/skills/`:

1. **Shadcn UI** (`shadcn`): Component patterns and implementation conventions for Shadcn UI.
2. **Taste Skill** (`design-taste-frontend`): Anti-slop frontend standards, editorial composition, and browser verification.
3. **Web Design Guidelines** (`web-design-guidelines`): Web interface guidelines, typography, contrast, and accessibility reviews.
