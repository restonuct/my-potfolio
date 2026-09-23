<div align="center">

#  Portfolio — Amal Mohammed M

### *Ultra-Minimalist, Apple-Inspired Personal Portfolio*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br />

<p align="center">
  A production-ready personal engineering portfolio designed following <b>Apple Human Interface Guidelines (HIG)</b>. Features fluid physics-based micro-interactions, an elastic Dynamic Island theme switcher, 3D perspective glass Bento cards, and an App Store-style project showcase.
</p>

<p align="center">
  <a href="https://github.com/restonuct"><b>GitHub (@restonuct)</b></a> •
  <a href="https://www.linkedin.com/in/amal-mohammed-418601431/"><b>LinkedIn</b></a>
</p>

</div>

---

## 🌟 Design & Engineering Philosophy

* **Apple Keynote Aesthetics:** Crisp typography using the `-apple-system` / Inter font stack with tight optical letter-spacing (`-0.025em`) and high typographic contrast.
* **Dual Theme Engine:** Defaults to Apple Light Mode (`#F5F5F7` to `#FFFFFF`) with a seamless spring toggle to Obsidian Dark Mode (`#000000` to `#0D0D10`).
* **Physical Spring Motion:** Frictionless, physical Framer Motion animations (`stiffness: 420, damping: 22`) simulating real-world momentum.
* **Frosted Glass & Squircle Geometry:** Multi-layer `backdrop-blur-2xl` with continuous curvature squircles (`rounded-[28px]`, `rounded-[32px]`) and 1px specular highlight rim lighting.
* **Zero Cursor Gimmicks:** Retains the native OS cursor with strict performance optimization and clean responsiveness across mobile, tablet, and desktop viewports.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React 18** + **Vite 5** | Lightning-fast HMR and modular component architecture |
| **Styling** | **Tailwind CSS 3.4** | Utility-first glassmorphism, Apple color tokens & dark mode classes |
| **Motion** | **Framer Motion 11** | Shared `layoutId` modal expansions, 3D tilt perspective & clip-path reveals |
| **Icons** | **Lucide React** | Monochrome, lightweight SF-symbol-inspired vector icons |
| **Audio API** | **Web Audio API** | Real-time browser oscillator frequency synthesis (587Hz → 880Hz) |

---

## 🚀 Key Micro-Interactions

1. **Hero Text Reveal:** Masked `clipPath: "inset(0 0 100% 0)"` upward slide for *"Amal Mohammed M"*, staggered by 150ms with subtitle tracking contraction.
2. **Dynamic Island Theme Switcher:** Floating pill in the navbar that elastically stretches horizontally (`scaleX: 1.18`, `scaleY: 0.92`) on press with an Apple spring release (`Cmd/Ctrl + \` shortcut supported).
3. **Interactive 3D Glass Bento Cards:** Physics-driven perspective tilt (`rotateX`, `rotateY` bounded to `±3°`) with internal Z-axis icon parallax depth (`translateZ: 20px`).
4. **App Store Card Expansion:** Project cards morph smoothly into fullscreen-style detail modals using Framer Motion `layoutId`, displaying architecture layers and live code inspection.
5. **Adaptive Mobile Navigation:** Responsive floating navbar that gracefully adapts into a frosted glass drawer on compact viewports with zero text overflow.

---

## 💻 Featured Projects

### 1. [B.A.D.I. (Balanced Autonomous Digital Intelligence)](https://github.com/restonuct/BADI)
* **Domain:** Autonomous Systems & AI Architecture
* **Stack:** Python 3.10+, `llama.cpp` (Local GGUF models), ChromaDB (Vector store), Asyncio, Modular Architecture, CLI & API.
* **Core Philosophy:** Privacy-first, offline-capable AI framework ensuring user data sovereignty with strict human-in-the-loop consent policies.

### 2. [Ganesan Run (Eco-Friendly Chase)](https://github.com/restonuct/ganesan-run)
* **Domain:** 3D Graphics & Game Engine Development
* **Stack:** Three.js (r128), WebGL 2.0, JavaScript (ES6+), Web Audio API, HTML5 LocalStorage, CSS3 Glassmorphism.
* **Core Philosophy:** High-performance 3D Endless Runner running at a locked 60 FPS in browser with procedural road pooling and real-time synthesized audio.

*(Foundational coursework algorithms such as the Student Grade Calculator and Voting Eligibility Verification System inform the core algorithmic and policy validation logic.)*

---

## ⚡ Quick Start & Local Setup

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher (or pnpm / yarn)

### 1. Clone the repository
```bash
git clone https://github.com/restonuct/portfolio-minimal.git
cd portfolio-minimal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for production
```bash
npm run build
```
Generates an optimized static bundle in the `dist/` directory ready for deployment.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy Site**.

---

## 📁 Project Structure

```
portfolio-minimal/
├── index.html               # Apple web app headers, typography preconnects
├── package.json             # React, Vite, Framer Motion, Lucide, Tailwind dependencies
├── tailwind.config.js       # Apple tokens, glassmorphism, squircle radii
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite build pipeline configuration
├── public/
│   └── profile.jpg          # Profile asset
├── src/
│   ├── main.jsx             # React DOM entrypoint
│   ├── App.jsx              # Theme state, keyboard shortcuts & section orchestration
│   ├── index.css            # Apple glassmorphism utilities & specular highlight styles
│   ├── data/
│   │   └── projects.js      # Verified technical data & architecture specs
│   └── components/
│       ├── Navbar.jsx       # Floating frosted glass bar + Dynamic Island theme pill
│       ├── Hero.jsx         # Masked clip-path text reveals + Keynote layout
│       ├── BentoSkills.jsx  # 3D tilt perspective cards with Z-axis depth parallax
│       ├── About.jsx        # Personal story, background & engineering ethos
│       ├── ProjectCard.jsx  # App Store layoutId card
│       ├── ProjectModal.jsx # Expanded modal with architecture layers & live triggers
│       └── Footer.jsx       # Minimalist monochrome footer
└── README.md
```

---

## 📬 Connect with Amal Mohammed M

* **GitHub:** [@restonuct](https://github.com/restonuct)
* **LinkedIn:** [Amal Mohammed](https://www.linkedin.com/in/amal-mohammed-418601431/)
* **Role:** First-Year B.Tech Computer Science & Engineering Student

---

<div align="center">
  <sub>Designed & Developed by <b>Amal Mohammed M</b> • Open Source MIT License</sub>
</div>
