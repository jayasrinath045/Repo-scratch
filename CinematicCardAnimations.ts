/**
 * CinematicCardAnimations.ts
 *
 * All scroll-driven and interaction animation logic for the CinematicCard section.
 * Separated from the JSX component for clarity and reusability.
 *
 * Dependencies: gsap, gsap/ScrollTrigger
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------
// Utility helpers
// ---------------------------------------------

/** Clamp a value between min and max (default 0–1). */
export const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(Math.max(value, min), max);

/** Linear interpolation from `from` to `to` by `progress` (0–1). */
export const mix = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;

// ---------------------------------------------
// Types
// ---------------------------------------------

export interface CinematicCardRefs {
  section: HTMLDivElement;
  stage: HTMLDivElement;
  card: HTMLDivElement;
  darkIntro: HTMLDivElement;
  content: HTMLDivElement;
  cta: HTMLDivElement;
  badge1: HTMLDivElement;
  badge2: HTMLDivElement;
  phone: HTMLDivElement | null;
}

export interface AnimateRingRefs {
  ring: SVGCircleElement | null;
  ringVal: HTMLDivElement | null;
  badge1: HTMLDivElement | null;
  badge2: HTMLDivElement | null;
}

// ---------------------------------------------
// Ring / counter animation (runs once on trigger)
// ---------------------------------------------

/**
 * Animates the SVG stroke ring from 0% to ~91% fill (28 / 31 days)
 * and counts up the numeric label inside it.
 * Also schedules the floating badge pop-ins.
 *
 * @param refs     DOM refs for the ring SVG circle, counter label, and badges.
 * @param target   Number to count up to (default 28).
 * @param duration Duration of the count-up animation in ms (default 1400).
 */
export function animateRing(
  refs: AnimateRingRefs,
  target = 28,
  duration = 1400
): void {
  const { ring, ringVal, badge1, badge2 } = refs;

  // Trigger the CSS transition on the stroke-dashoffset
  if (ring) ring.style.strokeDashoffset = "60";

  // Animate the counter number
  let start: number | null = null;
  function step(ts: number) {
    if (!start) start = ts;
    const pct = Math.min((ts - start) / duration, 1);
    const count = Math.round(pct * target);
    if (ringVal) ringVal.textContent = String(count);
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  // Staggered badge reveal
  setTimeout(() => badge1?.classList.add("show"), 600);
  setTimeout(() => badge2?.classList.add("show"), 1000);
}

// ---------------------------------------------
// Background colour interpolation
// ---------------------------------------------

/**
 * Returns the CSS `background` string for the stage element based on
 * the dark-to-light scroll progress value (0 = dark, 1 = light).
 */
export function buildStageBg(darkToLight: number): string {
  const r  = Math.round(mix(16,  250, darkToLight));
  const g  = Math.round(mix(10,  248, darkToLight));
  const b  = Math.round(mix(6,   244, darkToLight));
  const r2 = Math.round(mix(12,  245, darkToLight));
  const g2 = Math.round(mix(7,   245, darkToLight));
  const b2 = Math.round(mix(4,   240, darkToLight));
  const warmGlow = mix(0.2, 0.08, darkToLight);

  return (
    `radial-gradient(circle at 50% 34%, rgba(255,107,44,${warmGlow}) 0%, transparent 34%), ` +
    `linear-gradient(180deg, rgba(${r},${g},${b},1) 0%, rgba(${r2},${g2},${b2},1) 100%)`
  );
}

// ---------------------------------------------
// Scroll phases — progress breakpoints
// ---------------------------------------------

/**
 * Derives all animation progress values from a single raw scroll progress (0-1).
 *
 * Timeline layout (scroll progress ranges):
 *   0.00 to 0.22  — dark intro fully visible
 *   0.22 to 0.38  — dark intro fades out
 *   0.28 to 0.44  — background transitions dark to light
 *   0.30 to 0.38  — dark intro blurs out
 *   0.32 to 0.50  — card flies up from below
 *   0.40 to 0.50  — card content and phone reveal
 *   0.48 to 0.56  — badge 1 appears
 *   0.52 to 0.60  — badge 2 appears
 *   0.64 to 0.80  — card collapses back to rounded rect
 *   0.68 to 0.76  — card content fades out (upward)
 *   0.72 to 0.78  — CTA layer fades in
 */
export interface ScrollPhases {
  pct: number;
  darkToLight: number;
  darkIntroOp: number;
  darkIntroBlur: number;
  enterCard: number;
  contentReveal: number;
  badgeReveal: number;
  badge2Rev: number;
  ctaReveal: number;
  cardCollapse: number;
  contentFadeOut: number;
}

export function computeScrollPhases(pct: number): ScrollPhases {
  return {
    pct,
    darkToLight:    clamp((pct - 0.28) / 0.16),
    darkIntroOp:    clamp(1 - (pct - 0.22) / 0.16),
    darkIntroBlur:  clamp((pct - 0.30) / 0.08),
    enterCard:      clamp((pct - 0.32) / 0.18),
    contentReveal:  clamp((pct - 0.40) / 0.10),
    badgeReveal:    clamp((pct - 0.48) / 0.08),
    badge2Rev:      clamp((pct - 0.52) / 0.08),
    ctaReveal:      clamp((pct - 0.72) / 0.06),
    cardCollapse:   clamp((pct - 0.64) / 0.16),
    contentFadeOut: clamp((pct - 0.68) / 0.08),
  };
}

// ---------------------------------------------
// Per-phase DOM update helpers
// ---------------------------------------------

/** Phase 0: reset everything before the card enters (pct < 0.32). */
export function applyPhase0(
  card: HTMLDivElement,
  content: HTMLDivElement,
  cta: HTMLDivElement,
  badge1: HTMLDivElement,
  badge2: HTMLDivElement,
  isMob: boolean
): void {
  const startW = isMob ? 88 : 78;
  const startH = isMob ? 72 : 78;
  card.style.transform = "translateY(115vh)";
  card.style.width = `${startW}vw`;
  card.style.height = `${startH}vh`;
  card.style.borderRadius = isMob ? "30px" : "38px";
  content.style.opacity = "0";
  content.style.transform = "translateY(26px)";
  cta.style.opacity = "0";
  cta.style.transform = "translateY(30px)";
  cta.style.pointerEvents = "none";
  badge1.style.opacity = "0";
  badge1.style.transform = "translateY(24px)";
  badge2.style.opacity = "0";
  badge2.style.transform = "translateY(24px)";
}

/** Phase 1: card enters, content and badges reveal (0.32 <= pct < 0.64). */
export function applyPhase1(
  card: HTMLDivElement,
  content: HTMLDivElement,
  cta: HTMLDivElement,
  badge1: HTMLDivElement,
  badge2: HTMLDivElement,
  phases: ScrollPhases,
  isMob: boolean
): void {
  const startW = isMob ? 88 : 78;
  const startH = isMob ? 72 : 78;
  const { enterCard, contentReveal, badgeReveal, badge2Rev } = phases;

  card.style.transform = `translateY(${mix(115, 0, enterCard)}vh)`;
  card.style.width = `${mix(startW, 100, enterCard)}vw`;
  card.style.height = `${mix(startH, 100, enterCard)}vh`;
  card.style.borderRadius = `${mix(isMob ? 30 : 38, 0, enterCard)}px`;

  content.style.opacity = String(contentReveal);
  content.style.transform = `translateY(${mix(26, 0, contentReveal)}px)`;

  cta.style.opacity = "0";
  cta.style.transform = "translateY(30px)";
  cta.style.pointerEvents = "none";

  badge1.style.opacity = String(badgeReveal);
  badge1.style.transform = `translateY(${mix(20, 0, badgeReveal)}px)`;
  badge2.style.opacity = String(badge2Rev);
  badge2.style.transform = `translateY(${mix(20, 0, badge2Rev)}px)`;
}

/** Phase 2: card collapses, CTA reveals (pct >= 0.64). */
export function applyPhase2(
  card: HTMLDivElement,
  content: HTMLDivElement,
  cta: HTMLDivElement,
  badge1: HTMLDivElement,
  badge2: HTMLDivElement,
  phases: ScrollPhases,
  isMob: boolean
): void {
  const startW = isMob ? 88 : 78;
  const startH = isMob ? 72 : 78;
  const { cardCollapse, contentFadeOut, ctaReveal } = phases;

  card.style.transform = "translateY(0)";
  card.style.width = `${mix(100, startW, cardCollapse)}vw`;
  card.style.height = `${mix(100, startH, cardCollapse)}vh`;
  card.style.borderRadius = `${mix(0, isMob ? 30 : 38, cardCollapse)}px`;

  const contentOp = 1 - contentFadeOut;
  content.style.opacity = String(contentOp);
  content.style.transform = `translateY(${mix(0, -18, contentFadeOut)}px)`;

  cta.style.opacity = String(ctaReveal);
  cta.style.transform = `translateY(${mix(24, 0, ctaReveal)}px)`;
  cta.style.pointerEvents = ctaReveal > 0.65 ? "auto" : "none";

  const badgeOut = 1 - cardCollapse;
  badge1.style.opacity = String(badgeOut);
  badge1.style.transform = `translateY(${mix(0, -18, cardCollapse)}px)`;
  badge2.style.opacity = String(badgeOut);
  badge2.style.transform = `translateY(${mix(0, -18, cardCollapse)}px)`;
}

// ---------------------------------------------
// Main animation initialiser
// ---------------------------------------------

/**
 * Wires up all CinematicCard animations:
 *   1. Scroll-driven card / background / badge / CTA sequence (GSAP ScrollTrigger)
 *   2. Card hover sheen (CSS custom property via mousemove)
 *   3. Phone 3D tilt on document mousemove
 *
 * @param refs           All required DOM element refs.
 * @param onRingTrigger  Callback fired when the ring should animate (once).
 * @returns              A cleanup function — call it in useEffect return.
 */
export function initCinematicAnimations(
  refs: CinematicCardRefs,
  onRingTrigger: () => void
): () => void {
  const { section, stage, card, darkIntro, content, cta, badge1, badge2, phone } = refs;
  const isMob = window.innerWidth < 900;
  let ringTriggered = false;

  // 1. Scroll-driven sequence
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const phases = computeScrollPhases(self.progress);

      stage.style.background = buildStageBg(phases.darkToLight);

      darkIntro.style.opacity = String(phases.darkIntroOp);
      darkIntro.style.transform = `translateY(${mix(0, -34, self.progress)}px) scale(${mix(1, 0.96, self.progress)})`;
      darkIntro.style.filter = `blur(${mix(0, 4, phases.darkIntroBlur)}px)`;

      if (self.progress < 0.32) {
        applyPhase0(card, content, cta, badge1, badge2, isMob);
        return;
      }

      if (self.progress < 0.64) {
        applyPhase1(card, content, cta, badge1, badge2, phases, isMob);
        if (phases.contentReveal > 0.45 && !ringTriggered) {
          ringTriggered = true;
          onRingTrigger();
        }
        return;
      }

      applyPhase2(card, content, cta, badge1, badge2, phases, isMob);
    },
  });

  // 2. Card hover sheen
  const onCardMove = (e: MouseEvent) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  };
  card.addEventListener("mousemove", onCardMove);

  // 3. Phone 3D tilt
  const onPhoneTilt = (e: MouseEvent) => {
    if (!phone) return;
    const xv = (e.clientX / window.innerWidth - 0.5) * 2;
    const yv = (e.clientY / window.innerHeight - 0.5) * 2;
    phone.style.transform = `rotateY(${xv * 10}deg) rotateX(${-yv * 10}deg)`;
    phone.style.transition = "transform 1s cubic-bezier(.25,.4,.25,1)";
  };
  document.addEventListener("mousemove", onPhoneTilt);

  // Cleanup
  return () => {
    trigger.kill();
    card.removeEventListener("mousemove", onCardMove);
    document.removeEventListener("mousemove", onPhoneTilt);
  };
}
