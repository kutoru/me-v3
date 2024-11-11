import { useEffect, useState } from "react";
import ScreenSize from "../types/ScreenSize";
import tailwindTheme from "tailwindcss/defaultTheme";

const breakpoints = {
  sm: parseInt(tailwindTheme.screens.sm),
  md: parseInt(tailwindTheme.screens.md),
  lg: parseInt(tailwindTheme.screens.lg),
  xl: parseInt(tailwindTheme.screens.xl),
};

function getBreakpoint(width: number) {
  if (width < breakpoints.md) {
    return ScreenSize.SM;
  } else if (width < breakpoints.lg) {
    return ScreenSize.MD;
  } else if (width < breakpoints.xl) {
    return ScreenSize.LG;
  } else {
    return ScreenSize.XL;
  }
}

export default function useBreakpoint() {
  const [size, setSize] = useState(ScreenSize.SM);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [size]);

  useEffect(() => {
    onResize();
  }, []);

  function onResize() {
    const newSize = getBreakpoint(window.outerWidth);
    if (newSize !== size) {
      setSize(newSize);
    }
  }

  return size;
}
