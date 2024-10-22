import { useEffect, useState } from "react";
import { sleep } from "../utils";

export default function useLights(
  mainContainer: React.RefObject<HTMLDivElement>,
) {
  const [currMovable, setCurrMovable] = useState<{
    element: HTMLDivElement;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    const stop = animate();
    mainContainer.current?.addEventListener("mousemove", onMouseMove);

    return () => {
      stop();
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

  function animate() {
    const minSize = 25;
    const maxSize = 150;
    const minTime = 3000;
    const maxTime = 4000;
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

    let stop = false;

    (async () => {
      while (true) {
        if (stop) {
          break;
        }

        await sleep(
          Math.floor(minSleep + Math.random() * (maxSleep - minSleep)),
        );

        if (!mainContainer.current) {
          continue;
        }

        const { width: maxRight, height: maxBottom } =
          mainContainer.current.getBoundingClientRect();

        const size = Math.floor(minSize + Math.random() * (maxSize - minSize));
        const inTime = Math.floor(
          minTime + Math.random() * (maxTime - minTime),
        );
        const outTime = Math.floor(
          minTime + Math.random() * (maxTime - minTime),
        );
        const xLocation = Math.floor(Math.random() * maxRight);
        const yLocation = Math.floor(Math.random() * maxBottom);

        const lightContainer = document.createElement("div");
        lightContainer.className = "rounded-full z-0 opacity-0 absolute flex";
        lightContainer.style.transition = `opacity ${inTime}ms ease-in-out`;
        lightContainer.style.width = size * 2 + "px";
        lightContainer.style.height = size * 2 + "px";
        lightContainer.style.left = xLocation + "px";
        lightContainer.style.top = yLocation + "px";

        // lightContainer.style.backgroundColor = "rgba(0,0,0,1.0)";

        const light = document.createElement("div");
        light.className = "size-0 rounded-full m-auto";
        light.style.transition = `box-shadow 150ms ease-in-out`;
        light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.default}`;

        setupLightMouseEvents(
          lightContainer,
          light,
          xLocation,
          yLocation,
          size,
          colors,
        );

        lightContainer.append(light);

        mainContainer.current.prepend(lightContainer);
        setupLightTimeouts(lightContainer, inTime, outTime);
      }
    })();

    return () => {
      stop = true;
    };
  }

  function setupLightMouseEvents(
    container: HTMLDivElement,
    light: HTMLDivElement,
    x: number,
    y: number,
    size: number,
    colors: { default: string; hover: string; hold: string },
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
      holding = false;
      container.classList.replace("z-10", "z-0");
      setCurrMovable(null);

      if (!hovering) {
        light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.default}`;
      } else {
        light.style.boxShadow = `0 0 ${size}px ${size}px ${colors.hover}`;
      }
    };
  }

  function setupLightTimeouts(
    container: HTMLDivElement,
    inTime: number,
    outTime: number,
  ) {
    setTimeout(() => {
      container.classList.replace("opacity-0", "opacity-100");

      setTimeout(() => {
        container.style.transition = `opacity ${outTime}ms ease-in-out`;

        setTimeout(() => {
          container.classList.replace("opacity-100", "opacity-0");

          setTimeout(() => {
            container.remove();
          }, outTime);
        }, 50);
      }, inTime);
    }, 50);
  }
}
