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
    badge: "Three.js & WebGL 2.0",
    accentColor: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.25)",
    featured: true,
    previewKey: "runner",
    posterIcon: "gamepad",
    interactiveDemo: "synth",
    specs: [
      { label: "Engine", value: "Three.js r128 / WebGL 2.0" },
      { label: "Frame budget", value: "16.6 ms - locked 60 FPS" },
      { label: "Audio", value: "Web Audio API, fully procedural" },
      { label: "Persistence", value: "HTML5 LocalStorage economy" }
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
  },
  {
    id: "student-grade-calculator",
    title: "Student Grade Calculator",
    subtitle: "Weighted Marks to Letter Grade",
    tagline: "Foundational Python Logic & Input Validation",
    category: "Python Fundamentals",
    date: "2026",
    status: "Coursework Module",
    stars: 0,
    featured: false,
    previewKey: "grades",
    posterIcon: "chart",
    interactiveDemo: "grades",
    repoUrl: "https://github.com/restonuct/python-practical",
    badge: "Python 3 Console App",
    accentColor: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.22)",
    specs: [
      { label: "Language", value: "Python 3" },
      { label: "Interface", value: "Console prompts with validation" },
      { label: "Method", value: "Weighted average to letter grade" },
      { label: "Focus", value: "Guard clauses & pure functions" }
    ],
    summary:
      "A weighted grading utility written while learning applied Python. It validates marks and weights, rejects impossible input instead of silently coercing it, and maps a weighted average onto a letter grade with a GPA-style remark.",
    techStack: [
      "Python 3",
      "CLI I/O",
      "Input Validation",
      "Functions & Loops",
      "Conditional Logic"
    ],
    architecture: [
      { layer: "Input Layer", desc: "Prompts for marks and per-component weights, with type and range guards" },
      { layer: "Validation Layer", desc: "Rejects mismatched lengths, out-of-range marks and weights that do not total 100" },
      { layer: "Computation Layer", desc: "One pure function: weighted average, then threshold mapping" },
      { layer: "Presentation Layer", desc: "Formatted console report of score, letter grade and remark" }
    ],
    highlights: [
      "Fails loudly on bad input instead of producing a confident wrong number.",
      "Computation lives in a single pure function, so the grading table is trivial to change.",
      "The weighted-average maths generalises well beyond the coursework brief."
    ],
    codeSnippet: {
      filename: "grade_calculator.py",
      language: "python",
      code: `def calculate_grade(marks, weights):
    """Weighted average -> letter grade, with input guard clauses."""
    if len(marks) != len(weights):
        raise ValueError("marks and weights must be the same length")
    if sum(weights) != 100:
        raise ValueError("weights must total 100")
    if any(not 0 <= mark <= 100 for mark in marks):
        raise ValueError("each mark must be between 0 and 100")

    score = sum(mark * weight for mark, weight in zip(marks, weights)) / 100

    if score >= 90:
        return "A", score
    if score >= 80:
        return "B", score
    if score >= 70:
        return "C", score
    if score >= 60:
        return "D", score
    return "F", score`
    }
  },
  {
    id: "voting-eligibility-engine",
    title: "Voting Eligibility",
    subtitle: "Policy Verification Engine",
    tagline: "Age & Registration Rules with Explicit Reason Codes",
    category: "Logic & Policy Validation",
    date: "2026",
    status: "Coursework Module",
    stars: 0,
    featured: false,
    previewKey: "vote",
    posterIcon: "shield",
    interactiveDemo: "vote",
    repoUrl: "https://github.com/restonuct/python-practical",
    badge: "Python 3 Policy Logic",
    accentColor: "from-blue-500 to-cyan-600",
    glowColor: "rgba(41, 151, 255, 0.22)",
    specs: [
      { label: "Language", value: "Python 3" },
      { label: "Input", value: "Age + registration state" },
      { label: "Method", value: "Ordered rules with reason codes" },
      { label: "Focus", value: "Boolean logic & edge cases" }
    ],
    summary:
      "A small eligibility checker that models a real policy surface: minimum age, registration state and malformed input. Instead of returning a bare boolean it returns a reason code - the same consent-gate pattern used later in B.A.D.I.",
    techStack: [
      "Python 3",
      "Boolean Logic",
      "Guard Clauses",
      "Reason Codes",
      "Edge-case Testing"
    ],
    architecture: [
      { layer: "Rule Set", desc: "Minimum voting age and registration requirements held as named constants" },
      { layer: "Validator", desc: "Rejects non-integer or negative input before any rule runs" },
      { layer: "Evaluator", desc: "Ordered guard clauses - the first failing rule explains the outcome" },
      { layer: "Result Contract", desc: "Returns (eligible, reason) so the caller never has to guess why" }
    ],
    highlights: [
      "Returns a reason code rather than a bare boolean, which is far easier to test and to render.",
      "Malformed input is a first-class case, not an exception path.",
      "Same consent-gate reasoning that later shaped the B.A.D.I. policy engine."
    ],
    codeSnippet: {
      filename: "voting_eligibility.py",
      language: "python",
      code: `MINIMUM_VOTING_AGE = 18

def check_eligibility(age, is_registered):
    """Returns (eligible, reason) - every rejection carries a reason code."""
    if not isinstance(age, int) or age < 0:
        return False, "invalid_age"
    if age < MINIMUM_VOTING_AGE:
        return False, "under_minimum_age"
    if not is_registered:
        return False, "not_registered"
    return True, "eligible"


if __name__ == "__main__":
    for age, registered in ((17, True), (18, False), (18, True)):
        eligible, reason = check_eligibility(age, registered)
        print(f"age={age} registered={registered} -> {eligible} ({reason})")`
    }
  }
];
