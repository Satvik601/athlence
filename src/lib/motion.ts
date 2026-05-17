/*
 * Motion environment helpers.
 *
 * Brief §6 — honour prefers-reduced-motion.
 * Brief §8 — defer non-essential JS until idle.
 * Brief §9 — preserve native iOS Safari momentum (Lenis opt-out).
 * Brief §8 — respect saveData.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
  const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && safari;
}

export function saveDataEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(c?.saveData);
}

/**
 * Run on idle. Falls back to setTimeout for Safari (which lacks rIC).
 * Brief §8 — defer GSAP, Lenis, Pixel/Plausible behind this so they
 * don't compete with LCP.
 */
export function whenIdle(cb: () => void, timeout = 1500): void {
  if (typeof window === 'undefined') return;
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(cb, { timeout });
  } else {
    setTimeout(cb, 200);
  }
}

export function shouldAnimate(): boolean {
  return !prefersReducedMotion() && !saveDataEnabled();
}
