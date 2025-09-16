// JavaScript for Birthday Universe Journey
class BirthdayUniverse {
  constructor() {
    this.currentStage = 1;
    this.totalStages = 5;
    this.clickCount = 0;
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.currentLanguage = "ru"; // Default to Russian

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupEventListeners();
    this.setupLanguageToggle();
    this.startParticleSystem();
    this.preloadSounds();

    // Show initial stage
    this.showStage(1);

    console.log(
      "🎂 Birthday Universe initialized! Ready for magical journey..."
    );
  }

  setupCanvas() {
    this.canvas = document.getElementById("particle-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();

    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupEventListeners() {
    // Add click and touch listeners to each stage's doll
    for (let i = 1; i <= this.totalStages; i++) {
      const stage = document.getElementById(`stage${i}`);
      const doll = stage.querySelector(".doll");

      if (doll) {
        // Desktop events
        doll.addEventListener("click", (e) => this.handleStageClick(e, i));
        doll.addEventListener("mouseenter", () => this.addHoverEffect(doll));
        doll.addEventListener("mouseleave", () => this.removeHoverEffect(doll));

        // Mobile touch events
        doll.addEventListener(
          "touchstart",
          (e) => {
            e.preventDefault();
            doll.classList.add("touch-active");
            this.addHoverEffect(doll);
          },
          { passive: false }
        );

        doll.addEventListener(
          "touchend",
          (e) => {
            e.preventDefault();
            doll.classList.remove("touch-active");
            this.removeHoverEffect(doll);
            this.handleStageClick(e, i);
          },
          { passive: false }
        );

        doll.addEventListener("touchcancel", (e) => {
          doll.classList.remove("touch-active");
          this.removeHoverEffect(doll);
        });

        // Make sure the doll is tappable
        doll.style.touchAction = "manipulation";
        doll.style.cursor = "pointer";
      }
    }

    // Prevent default touch behaviors on the whole document
    document.addEventListener(
      "touchstart",
      (e) => {
        // Only prevent default if not touching interactive elements
        if (!e.target.closest(".doll") && !e.target.closest(".lang-btn")) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const currentStageElement = document.getElementById(
          `stage${this.currentStage}`
        );
        if (currentStageElement) {
          const doll = currentStageElement.querySelector(".doll");
          if (doll) {
            doll.click();
          }
        }
      }
    });
  }

  handleStageClick(event, stageNumber) {
    if (stageNumber !== this.currentStage) return;

    this.clickCount++;

    // Create click effect
    this.createClickEffect(event.clientX, event.clientY);

    // Play sound effect
    this.playClickSound();

    // Create burst of particles
    this.createParticleBurst(event.clientX, event.clientY);

    // Add screen shake effect
    this.addScreenShake();

    console.log(
      `🎭 Stage ${stageNumber} clicked! Total clicks: ${this.clickCount}`
    );

    // Move to next stage or final message
    setTimeout(() => {
      if (stageNumber === this.totalStages) {
        this.showFinalMessage();
      } else {
        this.nextStage();
      }
    }, 1000);
  }

  nextStage() {
    this.currentStage++;
    this.showStage(this.currentStage);

    console.log(
      `🚀 Advancing to stage ${this.currentStage} with 3D layered effect!`
    );
  }

  showStage(stageNumber) {
    // First, remove all classes from all stages
    for (let i = 1; i <= this.totalStages; i++) {
      const stage = document.getElementById(`stage${i}`);
      if (stage) {
        stage.classList.remove(
          "active",
          "behind-1",
          "behind-2",
          "behind-3",
          "behind-4",
          "exiting"
        );
      }
    }

    // Set the active stage
    const currentStage = document.getElementById(`stage${stageNumber}`);
    if (currentStage) {
      currentStage.classList.add("active");
    }

    // Add layered effect for previous stages
    for (let i = 1; i < stageNumber; i++) {
      const behindStage = document.getElementById(`stage${i}`);
      if (behindStage) {
        const depthClass = `behind-${Math.min(stageNumber - i, 4)}`;
        behindStage.classList.add(depthClass);
      }
    }

    this.updateStarfield(stageNumber);
    console.log(
      `🎭 3D Stage ${stageNumber} activated with layered background!`
    );
  }

  showFinalMessage() {
    const currentStageElement = document.getElementById(
      `stage${this.currentStage}`
    );
    const finalMessage = document.getElementById("final-message");

    // Add exit animation to current stage
    currentStageElement.classList.add("exiting");

    setTimeout(() => {
      currentStageElement.classList.remove("active", "exiting");
      finalMessage.classList.add("active");

      // Trigger celebration effects
      this.triggerCelebration();

      console.log("🎉 Final message revealed! Happy Birthday Eliza!");
    }, 1000);
  }

  createClickEffect(x, y) {
    const effect = document.createElement("div");
    effect.className = "click-effect";
    effect.style.left = x + "px";
    effect.style.top = y + "px";
    effect.textContent = "✨";

    document.body.appendChild(effect);

    setTimeout(() => {
      effect.remove();
    }, 1000);
  }

  addHoverEffect(element) {
    element.style.filter =
      "brightness(1.2) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))";
  }

  removeHoverEffect(element) {
    element.style.filter = "drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))";
  }

  addScreenShake() {
    document.body.style.animation =
      "shake 0.5s cubic-bezier(.36,.07,.19,.97) both";

    setTimeout(() => {
      document.body.style.animation = "";
    }, 500);

    // Add shake keyframes to CSS dynamically
    if (!document.querySelector("#shake-style")) {
      const style = document.createElement("style");
      style.id = "shake-style";
      style.textContent = `
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `;
      document.head.appendChild(style);
    }
  }

  preloadSounds() {
    // Create audio context for better sound management
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (e) {
      console.log("Audio context not supported");
    }
  }

  playClickSound() {
    // Create a simple beep sound using Web Audio API
    if (this.audioContext) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        this.audioContext.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.1
      );

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    }
  }

  // Particle System
  setupParticleSystem() {
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: this.getRandomColor(),
      life: Math.random() * 200 + 100,
    };
  }

  getRandomColor() {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createParticleBurst(x, y) {
    const burstParticles = 15;
    for (let i = 0; i < burstParticles; i++) {
      const angle = (Math.PI * 2 * i) / burstParticles;
      const velocity = Math.random() * 5 + 3;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * 4 + 2,
        opacity: 1,
        color: this.getRandomColor(),
        life: 60,
        isBurst: true,
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      if (particle.isBurst) {
        particle.opacity = particle.life / 60;
        particle.vy += 0.1; // gravity effect
      }

      // Wrap around screen edges for regular particles
      if (!particle.isBurst) {
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
      }

      return particle.life > 0;
    });

    // Maintain particle count for ambient particles
    while (this.particles.filter((p) => !p.isBurst).length < 50) {
      this.particles.push(this.createParticle());
    }
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Add glow effect
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  startParticleSystem() {
    this.setupParticleSystem();
    this.animate();
  }

  animate() {
    this.updateParticles();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateStarfield(stageNumber) {
    const starfield = document.getElementById(`starfield${stageNumber}`);
    if (starfield) {
      // Add dynamic color changes based on stage
      const colors = [
        "rgba(255, 107, 107, 0.8)", // Red
        "rgba(78, 205, 196, 0.8)", // Teal
        "rgba(69, 183, 209, 0.8)", // Blue
        "rgba(254, 202, 87, 0.8)", // Yellow
        "rgba(255, 159, 243, 0.8)", // Pink
      ];

      const color = colors[stageNumber - 1] || "rgba(255, 255, 255, 0.8)";
      starfield.style.background = `radial-gradient(circle, ${color} 1px, transparent 1px)`;
    }
  }

  triggerCelebration() {
    // Create massive particle burst
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Multiple bursts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createParticleBurst(
          centerX + (Math.random() - 0.5) * 200,
          centerY + (Math.random() - 0.5) * 200
        );
      }, i * 300);
    }

    // Add confetti effect
    this.createConfetti();

    // Play celebration sound
    this.playCelebrationSound();
  }

  createConfetti() {
    const confettiCount = 100;
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 6 + 2,
          opacity: 1,
          color: this.getRandomColor(),
          life: 300,
          isConfetti: true,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        });
      }, Math.random() * 2000);
    }
  }

  playCelebrationSound() {
    if (this.audioContext) {
      // Play a sequence of ascending notes
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C
      notes.forEach((frequency, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);

          oscillator.frequency.setValueAtTime(
            frequency,
            this.audioContext.currentTime
          );
          gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.3
          );

          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + 0.3);
        }, index * 150);
      });
    }
  }

  // Accessibility methods
  enableKeyboardNavigation() {
    const stages = document.querySelectorAll(".stage");
    stages.forEach((stage, index) => {
      const doll = stage.querySelector(".doll");
      if (doll) {
        doll.setAttribute("tabindex", "0");
        doll.setAttribute("role", "button");
        doll.setAttribute(
          "aria-label",
          `Stage ${index + 1}: Click to continue the magical journey`
        );
      }
    });
  }

  // Performance optimization
  optimizeForMobile() {
    if (window.innerWidth < 768) {
      // Reduce particle count on mobile
      this.particles = this.particles.slice(0, 25);

      // Simplify animations
      document.documentElement.style.setProperty("--animation-duration", "2s");
    }
  }

  // Cleanup method
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    this.particles = [];
    console.log("🧹 Birthday Universe cleaned up");
  }

  // Language Toggle Methods
  setupLanguageToggle() {
    const langToggle = document.getElementById("langToggle");
    if (langToggle) {
      // Desktop click
      langToggle.addEventListener("click", () => this.toggleLanguage());

      // Mobile touch events
      langToggle.addEventListener(
        "touchstart",
        (e) => {
          e.stopPropagation();
          langToggle.style.transform = "translateY(0px) scale(0.95)";
        },
        { passive: false }
      );

      langToggle.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          langToggle.style.transform = "";
          this.toggleLanguage();
        },
        { passive: false }
      );

      // Ensure button is tappable
      langToggle.style.touchAction = "manipulation";
      langToggle.style.cursor = "pointer";
    }
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === "ru" ? "en" : "ru";
    this.updateAllText();
    this.updateToggleButton();

    console.log(
      `🌍 Language switched to: ${
        this.currentLanguage === "ru" ? "Russian" : "English"
      }`
    );
  }

  updateAllText() {
    // Update document language
    document.documentElement.lang = this.currentLanguage;

    // Update title
    const title = document.querySelector("title");
    if (title) {
      const newTitle = title.getAttribute(`data-${this.currentLanguage}`);
      if (newTitle) title.textContent = newTitle;
    }

    // Update all elements with data attributes
    const elementsWithData = document.querySelectorAll("[data-ru], [data-en]");
    elementsWithData.forEach((element) => {
      const newText = element.getAttribute(`data-${this.currentLanguage}`);
      if (newText) {
        element.textContent = newText;
      }
    });
  }

  updateToggleButton() {
    const langText = document.querySelector(".lang-text");
    const flag = document.querySelector(".flag");

    if (langText && flag) {
      if (this.currentLanguage === "ru") {
        langText.textContent = "English";
        flag.textContent = "🇬🇧";
      } else {
        langText.textContent = "Русский";
        flag.textContent = "🇷🇺";
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check for user interaction requirement (some browsers require it for audio)
  const startExperience = () => {
    window.birthdayUniverse = new BirthdayUniverse();

    // Enable accessibility features
    window.birthdayUniverse.enableKeyboardNavigation();

    // Optimize for mobile if needed
    window.birthdayUniverse.optimizeForMobile();

    // Remove the start listener
    document.removeEventListener("click", startExperience);
    document.removeEventListener("touchstart", startExperience);
  };

  // Start immediately, but be ready for user interaction
  startExperience();

  // Fallback for browsers that need user interaction
  document.addEventListener("click", startExperience, { once: true });
  document.addEventListener("touchstart", startExperience, { once: true });
});

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (window.birthdayUniverse) {
    if (document.hidden) {
      // Pause animations when tab is not visible
      if (window.birthdayUniverse.animationId) {
        cancelAnimationFrame(window.birthdayUniverse.animationId);
      }
    } else {
      // Resume animations when tab becomes visible
      window.birthdayUniverse.animate();
    }
  }
});

// Handle window unload
window.addEventListener("beforeunload", () => {
  if (window.birthdayUniverse) {
    window.birthdayUniverse.destroy();
  }
});

// Add some magical console messages
console.log("🌟 Welcome to Eliza's Magical Birthday Universe! 🌟");
console.log("✨ Click through 5 magical realms to reveal your surprise! ✨");
console.log("💖 Made with love and JavaScript magic 💖");
