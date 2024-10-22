import { useEffect, useState } from "react";

export default function useHeader(
  header: React.RefObject<HTMLDivElement>,
): [boolean, (show: boolean) => void, number, (ms: number) => void] {
  const [height, setHeight] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [frozenUntil, setFrozenUntil] = useState(0);

  useEffect(() => {
    const now = Date.now();
    if (frozenUntil > now) {
      const timeoutId = setTimeout(() => setFrozenUntil(0), frozenUntil - now);
      return () => clearTimeout(timeoutId);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [frozenUntil, header, height, positionY, offsetY]);

  useEffect(() => {
    const newHeight = header.current!.getBoundingClientRect().height;
    if (newHeight !== height) {
      setHeight(newHeight);
    }
  }, [header, height]);

  useEffect(() => {
    console.log(offsetY);
    header.current!.style.top = offsetY + "px";
  }, [header, offsetY]);

  function onScroll() {
    const upperLimit = height * -2;
    const lowerLimit = 0;

    const diff = window.scrollY - positionY;
    setPositionY(window.scrollY);

    if (
      (diff > 0 && offsetY === upperLimit) ||
      (diff <= 0 && offsetY === lowerLimit)
    ) {
      return;
    }

    if (offsetY - diff < upperLimit) {
      setOffsetY(upperLimit);
    } else if (offsetY - diff > lowerLimit) {
      setOffsetY(lowerLimit);
    } else {
      setOffsetY(offsetY - diff);
    }
  }

  function setShown(value: boolean) {
    if (value) {
      setOffsetY(0);
    } else {
      setOffsetY(height * -2);
    }
  }

  function freeze(ms: number) {
    setFrozenUntil(Date.now() + ms);
  }

  return [offsetY !== height * -2, setShown, height, freeze];
}
