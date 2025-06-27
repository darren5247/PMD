import { useEffect, useState } from "react";

export const useMediaQuery = (query: string): boolean | null => {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    function handleChange() {
      setMatches(!!matchMedia.matches);
    }
    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
};
