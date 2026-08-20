"use client";
import { useRef } from "react";

// Simple, dependency-free left/right swipe detector for touch devices —
// spread the returned handlers onto a container's onTouchStart/onTouchEnd.
// Ignores mostly-vertical touches (normal page scrolling) so a swipe
// gesture never fights with scrolling — no preventDefault anywhere, so
// vertical scroll always keeps working even mid-gesture.
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 40 } = {}) {
  const start = useRef(null);

  function onTouchStart(e) {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e) {
    if (!start.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.current.x;
    const dy = t.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) onSwipeLeft && onSwipeLeft();
    else onSwipeRight && onSwipeRight();
  }

  return { onTouchStart, onTouchEnd };
}
