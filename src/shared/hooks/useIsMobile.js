import { useEffect, useState } from "react";

/**
 * Detecta viewport móvil (por defecto < 768px = Tailwind `md`).
 * En desktop se conserva el layout actual; en móvil se aplica el shell tipo app.
 */
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (event) => setIsMobile(event.matches);

    setIsMobile(media.matches);

    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [query]);

  return isMobile;
}
