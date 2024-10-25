import { useEffect, useState } from "react";
import { getRandomInRange } from "../utils";
import { gsap } from "gsap";

type Point = {
  top: number;
  left: number;
};

type Boundary = {
  top: number;
  right: number;
  left: number;
  bottom: number;
};

type BoundaryHitType = "top" | "bottom" | "left" | "right" | "corner" | "none";

type LightState = {
  element: HTMLDivElement;
  inUseUntil: number;
  opacityTimeline: gsap.core.Timeline | null;
  movementTimeline: gsap.core.Timeline | null;
};

const PATH_POINT_DISTANCE = 8; // px
const ALLOWED_TURN_RANGE = 22.5; // deg
const MIN_PATH_POINTS = 2; // count
const MAX_PATH_POINTS = 100; // count
const MIN_SIZE = 25; // px
const MAX_SIZE = 100; // px
const MIN_TRANS_DUR = 4000; // ms
const MAX_TRANS_DUR = 8000; // ms
const MIN_TIME_UNTIL_NEXT = 750; // ms
const MAX_TIME_UNTIL_NEXT = 1500; // ms
const COLORS = {
  default: "hsl(244,47%,40%)",
  hover: "hsl(244,47%,50%)",
  hold: "hsl(244,47%,60%)",
};

export default function useLights(
  mainContainer: React.RefObject<HTMLDivElement>,
) {
  const [lights, setLights] = useState<LightState[]>([]);
  const [addNextLightAt, setAddNextLightAt] = useState(0);

  // adding lights
  useEffect(() => {
    const now = Date.now();
    if (addNextLightAt <= now) {
      addLight();
      return;
    }

    const timeoutId = setTimeout(() => {
      setAddNextLightAt(0);
    }, addNextLightAt - now);

    return () => clearTimeout(timeoutId);
  }, [lights, addNextLightAt]);

  function addLight() {
    if (!mainContainer.current) {
      throw new Error("mainContainer is false");
    }

    // basic calculations

    const { width: maxLeft, height: maxTop } =
      mainContainer.current.getBoundingClientRect();

    const startingPoint: Point = {
      top: getRandomInRange(0, maxTop),
      left: getRandomInRange(0, maxLeft),
    };

    const glowSize = Math.floor(getRandomInRange(MIN_SIZE, MAX_SIZE));
    const containerSize = glowSize * 3;
    const appearDuration = Math.floor(
      getRandomInRange(MIN_TRANS_DUR, MAX_TRANS_DUR),
    );
    const disappearDuraiton = Math.floor(
      getRandomInRange(MIN_TRANS_DUR, MAX_TRANS_DUR),
    );
    const pathPoints = Math.floor(
      getRandomInRange(MIN_PATH_POINTS, MAX_PATH_POINTS),
    );

    // element initialization

    const { lightContainer, light, lightIndex } = loadLightElement();

    lightContainer.className = "rounded-full z-0 opacity-0 absolute flex";
    // lightContainer.style.backgroundColor = "rgba(0,0,0,1.0)";
    lightContainer.style.transform = `translate(-${containerSize / 2}px, -${
      containerSize / 2
    }px)`;
    lightContainer.style.width = containerSize + "px";
    lightContainer.style.height = containerSize + "px";

    light.className = "size-0 rounded-full m-auto";
    light.style.transition = `box-shadow 150ms ease-in-out`;
    light.style.boxShadow = `0 0 ${glowSize}px ${glowSize}px ${COLORS.default}`;

    // animation setup

    const travelPath = generatePath(
      startingPoint,
      pathPoints,
      PATH_POINT_DISTANCE,
      ALLOWED_TURN_RANGE,
      {
        top: 0,
        right: maxLeft,
        bottom: maxTop,
        left: 0,
      },
    );

    const { opacityTl, movementTl } = setupLightAnimation(
      lightContainer,
      travelPath,
      appearDuration,
      disappearDuraiton,
    );

    lights[lightIndex] = {
      element: lightContainer,
      opacityTimeline: opacityTl,
      movementTimeline: movementTl,
      inUseUntil: Date.now() + appearDuration + disappearDuraiton,
    };

    opacityTl.eventCallback("onComplete", () => {
      clearAnimations(lights[lightIndex]);
    });

    // state updates

    const waitUntilNextLight = Math.floor(
      getRandomInRange(MIN_TIME_UNTIL_NEXT, MAX_TIME_UNTIL_NEXT),
    );

    setAddNextLightAt(Date.now() + waitUntilNextLight);
    setLights([...lights]);
  }

  function loadLightElement() {
    let lightContainer;
    let light;
    let lightIndex = -1;

    // reuse an element if its idle

    for (let i = 0; i < lights.length; i++) {
      if (Date.now() > lights[i].inUseUntil) {
        clearAnimations(lights[i]);

        lightContainer = lights[i].element;
        light = lightContainer.children.item(0) as HTMLDivElement;
        lightIndex = i;
        break;
      }
    }

    // otherwise create a new one

    if (!lightContainer || !light) {
      lightContainer = document.createElement("div");
      light = document.createElement("div");
      lightIndex = lights.length;

      lightContainer.append(light);
      mainContainer.current!.prepend(lightContainer);
    }

    return { lightContainer, light, lightIndex };
  }

  function generatePath(
    start: Point,
    pointAmount: number,
    pointDistance: number,
    allowedDegrees: number,
    boundary: Boundary,
  ) {
    const points = [start];

    let prevDegree = Math.random() * 360;
    const initialRadians = (prevDegree * Math.PI) / 180;

    const secondPoint = getLineEndPoint(
      points[0],
      pointDistance,
      initialRadians,
    );
    prevDegree = fixPointOutOfBoundary(
      points[0],
      secondPoint,
      pointDistance,
      prevDegree,
      boundary,
    );
    points.push(secondPoint);

    for (let i = 2; i < pointAmount; i++) {
      const allowedStart = prevDegree + (180 - allowedDegrees / 2) - 180;
      const allowedEnd = allowedStart + allowedDegrees;

      prevDegree = getRandomInRange(allowedStart, allowedEnd);
      const radians = (prevDegree * Math.PI) / 180;

      const newPoint = getLineEndPoint(points[i - 1], pointDistance, radians);
      prevDegree = fixPointOutOfBoundary(
        points[i - 1],
        newPoint,
        pointDistance,
        prevDegree,
        boundary,
      );

      points.push(newPoint);
    }

    return points;
  }

  function getLineEndPoint(
    start: Point,
    length: number,
    radians: number,
  ): Point {
    return {
      top: length * Math.cos(radians) + start.top,
      left: length * Math.sin(radians) + start.left,
    };
  }

  // if necessary, changes location of the point IN PLACE.
  // returns the old degree, or the new one if it got changed
  function fixPointOutOfBoundary(
    lastPoint: Point,
    pointToFix: Point,
    distance: number,
    degree: number,
    boundary: Boundary,
  ): number {
    const hitType = getBoundaryHitType(pointToFix, boundary);
    if (hitType === "none") {
      return degree;
    }

    let newDegree;

    switch (hitType) {
      case "top":
      case "bottom":
        newDegree = 180 - degree;
        break;
      case "right":
      case "left":
        newDegree = 360 - degree;
        break;
      case "corner":
        newDegree = 180 + degree;
        break;
    }

    const fixedPoint = getLineEndPoint(
      lastPoint,
      distance,
      (newDegree * Math.PI) / 180,
    );

    pointToFix.top = fixedPoint.top;
    pointToFix.left = fixedPoint.left;
    return newDegree;
  }

  function getBoundaryHitType(point: Point, boundary: Boundary) {
    let type: BoundaryHitType | undefined = undefined;

    if (point.top < boundary.top) {
      type = "top";
    }

    if (point.top > boundary.bottom) {
      if (type) {
        type = "corner";
      } else {
        type = "bottom";
      }
    }

    if (point.left < boundary.left) {
      if (type) {
        type = "corner";
      } else {
        type = "left";
      }
    }

    if (point.left > boundary.right) {
      if (type) {
        type = "corner";
      } else {
        type = "right";
      }
    }

    if (!type) {
      return "none";
    } else {
      return type;
    }
  }

  function setupLightAnimation(
    element: HTMLDivElement,
    path: Point[],
    appearDuration: number,
    disappearDuraiton: number,
  ) {
    const opacityTl = gsap.timeline({ paused: true });
    opacityTl.set(element, {
      opacity: 0,
    });

    opacityTl.to(element, {
      opacity: 1,
      ease: "sine.out",
      duration: appearDuration / 1000,
    });
    opacityTl.to(element, {
      opacity: 0,
      ease: "sine.in",
      duration: disappearDuraiton / 1000,
    });

    const movementSpeed =
      (appearDuration + disappearDuraiton) / 1000 / path.length;

    const movementTl = gsap.timeline({
      paused: true,
      defaults: { duration: movementSpeed, ease: "none" },
    });
    movementTl.set(element, {
      top: path[0].top,
      left: path[0].left,
    });

    for (let i = 1; i < path.length; i++) {
      movementTl.to(element, {
        top: path[i].top,
        left: path[i].left,
      });
    }

    opacityTl.play();
    movementTl.play();

    return { opacityTl, movementTl };
  }

  function clearAnimations(lightState: LightState) {
    lightState.opacityTimeline?.kill();
    lightState.movementTimeline?.kill();
    lightState.opacityTimeline = null;
    lightState.movementTimeline = null;
  }
}
