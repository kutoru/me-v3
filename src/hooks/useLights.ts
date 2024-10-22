import { useEffect, useState } from "react";

const minSize = 25;
const maxSize = 150;
const minTransitionTime = 3000;
const maxTransitionTime = 4000;
const minSleep = 500;
const maxSleep = 1000;
const colors = {
  //   default: "hsl(343,88%,16%)",
  //   default: "hsl(244,47%,20%)",
  //   hover: "hsl(244,47%,40%)",
  //   hold: "hsl(244,47%,60%)",
  default: "hsl(244,47%,40%)",
  hover: "hsl(244,47%,50%)",
  hold: "hsl(244,47%,60%)",
};

type LightState = {
  inUse: boolean;
  state:
    | "beforeAppearing"
    | "appearing"
    | "beforeDisappearing"
    | "disappearing";
  nextUpdate: number;
  appearTime: number;
  disappearTime: number;
  element: HTMLDivElement;
  cancelDrag: () => void;
};

export default function useLights(
  mainContainer: React.RefObject<HTMLDivElement>,
) {
  const [currMovable, setCurrMovable] = useState<{
    element: HTMLDivElement;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [lights, setLights] = useState<LightState[]>([]);
  const [nextLightAt, setNextLightAt] = useState(0);

  // drag related stuff
  useEffect(() => {
    mainContainer.current?.addEventListener("mousemove", onMouseMove);
    return () => {
      mainContainer.current?.removeEventListener("mousemove", onMouseMove);
    };
  }, [currMovable]);

  function onMouseMove(e: MouseEvent) {
    if (currMovable) {
      const x = e.x + currMovable.offsetX;
      const y = e.y + currMovable.offsetY;
      currMovable.element.style.left = x + "px";
      currMovable.element.style.top = y + "px";
    }
  }

  // activating lights
  useEffect(() => {
    const now = Date.now();
    if (nextLightAt <= now) {
      addLight();
      return;
    }

    const timeoutId = setTimeout(() => {
      setNextLightAt(0);
    }, nextLightAt - now);

    return () => clearTimeout(timeoutId);
  }, [lights, nextLightAt]);

  // updating active lights
  useEffect(() => {
    const timeoutIds: number[] = [];

    for (let i = 0; i < lights.length; i++) {
      const light = lights[i];

      if (!light.inUse) {
        continue;
      }

      switch (light.state) {
        case "beforeAppearing":
          timeoutIds.push(beforeAppearingTimeout(light));
          break;
        case "appearing":
          timeoutIds.push(appearingTimeout(light));
          break;
        case "beforeDisappearing":
          timeoutIds.push(beforeDisappearingTimeout(light));
          break;
        case "disappearing":
          timeoutIds.push(disappearingTimeout(light));
          break;
      }
    }

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [lights]);

  function beforeAppearingTimeout(light: LightState) {
    return setTimeout(() => {
      light.element.classList.replace("opacity-0", "opacity-100");
      light.state = "appearing";
      light.nextUpdate = light.nextUpdate + light.appearTime;
      setLights([...lights]);
    }, light.nextUpdate - Date.now());
  }

  function appearingTimeout(light: LightState) {
    return setTimeout(() => {
      light.element.style.transition = `opacity ${light.disappearTime}ms ease-in-out`;
      light.state = "beforeDisappearing";
      light.nextUpdate = light.nextUpdate + 50;
      setLights([...lights]);
    }, light.nextUpdate - Date.now());
  }

  function beforeDisappearingTimeout(light: LightState) {
    return setTimeout(() => {
      light.element.classList.replace("opacity-100", "opacity-0");
      light.state = "disappearing";
      light.nextUpdate = light.nextUpdate + light.disappearTime;
      setLights([...lights]);
    }, light.nextUpdate - Date.now());
  }

  function disappearingTimeout(light: LightState) {
    return setTimeout(() => {
      light.cancelDrag();
      light.inUse = false;
      setLights([...lights]);
    }, light.nextUpdate - Date.now());
  }

  function addLight() {
    if (!mainContainer.current) {
      throw new Error("mainContainer is false");
    }

    // calculations

    const { width: maxRight, height: maxBottom } =
      mainContainer.current.getBoundingClientRect();

    const size = Math.floor(minSize + Math.random() * (maxSize - minSize));
    const appearTime = Math.floor(
      minTransitionTime +
        Math.random() * (maxTransitionTime - minTransitionTime),
    );
    const disappearTime = Math.floor(
      minTransitionTime +
        Math.random() * (maxTransitionTime - minTransitionTime),
    );
    const x = Math.floor(Math.random() * maxRight);
    const y = Math.floor(Math.random() * maxBottom);

    // element loading

    const { lightContainer, light, lightIndex } = loadLightElement();

    // data assignments

    lightContainer.style.transition = `opacity ${appearTime}ms ease-in-out`;
    lightContainer.style.width = size * 2 + "px";
    lightContainer.style.height = size * 2 + "px";
    lightContainer.style.left = x + "px";
    lightContainer.style.top = y + "px";
    light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.default}`;

    const cancelDrag = setupLightMouseEvents(lightContainer, light, x, y, size);

    lights[lightIndex] = {
      inUse: true,
      state: "beforeAppearing",
      appearTime: appearTime,
      disappearTime: disappearTime,
      nextUpdate: Date.now() + 50,
      element: lightContainer,
      cancelDrag: cancelDrag,
    };

    // state updates

    const waitFor = Math.floor(
      minSleep + Math.random() * (maxSleep - minSleep),
    );

    setNextLightAt(Date.now() + waitFor);
    setLights([...lights]);
  }

  function loadLightElement() {
    let lightContainer;
    let light;
    let lightIndex = -1;

    // reuse an element if its idle

    for (let i = 0; i < lights.length; i++) {
      if (!lights[i].inUse) {
        lightContainer = lights[i].element;
        light = lightContainer.children.item(0) as HTMLDivElement;
        lightIndex = i;
        break;
      }
    }

    // otherwise create and append a new one

    if (!lightContainer || !light) {
      lightContainer = document.createElement("div");
      light = document.createElement("div");
      lightIndex = lights.length;

      lightContainer.className = "rounded-full z-0 opacity-0 absolute flex";
      //   lightContainer.style.backgroundColor = "rgba(0,0,0,1.0)";
      light.className = "size-0 rounded-full m-auto";
      light.style.transition = `box-shadow 150ms ease-in-out`;

      lightContainer.append(light);
      mainContainer.current!.prepend(lightContainer);
    }

    return { lightContainer, light, lightIndex };
  }

  function setupLightMouseEvents(
    container: HTMLDivElement,
    light: HTMLDivElement,
    x: number,
    y: number,
    size: number,
  ) {
    let holding = false;
    let hovering = false;

    const movableInfo = {
      element: container,
      offsetX: 0,
      offsetY: 0,
    };

    container.onmousedown = (e) => {
      holding = true;

      movableInfo.offsetX = x - e.x;
      movableInfo.offsetY = y - e.y;
      setCurrMovable(movableInfo);

      container.classList.replace("z-0", "z-10");
      light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.hold}`;
    };

    container.onmouseenter = () => {
      hovering = true;
      if (!holding) {
        light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.hover}`;
      }
    };

    container.onmouseleave = () => {
      hovering = false;
      if (!holding) {
        light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.default}`;
      }
    };

    container.onmouseup = () => {
      if (!holding) {
        return;
      }

      holding = false;
      container.classList.replace("z-10", "z-0");
      setCurrMovable(null);

      if (!hovering) {
        light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.default}`;
      } else {
        light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.hover}`;
      }
    };

    return () => container.onmouseup!({} as any);
  }
}
