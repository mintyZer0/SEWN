"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current viewport is desktop size (>= 1024px)
 * @returns boolean - true if desktop, false if mobile/tablet
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Standard Tailwind 'lg' breakpoint is 1024px
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    
    const handleResize = () => setIsDesktop(mediaQuery.matches);
    
    // Initial check
    handleResize();
    
    // Listen for changes
    mediaQuery.addEventListener("change", handleResize);
    
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isDesktop;
}
