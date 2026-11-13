export const PROJECTS = [
  {
    id: "badi-ai-assistant",
    title: "B.A.D.I.",
    subtitle: "Balanced Autonomous Digital Intelligence",
    tagline: "Privacy-First Open-Source AI Assistant Framework",
    category: "Autonomous Systems & AI",
    date: "2026",
    status: "Active Open Source",
    stars: 1,
    repoUrl: "https://github.com/restonuct/BADI",
    badge: "Featured AI Architecture",
    accentColor: "from-blue-600 to-indigo-600",
    glowColor: "rgba(37, 99, 235, 0.25)",
    featured: true,
    previewKey: "ai",
    posterIcon: "cpu",
    interactiveDemo: "consent",
    specs: [
      { label: "Runtime", value: "Python 3.10+ / asyncio" },
      { label: "Inference", value: "Local GGUF via llama.cpp" },
      { label: "Memory", value: "SQL history + ChromaDB vectors" },
      { label: "Autonomy", value: "Consent-gated policy engine" }
    ],
    summary:
      "A privacy-first AI assistant framework engineered with a local-first philosophy. Supports local LLM inference (llama.cpp / GGUF), vector memory indexing (ChromaDB), and transparent controlled autonomy with mandatory user consent policies.",
    techStack: [
      "Python 3.10+",
      "llama.cpp",
      "ChromaDB",
      "Asyncio",
      "Modular Plugin Architecture",
      "CLI & API Layer"
    ],
    architecture: [
      { layer: "User Layer", desc: "CLI interactive terminal, REST API endpoints, and Voice interface" },
      { layer: "Core Layer", desc: "Intent Router, Task Planner, Policy Verification Engine" },
      { layer: "Module System", desc: "Decoupled, isolated plugins inheriting from badi.modules.base.Module" },
      { layer: "Memory Store", desc: "Hybrid SQL history + ChromaDB vector embeddings + LRU cache" },
      { layer: "AI Runtime", desc: "Local GGUF models (e.g. LLaMA-3-8B-Q4) with optional cloud failover" }
    ],
    highlights: [
      "Local-First & Zero Leakage: Fully functional without internet connection.",
      "Strict Consent Protocol: High-impact actions require explicit human authorization.",
      "Extensible Plugin Engine: Dynamic module loading for automated file and OS tasks.",
      "Vector Memory Retention: Contextual retrieval across conversations using ChromaDB."
    ],
    codeSnippet: {
      filename: "badi/modules/base.py",
      language: "python",
      code: `from badi.modules.base import Module
import asyncio

class AutonomousActionModule(Module):
    name = "autonomous_worker"
    description = "Executes verified local tasks with policy check"
    requires_confirmation = True

    async def run(self, **kwargs) -> dict:
        # Pre-execution policy enforcement
        if self.requires_confirmation:
            confirmed = await self.request_user_consent(kwargs)
            if not confirmed:
                return {"status": "cancelled", "reason": "User declined action"}
        
        # High-performance async dispatch
        result = await self.execute_isolated_task(kwargs)
        return {"status": "success", "result": result}`
    }
  },
  {
    id: "ganesan-run-3d",
    title: "Ganesan Run",
    subtitle: "Eco-Friendly Ganesh Chaturthi Chase",
    tagline: "3D Endless Runner Game Engine with Three.js & WebGL",
    category: "3D Graphics & Game Development",
    date: "2026",
    status: "Live Open Source",
    stars: 1,
    repoUrl: "https://github.com/restonuct/ganesan-run",
    liveUrl: "https://ganesan-run.vercel.app",
    badge: "Three.js & WebGL 2.0",
    accentColor: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.25)",
    featured: true,
    previewKey: "runner",
    posterIcon: "gamepad",
    interactiveDemo: "runner-game",
    specs: [
      { label: "Engine", value: "Three.js r128 / WebGL 2.0" },
      { label: "Live Game", value: "ganesan-run.vercel.app" },
      { label: "Audio", value: "Web Audio API, fully procedural" },
      { label: "Frame budget", value: "16.6 ms - locked 60 FPS" }
    ],
    summary:
      "A high-performance 3D Endless Runner built with Three.js and WebGL 2.0. Features procedural ceremonial highway generation, low-poly animated character rigs, real-time Web Audio API sound synthesis, and a persistent local economy.",
    techStack: [
      "Three.js (r128)",
      "WebGL 2.0",
      "JavaScript (ES6+)",
      "Web Audio API",
      "HTML5 LocalStorage",
      "CSS3 Glassmorphism"
    ],
    architecture: [
      { layer: "Render Pipeline", desc: "Three.js r128 WebGL renderer with dynamic directional lighting and shadows" },
      { layer: "Physics & Lanes", desc: "3-lane continuous curving track with jump, slide, and collision detection" },
      { layer: "Audio Synthesis", desc: "Zero-latency Web Audio API procedural oscillator synthesis for SFX & BGM" },
      { layer: "Power-Up Arsenal", desc: "Divine Gada (shockwave), Sky Jetpack, Super Sneakers, and 2X Multiplier" },
      { layer: "State Economy", desc: "Persistent Modak bank stored via HTML5 localStorage for Mooshikan upgrades" }
    ],
    highlights: [
      "Solid 60 FPS in browser on both mobile and desktop hardware.",
      "Live interactive deployment at ganesan-run.vercel.app.",
      "Procedural road chunk pooling for zero garbage collection frame drops.",
      "Native Web Audio API synthesizer — no heavy audio asset loading required.",
      "Eco-friendly conservation narrative chasing the urban polluter villain."
    ],
    codeSnippet: {
      filename: "js/audio/synthesizer.js",
      language: "javascript",
      code: `// Real-Time Web Audio API Procedural Sound Engine
export class DivineAudioEngine {
  constructor() {
    this.ctx = null;
    this.initialized = false;
  }

  initOnFirstGesture() {
    if (!this.initialized) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    }
  }

  playModakChime() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }
}`
    }
  }
];
