# Portfolio Website

A personal portfolio built with Next.js, React Three Fiber, Liquid Shaders, and Shadcn UI.

## Tech Stack & Features

- **Next.js 16 (App Router)** with TypeScript & Turbopack
- **React Three Fiber & Drei (`@react-three/fiber`, `@react-three/drei`)**: Real-time 3D floating molten sphere in the hero section
- **Liquid Logo**: Molten chrome monogram reacting to cursor movement with glare and specular sweep
- **Liquid Glass (`liquid-glass-js`)**: Optical refraction cards with depth, chromatic dispersion, and normal highlights
- **Shader Gradient**: GPU-accelerated fluid background shader
- **Shadcn UI (`@base-ui/react`, Tailwind CSS v4)**: Badges, cards, tabs, buttons, tooltips, dialogs
- **Playwright E2E Testing**: Pre-configured browser test suite supporting Safari (WebKit) and Chrome (Chromium)

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

The project is configured with the requested Antigravity agent skills in `.agents/skills/`:

1. **Taste Skill** (`design-taste-frontend`): Anti-slop frontend standards, editorial composition, and browser verification.
2. **Web Design Guidelines** (`web-design-guidelines`): Web interface guidelines, typography, contrast, and accessibility reviews.
3. **Awesome Design Bundle** (`bergside/awesome-design-skills`): 60+ design system archetypes (glassmorphism, bento, brutalism, modern, sleek, mono, etc.).
